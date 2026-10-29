import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MAX_CUSTOM, ThemeDialog, copyTheme, themeProblems, withoutTheme } from "./ThemeDialog";
import { CLAY, ICE_SNOWSTORM, type ExportTheme } from "./themes";

const acme: ExportTheme = { ...CLAY, id: "acme", name: "Acme", builtin: false };
const html = (themes: ExportTheme[], themeId: string) => renderToStaticMarkup(<ThemeDialog themes={themes} themeId={themeId} onClose={() => {}} onSave={() => {}} />);

test("a_builtin_theme_shows_with_its_fields_disabled_and_no_delete", () => {
    const h = html([], "clay");
    expect(h).toMatch(/aria-label="Theme name"[^>]*disabled/);
    expect(h).toMatch(/aria-label="Accent hex"[^>]*disabled/);
    expect(h).toMatch(/<button[^>]*disabled[^>]*>Delete<\/button>/);
    expect(h).toContain("#D97757");
});

test("a_custom_theme_can_be_changed_and_deleted", () => {
    const h = html([acme], "acme");
    expect(h).not.toMatch(/aria-label="Theme name"[^>]*disabled/);
    expect(h).not.toMatch(/<button[^>]*disabled[^>]*>Delete<\/button>/);
});

test("the_form_has_four_colors_and_two_fonts", () => {
    const h = html([acme], "acme");
    for (const l of ["Page hex", "Text hex", "Headings hex", "Accent hex", "Text font", "Heading font"]) expect(h).toContain(`aria-label="${l}"`);
});

test("a_new_theme_copies_the_current_one_with_a_free_id", () => {
    const t = copyTheme(CLAY, [CLAY, ICE_SNOWSTORM, acme]);
    expect(t).toMatchObject({ name: "Copy of Clay", builtin: false, accent: CLAY.accent });
    expect(["clay", "ice-snowstorm", "acme"]).not.toContain(t.id);
});

test("a_delete_removes_only_that_custom_theme", () => {
    expect(withoutTheme([acme], "acme")).toEqual([]);
    expect(withoutTheme([acme], "clay")).toEqual([acme]);
});

test("a_blank_name_or_a_bad_hex_is_a_problem", () => {
    expect(themeProblems([acme])).toEqual([]);
    expect(themeProblems([{ ...acme, name: "  " }])[0]).toContain("name");
    expect(themeProblems([{ ...acme, accent: "#00880" }])[0]).toContain("Accent");
});

test("save_is_disabled_and_the_problem_shows_when_a_theme_is_not_valid", () => {
    const h = html([{ ...acme, accent: "#00880" }], "acme");
    expect(h).toMatch(/<button[^>]*disabled[^>]*>Save themes<\/button>/);
    expect(h).toContain('role="alert"');
});

test("new_theme_is_disabled_at_the_limit", () => {
    const many = Array.from({ length: MAX_CUSTOM }, (_, i) => ({ ...acme, id: `t${i}`, name: `T${i}` }));
    expect(html(many, "t0")).toMatch(/<button[^>]*disabled[^>]*>New theme<\/button>/);
});

test("the_dialog_is_a_native_modal_dialog", () => {
    expect(html([], "clay")).toMatch(/^<dialog/);
});
