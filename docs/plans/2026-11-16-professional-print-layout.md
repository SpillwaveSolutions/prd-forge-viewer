---
date: 2026-11-16
slug: professional-print-layout
title: Professional print layout for PDF and Word export
epic: 01M7JYNEDBP6V12CES431GFAF6
items: [01M7JYNEEAE60FVW4Z9HH8SAX9, 01M7JYNEEB98P8ZRP6935B5AR6, 01M7JYNEEB98P8ZRP6935B5AR8, 01M7JYNEECM7V957HNK5G96QV3, 01M7JYNEECM7V957HNK5G96QV5, 01M7JYNEECM7V957HNK5G96QV7]
git_hash: "4ce7c9104e24b12d4780e63ed2238782c7863dc4"
---

# Make the PDF and Word exports look professional

## Context

You exported the `prd-forge` PRD set (version 0.14.0) from the installed PRD Forge Viewer and the PDF looks unfinished:

- Lines break in the middle of sentences.
- Text after a page break starts at the top edge of the page. No page has a page number or a footer.
- A section heading, such as **Business objectives and success metrics**, sits at the bottom of a page.
- The **User journeys** heading and the J-001 heading stay on one page, and the diagram moves to the next page. Most of the page is empty.
- A diagram moves away from the table that describes it. For example, the J-001 satisfaction diagram and its stage table are on different pages.
- The title says "prd-forge PRD". It must say "PRD Forge PRD".

Root causes:

1. The installed app is 0.4.0. Release 0.4.1 already fixes the mid-sentence line breaks (PR #215, `src/exportBlocks.ts` `flowSoftBreaks`). The source markdown is hard-wrapped at 80 columns, and 0.4.0 printed each source line as its own line. No new code is needed for this item. Install the new build.
2. `src/exportHtml.ts` sets `@page { margin: 0; }` and uses body padding. Padding applies only to the first and last page. The stylesheet has no page-break rules and no footer. `src-tauri/src/export.rs` runs Chrome with `--no-pdf-header-footer`, which is correct. The footer must come from CSS `@page` margin boxes. Chrome 131 and later support them, and the installed Chrome is 157.
3. Diagrams have `max-height: 215mm`. A heading pair plus a 215 mm diagram does not fit on one page, so Chrome moves the diagram and leaves the headings alone.
4. The title comes from `set.product` (the `product:` slug in `prd.md`) in `src/exportModel.ts:24` and `src/exportRun.ts:56`.

Decisions you made:

- Apply the same page numbers, footer, and section page breaks to the PDF and to Word.
- For user journeys, fix only the layout. The PRD content stays the same.
- Title-case a product name that is an all-lowercase slug, and keep known acronyms in capitals. `prd-forge` becomes `PRD Forge`. A name that already has capitals, such as `PRD Forge Viewer`, does not change.

## Record the work

1. Run `bin/worklog add` for one item, "Professional print layout for PDF and Word export", and sync it to get its GitHub issue number.
2. Move the item to `in_progress` before the first code change.

## Do a design pass on the print stylesheet

Load the `frontend-design` skill and use it to design the print stylesheet in `src/exportHtml.ts`. The design must keep every theme color token in `src/themes.ts` and the embedded fonts in `src/exportFonts.ts`. The design spec:

- **Page box.** `@page { size: Letter; margin: 22mm 20mm 24mm; }`. Remove the body padding. Paint the theme page color into the margin with an `@page` background. If Chrome leaves the margin white, use a white page in the PDF and keep the theme page color for the screen preview.
- **Footer.** `@bottom-left` shows "PRD Forge PRD · Version 0.14.0", plus "· Draft" when `draftReason` returns a reason (TR-005). `@bottom-right` shows `"Page " counter(page) " of " counter(pages)`. Use the theme muted color at 8.5 pt. The cover page has no footer (`@page :first`).
- **Cover page.** The title, the version, the draft notice, and the export date are on page 1 by themselves. **Executive summary** and **Contents** start on page 2.
- **Sections.** Each `h1` after the first starts a new page (`break-before: page`). Each heading keeps with the next block (`break-after: avoid`).
- **Diagrams.** The figure is a framed card. The image and its caption are one unit (`break-inside: avoid`). Set `max-height` to about 180 mm, so that a section `h1`, a journey `h2`, and the diagram fit on one page. A wide diagram, such as a satisfaction chart, takes the full text width.
- **A diagram with its table.** A figure keeps with the next block. A paragraph directly before a table keeps with the table (`p:has(+ table)`). A table can still continue on the next page, and its header row repeats there.
- **Tables.** No row splits across pages (`tr { break-inside: avoid }`). Tighter cell padding. Words in a cell do not break, so "Domain expert" wraps only between the two words.
- **Text.** Body text at about 10.5 pt with a line height of 1.5. Headings use a pt scale. `orphans: 3; widows: 3`.

Add the footer text to `renderThemedHtml` as a new optional argument. `src/exportRun.ts` already passes the title, and it can pass the version and the draft state from `set`.

## Apply the same layout to Word

Change `src/exportDocx.ts`:

- Set the page size to Letter with the same margins.
- Add a footer with the same text as the PDF and `PageNumber.CURRENT` of `PageNumber.TOTAL_PAGES`. Give the cover page its own section with no footer, or use `titlePage: true`.
- Set `pageBreakBefore: true` on each `h1` paragraph after the first.
- Set `cantSplit: true` on table rows, and repeat the header row (`tableHeader: true` is already set).
- Set `keepNext` on the caption paragraph of an image and on a paragraph directly before a table. The image paragraph already has `keepNext`.

## Title-case the product name

Add one function, `displayName(product)`, in `src/exportModel.ts`. If the name has no capital letters, split it on `-`, `_`, and spaces. Write `prd`, `api`, `ui`, and `ai` in capitals, and capitalize the first letter of each other word. Otherwise, return the name unchanged. Use it for the cover `h1` (`exportModel.ts:24`) and for the document title (`exportRun.ts:56`). The export file name stays the same.

## Add tests

Add one check for each behavior to the existing test files:

- `src/exportHtml.test.ts`: the CSS has a Letter `@page` with margin boxes for the page counter, and an `h1` page-break rule.
- `src/exportModel.test.ts`: `displayName("prd-forge")` is `PRD Forge`, and `displayName("PRD Forge Viewer")` does not change.
- `src/exportDocx.test.ts`: the document XML has a footer with a page-number field, and the second `h1` has a page break before it.

## Update the PRD

Add acceptance criteria to FR-010 and FR-011 through the `prd-forge:prd-wizard` skill: "Each page shows its page number and the total page count, and each section starts on a new page." Then run the validator. It must report "18 documents, no errors". Your project instructions need this step for each new viewer requirement.

## Verification

1. Run `bun test`. Run `cargo test` in `src-tauri`.
2. Build the app and install it over the 0.4.0 app in `/Applications`.
3. Open `~/clients/kpmg/src/prd-forge` with `prdf` and export the full set to PDF and to Word, outside the set folder.
4. Render the PDF pages to PNG with `pdftoppm` or `qlmanage`, and examine these pages:
   - The cover page, with "PRD Forge PRD" and no footer.
   - The "How this document set is numbered" paragraph, with no mid-sentence breaks.
   - The start of **Business objectives and success metrics**, on a new page.
   - **User journeys**, with the J-001 heading and its diagram on one page.
   - The J-001 satisfaction diagram, with the paragraph and stage table that follow it.
   - The footer, with correct page numbers on every page after the cover.
5. Open the Word file in Word and check the footer, the page breaks, and the cover page.
6. Move the work item to `done`, run `bin/worklog roadmap-render`, and commit the log and the roadmap with the code.

## Ship the release

Do these steps only after you check the rendered pages from the verification step.

1. Create a branch, `print-layout`, and commit the code, the tests, the PRD change, the work log, and the roadmap.
2. Push the branch and open a PR with the `worklog:pr-description` skill. Link the issue.
3. Merge on green with the `worklog:merge-green` skill.
4. Cut the next release, 0.5.0, with the `worklog:release` skill. The release adds a new export behavior, so it is a minor version.

## Capture the plan

Run `bin/worklog plan-capture` on this plan. It writes `docs/plans/2026-11-16-professional-print-layout.md` and adds the steps as work items.

## Tasks

- [ ] (P1) Design the print stylesheet for the PDF export
  Letter page box, footer with page numbers, cover page, page break before each section, diagrams kept with their headings and tables.
- [ ] (P1) Apply the same page layout to the Word export
  Letter page, footer with page numbers, page break before each section, rows that do not split.
- [ ] (P2) Title-case a lowercase product name in the export title
  prd-forge becomes PRD Forge. A name with capitals does not change.
- [ ] (P2) Add FR-010 and FR-011 acceptance criteria for page numbers and section pages
- [ ] (P1) Export prd-forge and check the rendered pages
- [ ] (P1) Open the PR, merge on green, and cut release 0.5.0
