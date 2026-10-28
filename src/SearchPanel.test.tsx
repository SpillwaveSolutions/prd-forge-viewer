import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { SearchPanel, SearchResults } from "./SearchPanel";
import type { Hit } from "./types";

const hit = (id: string, score: number, title = `Title ${id}`): Hit => ({ id, title, file: "08.md", section: "Functional requirements", category: "functional-requirements", score });

test("results_show_count_score_id_title_and_section", () => {
    const html = renderToStaticMarkup(<SearchResults term="export" hits={[hit("FR-010", 100), hit("FR-011", 64)]} onOpenItem={() => {}} />);
    expect(html).toContain("2 matches");
    for (const s of ["100", "FR-010", "Title FR-010", "Functional requirements", "64"]) expect(html).toContain(s);
    expect(html.indexOf("FR-010")).toBeLessThan(html.indexOf("FR-011"));
});

test("each_result_is_a_button", () => {
    const html = renderToStaticMarkup(<SearchResults term="export" hits={[hit("FR-010", 100)]} onOpenItem={() => {}} />);
    expect(html).toMatch(/<button[^>]*>.*FR-010/s);
});

test("no_match_message", () => {
    const html = renderToStaticMarkup(<SearchResults term="zzq" hits={[]} onOpenItem={() => {}} />);
    expect(html).toContain("No matches for “zzq”");
});

test("panel_has_a_labeled_box_and_categories_with_all_first", () => {
    const html = renderToStaticMarkup(<SearchPanel categories={[{ kind: "functional-requirements", title: "Functional requirements" }]} onSearch={async () => []} onOpenItem={() => {}} />);
    expect(html).toMatch(/<label[^>]*>Search/);
    expect(html.indexOf('value="all"')).toBeLessThan(html.indexOf('value="functional-requirements"'));
});
