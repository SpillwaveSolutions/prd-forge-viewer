// Phase 5: US-014 to US-020 (FR-010 to FR-014, FR-019, TR-005, TR-007, TR-010), NFR-004, NFR-009,
// and FR-016 criterion 2, through the tauri MCP server. Each export file is read back from disk.
import { execFileSync } from "child_process";
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { copySet, expect, run, tmp } from "../harness.mjs";

const sh = (cmd, ...args) => execFileSync(cmd, args, { encoding: "utf8", maxBuffer: 64 << 20 });
const pdfText = (f) => sh("pdftotext", "-layout", f, "-").replace(/\s+/g, " ");
const docxPart = (f, part) => sh("unzip", "-p", f, part);
const xmlText = (x) => x.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const docxText = (f) => xmlText(docxPart(f, "word/document.xml").replace(/<w:tab\/>/g, " ")).replace(/\s+/g, " ");
const setStatus = (file, status) => writeFileSync(file, readFileSync(file, "utf8").replace(/^status: .*$/m, `status: ${status}`));
// The page color of the PDF, from a small rendering of page 1 (PPM: header, then RGB bytes).
const pageColor = (f) => {
  const out = join(tmp(), "p.ppm");
  sh("mutool", "draw", "-q", "-r", "10", "-c", "rgb", "-F", "pnm", "-o", out, f, "1");
  const b = readFileSync(out);
  const start = b.toString("latin1").match(/^P6\s+\d+\s+\d+\s+\d+\s/)[0].length;
  return "#" + [...b.subarray(start, start + 3)].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();
};
const order = (text, titles) => titles.map((t) => text.indexOf(t, text.indexOf("Executive summary") + 1));
// The first plain line of body text of a section, from the file on disk. The contents table has
// only titles, so a body line proves that the body itself is in the file, at that place.
const bodyLine = (file) => readFileSync(file, "utf8").split(/\n---\n/).slice(1).join("\n").split("\n").map((l) => l.trim())
  .find((l) => /^[A-Z][a-z]/.test(l) && !/[[\]()|*_`<>]/.test(l) && l.length > 30)?.slice(0, 30);
// The documents in reading order (the root, then the sections by file name), with a body line each.
const bodies = (set) => ["prd.md", ...readdirSync(set).filter((f) => f.endsWith(".md") && f !== "prd.md").sort()]
  .map((f) => ({ f, line: readFileSync(join(set, f), "utf8").match(/^status: pending$/m) ? null : bodyLine(join(set, f)) }))
  .filter((b) => b.line);
// Each search starts after the line of the section before, so it checks presence and order together.
const inOrder = (text, set) => {
  let from = text.indexOf("Contents");
  for (const b of bodies(set)) {
    const at = text.indexOf(b.line, from + 1);
    if (at < 0) return `${b.f} is missing or out of order ("${b.line}")`;
    from = at;
  }
  return "";
};

await run(async (h) => {
  const set = copySet(join(tmp(), "export"));
  const out = tmp();
  setStatus(join(set, "07-scope.md"), "pending");
  await h.launch(set);
  await h.waitText("Version");
  const titles = (await h.js("return [...document.querySelectorAll('ol.documents li button')].map(b => b.innerText.trim()).join('\\n')")).split("\n").filter(Boolean);
  const version = (await h.js("return document.body.innerText.match(/Version ([\\d.]+)/)?.[1] || ''"));
  const openExport = async () => {
    if (await h.js("return String(!!document.querySelector('dialog[aria-label=Export][open]'))") !== "true") {
      await h.click("//header//button[.='Export']", "xpath");
      await h.waitText("Sections, in reading order");
    }
  };
  const pick = (re, val) => h.js(`const s = document.querySelector('[aria-label="Export theme"]'); const o = [...s.options].find(o => ${re}.test(o.text)); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(s, o.value); s.dispatchEvent(new Event('change', { bubbles: true })); return 'ok'`);
  const exportTo = async (path, format, theme) => {
    await openExport();
    await h.js(`window.__pfvSavePath = ${JSON.stringify(path)}; return 'ok'`);
    await h.click(`//dialog//label[contains(., '${format}')]`, "xpath");
    if (theme) await pick(theme);
    const runs = await h.js("return document.querySelector('dialog[aria-label=Export]').dataset.runs");
    const t0 = Date.now();
    await h.click("//dialog//button[.='Export']", "xpath");
    await h.call("webview_wait_for", { type: "selector", value: `dialog[aria-label=Export]:not([data-runs="${runs}"])`, timeout: 30000 });
    const status = await h.js("return document.querySelector('dialog [role=status]').innerText");
    expect(status === "Export saved.", status);
    return Date.now() - t0;
  };
  let pdf, docx, pdfMs, docxMs;

  await h.check("FR-010: the whole set as one PDF, every document in order", async () => {
    pdf = join(out, "set.pdf");
    pdfMs = await exportTo(pdf, "PDF", /Ice Snowstorm/);
    const text = pdfText(pdf);
    expect(titles.length === 18 && bodies(set).length >= 16, `titles ${titles.length}, body lines ${bodies(set).length}`);
    const bad = inOrder(text, set);
    expect(!bad, bad);
    h.results.push(["INFO", `PDF export ${pdfMs} ms, ${sh("pdfinfo", pdf).match(/Pages:\s+(\d+)/)[1]} pages`]);
  });

  await h.check("FR-014, TR-005: the first page shows the version and Draft", async () => {
    const first = sh("pdftotext", "-f", "1", "-l", "1", pdf, "-");
    expect(first.includes(`Version ${version}`) && /Draft/.test(first), first.slice(0, 300));
  });

  await h.check("FR-019: contents show status, score, and blocking of every section; a pending section says it is not written", async () => {
    const text = pdfText(pdf);
    const contents = text.slice(text.indexOf("Contents"), text.indexOf("Contents") + 4000);
    for (const t of titles) expect(contents.includes(t), `contents miss ${t}`);
    expect(/Scope pending not graded|Scope pending \d+/.test(contents), "Scope row: " + contents.slice(contents.indexOf("Scope"), contents.indexOf("Scope") + 60));
    expect(/Functional requirements (final|review|draft) \d+ \d+/.test(contents), "no score row");
    const scopeAt = order(text, titles)[titles.indexOf("Scope")];
    expect(text.indexOf("This section is not written yet.", scopeAt) > scopeAt, "pending text missing after the Scope heading");
  });

  await h.check("TR-007: the export does not say the PRD is approved", async () => {
    const first = sh("pdftotext", "-f", "1", "-l", "1", pdf, "-");
    expect(!/approved/i.test(first), "first page says approved");
  });

  await h.check("FR-015 1 (Ice Snowstorm) and FR-016 2: the PDF has the theme page color and embeds its fonts", async () => {
    // The rendering to an image can move a channel by 1 or 2 (color conversion), so allow 2.
    const near = (a, b) => [1, 3, 5].every((i) => Math.abs(parseInt(a.slice(i, i + 2), 16) - parseInt(b.slice(i, i + 2), 16)) <= 2);
    expect(near(pageColor(pdf), "#F3F6FB"), `page ${pageColor(pdf)}`);
    const fonts = sh("pdffonts", pdf);
    expect(/SourceSans3/.test(fonts), fonts);
    expect(fonts.split("\n").slice(2).filter(Boolean).every((l) => / yes /.test(l)), "a font is not embedded:\n" + fonts);
  });

  await h.check("NFR-009: the PDF is tagged, with a language, a title, and an outline", async () => {
    const raw = sh("qpdf", "--qdf", "--object-streams=disable", pdf, "-");
    expect(raw.includes("/StructTreeRoot"), "no structure tree");
    expect(/\/Marked true/.test(raw), "not marked");
    expect(/\/Lang \(en\)/.test(raw), "no language");
    expect(/Title:\s+\S/.test(sh("pdfinfo", pdf)), "no title");
    expect(/\/S \/H1/.test(raw), "no heading tags");
  });

  await h.check("FR-011, FR-015 1 (Clay), FR-016 2: the whole set as Word, in order, with Clay colors and embedded fonts", async () => {
    docx = join(out, "set.docx");
    docxMs = await exportTo(docx, "Word", /Clay/);
    const text = docxText(docx);
    const bad = inOrder(text, set);
    expect(!bad, bad);
    const xml = docxPart(docx, "word/document.xml") + docxPart(docx, "word/styles.xml");
    for (const c of ["FAF9F5", "3D3D3A", "141413", "D97757"]) expect(xml.includes(c), `no ${c}`);
    expect(xml.includes('w:ascii="Source Serif 4"') && xml.includes('w:ascii="Source Sans 3"'), "fonts");
    expect(/w:embedRegular/.test(docxPart(docx, "word/fontTable.xml")), "fonts not embedded");
    h.results.push(["INFO", `Word export ${docxMs} ms`]);
  });

  await h.check("NFR-009: the Word file has a title, heading styles, and table header rows", async () => {
    expect(/<dc:title>[^<]+<\/dc:title>/.test(docxPart(docx, "docProps/core.xml")), "no title");
    const xml = docxPart(docx, "word/document.xml");
    expect(xml.includes('w:val="Heading1"') && xml.includes("<w:tblHeader/>"), "no headings or header rows");
  });

  await h.check("FR-012: only User journeys and Functional requirements, in reading order", async () => {
    await openExport();
    await h.click("//dialog//button[.='Select none']", "xpath");
    await h.click("//dialog//label[contains(., 'Functional requirements')]", "xpath");
    await h.click("//dialog//label[contains(., 'User journeys')]", "xpath");
    const two = join(out, "two.docx");
    await exportTo(two, "Word");
    const text = docxText(two);
    // The first line of body text of a section, from the file on disk.
    const marker = (f) => readFileSync(join(set, f), "utf8").split(/\n---\n/).slice(1).join("\n").split("\n").map((l) => l.trim()).find((l) => l && !l.startsWith("#") && !l.startsWith("|") && !l.startsWith("!") && !l.startsWith(">")).replace(/[*_`]/g, "").slice(0, 40);
    const [j, fr, per] = ["05-user-journeys.md", "08-functional-requirements.md", "04-personas.md"].map(marker);
    expect(text.includes(j) && text.includes(fr), `missing a selected section: ${j} / ${fr}`);
    expect(text.indexOf(j) < text.indexOf(fr), "order");
    expect(!text.includes(per), "a section that was not selected is in the file");
  });

  await h.check("FR-013: print has the same documents, order, and Draft mark as the PDF", async () => {
    await h.click("//dialog//button[.='Select all']", "xpath");
    await h.js("window.__printed = ''; window.__pfvPrint = () => { window.__printed = document.getElementById('print-root').innerText + '|' + getComputedStyle(document.getElementById('print-root')).display; }; return 'ok'");
    const runs = await h.js("return document.querySelector('dialog[aria-label=Export]').dataset.runs");
    await h.click("//dialog//button[.='Print']", "xpath");
    await h.call("webview_wait_for", { type: "selector", value: `dialog[aria-label=Export]:not([data-runs="${runs}"])`, timeout: 30000 });
    const [printed, display] = (await h.js("return window.__printed")).split("|");
    expect(display === "none", "the print copy shows on screen");
    const p = printed.replace(/\s+/g, " ");
    const bad = inOrder(p, set);
    expect(/Draft/.test(p) && !bad, `print: ${bad}`);
  });

  await h.check("FR-013: Print opens the macOS print panel, and Escape closes it", async () => {
    await h.js("delete window.__pfvPrint; return 'ok'");
    const runs = await h.js("return document.querySelector('dialog[aria-label=Export]').dataset.runs");
    await h.click("//dialog//button[.='Print']", "xpath");
    // The panel is a sheet or a window of the app process; System Events sees it.
    let panel = "";
    for (let i = 0; i < 20 && !/true/.test(panel); i++) {
      await new Promise((r) => setTimeout(r, 500));
      panel = sh("osascript", "-e", `tell application "System Events" to tell (first process whose unix id is ${h.app.pid}) to return ((count of windows) > 1) or (exists sheet 1 of window 1)`).trim();
    }
    expect(panel === "true", "no print panel");
    await h.realKey(53); // Escape
    await h.call("webview_wait_for", { type: "selector", value: `dialog[aria-label=Export]:not([data-runs="${runs}"])`, timeout: 30000 });
    const after = sh("osascript", "-e", `tell application "System Events" to tell (first process whose unix id is ${h.app.pid}) to return ((count of windows) > 1) or (exists sheet 1 of window 1)`).trim();
    expect(after === "false", "the print panel is still open");
  });

  await h.check("NFR-004: 20 exports, p95 within 10 s", async () => {
    const ms = [];
    for (let i = 0; i < 10; i++) {
      ms.push(await exportTo(join(out, `t${i}.pdf`), "PDF"));
      ms.push(await exportTo(join(out, `t${i}.docx`), "Word"));
    }
    ms.sort((a, b) => a - b);
    h.results.push(["INFO", `export ms: p50 ${ms[9]}, p95 ${ms[18]}, max ${ms[19]}`]);
    expect(ms[18] < 10000, `p95 ${ms[18]}`);
  });

  await h.check("OUT-001: an export into the set folder is refused", async () => {
    await openExport();
    await h.js(`window.__pfvSavePath = ${JSON.stringify(join(set, "in-set.pdf"))}; return 'ok'`);
    await h.click("//dialog//button[.='Export']", "xpath");
    await h.call("webview_wait_for", { type: "text", value: "outside the PRD set", timeout: 30000 });
    expect(!existsSync(join(set, "in-set.pdf")), "file written in the set");
  });

  await h.check("TR-005 2, TR-010: with every document final there is no Draft; a blocking defect does not stop the export", async () => {
    await h.click("//dialog//button[.='Close']", "xpath");
    for (const f of readdirSync(set).filter((f) => f.endsWith(".md"))) setStatus(join(set, f), "final");
    await h.call("webview_wait_for", { type: "text", value: "Export", timeout: 5000 });
    await new Promise((r) => setTimeout(r, 2500)); // the live reload (FR-009) picks up the new statuses
    const fin = join(out, "final.pdf");
    await exportTo(fin, "PDF");
    const first = sh("pdftotext", "-f", "1", "-l", "1", fin, "-");
    expect(!/Draft/.test(first), "Draft on an all-final export");
  });
  rmSync(out, { recursive: true, force: true });
});
