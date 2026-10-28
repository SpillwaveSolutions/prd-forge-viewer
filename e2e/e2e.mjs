// End-to-end checks of the PRD Forge Viewer through the tauri MCP server and the app's mcp-bridge.
// Each scenario starts the debug binary (built with --features mcp-bridge), drives it, and stops it.
import { connect } from "./client.mjs";
import { spawn } from "child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync, realpathSync } from "fs";
import { tmpdir, homedir } from "os";
import { join } from "path";

const REPO = join(import.meta.dir, "..");
const BIN = join(REPO, "src-tauri/target/debug/prd-forge-viewer");
const SET = join(REPO, "docs/prd/prd-forge-viewer");
const SHOTS = join(import.meta.dir, "shots");
const CFG = join(homedir(), "Library/Application Support/com.spillwave.prd-forge-viewer");
const SETTINGS = join(CFG, "settings.json");
mkdirSync(SHOTS, { recursive: true });

const results = [];
const tmp = () => realpathSync(mkdtempSync(join(tmpdir(), "pfv-")));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const copySet = (to) => { mkdirSync(to, { recursive: true }); cpSync(SET, to, { recursive: true }); return realpathSync(to); };

let client;
async function call(name, args = {}) {
  const r = await client.callTool({ name, arguments: args });
  const text = (r.content || []).map((c) => c.text || "").join("\n");
  if (r.isError) throw new Error(`${name}: ${text}`);
  return text;
}
const js = async (script) => call("webview_execute_js", { script });
const bodyText = () => js("return document.body.innerText");
const num = async (script) => Number((await js(script)).match(/\d+/)?.[0] ?? NaN);
// Real key presses through macOS System Events. Synthetic DOM key events do not move the focus.
const realKey = (code) => new Promise((res, rej) => {
  const p = spawn("osascript", ["-e", 'tell application "System Events" to tell (first process whose unix id is ' + app.pid + ') to set frontmost to true', "-e", "delay 0.3", "-e", 'tell application "System Events" to key code ' + code]);
  let err = ""; p.stderr.on("data", (d) => (err += d)); p.on("exit", (c) => (c ? rej(new Error("osascript: " + err.trim())) : res()));
});

let app;
async function launch(arg) {
  const t0 = Date.now();
  app = spawn(BIN, arg === undefined ? [] : [arg], { stdio: ["ignore", "pipe", "pipe"] });
  // The bridge picks the first free port from 9223; read it from the app's log line.
  const port = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("no bridge port in app log")), 15000);
    const onData = (d) => {
      const m = String(d).match(/listening on: 127\.0\.0\.1:(\d+)/);
      if (m) { clearTimeout(timer); resolve(Number(m[1])); }
    };
    app.stdout.on("data", onData);
    app.stderr.on("data", onData);
  });
  let connected = false;
  for (let i = 0; i < 40 && !connected; i++) {
    try { await call("driver_session", { action: "start", host: "127.0.0.1", port }); connected = true; }
    catch { await sleep(250); }
  }
  if (!connected) throw new Error(`no MCP session on port ${port}`);
  await call("webview_wait_for", { type: "selector", value: "main", timeout: 10000 });
  return t0;
}
async function quit() {
  try { await call("driver_session", { action: "stop" }); } catch {}
  app?.kill("SIGTERM");
  await sleep(800);
}
async function check(name, fn) {
  try { await fn(); results.push(["PASS", name]); }
  catch (e) { results.push(["FAIL", name, String(e.message || e).slice(0, 300)]); }
  finally { await call("webview_screenshot", { filePath: join(SHOTS, name.replace(/\W+/g, "_") + ".png"), maxWidth: 1000 }).catch(() => {}); }
}
const expect = (cond, msg) => { if (!cond) throw new Error(msg); };

// Keep the author's real settings: move them aside, put them back at the end.
const backup = SETTINGS + ".e2e-backup";
if (existsSync(SETTINGS)) renameSync(SETTINGS, backup);

client = await connect();
try {
  // FR-001, US-001: open the real set by path (FR-021, criterion 2), within the 2-second target (NFR-001).
  let t0 = await launch(SET);
  await check("FR-001 open the set shows product, version, summary, 18 documents, and grades", async () => {
    await call("webview_wait_for", { type: "text", value: "Version", timeout: 10000 });
    const ms = Date.now() - t0;
    const t = await bodyText();
    expect(t.includes("PRD Forge Viewer") && /Version 0\.\d+\.\d+/.test(t), "no product or version");
    expect(t.includes("Problem"), "no executive summary");
    const docs = await num("return document.querySelectorAll('ol.documents > li').length");
    expect(docs === 18, `documents listed: ${docs}`);
    const rows = await num("return document.querySelectorAll('table.grades tbody tr').length");
    expect(rows >= 16, `grade rows: ${rows}`);
    results.push(["INFO", `launch to first paint of the set: ${ms} ms (includes app start)`]);
  });
  await quit();

  // FR-003, SC-002: one unreadable section, the rest still reads.
  const broken = copySet(join(tmp(), "broken"));
  writeFileSync(join(broken, "04-personas.md"), "no front matter");
  await launch(broken);
  await check("FR-003 an unreadable section is marked with its file name", async () => {
    await call("webview_wait_for", { type: "text", value: "Unreadable", timeout: 10000 });
    const t = await bodyText();
    expect(t.includes("04-personas.md"), "file name missing");
    const rows = await js("return [...document.querySelectorAll('table.grades tbody tr')].some(r => r.innerText.includes('unreadable'))");
    expect(rows.includes("true"), "unreadable section is not a grades row");
  });
  await quit();

  // FR-021 criterion 3, FR-022 criteria 1 and 2, WF-006: no set here, known locations listed and openable.
  const empty = tmp();
  await launch(empty);
  await check("FR-021/FR-022 no set here shows known locations, and one opens", async () => {
    await call("webview_wait_for", { type: "text", value: "Known locations", timeout: 10000 });
    const t = await bodyText();
    expect(t.includes(`No PRD set in ${empty}`), "no 'No PRD set in <folder>'");
    expect((t.match(/PRD Forge Viewer/g) || []).length >= 2, "known locations do not show product names");
    await call("webview_interact", { action: "click", selector: "ul.set-list button" });
    await call("webview_wait_for", { type: "text", value: "Version", timeout: 10000 });
  });
  await quit();

  // FR-022 criterion 3: a known location whose set is gone shows Not found.
  rmSync(broken, { recursive: true, force: true });
  await launch(empty);
  await check("FR-022 a known location that no longer exists shows Not found", async () => {
    await call("webview_wait_for", { type: "text", value: "Not found", timeout: 10000 });
  });
  await quit();

  // FR-024, WF-010: two sets in docs/prd. First time: list both, open neither. Then the last one reopens.
  const proj = tmp();
  copySet(join(proj, "docs/prd/alpha"));
  const beta = copySet(join(proj, "docs/prd/beta"));
  await launch(proj);
  await check("FR-024 two sets and no last set lists both and opens neither", async () => {
    await call("webview_wait_for", { type: "text", value: "More than one PRD set", timeout: 10000 });
    const t = await bodyText();
    expect(t.includes("/docs/prd/alpha") && t.includes("/docs/prd/beta"), "both sets not listed");
    expect(!(await js("return !!document.querySelector('ol.documents')")).includes("true"), "a set was opened");
    await call("webview_interact", { action: "click", selector: `//button[contains(., '${beta}')]`, strategy: "xpath" });
    await call("webview_wait_for", { type: "text", value: "Version", timeout: 10000 });
  });
  await quit();
  await launch(proj);
  await check("FR-024 two sets and a last set reopens the last one", async () => {
    await call("webview_wait_for", { type: "text", value: "Version", timeout: 10000 });
  });
  await quit();

  // FR-002: no path, the last set reopens without any selection.
  await launch(undefined);
  await check("FR-002 the next session reopens the last set", async () => {
    await call("webview_wait_for", { type: "text", value: "Version", timeout: 10000 });
  });

  // Second launch while open: the single-instance handoff sends the new path to this window.
  await check("Second launch sends its path to the open window", async () => {
    const second = spawn(BIN, [empty], { stdio: "ignore" });
    await sleep(500);
    await call("webview_wait_for", { type: "text", value: `No PRD set in ${empty}`, timeout: 10000 });
    second.kill();
  });
  await quit();

  // NFR-007, SC-002: keyboard only. Tab to a known location and press Enter.
  await launch(empty);
  await check("NFR-007 keyboard only: Tab to a known location and press Enter opens it", async () => {
    await call("webview_wait_for", { type: "text", value: "Known locations", timeout: 10000 });
    const first = await js("return document.activeElement && document.activeElement.innerText");
    expect(first.includes("Open PRD set"), `focus starts on: ${first}`);
    let label = "";
    for (let i = 0; i < 6 && !label.includes("/"); i++) {
      await realKey(48); // Tab
      await sleep(200);
      label = await js("return document.activeElement && document.activeElement.innerText");
    }
    expect(label.includes("/"), `Tab never reached a known location: ${label}`);
    await realKey(36); // Return
    await call("webview_wait_for", { type: "text", value: "Version", timeout: 10000 });
  });
  await quit();
} finally {
  await quit();
  await client.close();
  rmSync(SETTINGS, { force: true });
  if (existsSync(backup)) renameSync(backup, SETTINGS);
}

for (const r of results) console.log(r.join("  "));
console.log(`screenshots: ${SHOTS}`);
process.exit(results.some((r) => r[0] === "FAIL") ? 1 : 0);
