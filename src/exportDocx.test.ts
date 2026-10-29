import { expect, test } from "bun:test";
import { readFileSync } from "fs";
import JSZip from "jszip";
import { join } from "path";
import { exportDocx } from "./exportDocx";
import { loadFonts } from "./exportFonts";
import { CLAY } from "./themes";

const fonts = await loadFonts(async (f) => readFileSync(join(import.meta.dir, "../public/fonts", f)));
const md = "# PRD\n\nVersion 0.1.0\n\n# User journeys\n\nJOURNEY\n\n# Functional requirements\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n";
const zip = await JSZip.loadAsync(await exportDocx(md, CLAY, "PRD Forge Viewer PRD", fonts));
const part = (name: string) => zip.file(name)!.async("string");

test("the_clay_colors_and_fonts_are_in_the_document", async () => {
    const all = (await part("word/document.xml")) + (await part("word/styles.xml"));
    for (const c of ["FAF9F5", "3D3D3A", "141413", "D97757"]) expect(all).toContain(c);
    expect(all).toContain('w:ascii="Source Serif 4"');
    expect(all).toContain('w:ascii="Source Sans 3"');
});

test("the_fonts_are_embedded_in_the_package", async () => {
    const table = await part("word/fontTable.xml");
    expect(table).toMatch(/Source Sans 3[\s\S]*w:embedRegular/);
    expect(table).toMatch(/Source Serif 4[\s\S]*w:embedRegular/);
    expect(Object.keys(zip.files).filter((f) => f.startsWith("word/fonts/")).length).toBeGreaterThanOrEqual(2);
});

test("the_sections_are_in_order_with_heading_styles", async () => {
    const doc = await part("word/document.xml");
    expect(doc.indexOf("User journeys")).toBeLessThan(doc.indexOf("Functional requirements"));
    expect(doc).toContain('w:val="Heading1"');
});

test("the_document_has_a_title_and_a_table_header_row", async () => {
    expect(await part("docProps/core.xml")).toContain("<dc:title>PRD Forge Viewer PRD</dc:title>");
    expect(await part("word/document.xml")).toContain("<w:tblHeader/>");
});
