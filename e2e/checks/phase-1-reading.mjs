// Phase 1: US-008 (FR-005), US-009 (FR-023), US-010 (FR-007), and NFR-010 for section bodies.
import { appendFileSync } from "fs";
import { join } from "path";
import { SET, copySet, expect, run, tmp } from "../harness.mjs";

// Poll a script until it returns text that matches, so a check never reads a page that is still loading.
const until = async (h, script, re, ms = 8000) => {
  let v = "";
  for (const end = Date.now() + ms; Date.now() < end; await new Promise((r) => setTimeout(r, 150))) {
    v = await h.js(script);
    if (re.test(v)) return v;
  }
  throw new Error(`timed out; last value: ${v.slice(0, 200)}`);
};

await run(async (h) => {
  await h.launch(SET);
  await h.waitText("Version");

  await h.check("FR-005 one action opens the functional requirements from the problem section", async () => {
    await h.click("//button[contains(., 'Problem and opportunity')]", "xpath");
    await h.waitText("P-001");
    await h.click("//button[contains(., 'Back to the PRD set')]", "xpath");
    const t0 = Date.now();
    await h.click("//button[contains(., 'Functional requirements')]", "xpath");
    await until(h, "return document.querySelector('.section-page h1')?.innerText || ''", /Functional requirements/);
    h.results.push(["INFO", `section opened in ${Date.now() - t0} ms`]);
  });

  await h.check("FR-023 the personas section lists PER-001 to PER-005, and PER-001 shows with its section status and grade", async () => {
    await h.click("//button[contains(., 'Back to the PRD set')]", "xpath");
    await h.click("//button[contains(., 'Users and personas')]", "xpath");
    await h.waitText("PER-005");
    const ids = await h.js("return [...document.querySelectorAll('nav.items button')].map(b => b.innerText).join(',')");
    for (let n = 1; n <= 5; n++) expect(ids.includes(`PER-00${n}`), `ids: ${ids}`);
    await h.click("//nav[@aria-label='Items']/button[.='PER-001']", "xpath");
    const item = await h.js("return document.querySelector('article.item')?.innerText");
    expect(item.includes("PER-001") && /final/.test(item) && /\d+, \d+ blocking/.test(item), `item: ${item}`);
  });

  await h.check("FR-007 from FR-004 the reference ST-002 opens stage ST-002 in J-001", async () => {
    await h.click("//button[contains(., 'Back to the PRD set')]", "xpath");
    await h.click("//button[contains(., 'Functional requirements')]", "xpath");
    await h.click("//nav[@aria-label='Items']/button[.='FR-004']", "xpath");
    await h.click("//article[contains(@class,'item')]//button[contains(@class,'ref') and .='ST-002']", "xpath");
    const item = await until(h, "return document.querySelector('article.item')?.innerText || ''", /^ST-002/);
    expect(item.includes("Check the grades") && item.includes("in J-001"), `item: ${item}`);
  });

  await h.check("A diagram in a section loads from the set folder", async () => {
    await h.click("//button[contains(., 'Back to the PRD set')]", "xpath");
    await h.click("//button[contains(., 'Scenarios')]", "xpath");
    await h.waitText("SC-001");
    let loaded = 0;
    for (let i = 0; i < 20 && !loaded; i++) {
      loaded = await h.num("return [...document.querySelectorAll('.body img')].filter(i => i.complete && i.naturalWidth > 0).length");
      if (!loaded) await new Promise((r) => setTimeout(r, 250));
    }
    expect(loaded > 0, "no diagram image loaded");
  });
  await h.quit();

  // NFR-010: a remote image and a script in a body do nothing.
  const set = copySet(join(tmp(), "remote"));
  appendFileSync(join(set, "07-scope.md"), '\n![tracker](https://example.com/pixel.png)\n\n<script>document.title="SCRIPT RAN"</script>\n<img src="x" onerror="document.title=\'SCRIPT RAN\'">\n');
  await h.launch(set);
  await h.check("NFR-010 a remote image does not load and no script in a body runs", async () => {
    await h.waitText("Version");
    await h.call("ipc_monitor", { action: "start" }).catch(() => {});
    await h.click("//button[contains(., 'Scope')]", "xpath");
    await h.waitText("[image: tracker]");
    await new Promise((r) => setTimeout(r, 800));
    const remote = await h.num("return [...document.querySelectorAll('img')].filter(i => /^https?:/.test(i.getAttribute('src') || '')).length");
    expect(remote === 0, `remote images: ${remote}`);
    const title = await h.js("return document.title");
    expect(!title.includes("SCRIPT RAN"), "a script ran");
  });
});
