import { expect, test } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";
import { renderThemedHtml } from "./exportHtml";
import { FONT_FILES, fontFaceCss, loadFonts } from "./exportFonts";
import { CLAY } from "./themes";

const fonts = await loadFonts(async (f) => readFileSync(join(import.meta.dir, "../public/fonts", f)));
const md = "# Scope\n\n## In scope\n\n- one\n- two\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n";

test("the_clay_colors_and_fonts_are_in_the_html", () => {
    const html = renderThemedHtml(md, CLAY, "PRD", fontFaceCss(fonts));
    for (const c of ["#FAF9F5", "#3D3D3A", "#141413", "#D97757"]) expect(html).toContain(c);
    expect(html).toMatch(/h1, h2[^{]*\{ font-family: 'Source Serif 4'/);
    expect(html).toMatch(/body \{ font-family: 'Source Sans 3'/);
});

test("every_font_file_is_embedded_as_a_font_face", () => {
    const css = fontFaceCss(fonts);
    expect(css.match(/@font-face/g)?.length).toBe(Object.values(FONT_FILES).flat().length);
    expect(css).toContain("data:font/ttf;base64,");
});

test("the_body_keeps_its_headings_lists_and_tables", () => {
    const html = renderThemedHtml(md, CLAY, "PRD", "");
    for (const t of ["<h1>Scope</h1>", "<h2>In scope</h2>", "<ul><li>one</li>", "<table>"]) expect(html).toContain(t);
});

test("the_html_names_its_language_and_title_for_screen_readers", () => {
    const html = renderThemedHtml(md, CLAY, "PRD Forge Viewer PRD", "");
    expect(html).toContain('<html lang="en">');
    expect(html).toContain("<title>PRD Forge Viewer PRD</title>");
});
