import { expect, test } from "bun:test";
import JSZip from "jszip";
import { markdownToBlocks, runsToText, type ExportBlock } from "./exportBlocks";
import { exportDocx } from "./exportDocx";
import { renderThemedHtml } from "./exportHtml";
import { CLAY } from "./themes";

function paragraph(markdown: string): Extract<ExportBlock, { type: "paragraph" }> {
    const block = markdownToBlocks(markdown).find((item) => item.type === "paragraph");
    if (block?.type !== "paragraph") throw new Error("expected a paragraph");
    return block;
}

const wrapped = [
    "At least two test matters move",
    "through the core",
    "lifecycle end to end with Party A, on a minimal workflow in a hosted",
    "product behind a",
    "sign-in.",
].join("\n");

test("a_soft_break_flows_as_a_space", () => {
    const runs = paragraph(wrapped).runs;
    expect(runsToText(runs)).toBe(
        "At least two test matters move through the core lifecycle end to end with Party A, on a minimal workflow in a hosted product behind a sign-in.",
    );
    expect(runsToText(runs)).not.toContain("\n");
});

test("spaces_and_a_carriage_return_around_a_soft_break_collapse", () => {
    expect(runsToText(paragraph("a \n b").runs)).toBe("a b");
    expect(runsToText(paragraph("a\tb\n\tc").runs)).toBe("a\tb c");
    expect(runsToText(paragraph("a\r\nb").runs)).toBe("a b");
    expect(runsToText(paragraph("one\ntwo\nthree").runs)).toBe("one two three");
});

test("two_trailing_spaces_stay_a_hard_break", () => {
    expect(paragraph("a  \nb").runs).toEqual([{ text: "a" }, { text: "\n" }, { text: "b" }]);
});

test("a_backslash_at_the_end_of_a_line_stays_a_hard_break", () => {
    expect(paragraph("a\\\nb").runs).toEqual([{ text: "a" }, { text: "\n" }, { text: "b" }]);
});

test("a_soft_break_and_a_hard_break_in_one_paragraph_stay_distinct", () => {
    expect(paragraph("keep\nflow  \nbreak\nmore").runs).toEqual([
        { text: "keep flow" },
        { text: "\n" },
        { text: "break more" },
    ]);
});

test("a_soft_break_inside_emphasis_stays_inside_it", () => {
    expect(paragraph("See *the\nrecord* and **the\nlaw**.").runs).toEqual([
        { text: "See " },
        { text: "the record", italic: true },
        { text: " and " },
        { text: "the law", bold: true },
        { text: "." },
    ]);
});

test("a_hard_break_inside_emphasis_stays_a_break", () => {
    expect(paragraph("*a  \nb*").runs).toEqual([
        { text: "a", italic: true },
        { text: "\n", italic: true },
        { text: "b", italic: true },
    ]);
    expect(paragraph("*a\\\nb*").runs).toEqual([
        { text: "a", italic: true },
        { text: "\n", italic: true },
        { text: "b", italic: true },
    ]);
});

test("a_soft_break_around_a_link_or_code_span_is_a_space", () => {
    expect(paragraph("see [docs](a.md)\nfor more").runs).toEqual([
        { text: "see " },
        { text: "docs", href: "a.md" },
        { text: " for more" },
    ]);
    expect(paragraph("[a\nb](http://x.test)").runs).toEqual([{ text: "a b", href: "http://x.test" }]);
    expect(paragraph("a\n`x\ny`\nb").runs).toEqual([{ text: "a " }, { text: "x y", code: true }, { text: " b" }]);
});

test("a_hard_break_inside_a_link_stays_a_break", () => {
    expect(paragraph("[a  \nb](http://x.test)").runs).toEqual([{ text: "a\nb", href: "http://x.test" }]);
    expect(paragraph("[a\\\nb](http://x.test)").runs).toEqual([{ text: "a\nb", href: "http://x.test" }]);
});

test("strikethrough_words_flow_and_a_hard_break_inside_them_stays", () => {
    expect(paragraph("~~a\nb~~").runs).toEqual([{ text: "a b" }]);
    expect(paragraph("~~a  \nb~~").runs).toEqual([{ text: "a" }, { text: "\n" }, { text: "b" }]);
});

test("a_wrapped_list_item_stays_one_line", () => {
    expect(markdownToBlocks("- alpha\n  beta\n- two\n")).toEqual([
        { type: "list", ordered: false, items: [[{ text: "alpha beta" }], [{ text: "two" }]] },
    ]);
    expect(markdownToBlocks("1. ordered\n   wrap\n2. two\n")).toEqual([
        { type: "list", ordered: true, items: [[{ text: "ordered wrap" }], [{ text: "two" }]] },
    ]);
    expect(markdownToBlocks("- **wrapped\nitem** here\n  more\n")).toEqual([
        {
            type: "list",
            ordered: false,
            items: [[{ text: "wrapped item", bold: true }, { text: " here more" }]],
        },
    ]);
});

test("a_soft_break_in_a_quote_flows_as_a_space", () => {
    expect(markdownToBlocks("> quote\n> wrapped\n")).toEqual([{ type: "quote", text: "quote wrapped" }]);
});

test("a_code_block_heading_table_and_image_keep_their_shape", () => {
    const blocks = markdownToBlocks("# Head\n\nText\nwrapped.\n\n![alt](diagrams/a.svg)\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n```\na\nb\n```\n");
    expect(blocks).toEqual([
        { type: "heading", level: 1, text: "Head" },
        { type: "paragraph", runs: [{ text: "Text wrapped." }] },
        { type: "image", alt: "alt", src: "diagrams/a.svg" },
        { type: "table", header: ["A", "B"], rows: [["1", "2"]] },
        { type: "code", text: "a\nb" },
    ]);
});

test("soft_breaks_flow_in_the_html_pdf_and_print_share", () => {
    const html = renderThemedHtml(`${wrapped}\n\nStay.  \nBroken.\\\nApart.\n`, CLAY, "Wrap");
    expect(html).toContain(
        "<p>At least two test matters move through the core lifecycle end to end with Party A, on a minimal workflow in a hosted product behind a sign-in.</p>",
    );
    expect(html).toContain("<p>Stay.<br />Broken.<br />Apart.</p>");
    const prose = html.slice(html.indexOf("<p>At least"), html.indexOf("</p>") + 4);
    expect(prose).not.toContain("<br");
});

test("lists_tables_code_and_headings_gain_no_soft_break_in_the_html", () => {
    const html = renderThemedHtml("# Head\n\n- alpha\n  beta\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n```\na\nb\n```\n", CLAY, "Wrap");
    expect(html).toContain("<h1>Head</h1>");
    expect(html).toContain("<ul><li>alpha beta</li></ul>");
    expect(html).toContain("<table>");
    expect(html).toContain("<td>1</td>");
    expect(html).toContain("<pre><code>a\nb</code></pre>");
    expect(html).not.toContain("<br");
});

async function wordXml(markdown: string): Promise<string> {
    const zip = await JSZip.loadAsync(await exportDocx(markdown, CLAY, "Wrap"));
    return zip.file("word/document.xml")!.async("string");
}

test("soft_breaks_flow_in_the_word_document_and_a_hard_break_is_a_line_break", async () => {
    const doc = await wordXml(`${wrapped}\n\nStay.  \nBroken.\\\nApart.\n`);
    expect(doc).toContain(
        "At least two test matters move through the core lifecycle end to end with Party A, on a minimal workflow in a hosted product behind a sign-in.",
    );
    expect(doc).toContain("Stay.");
    expect(doc).toContain("Broken.");
    expect(doc).toContain("Apart.");
    expect(doc.match(/<w:br\/>/g)?.length).toBe(2);
    expect(doc).not.toMatch(/<w:t[^>]*>[^<]*\n[^<]*<\/w:t>/);
});

test("a_word_code_block_list_and_heading_keep_their_line_breaks", async () => {
    const doc = await wordXml("# Head\n\n- alpha\n  beta\n\n```\na\nb\n```\n");
    expect(doc).toContain("Head");
    expect(doc).toContain("alpha beta");
    expect(doc).toMatch(/<w:t[^>]*>a\nb<\/w:t>/);
    expect(doc).not.toContain("<w:br");
});
