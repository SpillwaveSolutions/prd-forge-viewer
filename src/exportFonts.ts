import type { ThemeFont } from "./themes";

/** The open-license fonts in public/fonts, which every export embeds (FR-016, criterion 2). */
export const FAMILY: Record<ThemeFont, string> = { serif: "Source Serif 4", sans: "Source Sans 3", mono: "Source Code Pro" };

/** The regular face first, then the semibold face for headings. */
export const FONT_FILES: Record<ThemeFont, string[]> = {
    serif: ["SourceSerif4-Regular.ttf", "SourceSerif4-Semibold.ttf"],
    sans: ["SourceSans3-Regular.ttf", "SourceSans3-Semibold.ttf"],
    mono: ["SourceCodePro-Regular.ttf"],
};

export type FontData = Record<string, Uint8Array>;

const fromApp = async (file: string) => {
    const res = await fetch(`./fonts/${file}`);
    if (!res.ok) throw new Error(`The font ${file} is missing from the app (${res.status}).`);
    return new Uint8Array(await res.arrayBuffer());
};

/** Read every font file once. The window reads them from the app; the tests read them from disk. */
export async function loadFonts(read: (file: string) => Promise<Uint8Array> = fromApp): Promise<FontData> {
    const files = Object.values(FONT_FILES).flat();
    return Object.fromEntries(await Promise.all(files.map(async (f) => [f, await read(f)] as const)));
}

export function toBase64(bytes: Uint8Array): string {
    let s = "";
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(s);
}

/** @font-face rules with the font data in the CSS, so the HTML for the PDF needs no other file. */
export function fontFaceCss(fonts: FontData): string {
    return (Object.keys(FONT_FILES) as ThemeFont[])
        .flatMap((k) => FONT_FILES[k].filter((f) => fonts[f]).map((f, i) =>
            `@font-face { font-family: '${FAMILY[k]}'; font-weight: ${i === 0 ? 400 : 600}; src: url(data:font/ttf;base64,${toBase64(fonts[f]!)}) format("truetype"); }`))
        .join("\n");
}
