---
date: 2026-10-30
slug: plan-9-diagrams-design
title: Plan 9: diagrams as images, optional grades, and a better layout
epic: 01M6700RY14BFZCYD4FGHJYB7Q
items: [01M6700RYEA5ZRFE6QYW3CRRKV, 01M6700RYEA5ZRFE6QYW3CRRKX, 01M6700RYEA5ZRFE6QYW3CRRKZ, 01M6700RYF3F05QEDN2V10MPTH, 01M6700RYF3F05QEDN2V10MPTK, 01M6700RYF3F05QEDN2V10MPTN]
git_hash: "6ce028282a099bcfc241766f75dab25401ef3170"
---

# Plan 9: diagrams as images, optional grades, and a better layout

## Context

You used release 0.1.0 on the `prd-forge` set and found four problems:

1. The viewer shows the ASCII sketch of each wireframe above its drawing. You want only the drawing.
2. PDF and Word exports have no diagrams. Each image becomes its alt text (`exportBlocks.ts:141`), and each ASCII sketch prints as a code block. The `<!-- prd-forge:details -->` markers also print as text (`exportBlocks.ts:92`).
3. Diagrams in the viewer are too large. The only rule is `.body img { max-width: 100% }` (`styles.css:28`).
4. The app works, but its look is plain: 52 lines of global CSS and the system font.

You also want grades to be optional in exports. You chose **off by default**, and an update to FR-019 in the PRD. You also want to zoom and pan inside a diagram window.

No section body holds raw Mermaid or PlantUML code. The raw text in the exports is the ` ```wireframe ` ASCII sketches. Each sketch has a drawing on the next line, for example `![WF-001 drawing](diagrams/WF-001.svg)`. Every diagram has a `.svg` and a `.png` in `diagrams/`.

The guide is PRD Forge 0.11.0 `prd_export.py`:

- It drops a `wireframe` block when the next block is an image that exists (`prd_export.py:228`).
- It embeds the `.png` with the same name as the linked `.svg` (`:122`).
- It strips the details block (`:86`).
- It scales each image to fit 6.0 by 8.0 inches (`:678`), and uses the alt text as a caption.

## Tasks

- [ ] (P0) Task 1: one body cleaner for the viewer and the export
  Add `src/bodyClean.ts` with `cleanBody(md)`. It removes the details block, and each ` ```wireframe ` block that an image line follows, by the `prd_export.py` rules. `renderBody.ts` and `buildExport` (`exportModel.ts`) call it. Unit tests use a body from `08-wireframes.md`.
- [ ] (P0) Task 2: diagrams in PDF, print, and Word
  Add an `image` block to `ExportBlock` (`exportBlocks.ts`) for an image line. Before the export, `exportRun.ts` loads the `.png` of each image through the existing `read_asset` command. `exportHtml.ts` writes `<figure><img><figcaption>` with `max-width:100%; max-height:215mm`. `exportDocx.ts` writes a docx `ImageRun` scaled to fit 6.0 by 8.0 inches, with the PNG size read from its IHDR header, and a caption. A missing file keeps the alt text, as today.
- [ ] (P1) Task 3: optional grades in the export
  Add an **Include grades** checkbox, clear by default, to `ExportDialog.tsx`. Pass it through `runExport` and `runPrint` to `buildExport`. With the box clear, the contents table has only Section and Status. With the box selected, it also has Score and Blocking defects, as in 0.1.0. Before the code, update FR-019 with the `prd-forge:prd-wizard` skill: the export leaves out grades unless you select them. Add a change log entry, and run the validator, `prd-details.mjs`, and the export. Update the e2e checks for FR-019 to select the box.
- [ ] (P1) Task 4: diagram size, zoom, and pan in the viewer
  Show diagrams in a `figure` with a caption, at `max-height: 60vh` and `object-fit: contain`. Select a diagram to open it in a diagram window, a dialog that fills most of the app window. In the diagram window:
  - The diagram opens fitted to the window.
  - Scroll with a trackpad or wheel, or pinch, to zoom at the pointer, from 0.25x to 8x.
  - Drag to pan.
  - The **+**, **-**, and **Fit** buttons, and the `+`, `-`, `0`, and arrow keys, do the same from the keyboard.
  - Escape closes the window.

  Use a CSS `transform` on the image, with no new dependency. Put the zoom math in a pure function with a unit test.
- [ ] (P1) Task 5: a new visual design
  Use the `frontend-design` skill to restyle `styles.css`. Make these changes:
  - Load the bundled Source Sans 3, Source Serif 4, and Source Code Pro fonts from `public/fonts`.
  - Use color tokens, with a dark mode.
  - Make the header bar, the left document list, and the section page clear.
  - Show status as chips and scores as badges.
  - Make the tables, the dialogs, and the search panel tidy.

  Keep every class name, role, and label that the e2e checks use. Change markup only where the design needs it. Check the result with screenshots through the tauri MCP server.
- [ ] (P0) Task 6: checks, release, and install
  Extend `e2e/checks/phase-1-reading.mjs`: no `wireframe` code block shows, the diagram height is 60vh or less, and the diagram window zooms, pans, and closes with Escape. Extend `phase-5-export.mjs`: the PDF and the .docx each contain images, contain no ASCII sketch or details marker, and leave out the Score column by default. With **Include grades** selected, they have the Score column. Run all unit tests and e2e checks. Merge on green, cut 0.2.0, and install the new DMG in `/Applications`.

## Files

- New: `src/bodyClean.ts` and its test.
- Changed: `src/renderBody.ts`, `src/exportModel.ts`, `src/exportBlocks.ts`, `src/exportHtml.ts`, `src/exportDocx.ts`, `src/exportRun.ts`, `src/ExportDialog.tsx`, `src/SectionPage.tsx`, `src/styles.css`, and `src/App.tsx` (markup for the header bar only).
- PRD: `08-functional-requirements.md` (FR-019) and `16-change-log.md`, through the wizard.
- Reused with no change: the `read_asset` command (`src-tauri/src/prdset/section.rs:87`). It already returns PNG files inside the set folder as data URLs.

## Verification

1. Run `bun test src` and `cargo test --manifest-path src-tauri/Cargo.toml`.
2. Run `bun run test:e2e`. It runs every check file against the MCP build.
3. Open the 0.2.0 app on the `prd-forge` and `prd-forge-viewer` sets. Check that no ASCII sketch shows and that the diagrams fit the window.
4. Export both sets to PDF and Word, once with grades and once without. Compare the diagrams with the `prd_export.py` export of the same set.
5. Run the PRD validator. It must report "18 documents, no errors".
