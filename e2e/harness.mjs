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
const SETTINGS = join(homedir(), "Library/Application Support/com.spillwave.prd-forge-viewer/settings.json");
mkdirSync(SHOTS, { recursive: true });

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const tmp = () => realpathSync(mkdtempSync(join(tmpdir(), "pfv-")));
export const copySet = (to) => { mkdirSync(to, { recursive: true }); cpSync(SET, to, { recursive: true }); return realpathSync(to); };
export const expect = (cond, msg) => { if (!cond) throw new Error(msg); };

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
    waitText: (value, timeout = 10000) => call("webview_wait_for", { type: "text", value, timeout }),
    click: (selector, strategy) => call("webview_interact", { action: "click", selector, ...(strategy ? { strategy } : {}) }),
    // Real key presses through macOS System Events. Synthetic DOM key events do not move the focus.
    realKey: (code) => new Promise((res, rej) => {
      const p = spawn("osascript", ["-e", `tell application "System Events" to tell (first process whose unix id is ${app.pid}) to set frontmost to true`, "-e", "delay 0.3", "-e", `tell application "System Events" to key code ${code}`]);
      let err = ""; p.stderr.on("data", (d) => (err += d)); p.on("exit", (c) => (c ? rej(new Error("osascript: " + err.trim())) : res()));
    }),
    async launch(arg) {
      const t0 = Date.now();
      app = spawn(BIN, arg === undefined ? [] : [arg], { stdio: ["ignore", "pipe", "pipe"] });
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
