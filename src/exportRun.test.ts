import { expect, test } from "bun:test";
import { collectBodies, exportFileName, printCss, toBase64 } from "./exportRun";
import { renderThemedHtml } from "./exportHtml";
import { doc, sampleSet } from "./fixtures";
import { CLAY } from "./themes";
import type { Section } from "./types";

const set = sampleSet([doc({ file: "a.md", order: 1, status: "draft" }), doc({ file: "b.md", order: 2, status: "pending" }), doc({ file: "c.md", order: 3, status: "draft" })]);

test("bodies_are_read_only_for_selected_written_documents", async () => {
    const read: string[] = [];
    const bodies = await collectBodies(set, new Set(["a.md", "b.md"]), async (f) => { read.push(f); return { file: f, body: f } as Section; });
    expect(read).toEqual(["a.md"]);
    expect([...bodies.keys()]).toEqual(["a.md"]);
});

test("a_document_that_cannot_be_read_is_left_out_not_an_error", async () => {
    const bodies = await collectBodies(set, null, async (f) => { if (f === "c.md") throw new Error("gone"); return { file: f, body: f } as Section; });
    expect([...bodies.keys()]).toEqual(["a.md"]);
});

test("the_print_css_applies_only_when_printing_and_keeps_the_fonts_outside", () => {
    const css = printCss(renderThemedHtml("# X", CLAY, "T", "@font-face { font-family: 'F'; }"));
    expect(css.startsWith("@font-face")).toBe(true);
    expect(css).toContain("@media print {");
    expect(css).toContain("body > :not(#print-root) { display: none !important; }");
    expect(css).toContain("#FAF9F5");
    expect(css.indexOf("@page")).toBeLessThan(css.indexOf("@media print"));
});

test("base64_round_trips_large_bytes", () => {
    const bytes = new Uint8Array(200000).map((_, i) => i % 256);
    expect(Uint8Array.from(atob(toBase64(bytes)), (c) => c.charCodeAt(0))).toEqual(bytes);
});

test("the_file_name_is_clean_even_with_a_slash_in_the_version", () => {
    expect(exportFileName({ ...set, product: "PRD Forge", version: "1.0/beta" }, "pdf")).toBe("PRD-Forge-PRD-1.0-beta.pdf");
});
