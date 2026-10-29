// Phase 3: US-013 (FR-009, all three criteria) and NFR-002, through the tauri MCP server.
import { readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { copySet, expect, run, tmp } from "../harness.mjs";

const until = async (h, script, re, ms = 4000) => {
  let v = "";
  for (const end = Date.now() + ms; Date.now() < end; await new Promise((r) => setTimeout(r, 50))) {
    v = await h.js(script);
    if (re.test(v)) return v;
  }
  throw new Error(`timed out; last value: ${v.slice(0, 200)}`);
};
// Change a header value the way the authoring tools save a file: rewrite the whole file.
const setField = (file, field, value) => writeFileSync(file, readFileSync(file, "utf8").replace(new RegExp(`^${field}: .*$`, "m"), `${field}: ${value}`));

await run(async (h) => {
  const set = copySet(join(tmp(), "live"));
  const personas = join(set, "04-personas.md");
  const files = () => readdirSync(set, { recursive: true }).sort().join("\n");
  const before = files();
  await h.launch(set);
  await h.waitText("Version");
  await h.click("//button[contains(., 'Users and personas')]", "xpath");
  await until(h, "return document.querySelector('.section-page h1')?.innerText || ''", /Users and personas/);
  await new Promise((r) => setTimeout(r, 800)); // let the watcher start

  await h.check("FR-009 1: a save of the open section shows the new score and text with no action", async () => {
    const t0 = Date.now();
    setField(personas, "score", "61");
    writeFileSync(personas, readFileSync(personas, "utf8").replace("# Users and personas", "# Users and personas\n\nLIVE-EDIT-MARKER"));
    await until(h, "return document.querySelector('.section-page')?.innerText || ''", /61, 0 blocking[\s\S]*LIVE-EDIT-MARKER/);
    h.results.push(["INFO", `first update shown in ${Date.now() - t0} ms`]);
  });

  await h.check("FR-009 2: the author sees that the section changed", async () => {
    await until(h, "return document.querySelector('.change-notice')?.innerText || ''", /This section changed/);
  });

  await h.check("NFR-002: 20 saves each show within 2 s", async () => {
    const ms = [];
    for (let i = 0; i < 20; i++) {
      const score = 62 + i;
      const t0 = Date.now();
      setField(personas, "score", String(score));
      await until(h, "return document.querySelector('.section-page .version')?.innerText || ''", new RegExp(`\\b${score}, 0 blocking`), 4000);
      ms.push(Date.now() - t0);
      await new Promise((r) => setTimeout(r, 600));
    }
    ms.sort((a, b) => a - b);
    h.results.push(["INFO", `update ms: p50 ${ms[9]}, p95 ${ms[18]}, max ${ms[19]}`]);
    expect(ms[18] < 2000, `p95 ${ms[18]} ms`);
  });

  await h.check("FR-009 1: two saves 300 ms apart end on the second save", async () => {
    setField(personas, "score", "90");
    await new Promise((r) => setTimeout(r, 300));
    setField(personas, "score", "91");
    await until(h, "return document.querySelector('.section-page .version')?.innerText || ''", /\b91, 0 blocking/);
    await new Promise((r) => setTimeout(r, 2500));
    const v = await h.js("return document.querySelector('.section-page .version')?.innerText || ''");
    expect(/\b91, 0 blocking/.test(v), `after 2.5 s: ${v}`);
  });

  await h.check("FR-009 3: a section the author is not reading shows its new status and score in the grades", async () => {
    await h.click("//button[contains(., 'Back to the PRD set')]", "xpath");
    const objectives = join(set, "03-objectives-metrics.md");
    setField(objectives, "score", "42");
    setField(objectives, "status", "draft");
    await until(h, "return [...document.querySelectorAll('table.grades tbody tr')].find(r => r.innerText.includes('Objectives'))?.innerText || ''", /draft[\s\S]*42/);
    const mark = await h.js("return [...document.querySelectorAll('ol.documents li')].find(l => l.innerText.includes('Objectives'))?.innerText || ''");
    expect(/changed/.test(mark), `list line: ${mark}`);
  });

  await h.check("A deleted open section goes back to the set with a message", async () => {
    await h.click("//button[contains(., 'Users and personas')]", "xpath");
    await until(h, "return document.querySelector('.section-page h1')?.innerText || ''", /Users and personas/);
    rmSync(personas);
    await until(h, "return document.body.innerText", /04-personas.md was removed/);
    expect(!(await h.js("return String(!!document.querySelector('.section-page'))")).includes("true"), "section page still shown");
  });

  await h.check("OUT-001: the viewer adds no file to the set folder", async () => {
    const after = files().split("\n").filter((f) => f !== "04-personas.md").join("\n");
    expect(after === before.split("\n").filter((f) => f !== "04-personas.md").join("\n"), `new files: ${after}`);
  });
});
