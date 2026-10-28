import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { SectionPage } from "./SectionPage";
import { SetOverview } from "./SetOverview";
import { doc, sampleSet } from "./fixtures";
import type { Item, Section } from "./types";

const persona = (n: number): Item => ({ id: `PER-00${n}`, title: `Persona ${n}`, parent: null, fields: [{ name: "problems", text: "P-001, XX-999" }] });
const personas: Section = {
    file: "04-personas.md", title: "Users and personas", status: "final", section: 4, score: 86, blocking: 0, graded: "2026-10-27",
    body: "# Users and personas", items: [1, 2, 3, 4, 5].map(persona),
};
const known = new Set(["PER-001", "P-001"]);
const page = (over: Partial<Parameters<typeof SectionPage>[0]> = {}) =>
    renderToStaticMarkup(<SectionPage section={personas} known={known} selected={null} onSelect={() => {}} onOpenItem={() => {}} onBack={() => {}} renderHtml={(md) => md} {...over} />);

test("readable_documents_are_buttons", () => {
    const html = renderToStaticMarkup(<SetOverview set={sampleSet([doc({ file: "08.md", title: "Functional requirements" })])} onOpen={() => {}} />);
    expect(html).toMatch(/<button[^>]*>Functional requirements/);
});

test("section_lists_the_five_persona_ids", () => {
    const html = page();
    for (let n = 1; n <= 5; n++) expect(html).toContain(`PER-00${n}`);
});

test("selected_item_shows_its_section_status_and_grade", () => {
    const html = page({ selected: "PER-001" });
    expect(html).toContain("Persona 1");
    expect(html).toMatch(/final.*86, 0 blocking, 2026-10-27/s);
});

test("known_id_is_a_link_and_unknown_id_is_text", () => {
    const html = page({ selected: "PER-001" });
    expect(html).toMatch(/<button[^>]*>P-001<\/button>/);
    expect(html).not.toMatch(/<button[^>]*>XX-999<\/button>/);
    expect(html).toContain("XX-999");
});

test("nested_item_shows_its_parent", () => {
    const st: Item = { id: "ST-002", title: "Check the grades", parent: "J-001", fields: [] };
    const html = page({ section: { ...personas, items: [st] }, selected: "ST-002" });
    expect(html).toContain("in J-001");
});
