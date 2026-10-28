import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { SetOverview } from "./SetOverview";
import { doc, sampleSet } from "./fixtures";

const three = sampleSet([
    doc({ file: "prd.md", title: "PRD Forge Viewer PRD" }),
    doc({ file: "01-problem-opportunity.md", title: "Problem and opportunity", section: 1, order: 10 }),
    doc({ file: "02-customer-market.md", title: "Target customer and market", section: 2, order: 20 }),
]);

test("shows_product_version_and_summary", () => {
    const html = renderToStaticMarkup(<SetOverview set={three} />);
    expect(html).toContain("PRD Forge Viewer");
    expect(html).toContain("0.6.1");
    expect(html).toContain("Problem");
});

test("lists_documents_in_order", () => {
    const html = renderToStaticMarkup(<SetOverview set={three} />);
    expect(html.indexOf("Problem and opportunity")).toBeLessThan(html.indexOf("Target customer and market"));
});

test("marks_unreadable_with_file_name", () => {
    const set = sampleSet([doc({ file: "04-personas.md", title: "Users and personas", status: "unreadable", unreadable: "no front matter" })]);
    const html = renderToStaticMarkup(<SetOverview set={set} />);
    expect(html).toContain("Unreadable");
    expect(html).toContain("04-personas.md");
});

test("title_markup_is_text", () => {
    const set = sampleSet([doc({ title: "<script>alert(1)</script>" })]);
    const html = renderToStaticMarkup(<SetOverview set={set} />);
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
});
