---
date: 2026-10-29
slug: plan-7-export
title: Plan 7: PDF and Word export, print, and the Draft mark
epic: 01M64AFRXQ04J5X7RQ0PC24VNC
items: [01M64AFRY2E3BX98SZ4RCG3PEE, 01M64AFRY2E3BX98SZ4RCG3PEG, 01M64AFRY2E3BX98SZ4RCG3PEJ, 01M64AFRY2E3BX98SZ4RCG3PEM, 01M64AFRY2E3BX98SZ4RCG3PEP, 01M64AFRY2E3BX98SZ4RCG3PER]
git_hash: "d1e25eaf8c191b49d62aeec9f3ab3f2b3c675d4f"
---

# Plan 7: PDF and Word export, print, and the Draft mark

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task by task.

**Goal:** The author exports the whole set or selected sections to PDF or Word with a theme, or prints them. The first page shows the version, the Draft mark, the executive summary, and the status and score of every section.

**Architecture:** A pure TypeScript export model (`src/exportModel.ts`) turns the set and its sections into one markdown document with a first page (WF-009). Copies of Motion's `exportBlocks.ts`, `exportHtml.ts`, and `exportDocx.ts` (MIT) render it as themed HTML and as Word, with bundled open-license fonts. Rust adds `write_export(set, path, bytes)` for Word and `export_pdf(set, path, html)` for PDF. Both refuse a path inside the set folder (OUT-001). `export_pdf` prints the themed HTML to a tagged PDF with headless Chrome (ADR-002). Print sends the same themed HTML to the macOS print dialog. The export dialog (WF-007) selects the format, the theme, and the sections.

**Tech stack:** Plans 1 to 6, plus `docx` (npm) and Google Chrome on the author's computer for PDF.

**Spec:** FR-010 to FR-014, FR-019, TR-005, TR-007, TR-010, NFR-004, NFR-009, FR-016 criterion 2, WF-007, WF-009, stories US-014 to US-020, and ADR-002.

## Global constraints

- All earlier constraints stay. An export never writes inside the set folder (OUT-001).
- The first page shows "Draft" unless the root and every section are `final` (TR-005). Nothing in the viewer removes the mark. The export never says that the PRD is approved (TR-007). A blocking defect does not stop an export (TR-010).
- A `pending` section says that it is not written yet (FR-019).
- Sections come in reading order, whatever the order of the selection (FR-012).
- The fonts are open-license fonts in the app. Each export embeds them (FR-016, criterion 2).
- An export is ready within 10 seconds, p95 (NFR-004). A screen reader can read it (NFR-009).
- Diagrams show as their alt text in release 1. The PRD does not require them in an export.

## Review focus

1. **A path inside the set.** `write_export` and `export_pdf` refuse `<set>/x.pdf` and a path that resolves into the set through a link. Test in task 4.
2. **The Draft rule.** 17 final documents and 1 at review show "Draft". 18 final documents do not. Test in task 1.
3. **A selection out of order.** Functional requirements selected before journeys still export journeys first. Test in task 1.
4. **Markdown in a body.** A heading, a table, and a list in a section body keep their structure in both formats. Tests in tasks 2 and 3.
5. **No Chrome.** The PDF export reports that Chrome is missing, and the Word export still works. Test in task 4.

## Tasks

- [ ] (P0) Task 1: the export model and the first page
  `buildExport(set, sections, selected)` returns the markdown of the export. Tests: FR-012 order, FR-014 version and Draft, FR-019 contents and pending text, TR-005 both cases, TR-007, and TR-010.
- [ ] (P0) Task 2: themed HTML with embedded fonts
  Copy `exportBlocks.ts` and `exportHtml.ts`. Add the bundled serif, sans-serif, and monospace fonts as `@font-face` rules. Tests: the theme colors and fonts are in the HTML, and the body keeps its headings, tables, and lists.
- [ ] (P0) Task 3: the Word writer
  Copy `exportDocx.ts`, return bytes, and embed the fonts. Tests: the Clay colors and fonts are in `document.xml`, the fonts are in the package, and the sections are in order.
- [ ] (P0) Task 4: write the files outside the set
  `write_export` and `export_pdf` refuse paths in the set. `export_pdf` runs headless Chrome to a tagged PDF. Tests: both refusals, a PDF with a structure tree, and the missing Chrome message.
- [ ] (P0) Task 5: the export dialog and print
  An **Export** button opens WF-007: the format, the theme, **Edit themes**, the sections in reading order, the reason for Draft, **Print**, and **Export**. Tests in `bun test`.
- [ ] (P0) Task 6: MCP checks for phase 5
  `e2e/checks/phase-5-export.mjs` exports both formats and two sections, prints, and reads each file: order, version, Draft, contents, pending text, theme colors, and embedded fonts. It checks NFR-004 over 20 exports and the NFR-009 structure checks. Record the PDF engine in ADR-002.
