// Shared harness for the e2e checks: start the MCP test build, drive it through the tauri MCP
// server, and keep the author's real settings out of the way. Each file in e2e/checks/ uses it.
import { connect } from "./client.mjs";
import { spawn } from "child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, realpathSync, renameSync, rmSync } from "fs";
import { homedir, tmpdir } from "os";
import { join } from "path";

export const REPO = join(import.meta.dir, "..");
export const BIN = join(REPO, "src-tauri/target/debug/prd-forge-viewer");
export const SET = join(REPO, "docs/prd/prd-forge-viewer");
export const SHOTS = join(import.meta.dir, "shots");
export const SETTINGS = join(homedir(), "Library/Application Support/com.spillwave.prd-forge-viewer/settings.json");
mkdirSync(SHOTS, { recursive: true });

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const tmp = () => realpathSync(mkdtempSync(join(tmpdir(), "pfv-")));
export const copySet = (to) => { mkdirSync(to, { recursive: true }); cpSync(SET, to, { recursive: true }); return realpathSync(to); };
export const expect = (cond, msg) => { if (!cond) throw new Error(msg); };

// Real keys need the app in front. Without them, the app runs in the background (PFV_E2E_BACKGROUND).
export const REAL_KEYS = process.env.PFV_E2E_KEYS === "real";
// macOS key codes to DOM key names.
const KEYS = { 3: "f", 24: "=", 27: "-", 29: "0", 36: "Enter", 48: "Tab", 53: "Escape", 124: "ArrowRight" };
// Runs in the page. It must stay self-contained, because it is sent as source text.
function pageKey(key, meta) {
  const t = document.activeElement && document.activeElement !== document.body ? document.activeElement : document.body;
  if (!t.dispatchEvent(new KeyboardEvent("keydown", { key, metaKey: meta, bubbles: true, cancelable: true }))) return;
  if (key === "Escape") {
    const d = [...document.querySelectorAll("dialog[open]")].pop();
    if (d && d.dispatchEvent(new Event("cancel", { cancelable: true }))) d.close();
  } else if (key === "Enter" && t.matches("button, a[href]")) t.click();
  else if (key === "Enter" && t.form && t.matches("input")) t.form.requestSubmit();
  else if (key === "Tab") {
    const all = [...document.querySelectorAll("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])")]
      .filter((e) => !e.disabled && e.getClientRects().length && !e.closest("[inert]"));
    all[(all.indexOf(t) + 1) % all.length]?.focus();
  }
}

/** Run `body(h)` with a connected MCP client and fresh settings, then print results and exit. */
export async function run(body) {
  const results = [];
  const client = await connect();
  let app;
  const call = async (name, args = {}) => {
    const r = await client.callTool({ name, arguments: args });
    const text = (r.content || []).map((c) => c.text || "").join("\n");
    if (r.isError) throw new Error(`${name}: ${text}`);
    return text;
  };
  // The tool adds "[Executed in window: ...]" after the result; strip it so checks get the plain value.
  const js = async (script) => (await call("webview_execute_js", { script })).replace(/\s*\[Executed in window: [^\]]*\]\s*$/, "");
  const h = {
    results, call, js,
    get app() { return app; },
    bodyText: () => js("return document.body.innerText"),
    num: async (script) => Number((await js(script)).match(/-?\d+(\.\d+)?/)?.[0] ?? NaN),
    // Poll with short scripts. One long webview_wait_for can time out while the webview is busy.
    waitText: async (value, timeout = 10000) => {
      for (const end = Date.now() + timeout; ; await new Promise((r) => setTimeout(r, 150))) {
        if ((await js(`return String(document.body.innerText.includes(${JSON.stringify(value)}))`).catch(() => "")) === "true") return;
        if (Date.now() > end) throw new Error(`text not shown in ${timeout} ms: ${value}`);
      }
    },
    click: (selector, strategy) => call("webview_interact", { action: "click", selector, ...(strategy ? { strategy } : {}) }),
    // A key press. By default it is emulated in the page, so the checks never take the screen or
    // type into another app: a keydown on the focused element, then the browser default for
    // Escape (cancel the open dialog), Return (click the focused button), and Tab (focus the next
    // control). With PFV_E2E_KEYS=real, it is a real key press through macOS System Events, which
    // brings the app to the front. `mods` is an AppleScript modifier list, for example "command down".
    realKey: (code, mods) => REAL_KEYS ? new Promise((res, rej) => {
      const p = spawn("osascript", ["-e", `tell application "System Events" to tell (first process whose unix id is ${app.pid}) to set frontmost to true`, "-e", "delay 0.3", "-e", `tell application "System Events" to key code ${code}${mods ? ` using {${mods}}` : ""}`]);
      let err = ""; p.stderr.on("data", (d) => (err += d)); p.on("exit", (c) => (c ? rej(new Error("osascript: " + err.trim())) : res()));
    }) : js(`(${pageKey})(${JSON.stringify(KEYS[code])}, ${JSON.stringify(/command/.test(mods ?? ""))}); return 'ok'`),
    async launch(arg) {
      const t0 = Date.now();
      app = spawn(BIN, arg === undefined ? [] : [arg], { stdio: ["ignore", "pipe", "pipe"], env: REAL_KEYS ? process.env : { ...process.env, PFV_E2E_BACKGROUND: "1" } });
      // The bridge takes the first free port from 9223; read it from the app's log line.
      const port = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("no bridge port in app log")), 15000);
        const onData = (d) => { const m = String(d).match(/listening on: 127\.0\.0\.1:(\d+)/); if (m) { clearTimeout(timer); resolve(Number(m[1])); } };
        app.stdout.on("data", onData); app.stderr.on("data", onData);
      });
      let connected = false;
      for (let i = 0; i < 40 && !connected; i++) {
        try { await call("driver_session", { action: "start", host: "127.0.0.1", port }); connected = true; } catch { await sleep(250); }
      }
      if (!connected) throw new Error(`no MCP session on port ${port}`);
      await call("webview_wait_for", { type: "selector", value: "main", timeout: 10000 });
      // In background mode the window must stay hidden. Stop at once if it shows.
      if (!REAL_KEYS && (await js("return document.visibilityState")) !== "hidden") {
        this.quit();
        throw new Error("the test window shows on a display");
      }
      return t0;
    },
    async quit() {
      try { await call("driver_session", { action: "stop" }); } catch {}
      app?.kill("SIGTERM");
      await sleep(800);
    },
    async check(name, fn) {
      try { await fn(); results.push(["PASS", name]); }
      catch (e) { results.push(["FAIL", name, String(e.message || e).slice(0, 300)]); }
      finally { await call("webview_screenshot", { filePath: join(SHOTS, name.replace(/\W+/g, "_") + ".png"), maxWidth: 1000 }).catch(() => {}); }
    },
  };
  // A viewer that is already open would take the launch as a second instance. Quit it first.
  Bun.spawnSync(["osascript", "-e", 'if application "PRD Forge Viewer" is running then tell application "PRD Forge Viewer" to quit']);
  Bun.spawnSync(["pkill", "-f", "target/debug/prd-forge-viewer"]);
  await sleep(800);
  const backup = SETTINGS + ".e2e-backup";
  if (existsSync(SETTINGS)) renameSync(SETTINGS, backup);
  try {
    await body(h);
  } catch (e) {
    results.push(["FAIL", "harness", String(e.message || e).slice(0, 300)]);
  } finally {
    await h.quit();
    await client.close();
    rmSync(SETTINGS, { force: true });
    if (existsSync(backup)) renameSync(backup, SETTINGS);
  }
  for (const r of results) console.log(r.join("  "));
  process.exit(results.some((r) => r[0] === "FAIL") ? 1 : 0);
}
