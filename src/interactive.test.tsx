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
