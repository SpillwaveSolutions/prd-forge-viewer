# Plan 7: PDF and Word export, print, and the Draft mark

`01M64AFRXQ04J5X7RQ0PC24VNC` · epic/feature · **open**

Phase 5 of the release 1 completion plan.

## Children

- [[Ticket-01M64AFRY2E3BX98SZ4RCG3PEE]] Task 1: the export model and the first page — `buildExport(set, sections, selected)` returns the markdown of the export. (done)
- [[Ticket-01M64AFRY2E3BX98SZ4RCG3PEG]] Task 2: themed HTML with embedded fonts — Copy `exportBlocks.ts` and `exportHtml.ts`. (done)
- [[Ticket-01M64AFRY2E3BX98SZ4RCG3PEJ]] Task 3: the Word writer — Copy `exportDocx.ts`, return bytes, and embed the fonts. (done)
- [[Ticket-01M64AFRY2E3BX98SZ4RCG3PEM]] Task 4: write the files outside the set — `write_export` and `export_pdf` refuse paths in the set. (done)
- [[Ticket-01M64AFRY2E3BX98SZ4RCG3PEP]] Task 5: the export dialog and print — An **Export** button opens WF-007: the format, the theme, **Edit themes**, the sections in reading order, the reason for Draft, **Print**, and **Export**. (done)
- [[Ticket-01M64AFRY2E3BX98SZ4RCG3PER]] Task 6: MCP checks for phase 5 — `e2e/checks/phase-5-export.mjs` exports both formats and two sections, prints, and reads each file: order, version, Draft, contents, pending text, theme colors, and embedded fonts. (done)

Progress: 6/6 done
