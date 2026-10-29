import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { applyChange, keepSelection } from "./live";
import { SectionPage } from "./SectionPage";
import { SetOverview } from "./SetOverview";
import { doc, sampleSet } from "./fixtures";
import type { Section } from "./types";

const sec: Section = { file: "04.md", title: "Users and personas", status: "final", section: 4, score: 75, blocking: 0, graded: "2026-10-28", body: "x", items: [{ id: "PER-001", title: "P", parent: null, fields: [] }] };

test("changes_add_up", () => {
    expect([...applyChange(new Set(["01.md"]), ["04.md", "01.md"])].sort()).toEqual(["01.md", "04.md"]);
});

test("selected_item_kept_when_it_still_exists", () => {
    expect(keepSelection("PER-001", sec)).toBe("PER-001");
    expect(keepSelection("PER-009", sec)).toBeNull();
});

test("changed_section_shows_a_change_notice", () => {
    const html = renderToStaticMarkup(<SectionPage section={sec} known={new Set()} selected={null} onSelect={() => {}} onOpenItem={() => {}} onBack={() => {}} renderHtml={(m) => m} changed />);
    expect(html).toContain("This section changed");
});

test("unchanged_section_has_no_notice", () => {
    const html = renderToStaticMarkup(<SectionPage section={sec} known={new Set()} selected={null} onSelect={() => {}} onOpenItem={() => {}} onBack={() => {}} renderHtml={(m) => m} />);
    expect(html).not.toContain("This section changed");
});

test("changed_document_is_marked_in_the_list", () => {
    const set = sampleSet([doc({ file: "04.md", title: "Users and personas" }), doc({ file: "05.md", title: "User journeys" })]);
    const html = renderToStaticMarkup(<SetOverview set={set} onOpen={() => {}} changed={new Set(["04.md"])} />);
    expect(html).toMatch(/Users and personas.*changed/s);
    expect((html.match(/class="changed"/g) || []).length).toBe(1);
});
