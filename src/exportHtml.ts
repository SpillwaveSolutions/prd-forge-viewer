/**
 * Copied from Motion (MIT). The fonts are the bundled fonts of exportFonts.ts, and the page names
 * its language for screen readers (NFR-009).
 * Themed HTML used by the export preview. PDF and Word use the same blocks,
 * so the preview is the page those files are built from.
 */
import { markdownToBlocks, type ExportBlock, type InlineRun } from "./exportBlocks";
import { FAMILY } from "./exportFonts";
import type { ExportTheme } from "./themes";

const FONT_STACK: Record<ExportTheme["font"], string> = {
    serif: `'${FAMILY.serif}', Georgia, serif`,
    sans: `'${FAMILY.sans}', Helvetica, Arial, sans-serif`,
    mono: `'${FAMILY.mono}', Menlo, monospace`,
};

/**
 * `footer` makes the page a whole export: the blocks before the first H2 are a cover page, each
 * page after it shows the footer and its page number, and each section starts on a new page.
 */
export function renderThemedHtml(markdown: string, theme: ExportTheme, title: string, fontCss = "", images: ReadonlyMap<string, string> = new Map(), footer?: string): string {
    const blocks = markdownToBlocks(markdown);
    const html = (list: ExportBlock[]) => list.map((block) => renderBlock(block, images)).join("\n");
    const split = blocks.findIndex((b) => b.type === "heading" && b.level === 2);
    const cover = footer !== undefined && blocks[0]?.type === "heading" && blocks[0].level === 1 && split > 0;
    const body = cover ? `<header class="cover">\n${html(blocks.slice(0, split))}\n</header>\n${html(blocks.slice(split))}` : html(blocks);
    const safeTitle = escapeHtml(title);
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${safeTitle}</title>
<style>
${fontCss}
  @page { size: Letter; margin: 20mm 24mm 22mm; background: ${theme.page};${footer === undefined ? "" : `
    @bottom-left { content: ${cssString(footer)}; font: 8pt ${FONT_STACK[theme.font]}; color: ${theme.muted}; vertical-align: top; padding-top: 4mm; border-top: 0.5pt solid ${theme.tableBorder}; }
    @bottom-right { content: "Page " counter(page) " of " counter(pages); font: 8pt ${FONT_STACK[theme.font]}; color: ${theme.muted}; vertical-align: top; padding-top: 4mm; border-top: 0.5pt solid ${theme.tableBorder}; }`} }
  @page :first { @bottom-left { content: none; border: 0; } @bottom-right { content: none; border: 0; } }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; background: ${theme.page}; color: ${theme.text}; }
  body { font-family: ${FONT_STACK[theme.font]}; font-size: 10.5pt; line-height: 1.5; orphans: 3; widows: 3; }
  @media screen { body { padding: 48px 56px; } }
  h1, h2, h3, h4, h5, h6 { font-family: ${FONT_STACK[theme.headingFont]}; color: ${theme.heading}; font-weight: 600; line-height: 1.2; margin: 1.4em 0 0.45em; break-after: avoid; break-inside: avoid; }
  h1 { font-size: 24pt; margin-top: 0; padding-bottom: 0.3em; border-bottom: 2pt solid ${theme.accent}; margin-bottom: 0.8em; }
  h1 { break-before: page; }
  h2 { font-size: 15pt; }
  h3 { font-size: 12pt; }
  h4, h5, h6 { font-size: 10.5pt; }
  p { margin: 0.55em 0; }
  a { color: ${theme.accent}; }
  code { font-family: ${FONT_STACK.mono}; background: ${theme.codeBg}; color: ${theme.codeText}; padding: 0.05em 0.3em; border-radius: 3px; font-size: 0.86em; }
  pre { background: ${theme.codeBg}; color: ${theme.codeText}; padding: 10px 12px; border-radius: 4px; white-space: pre-wrap; break-inside: avoid; }
  pre code { background: transparent; padding: 0; }
  blockquote { margin: 0.8em 0; padding: 0.2em 0 0.2em 1em; border-left: 3px solid ${theme.accent}; color: ${theme.muted}; }
  hr { border: 0; border-top: 1px solid ${theme.tableBorder}; margin: 1.4em 0; }
  ul, ol { margin: 0.4em 0 0.6em 1.3em; padding: 0; }
  li { margin: 0.15em 0; }
  table { border-collapse: collapse; width: 100%; margin: 0.8em 0 1.1em; font-size: 9.5pt; line-height: 1.4; }
  thead { display: table-header-group; }
  tr { break-inside: avoid; }
  th, td { border: 0.75pt solid ${theme.tableBorder}; padding: 5px 7px; text-align: left; vertical-align: top; }
  th { background: ${theme.tableHeaderBg}; color: ${theme.tableHeaderText}; font-weight: 600; }
  td { background: ${theme.tableRowBg}; }
  tbody tr:nth-child(even) td { background: ${theme.tableRowAltBg}; }
  p:has(+ table), p:has(+ ul), p:has(+ ol) { break-after: avoid; }
  .muted { color: ${theme.muted}; }
  figure.diagram { margin: 0.9em 0 1.2em; padding: 10px 12px 8px; text-align: center; break-inside: avoid; background: ${theme.tableRowBg}; border: 0.75pt solid ${theme.tableBorder}; border-radius: 4px; }
  figure.diagram:has(+ table), figure.diagram:has(+ p + table) { break-after: avoid; }
  figure.diagram img { display: block; margin: 0 auto; max-width: 100%; max-height: 180mm; }
  figure.diagram figcaption { font-size: 8.5pt; color: ${theme.muted}; margin-top: 6px; }
  .cover { break-after: page; padding: 70mm 0 0 14mm; border-left: 5pt solid ${theme.accent}; min-height: 150mm; }
  .cover h1 { break-before: auto; font-size: 34pt; line-height: 1.1; border: 0; padding: 0; margin: 0 0 0.5em; }
  .cover p { font-size: 12pt; color: ${theme.muted}; margin: 0.3em 0; max-width: 120mm; }
</style>
</head>
<body>
${body || `<p class="muted">Nothing to export.</p>`}
</body>
</html>`;
}

function renderBlock(block: ExportBlock, images: ReadonlyMap<string, string>): string {
    if (block.type === "heading") {
        const tag = `h${block.level}`;
        return `<${tag}>${escapeHtml(block.text)}</${tag}>`;
    }
    if (block.type === "paragraph") return `<p>${renderRuns(block.runs)}</p>`;
    if (block.type === "list") {
        const tag = block.ordered ? "ol" : "ul";
        const items = block.items.map((item) => `<li>${renderRuns(item)}</li>`).join("");
        return `<${tag}>${items}</${tag}>`;
    }
    if (block.type === "quote") return `<blockquote>${escapeHtml(block.text)}</blockquote>`;
    if (block.type === "code") return `<pre><code>${escapeHtml(block.text)}</code></pre>`;
    if (block.type === "hr") return `<hr />`;
    // Only an image whose data is in the document is drawn, so nothing outside the set loads (NFR-010).
    if (block.type === "image")
        return images.get(block.src)?.startsWith("data:image/")
            ? `<figure class="diagram"><img src="${escapeHtml(images.get(block.src)!)}" alt="${escapeHtml(block.alt)}" /><figcaption>${escapeHtml(block.alt)}</figcaption></figure>`
            : `<p class="muted">${escapeHtml(block.alt)}</p>`;
    const head = block.header.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("");
    const rows = block.rows
        .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
        .join("");
    return `<table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
}

function renderRuns(runs: InlineRun[]): string {
    return runs
        .map((run) => {
            // Soft breaks are already spaces. A newline here is a hard break.
            let html = escapeHtml(run.text).replace(/\n/g, "<br />");
            if (run.code) html = `<code>${html}</code>`;
            if (run.bold) html = `<strong>${html}</strong>`;
            if (run.italic) html = `<em>${html}</em>`;
            if (run.href) html = `<a href="${escapeHtml(run.href)}">${html}</a>`;
            return html;
        })
        .join("");
}

/** A CSS string literal. A quote, a backslash, a new line, or a "<" cannot end the string or the style element. */
function cssString(text: string): string {
    return `"${text.replace(/[\\"<>\n\r]/g, (c) => `\\${c.charCodeAt(0).toString(16)} `)}"`;
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&" + "amp;")
        .replace(/</g, "&" + "lt;")
        .replace(/>/g, "&" + "gt;")
        .replace(/"/g, "&" + "quot;");
}
