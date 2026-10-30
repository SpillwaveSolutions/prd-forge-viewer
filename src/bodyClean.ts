/**
 * The parts of a section body that the viewer and the export do not show, by the rules of the
 * PRD Forge exporter (prd_export.py): the details block, which repeats the front matter, and each
 * ASCII wireframe sketch that a drawing follows. A sketch stays when its drawing cannot be read.
 */
const DETAILS = /<!-- prd-forge:details -->[\s\S]*?<!-- \/prd-forge:details -->\n?/g;
// A wireframe sketch, then (captured) the path of the image on the next non-blank line.
const SKETCH = /^```wireframe\n[\s\S]*?^```\n(?=\s*!\[[^\]]*\]\(([^)\s]+)\)\s*$)/gm;

/** For an export: drop each sketch whose drawing the export has. */
export const cleanForExport = (md: string, hasDrawing: (path: string) => boolean = () => true) =>
    md.replace(DETAILS, "").replace(SKETCH, (sketch, path: string) => (hasDrawing(path) ? "" : sketch));

/**
 * For the viewer: each sketch is hidden, and the viewer shows it if its drawing does not load. The
 * blank lines keep the sketch a code block inside the HTML block.
 */
export const cleanForView = (md: string) =>
    md.replace(DETAILS, "").replace(SKETCH, (sketch) => `<div class="sketch" data-sketch hidden>\n\n${sketch}\n</div>\n`);
