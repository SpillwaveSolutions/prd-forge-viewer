/**
 * Copied from Motion (MIT). Themed Word document. Heading and body fonts follow the theme and use
 * the bundled fonts of exportFonts.ts, which the document embeds (FR-016, criterion 2).
 */
import {
    BorderStyle,
    Document,
    AlignmentType,
    Footer,
    HeadingLevel,
    ImageRun,
    Packer,
    PageNumber,
    Paragraph,
    ShadingType,
    Table,
    TableCell,
    TableRow,
    TabStopType,
    TextRun,
    WidthType,
    type FileChild,
} from "docx";
import { markdownToBlocks, type ExportBlock, type InlineRun } from "./exportBlocks";
import { FAMILY, FONT_FILES, type FontData } from "./exportFonts";
import { hexBare, type ExportTheme, type ThemeFont } from "./themes";

const FONT: Record<ThemeFont, string> = FAMILY;

/** The fonts that the theme uses, with their regular and semibold faces, for embedding. */
function embedded(theme: ExportTheme, fonts: FontData) {
    const used = [...new Set<ThemeFont>([theme.font, theme.headingFont, "mono"])];
    return used.flatMap((k) => {
        const [regular, bold] = FONT_FILES[k].map((f) => fonts[f]);
        return regular ? [{ name: FAMILY[k], data: regular as Buffer, ...(bold ? { bold: bold as Buffer } : {}) }] : [];
    });
}

const HEADING: Record<1 | 2 | 3 | 4 | 5 | 6, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
    4: HeadingLevel.HEADING_4,
    5: HeadingLevel.HEADING_5,
    6: HeadingLevel.HEADING_6,
};

// Letter paper with the margins of the PDF export, in twips (1/1440 inch).
const PAGE = { width: 12240, height: 15840 };
const MARGIN = { top: 1134, bottom: 1247, left: 1361, right: 1361 };

/** `footer` makes the document a whole export, as in exportHtml.ts: a cover page, a footer with page numbers, and a new page for each section. */
export async function exportDocx(markdown: string, theme: ExportTheme, title: string, fonts: FontData = {}, images: ReadonlyMap<string, string> = new Map(), footer?: string): Promise<Blob> {
    const blocks = markdownToBlocks(markdown);
    const cover = footer !== undefined && blocks[0]?.type === "heading" && blocks[0].level === 1 && blocks.some((b) => b.type === "heading" && b.level === 2);
    const children = blocksToChildren(blocks, theme, images, cover);
    if (children.length === 0) {
        children.push(paragraph(title || "Untitled", theme, { heading: true, size: 36 }));
    }
    const doc = new Document({
        title,
        fonts: embedded(theme, fonts),
        background: { color: hexBare(theme.page) },
        styles: {
            default: {
                document: {
                    run: { font: FONT[theme.font], size: 22, color: hexBare(theme.text) },
                },
            },
        },
        sections: [
            {
                properties: { titlePage: true, page: { size: PAGE, margin: { ...MARGIN, footer: 567 } } },
                footers: footer === undefined ? undefined : { default: pageFooter(footer, theme), first: new Footer({ children: [] }) },
                children,
            },
        ],
    });
    return Packer.toBlob(doc);
}

function pageFooter(text: string, theme: ExportTheme): Footer {
    const run = { font: FONT[theme.font], size: 16, color: hexBare(theme.muted) };
    return new Footer({
        children: [
            new Paragraph({
                border: { top: { style: BorderStyle.SINGLE, size: 4, color: hexBare(theme.tableBorder), space: 6 } },
                tabStops: [{ type: TabStopType.RIGHT, position: PAGE.width - MARGIN.left - MARGIN.right }],
                children: [new TextRun({ ...run, text: text }), new TextRun({ ...run, children: ["\tPage ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES] })],
            }),
        ],
    });
}

/** Width and height in pixels, from the IHDR chunk of a PNG file. */
export function pngSize(png: Uint8Array): { width: number; height: number } {
    const v = new DataView(png.buffer, png.byteOffset, png.byteLength);
    return { width: v.getUint32(16), height: v.getUint32(20) };
}

/** Scale down only, to fit 6.0 by 8.0 inches at 96 pixels an inch, as the PRD Forge exporter does. */
export function fitImage(size: { width: number; height: number }): { width: number; height: number } {
    const scale = Math.min(1, 576 / size.width, 768 / size.height);
    return { width: Math.round(size.width * scale), height: Math.round(size.height * scale) };
}

/** Width and height from the viewBox of an SVG, or from its width and height. */
export function svgSize(svg: string): { width: number; height: number } {
    const box = /viewBox="[\d.-]+[ ,]+[\d.-]+[ ,]+([\d.]+)[ ,]+([\d.]+)"/.exec(svg);
    if (box) return { width: Number(box[1]), height: Number(box[2]) };
    const w = /\swidth="([\d.]+)/.exec(svg), h = /\sheight="([\d.]+)/.exec(svg);
    return { width: Number(w?.[1] ?? 576), height: Number(h?.[1] ?? 432) };
}

// Word 2016 and later draw the SVG. An older Word shows this 1 by 1 PNG in its place.
const BLANK_PNG = Uint8Array.from(atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="), (c) => c.charCodeAt(0));

function image(block: ExportBlock & { type: "image" }, theme: ExportTheme, src = "", keepNext = false): FileChild[] {
    const m = /^data:image\/(png|svg\+xml);base64,(.+)$/.exec(src);
    if (!m?.[2]) return [paragraph(block.alt, theme, { italic: true, color: theme.muted })];
    const data = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
    const altText = { name: block.alt, title: block.alt, description: block.alt };
    const run = m[1] === "png"
        ? new ImageRun({ type: "png", data, transformation: fitImage(pngSize(data)), altText })
        : new ImageRun({ type: "svg", data, fallback: { type: "png", data: BLANK_PNG }, transformation: fitImage(svgSize(new TextDecoder().decode(data))), altText });
    return [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            keepNext: true,
            children: [run],
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: AFTER },
            keepNext,
            children: [new TextRun({ text: block.alt, size: 16, font: FONT[theme.font], color: hexBare(theme.muted) })],
        }),
    ];
}

// Paragraph spacing in twips (1/20 pt). Word adds none by default, so headings
// touch the text and two tables merge into one.
const AFTER = 160;
const HEADING_SPACING: Record<1 | 2 | 3 | 4 | 5 | 6, { before: number; after: number }> = {
    1: { before: 240, after: 200 },
    2: { before: 360, after: 120 },
    3: { before: 280, after: 80 },
    4: { before: 240, after: 80 },
    5: { before: 240, after: 80 },
    6: { before: 240, after: 80 },
};

function blocksToChildren(blocks: ExportBlock[], theme: ExportTheme, images: ReadonlyMap<string, string>, cover = false): FileChild[] {
    const children: FileChild[] = [];
    let h1 = 0, h2 = 0;
    for (const [i, block] of blocks.entries()) {
        // A paragraph that leads into a table stays on the page of the table.
        const intoTable = blocks[i + 1]?.type === "table" || (blocks[i + 1]?.type === "paragraph" && blocks[i + 2]?.type === "table");
        if (block.type === "heading") {
            const coverTitle = cover && block.level === 1 && h1 === 0;
            // Each section starts a new page, and so does the first page after the cover.
            const newPage = (block.level === 1 && h1 > 0) || (cover && block.level === 2 && h2 === 0);
            if (block.level === 1) h1++;
            if (block.level === 2) h2++;
            children.push(
                new Paragraph({
                    heading: HEADING[block.level],
                    spacing: coverTitle ? { before: 3600, after: 360 } : HEADING_SPACING[block.level],
                    keepNext: true,
                    pageBreakBefore: newPage,
                    border:
                        block.level === 1
                            ? { bottom: { style: BorderStyle.SINGLE, size: 12, color: hexBare(theme.accent), space: 4 } }
                            : undefined,
                    children: [
                        new TextRun({
                            text: block.text,
                            bold: true,
                            font: FONT[theme.headingFont],
                            color: hexBare(theme.heading),
                            size: coverTitle ? 68 : block.level === 1 ? 44 : block.level === 2 ? 30 : 24,
                        }),
                    ],
                }),
            );
            continue;
        }
        if (block.type === "paragraph") {
            children.push(new Paragraph({ spacing: { after: AFTER }, keepNext: blocks[i + 1]?.type === "table", children: runs(block.runs, theme) }));
            continue;
        }
        if (block.type === "list") {
            block.items.forEach((item, index) => {
                const marker = block.ordered ? `${index + 1}. ` : "• ";
                children.push(
                    new Paragraph({
                        spacing: { after: index === block.items.length - 1 ? AFTER : 60 },
                        children: [new TextRun({ text: marker, font: FONT[theme.font], color: hexBare(theme.text) }), ...runs(item, theme)],
                    }),
                );
            });
            continue;
        }
        if (block.type === "quote") {
            children.push(
                paragraph(block.text, theme, { italic: true, color: theme.muted, indent: 360 }),
            );
            continue;
        }
        if (block.type === "code") {
            children.push(
                new Paragraph({
                    spacing: { after: AFTER },
                    shading: { type: ShadingType.CLEAR, fill: hexBare(theme.codeBg) },
                    children: [
                        new TextRun({
                            text: block.text,
                            font: FONT.mono,
                            color: hexBare(theme.codeText),
                            size: 18,
                        }),
                    ],
                }),
            );
            continue;
        }
        if (block.type === "image") {
            children.push(...image(block, theme, images.get(block.src), intoTable));
            continue;
        }
        if (block.type === "hr") {
            children.push(
                new Paragraph({
                    spacing: { after: AFTER },
                    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: hexBare(theme.accent), space: 1 } },
                    children: [new TextRun("")],
                }),
            );
            continue;
        }
        children.push(table(block.header, block.rows, theme));
        // Word joins two tables that touch. An empty paragraph keeps them apart.
        children.push(new Paragraph({ spacing: { after: 0 }, children: [] }));
    }
    return children;
}

function paragraph(
    text: string,
    theme: ExportTheme,
    opts: { heading?: boolean; size?: number; italic?: boolean; color?: string; indent?: number },
): Paragraph {
    return new Paragraph({
        spacing: { after: AFTER },
        indent: opts.indent ? { left: opts.indent } : undefined,
        children: [
            new TextRun({
                text,
                italics: opts.italic,
                bold: opts.heading,
                size: opts.size,
                font: FONT[opts.heading ? theme.headingFont : theme.font],
                color: hexBare(opts.color ?? theme.text),
            }),
        ],
    });
}

function runs(items: InlineRun[], theme: ExportTheme): TextRun[] {
    const out: TextRun[] = [];
    for (const run of items) {
        // A newline left in a run is a hard break. Word draws that from w:br;
        // a newline character inside w:t does not start a new line.
        const lines = run.text.split("\n");
        lines.forEach((line, index) => {
            if (index > 0) out.push(new TextRun({ break: 1 }));
            if (line) out.push(styledRun(line, run, theme));
        });
    }
    return out;
}

function styledRun(text: string, run: InlineRun, theme: ExportTheme): TextRun {
    return new TextRun({
        text,
        bold: run.bold,
        italics: run.italic,
        font: run.code ? FONT.mono : FONT[theme.font],
        color: hexBare(run.href ? theme.accent : run.code ? theme.codeText : theme.text),
        size: run.code ? 20 : 22,
    });
}

function table(header: string[], rows: string[][], theme: ExportTheme): Table {
    const cell = (text: string, fill: string, color: string, headerCell: boolean) =>
        new TableCell({
            shading: { type: ShadingType.CLEAR, fill: hexBare(fill) },
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text,
                            bold: headerCell,
                            font: FONT[theme.font],
                            color: hexBare(color),
                        }),
                    ],
                }),
            ],
        });
    const line = { style: BorderStyle.SINGLE, size: 4, color: hexBare(theme.tableBorder) };
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: line, bottom: line, left: line, right: line, insideHorizontal: line, insideVertical: line },
        rows: [
            new TableRow({
                tableHeader: true,
                children: header.map((text) => cell(text, theme.tableHeaderBg, theme.tableHeaderText, true)),
            }),
            ...rows.map(
                (row, index) =>
                    new TableRow({
                        cantSplit: true,
                        children: row.map((text) =>
                            cell(text, index % 2 === 1 ? theme.tableRowAltBg : theme.tableRowBg, theme.text, false),
                        ),
                    }),
            ),
        ],
    });
}
