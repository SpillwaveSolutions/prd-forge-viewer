---
date: 2026-10-28
slug: plan-1-open-and-grades
title: Plan 1, open a PRD set and see its grades
epic: 01M61XNJ3ME272NXHFN3BS3541
items: [01M61XNJ3ME272NXHFN3BS3541, 01M61XNJK6H7BC7R6S80XR242E, 01M61XNJ5TFSD53MNXM1XHBD57, 01M61XNJA9X5VBGWV3V2PKABB4, 01M61XNJNE8SY61J75A69S4TPA]
git_hash: "65049c0"
---

# Plan 1: open a PRD set and see its grades

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A macOS desktop app that opens a PRD set folder and shows the product name, the version, the executive summary, every document in order with its status, and the grade of every section.

**Architecture:** A Tauri 2 app. The Rust core reads the PRD set from disk and returns one `PrdSet` value through one command, `open_set`. A React UI renders that value. The UI never reads files, and nothing writes to the PRD set.

**Tech Stack:** Tauri 2.9, Rust (stable 1.93), `serde`, `serde_yaml`, Bun 1.3, React 19, TypeScript 5. The layout follows the Motion project at `/Users/richardhightower/clients/spillwave/src/motion` (ADR-001).

**Spec:** `docs/prd/prd-forge-viewer/` (PRD 0.6.1), `docs/prd/prd-forge-viewer-backlog/03-stories.md` (US-001, US-003, US-007), and `projects/001-prd-forge-viewer/decisions/ARC-001-ADR-001-v1.1.md`.

## Global constraints

- Release 1 runs on macOS only (OUT-003). Test on the Apple silicon test computer.
- Tauri `2.9.x`, `tauri-build 2.5.x`, `tauri-plugin-dialog 2.6.x`, as in Motion (ADR-001).
- The viewer never changes a document of a PRD set (OUT-001). No code path opens a PRD set file for writing.
- No content of a PRD set leaves the computer, and every feature works offline (NFR-005, NFR-006). Add no network dependency and no network permission.
- The viewer shows content only from files on the computer. No script in a PRD set runs (NFR-010). The CSP `script-src` is `'self'` only.
- The viewer reads the PRD Forge format, version 1 (C-003). The root is `prd.md`. Its `links.children` gives every section with its `order`.
- A person who uses only a keyboard can do every task (NFR-007). Every control is a native `button` or link.
- The author sees an open PRD set within 2 seconds, p95 (NFR-001).
- UI words come from the PRD glossary: "PRD set", "section", "grade", "blocking defect", "status", "unreadable document".

## Review focus

1. **A folder that is not a PRD set.** The author opens a folder with no `prd.md`. Expect a message that names the folder and says that no PRD set is there, and no crash. The test goes in Task 3.
2. **A section listed in the root but missing on disk.** Expect a row marked unreadable, with its file name. The test goes in Task 3.
3. **Windows line endings.** A document saved with `\r\n` must parse. The test goes in Task 2.
4. **A score with no grade date.** A section with `score` and no `graded` shows the score and "no date", not "Not graded". The test goes in Task 6.
5. **Markup in a title.** A title such as `<script>alert(1)</script>` shows as text and never runs (NFR-010). The test goes in Task 5.

---

### Task 1: Scaffold the app

Covers the foundation of EPIC-001 and NFR-010.

**Files:**
- Create: `package.json`, `tsconfig.json`, `scripts/build.ts`, `src/main.tsx`, `src/App.tsx`, `src/styles.css`
- Create: `src-tauri/Cargo.toml`, `src-tauri/build.rs`, `src-tauri/tauri.conf.json`, `src-tauri/capabilities/default.json`, `src-tauri/src/main.rs`, `src-tauri/src/lib.rs`, `src-tauri/icons/` (from `bunx tauri icon` on a placeholder PNG)
- Test: `src-tauri/tests/config.rs`

**Interfaces:**
- Produces: the crate `prd_forge_viewer_lib` with `pub fn run()`. Later tasks add modules to `src-tauri/src/lib.rs`.
- Produces: `bun run build` writes `dist/index.html` and `dist/main.js`. `tauri.conf.json` uses `frontendDist: "../dist"` and no `devUrl`. `beforeDevCommand` is `bun run build -- --watch`.

- [ ] **Step 1: Write the failing test** `csp_blocks_scripts_and_network` in `src-tauri/tests/config.rs`. It reads `../tauri.conf.json` as JSON, takes `app.security.csp`, and asserts:

```rust
assert!(csp.contains("script-src 'self'"));
let script = csp.split(';').find(|d| d.trim().starts_with("script-src")).unwrap();
assert!(!script.contains("unsafe-inline") && !script.contains("unsafe-eval"));
let connect = csp.split(';').find(|d| d.trim().starts_with("connect-src")).unwrap();
assert!(!connect.contains("https://") || connect.contains("https://ipc.localhost"));
assert!(csp.contains("object-src 'none'") && csp.contains("frame-src 'none'"));
```

- [ ] **Step 2: Run it and see it fail.** Run `cargo test --manifest-path src-tauri/Cargo.toml --test config`. Expected: FAIL, because the crate does not exist yet.
- [ ] **Step 3: Create the scaffold.** Copy the shape of Motion's `src-tauri/Cargo.toml`, `build.rs`, `main.rs`, and `tauri.conf.json`, with these values:
  - package `prd-forge-viewer`, lib name `prd_forge_viewer_lib`, `productName` "PRD Forge Viewer", `identifier` `com.spillwave.prd-forge-viewer`, version `0.1.0`.
  - dependencies: `tauri 2.9.5`, `tauri-plugin-dialog 2.6.0`, `serde` with `derive`, `serde_json`, `serde_yaml 0.9`. No `reqwest`, no `tauri-plugin-fs`, no `tauri-plugin-shell`. Dev dependency `tempfile 3`.
  - CSP: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' ipc: http://ipc.localhost; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'none'`.
  - capability `default.json`: `core:default` and `dialog:allow-open` only.
  - `scripts/build.ts`: `Bun.build` of `src/main.tsx` to `dist/`, then write `dist/index.html` with a `<div id="root">` and the script tag, as Motion's build does. It accepts `--watch`.
  - `package.json`: dependencies `react ^19.2.3`, `react-dom ^19.2.3`, `@tauri-apps/api ^2.9.1`, `@tauri-apps/plugin-dialog ^2.6.0`. Dev dependencies `@tauri-apps/cli ^2.9.6`, `@types/bun`, `@types/react`, `@types/react-dom`, `typescript ^5`. Scripts `build`, `tauri`, `test` (`bun test src`), `typecheck`.
  - `App.tsx` renders the heading "PRD Forge Viewer" and nothing else yet.
- [ ] **Step 4: Run the checks.** Run `bun install && bun run build && cargo test --manifest-path src-tauri/Cargo.toml`. Expected: `dist/index.html` exists, and the test passes.
- [ ] **Step 5: Check the window.** Run `bun run tauri dev`. Expected: a window titled "PRD Forge Viewer" with the heading. Close it.
- [ ] **Step 6: Commit.** `git add package.json bun.lock tsconfig.json scripts src src-tauri .gitignore` (ignore `dist/`, `node_modules/`, `src-tauri/target/`, `src-tauri/gen/`). Message: `feat: scaffold the Tauri app`, with the EPIC-001 ULID.

### Task 2: Read the header of one document

Covers US-001 and US-003 (FR-001, FR-003).

**Files:**
- Create: `src-tauri/src/prdset/mod.rs`, `src-tauri/src/prdset/header.rs`
- Modify: `src-tauri/src/lib.rs` (add `pub mod prdset;`)
- Test: in `header.rs` (`#[cfg(test)] mod tests`)

**Interfaces:**
- Produces: `pub fn split_front_matter(text: &str) -> Option<(&str, &str)>`, which returns the YAML and the body.
- Produces: `pub fn parse_header(yaml: &str) -> Result<Header, String>`.
- Produces: `#[derive(Deserialize, Serialize, Clone, Debug)] pub struct Header { pub id: String, pub kind: String, pub title: String, pub status: String, pub section: Option<u8>, pub order: Option<u32>, pub score: Option<u8>, pub blocking: Option<u32>, pub graded: Option<String>, #[serde(default)] pub product: Option<String>, #[serde(default)] pub version: Option<String>, #[serde(default)] pub summary: Option<serde_yaml::Mapping>, #[serde(default)] pub links: Option<Links> }`.
- Produces: `pub struct Links { #[serde(default)] pub children: Vec<ChildLink> }` and `pub struct ChildLink { pub path: String, pub title: String, pub order: Option<u32>, pub status: Option<String> }`.

- [ ] **Step 1: Write the failing tests.**
  - `splits_front_matter`: `split_front_matter("---\nid: a\n---\n# Body\n")` returns `Some(("id: a", "# Body\n"))`.
  - `no_front_matter_is_none`: `split_front_matter("# Body")` returns `None`.
  - `crlf_front_matter`: `split_front_matter("---\r\nid: a\r\n---\r\nBody")` returns `Some` with YAML that `parse_header` reads after the other required fields are added.
  - `parses_graded_section`: a header with `status: final`, `score: 83`, `blocking: 0`, `graded: 2026-10-28` gives those values. `graded` is the string `"2026-10-28"`.
  - `bad_yaml_is_err`: `parse_header("id: [")` returns `Err`.
- [ ] **Step 2: Run them and see them fail.** Run `cargo test --manifest-path src-tauri/Cargo.toml header`. Expected: FAIL, because the functions do not exist.
- [ ] **Step 3: Implement** both functions in `header.rs`. Normalize `\r\n` to `\n` before splitting. Read a `graded` date with a `deserialize_with` that accepts a YAML date or a string and returns a `String`.
- [ ] **Step 4: Run the tests.** Expected: PASS.
- [ ] **Step 5: Commit.** Message `feat: read the header of a PRD document`, with the US-001 ULID.

### Task 3: Load a PRD set

Covers US-001 and US-003 (FR-001, FR-003, C-003).

**Files:**
- Create: `src-tauri/src/prdset/load.rs`
- Test: `src-tauri/tests/load_set.rs`

**Interfaces:**
- Consumes: `split_front_matter`, `parse_header`, `Header` (Task 2).
- Produces: `pub fn load_set(dir: &Path) -> Result<PrdSet, LoadError>`.
- Produces, all `#[derive(Serialize)] #[serde(rename_all = "camelCase")]`:
  - `pub struct PrdSet { pub folder: String, pub product: String, pub version: String, pub summary: Vec<SummaryItem>, pub documents: Vec<DocEntry> }`
  - `pub struct SummaryItem { pub label: String, pub text: String }`, in the root's key order (`problem`, `users`, `why_now`, `bet`, `measure`). The label is the key with `_` as a space and a capital first letter.
  - `pub struct DocEntry { pub file: String, pub title: String, pub section: Option<u8>, pub order: u32, pub status: String, pub grade: Option<Grade>, pub unreadable: Option<String> }`. `status` is `"unreadable"` when `unreadable` is `Some(reason)`.
  - `pub struct Grade { pub score: u8, pub blocking: u32, pub graded: Option<String> }`. It is `Some` only when the header has `score`.
  - `#[derive(Debug)] pub enum LoadError { NoRoot(PathBuf), UnreadableRoot(String) }`, with a `Display` that gives "No PRD set in <folder>: prd.md was not found." for `NoRoot`.
- Rule: the root `prd.md` is the first entry, with `order` 0. The children of `links.children` follow in `order`. A child file that is missing, has no front matter, or fails `parse_header` becomes an entry with its link `title`, its link `order`, and `unreadable: Some(reason)`.

- [ ] **Step 1: Write the failing tests** in `src-tauri/tests/load_set.rs`. Copy `docs/prd/prd-forge-viewer` into a `tempfile::TempDir` for each test that changes files, with a helper `fn copy_set() -> TempDir`.
  - `loads_the_real_set`: `load_set` on `../docs/prd/prd-forge-viewer` gives `product == "PRD Forge Viewer"`, a `version` equal to the root front matter `version`, 18 documents, `documents[0].file == "prd.md"`, `documents[1].file == "01-problem-opportunity.md"`, and 5 summary items with the first label `"Problem"`.
  - `pending_sections_listed` (FR-003, criterion 1): set 13 section files to a header with `status: pending` and an empty body. Expect 18 documents, and those 13 with `status == "pending"`.
  - `unreadable_section_marked` (FR-003, criterion 2): replace `04-personas.md` with `no front matter`. Expect that entry to have `status == "unreadable"`, `file == "04-personas.md"`, and `unreadable.is_some()`, and the other 17 to be readable.
  - `missing_section_marked`: delete `06-scenarios.md`. Expect an unreadable entry for it, and no error.
  - `folder_without_root`: `load_set` on an empty `TempDir` returns `Err(LoadError::NoRoot(_))`, and its message contains "No PRD set in".
- [ ] **Step 2: Run them and see them fail.** Run `cargo test --manifest-path src-tauri/Cargo.toml --test load_set`. Expected: FAIL, because `load_set` does not exist.
- [ ] **Step 3: Implement `load_set`** in `load.rs`. Read files with `std::fs::read_to_string` only.
- [ ] **Step 4: Run the tests.** Expected: PASS. Also check that the test of the real set runs in less than 200 ms in a release build (`cargo test --release`). This leaves room for NFR-001.
- [ ] **Step 5: Commit.** Message `feat: load a PRD set with unreadable and pending documents`, with the US-003 ULID.

### Task 4: The `open_set` command

Covers US-001 (FR-001).

**Files:**
- Create: `src-tauri/src/commands.rs`
- Modify: `src-tauri/src/lib.rs` (register the dialog plugin and `open_set`)
- Test: in `commands.rs`

**Interfaces:**
- Consumes: `load_set`, `PrdSet`, `LoadError` (Task 3).
- Produces: `#[tauri::command] pub fn open_set(path: String) -> Result<PrdSet, String>`, which maps a `LoadError` to its `Display` text.
- Produces for the UI: `invoke<PrdSet>("open_set", { path })`.

- [ ] **Step 1: Write the failing tests.** `open_set_returns_the_set` calls `open_set` with the real set path and checks 18 documents. `open_set_reports_no_root` calls it with a `TempDir` and checks that the `Err` text starts with "No PRD set in".
- [ ] **Step 2: Run them and see them fail.** Expected: FAIL, because `open_set` does not exist.
- [ ] **Step 3: Implement** `open_set`, and register it with `tauri::generate_handler![commands::open_set]` and `tauri_plugin_dialog::init()` in `run()`.
- [ ] **Step 4: Run the tests.** Expected: PASS.
- [ ] **Step 5: Commit.** Message `feat: open_set command`, with the US-001 ULID.

### Task 5: The set overview

Covers US-001 and US-003 (FR-001, FR-003), and WF-001 and WF-005.

**Files:**
- Create: `src/types.ts`, `src/SetOverview.tsx`
- Test: `src/SetOverview.test.tsx`

**Interfaces:**
- Produces: `src/types.ts` with TypeScript types that match Task 3 exactly: `PrdSet`, `SummaryItem`, `DocEntry`, `Grade` (camelCase fields).
- Produces: `export function SetOverview(props: { set: PrdSet }): JSX.Element`. It shows the product name as `h1`, the version, the summary as a definition list, and one list item for each document in order, with its title and status.
- An unreadable document shows the text "Unreadable", its file name, and its reason (WF-005).

- [ ] **Step 1: Write the failing tests** with `renderToStaticMarkup` from `react-dom/server`, on a hand-made `PrdSet` of 3 documents.
  - `shows_product_version_and_summary`: the HTML contains "PRD Forge Viewer", "0.6.1", and the summary label "Problem".
  - `lists_documents_in_order`: the index of "Problem and opportunity" in the HTML is less than the index of "Target customer and market".
  - `marks_unreadable_with_file_name`: a document with `unreadable: "no front matter"` and `file: "04-personas.md"` gives HTML that contains "Unreadable" and "04-personas.md".
  - `title_markup_is_text` (Review Focus 5): a title `<script>alert(1)</script>` appears as `&lt;script&gt;`, and the HTML has no `<script>` tag.
- [ ] **Step 2: Run them and see them fail.** Run `bun test src/SetOverview.test.tsx`. Expected: FAIL, because the module does not exist.
- [ ] **Step 3: Implement** `SetOverview`. Render all text as React text, never with `dangerouslySetInnerHTML`.
- [ ] **Step 4: Run the tests.** Expected: PASS.
- [ ] **Step 5: Commit.** Message `feat: set overview`, with the US-001 ULID.

### Task 6: The grades view

Covers US-007 (FR-004) and TR-002.

**Files:**
- Create: `src/GradesTable.tsx`, `src/grade.ts`
- Test: `src/GradesTable.test.tsx`

**Interfaces:**
- Consumes: `DocEntry`, `Grade` (Task 5).
- Produces: `export function gradeLabel(doc: DocEntry): string` in `grade.ts`. It returns `"Not graded"` when `grade` is absent, `"<score>, <blocking> blocking, <graded>"` when present, and uses `"no date"` when `graded` is absent.
- Produces: `export function GradesTable(props: { documents: DocEntry[] }): JSX.Element`. It is a `table` with one row for each section (`section` is set), and the columns Section, Status, Score, Blocking defects, and Graded.
- Rule (TR-002): the table marks no section as "to fix" and sorts nothing. Rows stay in reading order.

- [ ] **Step 1: Write the failing tests.**
  - `shows_both_grades` (FR-004, criterion 1): section 4 with score 61, blocking 0, graded "2026-10-26", and section 3 with score 75, blocking 1, graded "2026-10-27". The HTML contains "61", "75", "2026-10-26", and "2026-10-27", and section 3 comes before section 4.
  - `ungraded_section` (FR-004, criterion 2): a section with no grade shows "Not graded".
  - `score_without_date` (Review Focus 4): `gradeLabel` of `{ score: 70, blocking: 0 }` with no `graded` returns `"70, 0 blocking, no date"`.
  - `no_fix_marks` (TR-002): the HTML does not contain "to fix".
- [ ] **Step 2: Run them and see them fail.** Run `bun test src/GradesTable.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement** `gradeLabel` and `GradesTable`.
- [ ] **Step 4: Run the tests.** Expected: PASS.
- [ ] **Step 5: Commit.** Message `feat: grades view`, with the US-007 ULID.

### Task 7: Open a set from the app

Covers US-001 and US-003 end to end, and SC-002.

**Files:**
- Modify: `src/App.tsx`
- Create: `src/openSet.ts`
- Test: `src/openSet.test.ts`

**Interfaces:**
- Consumes: `SetOverview`, `GradesTable`, `PrdSet` (Tasks 5 and 6), and the `open_set` command (Task 4).
- Produces: `export async function openSet(pick: () => Promise<string | null>, load: (path: string) => Promise<PrdSet>): Promise<{ set?: PrdSet; error?: string }>`. It returns `{}` when the author cancels, `{ set }` on success, and `{ error }` with the command's message on failure.
- `App.tsx` shows an **Open PRD set** button. It calls `openSet` with the dialog `open({ directory: true })` and `invoke("open_set", { path })`. It then shows `SetOverview` and `GradesTable`, or the error text.

- [ ] **Step 1: Write the failing tests.** `cancel_gives_nothing`, `success_gives_set`, and `failure_gives_message` call `openSet` with fake `pick` and `load` functions.
- [ ] **Step 2: Run them and see them fail.** Expected: FAIL.
- [ ] **Step 3: Implement** `openSet` and wire `App.tsx`.
- [ ] **Step 4: Run all the checks.** Run `bun run typecheck && bun test src && cargo test --manifest-path src-tauri/Cargo.toml`. Expected: all pass.
- [ ] **Step 5: Check by hand (SC-002 and FR-001).** Run `bun run tauri dev`, select **Open PRD set**, and open `docs/prd/prd-forge-viewer`. Expected: the product name, version 0.6.1, the summary, 18 documents in order, and the grades. Then open an empty folder. Expected: the "No PRD set in" message. Use only the keyboard for both (NFR-007).
- [ ] **Step 6: Commit.** Message `feat: open a PRD set from the app`, with the EPIC-001 ULID.

---

## Later plans

Each later plan gets its own file in `docs/plans/` when plan 1 is done. Each one ships working software on top of the previous plan.

| Plan | Stories | Decision | Adds |
| --- | --- | --- | --- |
| 2. Launcher and settings | US-002, US-004, US-005, US-006 | ADR-004 | `prdf`, known locations, the last set, the list of sets in `docs/prd` |
| 3. Read sections and items | US-008, US-009, US-010 | ADR-001 | The section page, the item view, and links between items, with no scripts |
| 4. Search | US-011, US-012 | ADR-003 | The SQLite FTS5 index with BM25 ranking, and a score from 0 to 100 |
| 5. Live updates | US-013 | ADR-005 | File events with a debounce and a polling fallback, within 2 seconds |
| 6. Export and themes | US-014 to US-025 | ADR-002 | PDF from themed HTML, the Word writer, print, themes, and the Draft gate |

Spike SPK-001 (Q-002) blocks no plan.
