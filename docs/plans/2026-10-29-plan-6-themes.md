---
date: 2026-10-29
slug: plan-6-themes
title: Plan 6: export themes
epic: 01M62PG5A0K6D0ZN6QHB51EG8W
items: [01M62PG5ADWD51YWCVTGKQ63YB, 01M62PG5ADWD51YWCVTGKQ63YD, 01M62PG5ADWD51YWCVTGKQ63YF, 01M62PG5ADWD51YWCVTGKQ63YH]
git_hash: "a706740026ef38423f9b5e5c5ff05de60ae34a30"
---

# Plan 6: export themes

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task by task.

**Goal:** The author selects one of the two built-in export themes, makes, changes, and deletes custom themes, and finds the custom themes again after a restart.

**Architecture:** Copy Motion's `themes.ts` (MIT) to `src/themes.ts`. Rust adds two fields to `Settings`: `themes`, the custom themes as JSON, and `export_theme`, the selected theme id, with the same atomic save (NFR-008). New commands `themes` and `save_themes` read and write them. The UI adds a **Themes** button on the set page that opens a copy of Motion's `ThemeSettingsDialog` (WF-008).

**Tech stack:** Plans 1 to 5. No new dependency.

**Spec:** FR-015, FR-016 (criterion 1), FR-017, FR-018, FR-020, WF-008, stories US-021 to US-025, ADR-002, and ADR-004.

## Global constraints

- All earlier constraints stay. Themes live in the settings file in the OS app config folder, never in the set folder (OUT-001, ADR-004).
- Clay and Ice Snowstorm have the FR-015 hex values. The core and the UI both refuse to change or delete them.
- A custom theme has a page, text, heading, and accent color, and a text font and a heading font, each serif, sans-serif, or monospace (FR-016).
- The export file checks for FR-015 to FR-017 and the font embedding of FR-016 criterion 2 come in plan 7, with the export itself.

## Review focus

1. **A settings file from plan 2.** A file with only `known` and `last` loads, and a theme save keeps both. Test in task 2.
2. **A built-in id in the file.** A custom theme with the id `clay` is dropped on load and on save. Tests in tasks 1 and 2.
3. **A damaged theme.** A theme with a bad color or font gets the fallback value, not an error. Test in task 1.
4. **Cancel.** Changes in the dialog are not saved until the author selects **Save themes**. Test in task 3.
5. **The selected theme is deleted.** The selection goes back to a built-in theme. Test in task 3.

## Tasks

- [ ] (P1) Task 1: the theme model
  Copy `themes.ts` from Motion. Tests: Clay and Ice Snowstorm have the FR-015 colors and fonts, a built-in id is dropped by `sanitizeCustomThemes`, and a bad color gets the fallback.
- [ ] (P1) Task 2: themes in the settings file
  `Settings` gets `themes` and `export_theme`. The `themes` and `save_themes` commands read and write them with the atomic save. Tests: a plan 2 file loads, a save keeps `known` and `last`, a built-in id is dropped, and themes survive a restart.
- [ ] (P1) Task 3: the themes dialog
  A **Themes** button on the set page opens the dialog (WF-008). Built-in themes show with their fields disabled and no delete. **New theme**, the name, the four colors, the two fonts, **Delete**, and **Save themes** work. Tests in `bun test`: built-in fields are disabled, a new theme saves, cancel saves nothing, and a delete removes the theme.
- [ ] (P1) Task 4: MCP checks for phase 4
  `e2e/checks/phase-4-themes.mjs` makes "Acme", restarts the viewer, finds "Acme" with the same values, changes its accent, deletes it, and checks that the built-in themes cannot change or be deleted.
