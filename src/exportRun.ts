import DOMPurify from "dompurify";
import { exportDocx } from "./exportDocx";
import { fontFaceCss, loadFonts, toBase64, type FontData } from "./exportFonts";
import { renderThemedHtml } from "./exportHtml";
import { buildExport, type ExportOptions } from "./exportModel";
import type { ExportTheme } from "./themes";
import type { PrdSet, Section } from "./types";

export { toBase64 };

/** The bodies of the selected documents that are written. A document that cannot be read is left out, and the export says so. */
export async function collectBodies(set: PrdSet, selected: ReadonlySet<string> | null, read: (file: string) => Promise<Section>): Promise<Map<string, Section>> {
    const files = set.documents.filter((d) => d.status !== "pending" && (!selected || selected.has(d.file))).map((d) => d.file);
    const pairs = await Promise.all(files.map(async (f) => [f, await read(f).catch(() => undefined)] as const));
    return new Map(pairs.filter((p): p is readonly [string, Section] => !!p[1]));
}

let fonts: Promise<FontData> | undefined;
// ponytail: the fonts load once per window, about 1.6 MB. A failed load is tried again next time.
const appFonts = () => (fonts ??= loadFonts().catch((e) => { fonts = undefined; throw e; }));

const clean = (s: string) => s.replace(/[^\w.-]+/g, "-");

/** The default file name, for example PRD-Forge-Viewer-PRD-0.6.1.pdf. */
export function exportFileName(set: PrdSet, format: "pdf" | "docx"): string {
    return `${clean(set.product)}-PRD-${clean(set.version)}.${format}`;
}

const IMAGE = /!\[([^\]]*)\]\(([^)\s]+)\)/g;

/**
 * The picture of each local image, as a data URL by image path. `image` returns the PNG of an SVG, as
 * the PRD Forge exporter embeds, or the SVG when its PNG is older. The data stays out of the markdown,
 * which stays small to parse. An image that cannot be read is not in the map, and exports as its alt text.
 */
export async function loadImages(md: string, asset: (rel: string) => Promise<string>): Promise<Map<string, string>> {
    const local = [...new Set([...md.matchAll(IMAGE)].map((m) => m[2] ?? "").filter((p) => p && !/^[a-z][a-z0-9+.-]*:/i.test(p)))];
    const pairs = await Promise.all(local.map(async (p) => [p, await asset(p.replace(/^\.\//, "")).catch(() => null)] as const));
    return new Map(pairs.filter((x): x is readonly [string, string] => !!x[1]));
}

export type Deps = {
    read: (file: string) => Promise<Section>;
    asset: (rel: string) => Promise<string>;
    save: (format: "pdf" | "docx", name: string) => Promise<string | null>;
    writeDocx: (path: string, base64: string) => Promise<void>;
    writePdf: (path: string, html: string) => Promise<void>;
    print: () => Promise<void>;
};

async function themedExport(set: PrdSet, selected: ReadonlySet<string>, options: ExportOptions, deps: Pick<Deps, "read" | "asset">) {
    const bodies = await collectBodies(set, selected, deps.read);
    // The images first, so a sketch stays in the export when its drawing cannot be read.
    const images = await loadImages([...bodies.values()].map((b) => b.body).join("\n"), deps.asset);
    const markdown = buildExport(set, bodies, selected, { ...options, hasDrawing: (p) => images.has(p) });
    return { markdown, images, title: `${set.product} PRD`, fonts: await appFonts() };
}

/** Export to PDF or Word, saved where the author picks (FR-010, FR-011, FR-012). Returns false when the author cancels. */
export async function runExport(format: "pdf" | "docx", set: PrdSet, theme: ExportTheme, selected: ReadonlySet<string>, deps: Deps, options: ExportOptions = {}): Promise<boolean> {
    const path = await deps.save(format, exportFileName(set, format));
    if (!path) return false;
    const { markdown, images, title, fonts } = await themedExport(set, selected, options, deps);
    if (format === "pdf") await deps.writePdf(path, renderThemedHtml(markdown, theme, title, fontFaceCss(fonts), images));
    else await deps.writeDocx(path, toBase64(new Uint8Array(await (await exportDocx(markdown, theme, title, fonts, images)).arrayBuffer())));
    return true;
}

/** The themed CSS for print only: the window shows nothing else on paper. @font-face and @page cannot be inside @media. */
export function printCss(html: string): string {
    const css = /<style>([\s\S]*?)<\/style>/.exec(html)?.[1] ?? "";
    const outside = css.match(/@font-face[^}]*\}|@page[^}]*\}/g) ?? [];
    const rest = outside.reduce((s, r) => s.replace(r, ""), css);
    return `${outside.join("\n")}\n@media print {\n  body > :not(#print-root) { display: none !important; }\n  #print-root { display: block !important; }\n${rest}\n}\n#print-root { display: none; }`;
}

/** Print the same themed document as the PDF export (FR-013). */
export async function runPrint(set: PrdSet, theme: ExportTheme, selected: ReadonlySet<string>, deps: Pick<Deps, "read" | "asset" | "print">, options: ExportOptions = {}): Promise<void> {
    const { markdown, images, title, fonts } = await themedExport(set, selected, options, deps);
    const html = renderThemedHtml(markdown, theme, title, fontFaceCss(fonts), images);
    // The last print stays in the page, hidden on screen: the print dialog can read the page after print() returns.
    document.getElementById("print-style")?.remove();
    document.getElementById("print-root")?.remove();
    const style = document.createElement("style");
    style.id = "print-style";
    style.textContent = printCss(html);
    const root = document.createElement("div");
    root.id = "print-root";
    root.innerHTML = DOMPurify.sanitize(/<body>([\s\S]*)<\/body>/.exec(html)?.[1] ?? "");
    document.head.append(style);
    document.body.append(root);
    // Remove the print copy after printing, so a later print of the window does not print it.
    window.addEventListener("afterprint", () => { style.remove(); root.remove(); }, { once: true });
    await deps.print();
}
