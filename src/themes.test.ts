import { expect, test } from "bun:test";
import { CLAY, ICE_SNOWSTORM, findTheme, sanitizeCustomThemes } from "./themes";

test("clay_has_the_fr_015_values", () => {
    expect([CLAY.page, CLAY.text, CLAY.heading, CLAY.accent]).toEqual(["#FAF9F5", "#3D3D3A", "#141413", "#D97757"]);
    expect([CLAY.headingFont, CLAY.font]).toEqual(["serif", "sans"]);
});

test("ice_snowstorm_has_the_fr_015_values", () => {
    const t = ICE_SNOWSTORM;
    expect([t.page, t.text, t.heading, t.accent]).toEqual(["#F3F6FB", "#111111", "#0B1F4B", "#1D4E89"]);
    expect([t.headingFont, t.font]).toEqual(["sans", "sans"]);
});

test("a_custom_theme_with_a_builtin_id_is_dropped", () => {
    expect(sanitizeCustomThemes([{ id: "clay", name: "Fake clay", page: "#000000" }])).toEqual([]);
    expect(findTheme("clay", []).page).toBe("#FAF9F5");
});

test("a_bad_color_or_font_gets_the_fallback", () => {
    const [t] = sanitizeCustomThemes([{ id: "acme", name: "Acme", page: "not a color", font: "comic", accent: "#abc" }]);
    expect(t!.page).toBe(CLAY.page);
    expect(t!.font).toBe(CLAY.font);
    expect(t!.accent).toBe("#AABBCC");
});
