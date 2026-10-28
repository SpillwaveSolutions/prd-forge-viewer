// Plans 1 and 2: US-001 to US-007, checked through the tauri MCP server.
import { spawn } from "child_process";
import { rmSync, writeFileSync } from "fs";
import { join } from "path";
import { BIN, SET, copySet, expect, run, sleep, tmp } from "../harness.mjs";

await run(async (h) => {
  // FR-001, US-001: open the real set by path (FR-021, criterion 2), within the 2-second target (NFR-001).
  let t0 = await h.launch(SET);
  await h.check("FR-001 open the set shows product, version, summary, 18 documents, and grades", async () => {
    await h.call("webview_wait_for", { type: "text", value: "Version", timeout: 10000 });
    const ms = Date.now() - t0;
    const t = await h.bodyText();
    expect(t.includes("PRD Forge Viewer") && /Version 0\.\d+\.\d+/.test(t), "no product or version");
    expect(t.includes("Problem"), "no executive summary");
    const docs = await h.num("return document.querySelectorAll('ol.documents > li').length");
    expect(docs === 18, `documents listed: ${docs}`);
    const rows = await h.num("return document.querySelectorAll('table.grades tbody tr').length");
    expect(rows >= 16, `grade rows: ${rows}`);
    h.results.push(["INFO", `launch to first paint of the set: ${ms} ms (includes app start)`]);
  });
  await h.quit();

  // FR-003, SC-002: one unreadable section, the rest still reads.
  const broken = copySet(join(tmp(), "broken"));
  writeFileSync(join(broken, "04-personas.md"), "no front matter");
  await h.launch(broken);
  await h.check("FR-003 an unreadable section is marked with its file name", async () => {
    await h.call("webview_wait_for", { type: "text", value: "Unreadable", timeout: 10000 });
    const t = await h.bodyText();
    expect(t.includes("04-personas.md"), "file name missing");
    const rows = await h.js("return [...document.querySelectorAll('table.grades tbody tr')].some(r => r.innerText.includes('unreadable'))");
    expect(rows.includes("true"), "unreadable section is not a grades row");
  });
  await h.quit();

  // FR-021 criterion 3, FR-022 criteria 1 and 2, WF-006: no set here, known locations listed and openable.
  const empty = tmp();
  await h.launch(empty);
  await h.check("FR-021/FR-022 no set here shows known locations, and one opens", async () => {
    await h.call("webview_wait_for", { type: "text", value: "Known locations", timeout: 10000 });
    const t = await h.bodyText();
    expect(t.includes(`No PRD set in ${empty}`), "no 'No PRD set in <folder>'");
    expect((t.match(/PRD Forge Viewer/g) || []).length >= 2, "known locations do not show product names");
    await h.call("webview_interact", { action: "click", selector: "ul.set-list button" });
    await h.call("webview_wait_for", { type: "text", value: "Version", timeout: 10000 });
  });
  await h.quit();

  // FR-022 criterion 3: a known location whose set is gone shows Not found.
  rmSync(broken, { recursive: true, force: true });
  await h.launch(empty);
  await h.check("FR-022 a known location that no longer exists shows Not found", async () => {
    await h.call("webview_wait_for", { type: "text", value: "Not found", timeout: 10000 });
  });
  await h.quit();

  // FR-024, WF-010: two sets in docs/prd. First time: list both, open neither. Then the last one reopens.
  const proj = tmp();
  copySet(join(proj, "docs/prd/alpha"));
  const beta = copySet(join(proj, "docs/prd/beta"));
  await h.launch(proj);
  await h.check("FR-024 two sets and no last set lists both and opens neither", async () => {
    await h.call("webview_wait_for", { type: "text", value: "More than one PRD set", timeout: 10000 });
    const t = await h.bodyText();
    expect(t.includes("/docs/prd/alpha") && t.includes("/docs/prd/beta"), "both sets not listed");
    expect(!(await h.js("return !!document.querySelector('ol.documents')")).includes("true"), "a set was opened");
    await h.call("webview_interact", { action: "click", selector: `//button[contains(., '${beta}')]`, strategy: "xpath" });
    await h.call("webview_wait_for", { type: "text", value: "Version", timeout: 10000 });
  });
  await h.quit();
  await h.launch(proj);
  await h.check("FR-024 two sets and a last set reopens the last one", async () => {
    await h.call("webview_wait_for", { type: "text", value: "Version", timeout: 10000 });
  });
  await h.quit();

  // FR-002: no path, the last set reopens without any selection.
  await h.launch(undefined);
  await h.check("FR-002 the next session reopens the last set", async () => {
    await h.call("webview_wait_for", { type: "text", value: "Version", timeout: 10000 });
  });

  // Second launch while open: the single-instance handoff sends the new path to this window.
  await h.check("Second launch sends its path to the open window", async () => {
    const second = spawn(BIN, [empty], { stdio: "ignore" });
    await sleep(500);
    await h.call("webview_wait_for", { type: "text", value: `No PRD set in ${empty}`, timeout: 10000 });
    second.kill();
  });
  await h.quit();

  // NFR-007, SC-002: keyboard only. Tab to a known location and press Enter.
  await h.launch(empty);
  await h.check("NFR-007 keyboard only: Tab to a known location and press Enter opens it", async () => {
    await h.call("webview_wait_for", { type: "text", value: "Known locations", timeout: 10000 });
    const first = await h.js("return document.activeElement && document.activeElement.innerText");
    expect(first.includes("Open PRD set"), `focus starts on: ${first}`);
    let label = "";
    for (let i = 0; i < 6 && !label.includes("/"); i++) {
      await h.realKey(48); // Tab
      await sleep(200);
      label = await h.js("return document.activeElement && document.activeElement.innerText");
    }
    expect(label.includes("/"), `Tab never reached a known location: ${label}`);
    await h.realKey(36); // Return
    await h.call("webview_wait_for", { type: "text", value: "Version", timeout: 10000 });
  });
  await h.quit();
});
