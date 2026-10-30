import { expect, test } from "bun:test";
import { cleanBody } from "./bodyClean";

const sketch = "```wireframe\n┌─ PRD Forge Viewer ─┐\n│ <1>                │\n└────────────────────┘\n```";

test("a_wireframe_sketch_with_a_drawing_after_it_is_removed", () => {
    const out = cleanBody(`# Wireframes\n\nText.\n\n${sketch}\n\n![WF-001 drawing](diagrams/WF-001.svg)\n`);
    expect(out).not.toContain("```wireframe");
    expect(out).not.toContain("PRD Forge Viewer ─┐");
    expect(out).toContain("![WF-001 drawing](diagrams/WF-001.svg)");
    expect(out).toContain("Text.");
});

test("a_wireframe_sketch_with_no_drawing_stays", () => {
    const md = `${sketch}\n\nNo drawing here.\n`;
    expect(cleanBody(md)).toContain("```wireframe");
});

test("other_code_blocks_stay", () => {
    const md = "```js\nlet a = 1;\n```\n\n![x](diagrams/x.svg)\n";
    expect(cleanBody(md)).toContain("let a = 1;");
});

test("the_details_block_is_removed", () => {
    const md = "Body.\n\n<!-- prd-forge:details -->\n## Details\n\n**Field:** value\n<!-- /prd-forge:details -->\n";
    const out = cleanBody(md);
    expect(out).toContain("Body.");
    expect(out).not.toContain("prd-forge:details");
    expect(out).not.toContain("## Details");
});
