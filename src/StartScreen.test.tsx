import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { StartScreen } from "./StartScreen";
import type { SetRef } from "./types";

const ref = (folder: string, product: string | null, found = true): SetRef => ({ folder, product, found });
const known = [ref("/a/alpha", "Alpha"), ref("/b/beta", "Beta")];
const noop = () => {};

test("not_found_lists_known", () => {
    const html = renderToStaticMarkup(<StartScreen view={{ kind: "notFound", folder: "/work", known }} onOpen={noop} />);
    for (const t of ["No PRD set in /work", "Known locations", "Alpha", "Beta"]) expect(html).toContain(t);
});

test("missing_location_marked", () => {
    const view = { kind: "notFound" as const, folder: "/work", known: [ref("/gone/set", null, false)] };
    const html = renderToStaticMarkup(<StartScreen view={view} onOpen={noop} />);
    expect(html).toContain("Not found");
    expect(html).not.toMatch(/<button[^>]*>[^<]*\/gone\/set/);
});

test("choose_lists_sets_above_known", () => {
    const view = { kind: "choose" as const, folder: "/repo", sets: [ref("/repo/docs/prd/g", "Gamma")], known };
    const html = renderToStaticMarkup(<StartScreen view={view} onOpen={noop} />);
    expect(html).toContain("More than one PRD set in /repo. Select one.");
    expect(html.indexOf("Gamma")).toBeLessThan(html.indexOf("Alpha"));
});

test("welcome_empty", () => {
    const html = renderToStaticMarkup(<StartScreen view={{ kind: "welcome", known: [] }} onOpen={noop} />);
    expect(html).toContain("No known locations yet");
});
