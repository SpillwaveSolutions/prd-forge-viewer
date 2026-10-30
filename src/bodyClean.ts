/**
 * The parts of a section body that the viewer and the export do not show, by the rules of the
 * PRD Forge exporter (prd_export.py): the details block, which repeats the front matter, and each
 * ASCII wireframe sketch that a drawing follows.
 */
const DETAILS = /<!-- prd-forge:details -->[\s\S]*?<!-- \/prd-forge:details -->\n?/g;
// ponytail: the next non-blank line must be an image; prd_export.py also checks that the file exists.
const SKETCH = /^```wireframe\n[\s\S]*?^```\n(?=\s*!\[[^\]]*\]\([^)\s]+\)\s*$)/gm;

export const cleanBody = (md: string) => md.replace(DETAILS, "").replace(SKETCH, "");
