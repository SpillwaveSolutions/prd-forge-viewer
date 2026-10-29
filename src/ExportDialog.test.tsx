import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ExportDialog } from "./ExportDialog";
import { doc, sampleSet } from "./fixtures";
import { CLAY, type ExportTheme } from "./themes";

const acme: ExportTheme = { ...CLAY, id: "acme", name: "Acme", builtin: false };
const set = sampleSet([
    doc({ file: "prd.md", title: "Root", order: 0, status: "final" }),
    doc({ file: "08.md", title: "Functional requirements", order: 8, status: "review" }),
    doc({ file: "05.md", title: "User journeys", order: 5, status: "final" }),
]);
const html = (s = set) => renderToStaticMarkup(<ExportDialog set={s} themes={[acme]} themeId="acme" onEditThemes={() => {}} onClose={() => {}} onExport={async () => true} onPrint={async () => {}} />);

test("wf_007_has_format_theme_sections_and_the_buttons", () => {
    const h = html();
    for (const t of ["PDF", "Word", "Ice Snowstorm", "Clay", "Acme", "Edit themes", ">Print<", ">Export<"]) expect(h).toContain(t);
    expect(h).toMatch(/<option[^>]*selected[^>]*>Acme</);
});

test("the_sections_are_listed_in_reading_order_and_all_selected", () => {
    const h = html();
    expect(h.indexOf("User journeys")).toBeLessThan(h.indexOf("Functional requirements"));
    expect(h.match(/type="checkbox"[^>]*checked/g)?.length).toBe(3);
});

test("the_reason_for_draft_shows", () => {
    expect(html()).toContain("Draft: 1 of 3 documents are not final.");
    const finals = sampleSet(set.documents.map((d) => ({ ...d, status: "final" })));
    expect(html(finals)).not.toContain("Draft:");
});
