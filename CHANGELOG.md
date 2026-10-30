# Changelog

## 0.2.0, 2026-10-30

This release shows diagrams as pictures everywhere, makes grades optional in
exports, and gives the viewer a new design. It follows PRD 0.6.2.

### New

- **Diagrams in exports.** PDF, print, and Word exports show each diagram as
  its picture, with its name as a caption. Word scales each picture to fit
  the page. The exports follow the PRD Forge exporter.
- **No ASCII sketches.** The viewer and the exports leave out each text sketch
  of a wireframe that has a drawing. They also leave out the details block
  that PRD Forge 0.11.0 adds to each document.
- **Optional grades.** An export leaves out the score and the blocking
  defects of each section, unless you select **Include grades** in the
  Export dialog. The status of each section always shows (FR-019).
- **Diagram window.** Diagrams fit the reading column. Select a diagram to
  open it in a large window. Scroll or pinch to zoom, drag to pan, and press
  Escape to close. The **+**, **-**, and **Fit** buttons and the `+`, `-`,
  `0`, and arrow keys also work.
- **New design.** The viewer uses the bundled Source fonts, a light and a
  dark mode, and a colored status mark next to each document. The overview
  shows the summary and the documents side by side.

### Tests

- 94 Rust tests and 99 UI tests.
- 58 tauri MCP checks in six check files. New checks cover the diagrams in
  the viewer, the PDF, and the Word file, the diagram window, and the
  **Include grades** option.

## 0.1.0, 2026-10-29

The first release of PRD Forge Viewer. It covers release 1 (REL-001) of the PRD:
FR-001 to FR-024, except FR-006. The viewer runs on macOS and is read-only.

### New

- **Open a PRD set.** Open a set from the app or with the `prdf` command in a
  terminal. The viewer reopens the last set, remembers known locations, and
  lists the sets when `docs/prd` holds more than one (FR-001 to FR-003,
  FR-021, FR-022, FR-024).
- **See the grades.** One table shows the status, score, and blocking defects
  of every section (FR-004).
- **Read sections and items.** Open any section in one action, read one item
  with the status and grade of its section, and follow an id to the item that
  it names. Diagrams load from the set folder only, and no remote image or
  script runs (FR-005, FR-007, FR-023, NFR-010).
- **Search.** Search by term, in one category or in all, with results ranked
  by BM25 and a score from 0 to 100 (FR-008).
- **Live updates.** A save from the authoring tools shows in the window within
  2 seconds, with a change notice and a mark on each changed document
  (FR-009).
- **Export themes.** Select Clay or Ice Snowstorm, or make, change, and delete
  custom themes. Custom themes are kept after a restart (FR-015 to FR-018,
  FR-020).
- **Export and print.** Export the whole set or selected sections to PDF or
  Word, or print them. The first page shows the version, the Draft mark until
  every document is final, the executive summary, and the status and score of
  every section. Exports embed the bundled Source Serif 4, Source Sans 3, and
  Source Code Pro fonts (FR-010 to FR-014, FR-016, FR-019, TR-005).

### Known limits

- PDF export needs Google Chrome on the Mac (ADR-002). Word export does not.
- Diagrams show as their alt text in exports.
- Some non-functional checks have no full run yet: the network-off run, the
  checksum test, the full hostile fixture, the full keyboard audit, and a
  reader's accessibility checker on the exports. See section 4.2 of
  `projects/001-prd-forge-viewer/ARC-001-TRAC-v1.0.md`.

### Tests

- 80 Rust tests and 84 UI tests.
- Six tauri MCP check files in `e2e/checks/` drive the real app and read
  each exported file. Run them with `bun run test:e2e`.
