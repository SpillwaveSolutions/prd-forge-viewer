import { expect, test } from "bun:test";
import { JSDOM } from "jsdom";
import { cleanForExport, cleanForView } from "./bodyClean";
import { renderBody } from "./renderBody";

const sketch = "```wireframe\n┌─ PRD Forge Viewer ─┐\n│ <1>                │\n└────────────────────┘\n```";
const page = `# Wireframes\n\nText.\n\n${sketch}\n\n![WF-001 drawing](diagrams/WF-001.svg)\n`;

test("an_export_drops_a_sketch_whose_drawing_it_has", () => {
    const out = cleanForExport(page, (p) => p === "diagrams/WF-001.svg");
    expect(out).not.toContain("```wireframe");
    expect(out).toContain("![WF-001 drawing](diagrams/WF-001.svg)");
    expect(out).toContain("Text.");
});

test("an_export_keeps_a_sketch_whose_drawing_cannot_be_read", () => {
    expect(cleanForExport(page, () => false)).toContain("```wireframe");
});

test("a_wireframe_sketch_with_no_drawing_stays", () => {
    expect(cleanForExport(`${sketch}\n\nNo drawing here.\n`)).toContain("```wireframe");
    expect(cleanForView(`${sketch}\n\nNo drawing here.\n`)).not.toContain("data-sketch");
});

test("other_code_blocks_stay", () => {
    expect(cleanForExport("```js\nlet a = 1;\n```\n\n![x](diagrams/x.svg)\n")).toContain("let a = 1;");
});

test("the_details_block_is_removed", () => {
    const md = "Body.\n\n<!-- prd-forge:details -->\n## Details\n\n**Field:** value\n<!-- /prd-forge:details -->\n";
    for (const out of [cleanForExport(md), cleanForView(md)]) {
        expect(out).toContain("Body.");
        expect(out).not.toContain("prd-forge:details");
        expect(out).not.toContain("## Details");
    }
});

test("the_viewer_renders_the_sketch_hidden_as_a_code_block", () => {
    const win = new JSDOM("").window as unknown as Window & typeof globalThis;
    const div = win.document.createElement("div");
    div.innerHTML = renderBody(page, win);
    const hidden = div.querySelector("[data-sketch]");
    expect(hidden?.hasAttribute("hidden")).toBe(true);
    expect(hidden?.querySelector("pre code")?.textContent).toContain("PRD Forge Viewer");
});
