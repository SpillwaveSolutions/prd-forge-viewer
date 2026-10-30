// Phase 4: US-021 to US-025 (FR-015 to FR-018, FR-020), through the tauri MCP server.
import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { copySet, expect, run, tmp } from "../harness.mjs";

const SETTINGS = join(homedir(), "Library/Application Support/com.spillwave.prd-forge-viewer/settings.json");
const saved = () => JSON.parse(readFileSync(SETTINGS, "utf8"));
// Set a React-controlled input the way typing does: the native setter, then an input event.
const type = (label, value) => `(() => { const el = document.querySelector('[aria-label="${label}"]');
  const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${JSON.stringify(value)});
  el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true })); return 'ok'; })()`;
const field = (label) => `return (() => { const el = document.querySelector('[aria-label="${label}"]'); return el.value + (el.disabled ? ' disabled' : ''); })()`;

await run(async (h) => {
  const set = copySet(join(tmp(), "themes"));
  const pick = (name) => h.click(`//ul[@aria-label='Theme list']//button[contains(., '${name}')]`, "xpath");
  const openDialog = async () => { await h.click("//header//button[.='Themes']", "xpath"); await h.waitText("Save themes"); };
  await h.launch(set);
  await h.waitText("Version");

  await h.check("FR-015: both built-in themes have the PRD colors and fonts", async () => {
    await openDialog();
    await pick("Clay");
    const clay = await h.js(`return ['Page hex','Text hex','Headings hex','Accent hex','Text font','Heading font'].map(l => document.querySelector('[aria-label="' + l + '"]').value).join(' ')`);
    expect(clay === "#FAF9F5 #3D3D3A #141413 #D97757 sans serif", `Clay: ${clay}`);
    await pick("Ice Snowstorm");
    const ice = await h.js(`return ['Page hex','Text hex','Headings hex','Accent hex','Text font','Heading font'].map(l => document.querySelector('[aria-label="' + l + '"]').value).join(' ')`);
    expect(ice === "#F3F6FB #111111 #0B1F4B #1D4E89 sans sans", `Ice Snowstorm: ${ice}`);
  });

  await h.check("FR-017 2, FR-018 2: a built-in theme cannot change or be deleted", async () => {
    await pick("Clay");
    expect((await h.js(field("Accent hex"))).endsWith("disabled"), "accent not disabled");
    expect((await h.js(field("Theme name"))).endsWith("disabled"), "name not disabled");
    expect((await h.js("return String(document.evaluate(\"//button[.='Delete']\", document, null, 9, null).singleNodeValue.disabled)")) === "true", "Delete enabled");
  });

  await h.check("FR-016 1: the author makes the theme Acme with four colors and two fonts", async () => {
    await h.click("//button[.='New theme']", "xpath");
    for (const [l, v] of [["Theme name", "Acme"], ["Page hex", "#FFFFF0"], ["Text hex", "#222222"], ["Headings hex", "#003366"], ["Accent hex", "#CC0000"], ["Text font", "serif"], ["Heading font", "mono"]]) await h.js(`return ${type(l, v)}`);
    await h.click("//button[.='Save themes']", "xpath");
    const acme = saved().themes.find((t) => t.name === "Acme");
    expect(acme && acme.page === "#FFFFF0" && acme.accent === "#CC0000" && acme.font === "serif" && acme.headingFont === "mono", JSON.stringify(acme));
  });

  await h.check("A theme save keeps the known locations, and a set open keeps the themes", async () => {
    expect(saved().known.includes(set), JSON.stringify(saved().known));
  });

  await h.check("A blank name or a bad hex blocks the save and says why", async () => {
    await openDialog();
    await pick("Acme");
    await h.js(`return ${type("Theme name", " ")}`);
    await h.js(`return ${type("Accent hex", "#00880")}`);
    const state = await h.js("return document.evaluate(\"//button[.='Save themes']\", document, null, 9, null).singleNodeValue.disabled + ' ' + (document.querySelector('dialog [role=alert]')?.innerText || '')");
    expect(state.startsWith("true") && /no name/.test(state) && /Accent/.test(state), state);
  });

  await h.check("NFR-007: Escape closes the dialog and the focus goes back to Themes", async () => {
    await h.realKey(53);
    await new Promise((r) => setTimeout(r, 400));
    // Open it again from the keyboard: focus on Themes, then Return. Then close it with Escape.
    // macOS can drop a real key press while it brings the app to the front, so try up to 3 times.
    for (let i = 0; ; i++) {
      await h.js("document.evaluate(\"//header//button[.='Themes']\", document, null, 9, null).singleNodeValue.focus(); return 'ok'");
      await h.realKey(36);
      try { await h.waitText("Save themes", 3000); break; } catch (e) { if (i === 2) throw e; }
    }
    const inside = await h.js("return String(!!document.activeElement?.closest('dialog'))");
    expect(inside === "true", "focus is not in the dialog");
    await h.realKey(53);
    await new Promise((r) => setTimeout(r, 400));
    const st = await h.js("return String(!!document.querySelector('dialog[open]')) + ' ' + document.activeElement?.innerText");
    expect(st === "false Themes", st);
    expect(saved().themes.find((t) => t.name === "Acme")?.accent === "#CC0000", "Escape saved the change");
  });

  await h.check("FR-020: Acme is there after a restart, with the same colors and fonts", async () => {
    await h.quit();
    await h.launch(set);
    await h.waitText("Version");
    await openDialog();
    await pick("Acme");
    const v = await h.js(`return ['Page hex','Text hex','Headings hex','Accent hex','Text font','Heading font'].map(l => document.querySelector('[aria-label="' + l + '"]').value).join(' ')`);
    expect(v === "#FFFFF0 #222222 #003366 #CC0000 serif mono", v);
  });

  await h.check("FR-017 1: a changed accent color is saved", async () => {
    await h.js(`return ${type("Accent hex", "#008800")}`);
    await h.click("//button[.='Save themes']", "xpath");
    expect(saved().themes.find((t) => t.name === "Acme")?.accent === "#008800", JSON.stringify(saved().themes));
  });

  await h.check("Cancel saves nothing", async () => {
    await openDialog();
    await pick("Acme");
    await h.js(`return ${type("Accent hex", "#111111")}`);
    await h.click("//button[.='Cancel']", "xpath");
    expect(saved().themes.find((t) => t.name === "Acme")?.accent === "#008800", "cancel saved the change");
  });

  await h.check("FR-018 1: a deleted Acme is no longer available to select", async () => {
    await openDialog();
    await pick("Acme");
    await h.click("//button[.='Delete']", "xpath");
    await h.click("//button[.='Save themes']", "xpath");
    expect(saved().themes.length === 0, JSON.stringify(saved().themes));
    await openDialog();
    const names = await h.js("return document.querySelector('[aria-label=\"Theme list\"]').innerText");
    expect(!names.includes("Acme") && names.includes("Clay") && names.includes("Ice Snowstorm"), names);
  });
});
