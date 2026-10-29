# Changelog

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
