// Phase 1: US-008 (FR-005), US-009 (FR-023), US-010 (FR-007), and NFR-010 for section bodies.
import { appendFileSync, readFileSync } from "fs";
import { join } from "path";
import { SET, SETTINGS, copySet, expect, run, tmp } from "../harness.mjs";

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
    await until(h, "return document.querySelector('.section-page h1')?.innerText || ''", /Problem and opportunity/);
    // One action: the document list on the section page, with no Back.
    const t0 = Date.now();
    await h.click("//nav[@aria-label='Documents']/button[.='Functional requirements']", "xpath");
    await until(h, "return document.querySelector('.section-page h1')?.innerText || ''", /Functional requirements/);
    const ms = Date.now() - t0;
    h.results.push(["INFO", `section opened in ${ms} ms`]);
    expect(ms < 2000, `took ${ms} ms`);
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

  await h.check("Text size: the buttons and Command-plus, Command-minus, and Command-0 change the text, and the size is kept", async () => {
    const size = () => h.num("return parseFloat(getComputedStyle(document.querySelector('.body p')).fontSize)");
    const normal = await size();
    await h.click("//button[@aria-label='Larger text']", "xpath");
    await h.click("//button[@aria-label='Larger text']", "xpath");
    const larger = await size();
    expect(Math.abs(larger / normal - 1.3) < 0.02, `normal ${normal}, after 2 steps ${larger}`);
    // The size is kept in the settings file (ADR-004).
    let kept;
    for (let i = 0; i < 20 && kept !== 1.3; i++) { await new Promise((r) => setTimeout(r, 100)); try { kept = JSON.parse(readFileSync(SETTINGS, "utf8")).text_zoom; } catch {} }
    expect(kept === 1.3, `settings.json text_zoom is ${kept}`);
    // The document list starts below the header, whose height grows with the text.
    const navGap = await h.num("return document.querySelector('.doc-nav') ? parseFloat(getComputedStyle(document.querySelector('.doc-nav')).top) - document.querySelector('header').offsetHeight : 8");
    expect(navGap >= 0, `the header covers the document list by ${-navGap} px`);
    // Real key presses: macOS can drop one while it brings the app to the front, so wait for each change.
    const keyUntil = async (code, mods, test) => {
      for (let i = 0; i < 3; i++) {
        await h.realKey(code, mods);
        for (let t = 0; t < 10; t++) { if (test(await size())) return; await new Promise((r) => setTimeout(r, 100)); }
      }
      throw new Error(`key ${code} did not change the text size`);
    };
    await keyUntil(24, "command down", (v) => v > larger + 0.5); // Command-plus
    await keyUntil(27, "command down", (v) => Math.abs(v - larger) < 0.1); // Command-minus
    await keyUntil(29, "command down", (v) => Math.abs(v - normal) < 0.1); // Command-0
  });

  await h.check("Wireframes show only their drawings: no ASCII sketch and no details block", async () => {
    await h.click("//button[contains(., 'Back to the PRD set')]", "xpath");
    await h.click("//ol[contains(@class,'documents')]//button[.='Wireframes']", "xpath");
    await h.waitText("WF-001");
    const body = await h.js("return document.querySelector('.body').innerText");
    expect(!/[┌└│]/.test(body), "an ASCII sketch shows");
    expect(!/prd-forge:details|^Details$/m.test(body), "the details block shows");
    const n = await h.num("return document.querySelectorAll('.body .diagram img').length");
    expect(n >= 9, `${n} drawings`);
  });

  await h.check("Each diagram fits within 60% of the window height", async () => {
    await until(h, "return String([...document.querySelectorAll('.body .diagram img')].every(i => i.complete && i.naturalWidth > 0))", /true/);
    const tallest = await h.num("return Math.max(...[...document.querySelectorAll('.body .diagram img')].map(i => i.getBoundingClientRect().height))");
    const limit = await h.num("return window.innerHeight * 0.6");
    expect(tallest <= limit + 1, `tallest ${tallest} px, limit ${limit} px`);
  });

  await h.check("The diagram window opens fitted, zooms, pans, and closes with Escape", async () => {
    await h.click("(//button[contains(@class,'diagram')])[1]", "xpath");
    // The x offset and the scale of the diagram, from its CSS transform.
    const view = async () => (await h.js("const m = /translate\\(([-\\d.]+)px.*scale\\(([\\d.]+)\\)/.exec(document.querySelector('.diagram-viewer[open] .stage img')?.style.transform || ''); return m ? m[1] + ' ' + m[2] : ''")).split(" ").map(Number);
    const change = async (from, i) => {
      for (const end = Date.now() + 4000; Date.now() < end; await new Promise((r) => setTimeout(r, 100))) {
        const v = await view();
        if (v.length === 2 && v[i] !== from[i]) return v;
      }
      throw new Error(`no change from ${from}`);
    };
    const fitted = await change([NaN, NaN], 1);
    await h.realKey(24); // "=", zoom in
    const zoomed = await change(fitted, 1);
    expect(zoomed[1] > fitted[1], `zoom ${fitted[1]} -> ${zoomed[1]}`);
    await h.realKey(124); // Right arrow, pan
    await change(zoomed, 0);
    await h.realKey(29); // "0", fit again
    const refit = await change(zoomed, 1);
    expect(Math.abs(refit[1] - fitted[1]) < 0.001, `fit ${refit[1]}, first ${fitted[1]}`);
    // macOS can drop a real key press, so press Escape up to 3 times.
    for (let i = 0; ; i++) {
      await h.realKey(53); // Escape
      try { await until(h, "return String(!!document.querySelector('.diagram-viewer'))", /false/, 2000); break; } catch (e) { if (i === 2) throw e; }
    }
  });
  await h.quit();

  // NFR-010: a remote image and a script in a body do nothing.
  const set = copySet(join(tmp(), "remote"));
  appendFileSync(join(set, "07-scope.md"), '\n![tracker](https://example.com/pixel.png)\n\n<details open ontoggle="document.title=\'SCRIPT RAN\'"><summary>s</summary>x</details>\n<svg onload="document.title=\'SCRIPT RAN\'"><circle r="1"/></svg>\n<img src="https://example.com/b.png" srcset="https://example.com/c.png 1x">\n');
  await h.launch(set);
  await h.check("NFR-010 a remote image does not load and no script in a body runs", async () => {
    await h.waitText("Version");
    await h.click("//button[contains(., 'Scope')]", "xpath");
    await h.waitText("[image: tracker]");
    await new Promise((r) => setTimeout(r, 800));
    const remote = await h.num("return document.querySelector('.body').innerHTML.split('example.com').length - 1");
    expect(remote === 0, `remote URLs left in the body: ${remote}`);
    const title = await h.js("return document.title");
    expect(!title.includes("SCRIPT RAN"), "a script ran");
  });
});
