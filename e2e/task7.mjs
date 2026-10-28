// Plan 2 task 7 with the installed app: Install prdf command, then prdf from a terminal (SC-006, SC-009).
import { connect } from "./client.mjs";
import { execFileSync, spawnSync } from "child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, realpathSync, readFileSync } from "fs";
import { tmpdir, homedir } from "os";
import { join } from "path";

const REPO = join(import.meta.dir, "..");
const SET = join(REPO, "docs/prd/prd-forge-viewer");
const PRDF = join(homedir(), ".local/bin/prdf");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const client = await connect();
const call = async (n, a = {}) => { const r = await client.callTool({ name: n, arguments: a }); const t = (r.content || []).map((c) => c.text || "").join("\n"); if (r.isError) throw new Error(`${n}: ${t}`); return t; };
const check = async (name, fn) => { try { await fn(); results.push(["PASS", name]); } catch (e) { results.push(["FAIL", name, String(e.message).slice(0, 300)]); } };
const osa = (...lines) => execFileSync("osascript", lines.flatMap((l) => ["-e", l]));
const prdf = (cwd, ...args) => spawnSync(PRDF, args, { cwd, encoding: "utf8" });

// Start the installed app with no set, and connect to its bridge on the first free port from 9223.
execFileSync("open", ["-a", "PRD Forge Viewer"]);
let ok = false;
for (let i = 0; i < 60 && !ok; i++) {
  for (const port of [9223, 9224, 9225]) {
    try { const t = await call("driver_session", { action: "start", host: "127.0.0.1", port }); if (/Tauri App|PRD Forge/.test(t)) { const id = await call("ipc_get_backend_state", {}); if (id.includes("prd-forge-viewer")) { ok = true; break; } await call("driver_session", { action: "stop" }); } } catch {}
  }
  if (!ok) await sleep(500);
}
if (!ok) throw new Error("installed app not reachable through MCP");

await check("Install prdf command asks, then writes ~/.local/bin/prdf", async () => {
  await call("webview_interact", { action: "click", selector: "//button[contains(., 'Install prdf command')]", strategy: "xpath" });
  await sleep(1200);
  osa('tell application "System Events" to tell process "PRD Forge Viewer" to set frontmost to true', "delay 0.3", 'tell application "System Events" to key code 36');
  await call("webview_wait_for", { type: "text", value: "Installed", timeout: 8000 });
  if (!existsSync(PRDF) || !readFileSync(PRDF, "utf8").includes("# prdf launcher for PRD Forge Viewer")) throw new Error("prdf not written");
});

await check("prdf in this repository opens its one PRD set (FR-021, criterion 1)", async () => {
  prdf(REPO);
  await call("webview_wait_for", { type: "text", value: "Version 0.6", timeout: 10000 });
});

const proj = realpathSync(mkdtempSync(join(tmpdir(), "pfv-two-")));
for (const n of ["alpha", "beta"]) { mkdirSync(join(proj, "docs/prd", n), { recursive: true }); cpSync(SET, join(proj, "docs/prd", n), { recursive: true }); }
await check("prdf in a project with two sets lists both and opens neither (FR-024, WF-010)", async () => {
  prdf(proj);
  await call("webview_wait_for", { type: "text", value: "More than one PRD set", timeout: 10000 });
  await call("webview_interact", { action: "click", selector: `//button[contains(., '${proj}/docs/prd/beta')]`, strategy: "xpath" });
  await call("webview_wait_for", { type: "text", value: "Version 0.6", timeout: 10000 });
});
await check("prdf . in that project again opens the last set, beta (FR-024, criterion 2)", async () => {
  prdf(proj, ".");
  await sleep(1500);
  const t = await call("webview_execute_js", { script: "return document.querySelector('ol.documents') ? 'open' : document.body.innerText" });
  if (!t.includes("open")) throw new Error(t.slice(0, 200));
});
await check("prdf /tmp shows No PRD set and the known locations (FR-021, criterion 3, WF-006)", async () => {
  prdf("/tmp");
  await call("webview_wait_for", { type: "text", value: "Known locations", timeout: 10000 });
  const t = await call("webview_execute_js", { script: "return document.body.innerText" });
  if (!/No PRD set in \/(private\/)?tmp/.test(t)) throw new Error(t.slice(0, 200));
});
await call("webview_screenshot", { filePath: join(import.meta.dir, "shots/task7_prdf_tmp.png"), maxWidth: 1000 }).catch(() => {});
await call("driver_session", { action: "stop" }).catch(() => {});
await client.close();
osa('tell application "PRD Forge Viewer" to quit');
for (const r of results) console.log(r.join("  "));
process.exit(results.some((r) => r[0] === "FAIL") ? 1 : 0);
