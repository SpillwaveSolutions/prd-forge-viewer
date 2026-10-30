import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import JSZip from "jszip";
import { markdownToBlocks } from "./exportBlocks";
import { exportDocx, fitImage, pngSize, svgSize } from "./exportDocx";
import { loadFonts } from "./exportFonts";
import { renderThemedHtml } from "./exportHtml";
import { loadImages } from "./exportRun";
import { CLAY } from "./themes";

const png = readFileSync(join(import.meta.dir, "../docs/prd/prd-forge-viewer/diagrams/WF-001.png"));
const dataUrl = `data:image/png;base64,${png.toString("base64")}`;

test("an_image_line_is_an_image_block", () => {
    expect(markdownToBlocks("Text.\n\n![WF-001 drawing](diagrams/WF-001.svg)\n")).toContainEqual({ type: "image", alt: "WF-001 drawing", src: "diagrams/WF-001.svg" });
});

test("each_local_image_is_asked_for_by_its_own_path", async () => {
    const asked: string[] = [];
    const images = await loadImages("![A](diagrams/A.svg)\n\n![B](https://x.test/b.png)\n", async (rel) => { asked.push(rel); return "data:image/png;base64,AAAA"; });
    expect(asked).toEqual(["diagrams/A.svg"]);
    expect([...images]).toEqual([["diagrams/A.svg", "data:image/png;base64,AAAA"]]);
});

test("an_image_that_cannot_be_read_is_not_in_the_map", async () => {
    expect((await loadImages("![A](diagrams/A.svg)\n", async () => { throw new Error("gone"); })).size).toBe(0);
});

test("the_html_shows_a_figure_with_a_caption_and_only_data_images", () => {
    const html = renderThemedHtml("![WF-001 drawing](diagrams/WF-001.svg)\n\n![Gone](diagrams/gone.svg)\n", CLAY, "T", "", new Map([["diagrams/WF-001.svg", dataUrl]]));
    expect(html).toContain(`<figure class="diagram"><img src="data:image/png;base64,`);
    expect(html).toContain("<figcaption>WF-001 drawing</figcaption>");
    expect(html).not.toContain("diagrams/gone.svg");
    expect(html).toContain("Gone");
});

test("the_png_size_is_read_and_fits_6_by_8_inches", () => {
    const size = pngSize(png);
    expect(size.width).toBeGreaterThan(0);
    expect(fitImage({ width: 1152, height: 400 })).toEqual({ width: 576, height: 200 });
    expect(fitImage({ width: 300, height: 1536 })).toEqual({ width: 150, height: 768 });
    expect(fitImage({ width: 100, height: 50 })).toEqual({ width: 100, height: 50 });
});

test("the_word_file_embeds_the_png_with_a_caption", async () => {
    const fonts = await loadFonts(async (f) => readFileSync(join(import.meta.dir, "../public/fonts", f)));
    const zip = await JSZip.loadAsync(await exportDocx("![WF-001 drawing](diagrams/WF-001.svg)\n", CLAY, "T", fonts, new Map([["diagrams/WF-001.svg", dataUrl]])));
    expect(Object.keys(zip.files).some((f) => f.startsWith("word/media/") && f.endsWith(".png"))).toBe(true);
    expect(await zip.file("word/document.xml")!.async("string")).toContain("WF-001 drawing");
});

test("the_word_file_embeds_an_svg_when_its_png_is_stale", async () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1152 400"><rect width="10" height="10"/></svg>';
    const fonts = await loadFonts(async (f) => readFileSync(join(import.meta.dir, "../public/fonts", f)));
    const url = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
    const zip = await JSZip.loadAsync(await exportDocx("![D](diagrams/D.svg)\n", CLAY, "T", fonts, new Map([["diagrams/D.svg", url]])));
    expect(Object.keys(zip.files).some((f) => f.startsWith("word/media/") && f.endsWith(".svg"))).toBe(true);
});

test("the_svg_size_comes_from_its_view_box_or_its_width_and_height", () => {
    expect(svgSize('<svg viewBox="0 0 300 150">')).toEqual({ width: 300, height: 150 });
    expect(svgSize('<svg width="200px" height="100px">')).toEqual({ width: 200, height: 100 });
});
