import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { GradesTable } from "./GradesTable";
import { doc } from "./fixtures";

const s3 = doc({ file: "03.md", title: "Objectives", section: 3, order: 30, status: "review", grade: { score: 75, blocking: 1, graded: "2026-10-27" } });
const s4 = doc({ file: "04.md", title: "Personas", section: 4, order: 40, status: "draft", grade: { score: 61, blocking: 0, graded: "2026-10-26" } });

test("shows_both_grades", () => {
    const html = renderToStaticMarkup(<GradesTable documents={[s3, s4]} />);
    for (const v of ["61", "75", "2026-10-26", "2026-10-27"]) expect(html).toContain(v);
    expect(html.indexOf("Objectives")).toBeLessThan(html.indexOf("Personas"));
});

test("ungraded_section", () => {
    const html = renderToStaticMarkup(<GradesTable documents={[doc({ title: "Glossary", section: 14 })]} />);
    expect(html).toContain("Not graded");
});

test("score_without_date", () => {
    const html = renderToStaticMarkup(<GradesTable documents={[doc({ section: 2, grade: { score: 70, blocking: 0, graded: null } })]} />);
    expect(html).toContain("70");
    expect(html).toContain("no date");
    expect(html).not.toContain("Not graded");
});

test("unreadable_section_is_a_row", () => {
    const html = renderToStaticMarkup(<GradesTable documents={[doc({ title: "Users and personas", section: 4, status: "unreadable", unreadable: "no front matter" })]} />);
    expect(html).toContain("4. Users and personas");
    expect(html).toContain("unreadable");
});

test("no_fix_marks", () => {
    const html = renderToStaticMarkup(<GradesTable documents={[s3, s4]} />);
    expect(html).not.toContain("to fix");
});

test("root_is_not_a_section_row", () => {
    const html = renderToStaticMarkup(<GradesTable documents={[doc({ title: "The root", section: null }), s3]} />);
    expect(html).not.toContain("The root");
});
