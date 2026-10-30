import { expect, test } from "bun:test";
import { buildExport, draftReason } from "./exportModel";
import { doc, sampleSet } from "./fixtures";
import type { Section } from "./types";

const docs = [
    doc({ file: "prd.md", title: "PRD Forge Viewer PRD", order: 0, status: "draft" }),
    doc({ file: "05-user-journeys.md", title: "User journeys", section: 5, order: 5, status: "review", grade: { score: 82, blocking: 0, graded: "2026-10-28" } }),
    doc({ file: "07-scope.md", title: "Scope", section: 7, order: 7, status: "pending" }),
    doc({ file: "08-functional-requirements.md", title: "Functional requirements", section: 8, order: 8, status: "draft", grade: { score: 61, blocking: 1, graded: "2026-10-28" } }),
];
const set = { ...sampleSet(docs), version: "0.1.0" };
const body = (file: string, text: string): Section => ({ file, title: file, status: "draft", section: null, score: null, blocking: null, graded: null, body: text, items: [] });
const bodies = new Map([
    ["prd.md", body("prd.md", "# PRD Forge Viewer PRD\n\nRoot text.")],
    ["05-user-journeys.md", body("05-user-journeys.md", "# User journeys\n\nJOURNEY-TEXT")],
    ["07-scope.md", body("07-scope.md", "# Scope\n\nNot interviewed.")],
    ["08-functional-requirements.md", body("08-functional-requirements.md", "# Functional requirements\n\nFR-TEXT")],
]);

test("fr_014_the_first_page_shows_the_version_and_draft", () => {
    const md = buildExport(set, bodies, null);
    const first = md.slice(0, md.indexOf("## Contents"));
    expect(first).toContain("Version 0.1.0");
    expect(first).toContain("Draft");
    expect(first).toContain("A PRD set is 18 linked files.");
});

test("tr_005_draft_unless_every_document_is_final", () => {
    expect(draftReason(docs)).toContain("4 of 4 documents are not final");
    const finals = docs.map((d) => ({ ...d, status: "final" }));
    expect(draftReason(finals)).toBeNull();
    expect(buildExport({ ...set, documents: finals }, bodies, null)).not.toContain("Draft");
    const oneReview = finals.map((d, i) => (i === 1 ? { ...d, status: "review" } : d));
    expect(buildExport({ ...set, documents: oneReview }, bodies, null)).toContain("Draft");
});

test("fr_019_with_grades_contents_show_status_score_and_blocking_of_every_section", () => {
    const md = buildExport(set, bodies, new Set(["05-user-journeys.md"]), { grades: true });
    const contents = md.slice(md.indexOf("## Contents"));
    expect(contents).toContain("| User journeys | review | 82 | 0 |");
    expect(contents).toContain("| Scope | pending | not graded | not graded |");
    expect(contents).toContain("| Functional requirements | draft | 61 | 1 |");
});

test("fr_019_a_pending_section_says_it_is_not_written_yet", () => {
    const md = buildExport(set, bodies, null);
    const scope = md.slice(md.indexOf("# Scope"));
    expect(scope).toContain("This section is not written yet.");
    expect(scope).not.toContain("Not interviewed.");
});

test("fr_012_only_selected_sections_in_reading_order", () => {
    const md = buildExport(set, bodies, new Set(["08-functional-requirements.md", "05-user-journeys.md"]));
    expect(md).toContain("JOURNEY-TEXT");
    expect(md).toContain("FR-TEXT");
    expect(md).not.toContain("Root text.");
    expect(md).not.toContain("This section is not written yet.");
    expect(md.indexOf("JOURNEY-TEXT")).toBeLessThan(md.indexOf("FR-TEXT"));
});

test("fr_010_the_whole_set_has_every_document_in_order", () => {
    const md = buildExport(set, bodies, null);
    const at = ["Root text.", "JOURNEY-TEXT", "This section is not written yet.", "FR-TEXT"].map((t) => md.indexOf(t));
    expect(at.every((i) => i > 0)).toBe(true);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
});

test("tr_007_the_export_never_says_approved", () => {
    const finals = docs.map((d) => ({ ...d, status: "final" }));
    expect(buildExport({ ...set, documents: finals }, new Map(), null).toLowerCase()).not.toContain("approved");
});

test("tr_010_a_blocking_defect_does_not_stop_the_export", () => {
    expect(buildExport(set, bodies, new Set(["08-functional-requirements.md"]))).toContain("FR-TEXT");
});

test("an_unreadable_document_says_why", () => {
    const md = buildExport(set, new Map(), new Set(["05-user-journeys.md"]));
    expect(md).toContain("This section cannot be read.");
});

test("fr_019_grades_are_left_out_by_default", () => {
    const md = buildExport(set, bodies, null);
    const contents = md.slice(md.indexOf("## Contents"));
    expect(contents).toContain("| Section | Status |");
    expect(contents).not.toContain("Score");
    expect(contents).not.toContain("Blocking");
});

test("fr_019_grades_show_when_the_author_includes_them", () => {
    const contents = buildExport(set, bodies, null, { grades: true }).slice(0);
    expect(contents).toContain("| Section | Status | Score | Blocking defects |");
});
