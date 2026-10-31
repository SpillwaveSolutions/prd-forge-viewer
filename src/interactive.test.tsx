// Interactive tests: React renders into a JSDOM document, and the tests send real DOM events.
import { expect, test } from "bun:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><body></body>", { pretendToBeVisual: true });
const g = globalThis as Record<string, unknown>;
for (const k of ["window", "document", "navigator", "HTMLElement", "HTMLDialogElement", "HTMLImageElement", "Node", "Event", "KeyboardEvent", "WheelEvent", "MouseEvent", "getComputedStyle"])
    g[k] = (dom.window as unknown as Record<string, unknown>)[k];
g.IS_REACT_ACT_ENVIRONMENT = true;
// JSDOM has no modal dialogs. Opening one sets the open attribute, as a browser does.
dom.window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };

const { act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { DiagramViewer } = await import("./DiagramViewer");
const { SectionPage } = await import("./SectionPage");
const { renderBody } = await import("./renderBody");
const { SearchPanel } = await import("./SearchPanel");
const { SearchDrawer } = await import("./SearchDrawer");

const mount = async (el: React.ReactElement) => {
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    await act(async () => root.render(el));
    return { host, unmount: () => act(async () => root.unmount()) };
};
const scale = (img: Element) => Number(/scale\(([\d.]+)\)/.exec((img as HTMLElement).style.transform)?.[1]);

test("the_diagram_window_fits_zooms_pans_and_closes", async () => {
    let closed = false;
    const { host, unmount } = await mount(<DiagramViewer src="data:image/png;base64,AA" alt="WF-001 drawing" onClose={() => (closed = true)} />);
    const dialog = host.querySelector("dialog")!;
    const img = host.querySelector(".stage img")!;
    expect(dialog.hasAttribute("open")).toBe(true);
    expect(document.activeElement).toBe(host.querySelector(".stage"));

    await act(async () => { img.dispatchEvent(new Event("load")); });
    const fitted = scale(img);
    expect(fitted).toBeGreaterThan(0);

    await act(async () => { (host.querySelector("[aria-label='Zoom in']") as HTMLElement).click(); });
    expect(scale(img)).toBeCloseTo(fitted * 1.25);

    const key = (k: string) => act(async () => { host.querySelector(".stage")!.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true })); });
    const x = () => (img as HTMLElement).style.transform;
    const before = x();
    await key("ArrowRight");
    expect(x()).not.toBe(before);
    await key("0");
    expect(scale(img)).toBeCloseTo(fitted);
    await key("-");
    expect(scale(img)).toBeCloseTo(Math.max(0.25, fitted / 1.25));

    await act(async () => { host.querySelector(".stage")!.dispatchEvent(new WheelEvent("wheel", { deltaY: -100, bubbles: true })); });
    expect(scale(img)).toBeGreaterThan(Math.max(0.25, fitted / 1.25));

    await act(async () => { dialog.dispatchEvent(new Event("cancel", { cancelable: true })); });
    expect(closed).toBe(true);
    await unmount();
});

test("a_sketch_shows_when_its_drawing_does_not_load", async () => {
    const body = "# Wireframes\n\n```wireframe\n┌ sketch ┐\n```\n\n![WF-001 drawing](diagrams/WF-001.svg)\n";
    const section = { file: "08-wireframes.md", title: "Wireframes", status: "final", section: 8, score: 90, blocking: 0, graded: null, body, items: [] };
    const { host, unmount } = await mount(
        <SectionPage section={section} known={new Set()} selected={null} onSelect={() => {}} onOpenItem={() => {}} onBack={() => {}}
            renderHtml={(md) => renderBody(md, dom.window as unknown as Window & typeof globalThis)} loadAsset={() => Promise.reject(new Error("gone"))} />,
    );
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
    const sketch = host.querySelector("[data-sketch]")!;
    expect(sketch.hasAttribute("hidden")).toBe(false);
    expect(host.textContent).toContain("[image not found: WF-001 drawing]");
    await unmount();
});

test("search_uses_every_selected_category_and_all_clears_them", async () => {
    const calls: string[][] = [];
    const cats = [{ kind: "functional-requirements", title: "Functional requirements" }, { kind: "scenarios", title: "Scenarios" }, { kind: "glossary", title: "Glossary" }];
    const { host, unmount } = await mount(<SearchPanel categories={cats} onSearch={async (_t, c) => { calls.push(c); return []; }} onOpenHit={() => {}} />);
    const box = (v: string) => host.querySelector(`input[type=checkbox][value="${v}"]`) as HTMLInputElement;
    const input = host.querySelector("input[type=search]") as HTMLInputElement;
    await act(async () => {
        Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value")!.set!.call(input, "export");
        input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    const submit = () => act(async () => { host.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); });

    await act(async () => { box("functional-requirements").click(); });
    await act(async () => { box("scenarios").click(); });
    expect(box("all").checked).toBe(false);
    await submit();
    expect(calls.at(-1)).toEqual(["functional-requirements", "scenarios"]);

    await act(async () => { box("all").click(); });
    expect(box("functional-requirements").checked).toBe(false);
    await submit();
    expect(calls.at(-1)).toEqual([]);
    await unmount();
});

test("the_search_drawer_opens_with_focus_pins_and_closes_with_escape_only_when_unpinned", async () => {
    let closed = 0, pinned: boolean | undefined;
    const drawer = (open: boolean, pin: boolean) => (
        <SearchDrawer open={open} pinned={pin} onClose={() => closed++} onPin={(p) => (pinned = p)}>
            <input type="search" />
        </SearchDrawer>
    );
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    await act(async () => root.render(drawer(false, false)));
    const aside = host.querySelector("aside")!;
    expect(aside.hasAttribute("inert")).toBe(true);
    expect(aside.classList.contains("open")).toBe(false);

    await act(async () => root.render(drawer(true, false)));
    expect(aside.hasAttribute("inert")).toBe(false);
    expect(document.activeElement).toBe(host.querySelector("input[type=search]"));
    const esc = () => act(async () => { window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })); });
    await esc();
    expect(closed).toBe(1);

    await act(async () => { (host.querySelector("[aria-pressed]") as HTMLElement).click(); });
    expect(pinned).toBe(true);
    await act(async () => root.render(drawer(true, true)));
    await esc();
    expect(closed).toBe(1);
    await act(async () => { (host.querySelector("[aria-label='Close search']") as HTMLElement).click(); });
    expect(closed).toBe(2);
    await act(async () => root.unmount());
});

test("fr_025_findings_show_the_grade_note_or_say_that_none_are_recorded", async () => {
    const section = { file: "06-scenarios.md", title: "Scenarios", status: "review", section: 6, score: 72, blocking: 0, graded: "2026-10-27", body: "# Scenarios", items: [] };
    const page = (load: () => Promise<string | null>) => (
        <SectionPage section={section} known={new Set()} selected={null} onSelect={() => {}} onOpenItem={() => {}} onBack={() => {}}
            renderHtml={(md) => renderBody(md, dom.window as unknown as Window & typeof globalThis)} loadFindings={load} />
    );
    const open = async (host: HTMLElement) => {
        const btn = [...host.querySelectorAll("button")].find((b) => b.textContent === "Findings")!;
        expect(btn.getAttribute("aria-expanded")).toBe("false");
        await act(async () => { btn.click(); await new Promise((r) => setTimeout(r, 0)); });
        expect(btn.getAttribute("aria-expanded")).toBe("true");
        return host.querySelector("[aria-label='Findings']")?.textContent ?? "";
    };
    const a = await mount(page(async () => "# Why scenarios scored 72\n\n## Blocking defects\n\nNone.\n\n## How to raise the grade\n\n- Add the section lifecycle\n"));
    const text = await open(a.host);
    expect(text).toContain("Blocking defects");
    expect(text).toContain("Add the section lifecycle");
    await a.unmount();
    const b = await mount(page(async () => null));
    expect(await open(b.host)).toContain("No findings are recorded for this section.");
    await b.unmount();
});
