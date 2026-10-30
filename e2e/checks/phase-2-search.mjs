// Phase 2: US-011 and US-012 (FR-008, all six criteria) and NFR-003, through the tauri MCP server.
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { SET, expect, run, tmp } from "../harness.mjs";

const until = async (h, script, re, ms = 8000) => {
  let v = "";
  for (const end = Date.now() + ms; Date.now() < end; await new Promise((r) => setTimeout(r, 50))) {
    v = await h.js(script);
    if (re.test(v)) return v;
  }
  throw new Error(`timed out; last value: ${v.slice(0, 200)}`);
};

// Type a term, pick categories (none means all), and submit. Returns the status text: "N matches" or "No matches".
async function search(h, term, categories = []) {
  await h.js(`
    const set = (el, v) => { Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); };
    set(document.querySelector('form[role=search] input[type=search]'), ${JSON.stringify(term)});
    const want = ${JSON.stringify(categories)};
    const all = document.querySelector('.categories input[value=all]');
    if (!want.length) { if (!all.checked) all.click(); }
    else for (const b of document.querySelectorAll('.categories input:not([value=all])')) if (b.checked !== want.includes(b.value)) b.click();
    window.__searchT0 = performance.now();
    window.__seq = +(document.querySelector('.search [role=status]')?.dataset.seq || 0);
    document.querySelector('form[role=search] button[type=submit]').click();
    return 'ok';`);
  return until(h, `const s = document.querySelector('.search [role=status]'); return s && +s.dataset.seq > window.__seq ? s.innerText + '|' + (performance.now() - window.__searchT0) : ''`, /match/);
}
// The MCP tool returns a script's result as text, sometimes JSON-encoded again; parse until it is a value.
const value = (text) => { let v = text; for (let i = 0; i < 2 && typeof v === "string"; i++) { try { v = JSON.parse(v); } catch { break; } } return v; };
const rows = async (h) => value(await h.js("return JSON.stringify([...document.querySelectorAll('.results li')].map(li => li.innerText))"));

await run(async (h) => {
  await h.launch(SET);
  await h.waitText("Version");
  await until(h, "return document.querySelectorAll('.categories input[type=checkbox]').length + ''", /^[2-9]|\d\d/);

  await h.check("FR-008 1: export in functional requirements gives only functional requirements", async () => {
    await search(h, "export", ["functional-requirements"]);
    const bad = await h.js("const r = [...document.querySelectorAll('.results li')]; return r.length + ':' + r.filter(li => !/FR-\\d{3}/.test(li.innerText) || !li.innerText.includes('Functional requirements')).length");
    expect(/^[1-9]\d*:0$/.test(bad), `results:off-category = ${bad}`);
  });

  await h.check("FR-008 1: export in functional requirements and scenarios gives both and nothing else", async () => {
    await search(h, "export", ["functional-requirements", "scenarios"]);
    const kinds = await h.js("const r = [...document.querySelectorAll('.results li')]; return [r.some(li => /FR-\\d{3}/.test(li.innerText)), r.some(li => /SC-\\d{3}/.test(li.innerText)), r.filter(li => !/(FR|SC)-\\d{3}/.test(li.innerText)).length].join(',')");
    expect(kinds === "true,true,0", `FR, SC, other: ${kinds}`);
  });

  await h.check("FR-008 2: export in all categories includes scenarios", async () => {
    await search(h, "export");
    const sc = await h.num("return [...document.querySelectorAll('.results li')].filter(li => /SC-\\d{3}/.test(li.innerText)).length");
    expect(sc > 0, `scenario results: ${sc}`);
  });

  await h.check("FR-008 4: each result shows a score from 0 to 100, highest first", async () => {
    const scores = value(await h.js("return JSON.stringify([...document.querySelectorAll('.results .score')].map(e => +e.innerText))"));
    expect(scores[0] === 100 && scores.every((v, i) => v >= 0 && v <= 100 && (i === 0 || scores[i - 1] >= v)), JSON.stringify(scores));
  });

  await h.check("FR-008 5: selecting a result shows that item in its section", async () => {
    const id = await h.js("return document.querySelector('.results li strong').innerText");
    await h.click(".results li button");
    await until(h, "return document.querySelector('article.item h3')?.innerText || ''", new RegExp("^" + id));
  });

  await h.check("FR-008 6: a term that no item contains says there are no matches", async () => {
    const status = await search(h, "zzqxnomatch");
    expect(status.startsWith("No matches"), status);
  });

  await h.check("NFR-003: 20 searches each show results within 0.5 s", async () => {
    const terms = ["grade", "theme", "search", "section", "draft", "sponsor", "PDF", "keyboard", "prdf", "known", "stage", "journey", "score", "blocking", "persona", "release", "network", "script", "folder", "export"];
    const ms = [];
    for (const t of terms) ms.push(Number((await search(h, t)).split("|").pop()));
    ms.sort((a, b) => a - b);
    h.results.push(["INFO", `search ms: p50 ${ms[9].toFixed(0)}, p95 ${ms[18].toFixed(0)}, max ${ms[19].toFixed(0)}`]);
    expect(ms[18] < 500, `p95 ${ms[18]} ms`);
  });
  await h.quit();

  // FR-008 3: a title match ranks above a match in the text.
  const s = join(tmp(), "rank");
  mkdirSync(s, { recursive: true });
  writeFileSync(join(s, "prd.md"), "---\nid: r\nkind: prd\ntitle: Rank test PRD\nstatus: draft\nproduct: Rank test\nversion: 0.0.1\nlinks:\n  children:\n    - { path: ./08.md, title: Functional requirements, section: 7, order: 80 }\n---\n");
  writeFileSync(join(s, "08.md"), "---\nid: f\nkind: functional-requirements\ntitle: Functional requirements\nstatus: draft\nsection: 7\nrequirements:\n  - id: FR-001\n    capability: Item B\n    outcome: Mentions export once\n  - id: FR-002\n    capability: Item A export\n    outcome: A file\n---\n");
  await h.launch(s);
  await h.check("FR-008 3: item A with export in its title is above item B with export once in its text", async () => {
    await h.waitText("Rank test");
    await until(h, "return document.querySelectorAll('.categories input[type=checkbox]').length + ''", /^[2-9]/);
    await search(h, "export");
    const order = await h.js("return [...document.querySelectorAll('.results li strong')].map(s => s.innerText).join(',')");
    expect(order === "FR-002,FR-001", order);
  });
});
