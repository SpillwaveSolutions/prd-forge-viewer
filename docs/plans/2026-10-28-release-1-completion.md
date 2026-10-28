---
date: 2026-10-28
slug: release-1-completion
title: Release 1 completion: build the 15 remaining requirements
epic: 01M62C7RE2CW1HN12H2T82VJ6C
items: [01M62C7REFJRP4FVS9Z3JD5SB5, 01M62C7REFJRP4FVS9Z3JD5SB7, 01M62C7REFJRP4FVS9Z3JD5SB9, 01M62C7REFJRP4FVS9Z3JD5SBB, 01M62C7REFJRP4FVS9Z3JD5SBD, 01M62C7REFJRP4FVS9Z3JD5SBF, 01M62C7REFJRP4FVS9Z3JD5SBH, 01M62C7REFJRP4FVS9Z3JD5SBK, 01M62C7REFJRP4FVS9Z3JD5SBN, 01M62C7REFJRP4FVS9Z3JD5SBQ, 01M62C7REFJRP4FVS9Z3JD5SBS, 01M62C7REGCD2R415FMWFCZMTG, 01M62C7REGCD2R415FMWFCZMTJ, 01M62C7REGCD2R415FMWFCZMTM, 01M62C7REGCD2R415FMWFCZMTP, 01M62C7REGCD2R415FMWFCZMTR, 01M62C7REGCD2R415FMWFCZMTT, 01M62C7REGCD2R415FMWFCZMTW, 01M62C7REGCD2R415FMWFCZMTY, 01M62C7REGCD2R415FMWFCZMV0, 01M62C7REGCD2R415FMWFCZMV2, 01M62C7REGCD2R415FMWFCZMV4, 01M62C7REGCD2R415FMWFCZMV6, 01M62C7REGCD2R415FMWFCZMV8, 01M62C7REGCD2R415FMWFCZMVA, 01M62C7REHN9N2P8Z19K0EPA0F, 01M62C7REHN9N2P8Z19K0EPA0H]
git_hash: "9cd5edeb810fe80a6c390293cde8f520753e949c"
---

# Release 1 completion plan: build the 15 remaining requirements

## Context

Release 1 (REL-001, due 2026-11-06) has 23 requirements: FR-001 to FR-024, except FR-006. Plans 1 and 2 built 8 of them (FR-001 to FR-004, FR-021, FR-022, FR-024, and FR-002). You can open a set, see its grades, and use `prdf`. You cannot click a section, read an item, search, see live changes, or export to PDF or Word with a theme.

This plan builds the other 15 requirements in 6 phases, one phase for each subsystem. Each phase gets its own detailed TDD plan (superpowers writing-plans) at the start of the phase, and the tauri MCP server checks its features before it merges. The plan ends with a goal that keeps the work running until all phases are done.

Sources: the PRD at `docs/prd/prd-forge-viewer/` (0.6.1), the backlog at `docs/prd/prd-forge-viewer-backlog/`, ADR-001 to ADR-005 in `projects/001-prd-forge-viewer/decisions/`, and the wireframes WF-002 to WF-004 and WF-007 to WF-009.

## Code to reuse

- **This repository:** `load_set`, `split_front_matter`, and `parse_header` (`src-tauri/src/prdset/`); `settings.rs` (add themes to it); `commands.rs`; `SetOverview` and `GradesTable` (`src/`); and the MCP test harness in `e2e/` (`client.mjs`, `e2e.mjs`).
- **Motion (`/Users/richardhightower/clients/spillwave/src/motion`, MIT), copied as is:**
  - `src/lib/themes.ts`: `ExportTheme`, `ICE_SNOWSTORM`, `CLAY`, `sanitizeCustomThemes`, `findTheme`, and `slugThemeId`
  - `src/lib/exportBlocks.ts`: `markdownToBlocks`, and `src/lib/frontmatter.ts`
  - `src/lib/exportHtml.ts`: `renderThemedHtml`
  - `src/lib/exportDocx.ts`: `exportDocx`
  - `src/lib/sanitize.ts`
  - `src/lib/export.test.ts`
- **Motion, changed when copied:** `src/components/Themes/dialogs.tsx` (`ExportDialog` and `ThemeSettingsDialog`). Remove the jsPDF import, pass a save callback in, and bring the theme CSS.
- **Not reused:** Motion's jsPDF writer, and its `<a download>` save. The viewer saves with the dialog `save()` and a Rust command.

## Phases

| Phase | Builds | Stories | Decision | Time |
| --- | --- | --- | --- | --- |
| 0 | Merge PR #104, and add a phase check runner to `e2e/` | none | none | About 30 minutes |
| 1 | Read a section, read one item, follow a reference | US-008, US-009, US-010 (FR-005, FR-023, FR-007) | ADR-001 | About 2 hours |
| 2 | Search with BM25 ranking and a score from 0 to 100 | US-011, US-012 (FR-008) | ADR-003 | About 2 hours |
| 3 | Live updates within 2 seconds | US-013 (FR-009) | ADR-005 | About 1 hour |
| 4 | Built-in and custom export themes | US-021 to US-025 (FR-015 to FR-018, FR-020) | ADR-002, ADR-004 | About 2 hours |
| 5 | PDF, Word, selected sections, print, the version and Draft mark, and section status in the export | US-014 to US-020 (FR-010 to FR-014, FR-019, TR-005) | ADR-002 | About 4 to 5 hours |
| 6 | Close out release 1: full regression, NFR checks, release build, and docs | All | All | About 1 to 2 hours |

The total is about 12 to 15 hours of build time.

### Phase 1 design: reading

- **Rust:** `read_section(folder, file)` returns the body markdown and the items of the section. Items come from each top-level front matter list whose entries have an id such as `FR-008`, plus the glossary terms. Each item's title is its first named field: name, capability, statement, question, or term. A set-wide id index maps each id to its document and item, for FR-007.
- **Images:** a section body links `diagrams/*.svg`. `read_asset(folder, rel)` returns a data URL only for a path inside the set folder. A remote image is not loaded, and its alt text shows (NFR-010).
- **UI:** each document in the list becomes a button that opens the section page (FR-005). Bodies render with `marked` and DOMPurify, with no scripts. The section page lists its items, and one item shows with the status and grade of its section (FR-023, WF-002). An id in an item's text becomes a link to that item (FR-007).

### Phase 2 design: search

- `rusqlite` with the bundled SQLite and FTS5. One index file for each set in the app data folder, with a content hash for each document, so that the index rebuilds only changed documents (ADR-003).
- `search(folder, term, category)` returns the items ranked by `bm25()`. Title matches have a higher weight. Score = best `bm25` divided by this `bm25`, times 100.
- WF-003 and WF-004: a search box, a category filter, the number of matches, and a "no match" message. Selecting a result opens its item in its section.
- NFR-003: p95 within 0.5 seconds for this set.

### Phase 3 design: live updates

- The `notify` crate, with a 200 ms debounce for each file and a polling fallback (ADR-005). On a change, the core reloads the set and emits `set-changed` with the file names.
- The UI updates the open section and the grades, and shows a change notice on each changed section (WF-002). NFR-002: within 2 seconds.

### Phase 4 design: themes

- Copy `themes.ts`. Check that the two built-in themes match the FR-015 hex values, and correct them to the PRD values if they differ.
- Store custom themes and the selected theme id in our `settings.json`, with the same atomic save (NFR-008, FR-020).
- Copy `ThemeSettingsDialog` for WF-008. Built-in themes cannot change or be deleted (FR-017, FR-018).
- Bundle open-license fonts for serif, sans-serif, and monospace, so that exports embed them (FR-016, criterion 2).

### Phase 5 design: export

- Build the export model from the set. The first page (WF-009) has:
  - the Draft mark, unless every document is final (TR-005),
  - the version,
  - the executive summary,
  - the contents list, with the status, score, and blocking defects of each section (FR-019).

  Each pending section says that it is not written yet. Then come the selected sections, in reading order (FR-012).
- **Word:** use `exportDocx` with an image block for diagrams, and embed the fonts.
- **PDF:** use `renderThemedHtml` with print CSS. The first engine to try is the macOS web view's PDF writer. If the NFR-009 accessibility check fails, switch to a bundled Chromium, as ADR-002 allows. Record the result in ADR-002.
- **Print (FR-013):** print the same themed HTML.
- **Save:** use the dialog `save()` and a Rust `write_export(path, bytes)` command. The command refuses any path inside the set folder (OUT-001).
- **Export dialog (WF-007):** the format, the theme, the sections, the reason for Draft, and the **Print** and **Export** buttons.
- NFR-004: within 10 seconds. NFR-009: zero checker errors.

## Per-phase loop

Each phase runs these steps, without waiting for you between phases:

1. Write the phase plan to `docs/plans/<date>-plan-<n>-<slug>.md` with superpowers writing-plans, and capture it with `bin/worklog plan-capture`. Its tasks go under the phase's stories.
2. Build it with superpowers executing-plans: TDD for each task, and a ledger.
3. Add `e2e/phase<n>.mjs`, which checks every acceptance criterion of the phase through the tauri MCP tools. Run it with all earlier phase checks.
4. Run a fresh whole-branch review, and fix the critical and important findings, each with a failing test first.
5. Open the PR, and merge it on green with the worklog merge-green skill.
6. Close the stories in the worklog, render the roadmap, and sync to GitHub Issues.

## Tasks

- [ ] (P0) Phase 0: merge the MCP tests and add a phase check runner
  Merge PR #104 on green. Change `e2e/` so that each phase adds one check file, and one command runs every check file against the MCP test build.
- [ ] (P0) Phase 1: read sections, items, and references (US-008, US-009, US-010)
  Make each document clickable and readable, list the items of a section, show one item with the status and grade of its section, and turn ids into links. Diagrams in a section show from local files only.
  - [ ] Plan 3 written and captured
  - [ ] Built with TDD, and the review findings fixed
  - [ ] e2e/phase1.mjs passes: FR-005, FR-023, FR-007, and a remote image that does not load
- [ ] (P0) Phase 2: search with ranked results (US-011, US-012)
  Add a local full-text index with BM25 ranking, a search box with a category filter, scores from 0 to 100, and results that open their item.
  - [ ] Plan 4 written and captured
  - [ ] Built with TDD, and the review findings fixed
  - [ ] e2e/phase2.mjs passes: all six FR-008 criteria, and NFR-003 within 0.5 s
- [ ] (P0) Phase 3: live updates from the authoring tools (US-013)
  Watch the set folder, reload changed documents, and show the new text, score, and a change notice without any action.
  - [ ] Plan 5 written and captured
  - [ ] Built with TDD, and the review findings fixed
  - [ ] e2e/phase3.mjs passes: all three FR-009 criteria, and NFR-002 within 2 s
- [ ] (P1) Phase 4: export themes (US-021 to US-025)
  Port the Motion theme model and theme dialog, store custom themes in the settings file, protect the built-in themes, and bundle the fonts that exports embed.
  - [ ] Plan 6 written and captured
  - [ ] Built with TDD, and the review findings fixed
  - [ ] e2e/phase4.mjs passes: FR-015 to FR-018 and FR-020, with themes kept after a restart
- [ ] (P0) Phase 5: PDF and Word export, print, and the Draft mark (US-014 to US-020)
  Build the export model and its first page, write PDF from themed HTML and Word with the Motion writer, print, and save outside the set folder. Pick the PDF engine with the NFR-009 check, and record the result in ADR-002.
  - [ ] Plan 7 written and captured
  - [ ] Built with TDD, and the review findings fixed
  - [ ] e2e/phase5.mjs passes: FR-010 to FR-014, FR-019, TR-005, TR-007, and TR-010, with file checks of each export
  - [ ] NFR-004 within 10 s, and NFR-009 with zero checker errors
- [ ] (P1) Phase 6: close out release 1
  Run every phase check and unit test, check NFR-001 to NFR-010, install the release build, and update REQ, TRAC, and the external README from the result.
  - [ ] All e2e checks and unit tests pass on the release build
  - [ ] The release build is installed in /Applications with no MCP bridge
  - [ ] REQ and TRAC show each release 1 requirement as built and tested
  - [ ] All release 1 stories closed, the roadmap rendered, and GitHub Issues synced

## Verification

- **For each phase:** run `cargo test --manifest-path src-tauri/Cargo.toml` and `bun test src`, then `bun run build:mcp` and `bun e2e/run.mjs`. That command runs every phase check through the tauri MCP server, with screenshots in `e2e/shots/`.
- **Export files:** read the .docx with `python-docx` and check its colors, fonts, and section order. Read the PDF text and fonts with `pypdf`, or with `mdls` and `strings` if `pypdf` is missing. Check the tags and fonts against NFR-009.
- **Release check:** run `e2e/task7.mjs` against the installed app, and run every phase check against the MCP test build.

## Suggested goal

After you approve this plan, set this goal so that the work keeps running until it is done:

```
/goal All 23 release 1 requirements (FR-001 to FR-024 except FR-006) are built, each has a passing tauri MCP check in e2e/, all unit tests pass, every release 1 story in the worklog is closed and synced to GitHub Issues, and every phase PR is merged on green.
```
