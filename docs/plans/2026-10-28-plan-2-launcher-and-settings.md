---
date: 2026-10-28
slug: plan-2-launcher-and-settings
title: Plan 2, the prdf launcher, known locations, and the last set
epic: 01M61XNJ3ME272NXHFN3BS3541
items: [01M61XNJ81PQF626SXP9WX3KVX, 01M61XNJCGQ4NBRVQGV7FMCJ2V, 01M61XNJEQ6EERZRJYVAH4FH1H, 01M61XNJGZ7VDMBJZB37S0NA2P]
git_hash: "e3b7a88"
---

# Plan 2: the prdf launcher, known locations, and the last set

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The author starts the viewer with `prdf` from a terminal, the viewer reopens the last PRD set, and the author picks a PRD set from the known locations or from the sets in `docs/prd`.

**Architecture:** Three small Rust modules sit beside the plan 1 loader. `settings` keeps the known locations and the last set in one JSON file in the app config folder. `locate` finds PRD sets. `start` decides what the window shows at start, from the launcher's path and the settings. The app installs `prdf`, a shell launcher, after the author confirms. A single-instance plugin sends the path of a second launch to the open window.

**Tech Stack:** Plan 1, plus `tauri-plugin-single-instance 2`.

**Spec:** `docs/prd/prd-forge-viewer/` (PRD 0.6.1): FR-002, FR-021, FR-022, FR-024, NFR-008, TR-001, TR-012, WF-006, WF-010. Backlog stories US-002, US-004, US-005, US-006. Decision `projects/001-prd-forge-viewer/decisions/ARC-001-ADR-004-v1.1.md`, option 1.

## Global constraints

- All plan 1 constraints stay: macOS only (OUT-003), read-only on the PRD set (OUT-001), no network (NFR-005, NFR-006), no script runs (NFR-010), keyboard only (NFR-007).
- Settings live in one file, `settings.json`, in the operating system app config folder (ADR-004). Nothing goes in the PRD set folder.
- Known locations and the last set are not lost when the viewer restarts (NFR-008). Write the settings file to a temporary file and rename it.
- The viewer proposes the last set, and the author decides (TR-001, TR-012). Opening a different set replaces it.
- The launcher is installed only after the author confirms, and never replaces a `prdf` that the app did not write.
- UI words: "PRD set", "known locations", "Not found". WF-006 and WF-010 give the screens.

## Review focus

1. **A broken settings file.** The settings file holds bad JSON. Expect the viewer to start with empty settings and no crash. The test goes in Task 1.
2. **The same folder twice.** The author opens `/a/set` and then `/a/set/`. Expect one known location. The test goes in Task 1.
3. **A relative path.** The author runs `prdf docs/prd/x`. Expect the launcher to pass an absolute path. The test goes in Task 5.
4. **Clutter in `docs/prd`.** `docs/prd` holds a plain file and a folder with no `prd.md`. Expect both to be ignored. The test goes in Task 2.
5. **Another `prdf` on the PATH.** A file named `prdf` that the app did not write is already there. Expect no overwrite, and a message. The test goes in Task 5.

---

### Task 1: The settings store

Covers US-002 and US-005 (FR-002, FR-022, NFR-008).

**Files:**
- Create: `src-tauri/src/settings.rs`
- Modify: `src-tauri/src/lib.rs` (`pub mod settings;`)
- Test: in `settings.rs`

**Interfaces:**
- Produces: `#[derive(Serialize, Deserialize, Default, Debug, PartialEq, Clone)] pub struct Settings { #[serde(default)] pub known: Vec<String>, #[serde(default)] pub last: Option<String> }`.
- Produces: `pub fn load_settings(path: &Path) -> Settings`. A missing or bad file gives `Settings::default()`.
- Produces: `pub fn save_settings(path: &Path, s: &Settings) -> std::io::Result<()>`. It creates the parent folder, writes `settings.json.tmp`, and renames it.
- Produces: `pub fn remember(s: &mut Settings, folder: &str)`. It trims a trailing `/`, moves the folder to the front of `known` with no duplicate, and sets `last`.

- [ ] **Step 1: Write the failing tests.**
  - `missing_file_is_default`: `load_settings` of a path that does not exist returns `Settings::default()`.
  - `bad_json_is_default` (Review Focus 1): a file with `{not json` returns `Settings::default()`.
  - `survives_restart` (NFR-008): `remember` 3 folders, `save_settings`, then `load_settings` returns an equal value, with `last` the third folder.
  - `remember_moves_to_front`: `remember(a)`, `remember(b)`, `remember(a)` gives `known == [a, b]`.
  - `trailing_slash_is_one_location` (Review Focus 2): `remember("/x/set")` and `remember("/x/set/")` give one entry.
- [ ] **Step 2: Run them and see them fail.** Run `cargo test --manifest-path src-tauri/Cargo.toml settings`. Expected: FAIL, because the module does not exist.
- [ ] **Step 3: Implement** the four items in `settings.rs`.
- [ ] **Step 4: Run the tests.** Expected: PASS.
- [ ] **Step 5: Commit** with the US-002 ULID.

### Task 2: Find PRD sets

Covers US-005 and US-006 (FR-022, FR-024).

**Files:**
- Create: `src-tauri/src/locate.rs`
- Modify: `src-tauri/src/lib.rs` (`pub mod locate;`)
- Test: in `locate.rs`

**Interfaces:**
- Consumes: `split_front_matter`, `parse_header` (plan 1).
- Produces: `#[derive(Serialize, Debug, Clone, PartialEq)] #[serde(rename_all = "camelCase")] pub struct SetRef { pub folder: String, pub product: Option<String>, pub found: bool }`.
- Produces: `pub fn set_ref(folder: &Path) -> SetRef`. `found` is true when `folder/prd.md` exists. `product` is the root `product`, or its `title`, or `None` when the root cannot be read.
- Produces: `pub fn find_sets(dir: &Path) -> Vec<SetRef>`. It returns one `SetRef` for each direct subfolder of `dir/docs/prd` that has a `prd.md`, sorted by folder.

- [ ] **Step 1: Write the failing tests.** Build sets in a `TempDir` with a helper `fn make_set(dir: &Path, product: &str)` that writes a minimal `prd.md` with `id`, `kind: prd`, `title`, `status: draft`, `product`, and `links: {}`.
  - `set_ref_reads_product`: a set with product "Alpha" gives `SetRef { product: Some("Alpha"), found: true }`.
  - `set_ref_missing_is_not_found` (FR-022, criterion 3): a folder that does not exist gives `found: false` and `product: None`.
  - `finds_two_sets`: `docs/prd/a` and `docs/prd/b` give two refs, `a` first.
  - `ignores_clutter` (Review Focus 4): `docs/prd/notes.txt` and `docs/prd/empty/` give no ref.
- [ ] **Step 2: Run them and see them fail.** Expected: FAIL, because the module does not exist.
- [ ] **Step 3: Implement** `set_ref` and `find_sets`.
- [ ] **Step 4: Run the tests.** Expected: PASS.
- [ ] **Step 5: Commit** with the US-006 ULID.

### Task 3: Decide what the window shows at start

Covers US-002, US-004, US-005, and US-006 (FR-002, FR-021, FR-022, FR-024, TR-001, TR-012).

**Files:**
- Create: `src-tauri/src/start.rs`
- Modify: `src-tauri/src/lib.rs` (`pub mod start;`)
- Test: `src-tauri/tests/start.rs`

**Interfaces:**
- Consumes: `Settings` (Task 1), `SetRef`, `set_ref`, `find_sets` (Task 2).
- Produces: `#[derive(Serialize, Debug, PartialEq)] #[serde(tag = "kind", rename_all = "camelCase")] pub enum StartView { Open { folder: String }, Choose { folder: String, sets: Vec<SetRef>, known: Vec<SetRef> }, NotFound { folder: String, known: Vec<SetRef> }, Welcome { known: Vec<SetRef> } }`.
- Produces: `pub fn start_view(arg: Option<&Path>, settings: &Settings) -> StartView`. Rules, in order:
  1. No `arg`: `Open { last }` when `last` is set and its set is found (FR-002), else `Welcome`.
  2. `arg/prd.md` exists: `Open { arg }` (FR-021, criterion 2).
  3. `find_sets(arg)` gives one set: `Open` it (FR-021, criterion 1).
  4. It gives more than one: `Open { last }` when `last` is one of them (FR-024, criterion 2), else `Choose` (FR-024, criterion 1).
  5. It gives none: `NotFound` (FR-021, criterion 3).
- `known` is `settings.known` mapped with `set_ref`, in order.

- [ ] **Step 1: Write the failing tests**, with the Task 2 helper copied into the test file.
  - `last_set_reopens` (FR-002, criterion 1): no arg, and `last` is a real set. Expect `Open` of that set.
  - `last_set_gone_is_welcome`: no arg, and `last` is a deleted folder. Expect `Welcome`.
  - `path_of_a_set_opens` (FR-021, criterion 2): `arg` is a set folder. Expect `Open`.
  - `one_set_in_docs_prd_opens` (FR-021, criterion 1).
  - `no_set_is_not_found_with_known` (FR-021, criterion 3, and FR-022, criterion 1): two known sets "Alpha" and "Beta". Expect `NotFound` with both products in `known`.
  - `two_sets_and_no_last_is_choose` (FR-024, criterion 1): expect `Choose` with 2 sets.
  - `two_sets_and_last_opens_last` (FR-024, criterion 2): `last` is the second set. Expect `Open` of it.
- [ ] **Step 2: Run them and see them fail.** Run `cargo test --manifest-path src-tauri/Cargo.toml --test start`. Expected: FAIL.
- [ ] **Step 3: Implement** `StartView` and `start_view`.
- [ ] **Step 4: Run the tests.** Expected: PASS.
- [ ] **Step 5: Commit** with the US-004 ULID.

### Task 4: Commands, settings path, and the second launch

Covers US-002, US-004, and US-005.

**Files:**
- Modify: `src-tauri/src/commands.rs`, `src-tauri/src/lib.rs`, `src-tauri/Cargo.toml`
- Test: in `commands.rs`

**Interfaces:**
- Consumes: `load_set` (plan 1), Tasks 1 to 3.
- Produces: `pub fn open_and_remember(settings_path: &Path, folder: &str) -> Result<PrdSet, String>`. It loads the set, and only on success calls `remember` and `save_settings`.
- Produces: the commands `open_set(app: AppHandle, path: String) -> Result<PrdSet, String>` (async) and `startup(app: AppHandle, state: State<StartArg>) -> StartView` (async). `StartArg(Mutex<Option<PathBuf>>)` holds the path from the first launch, from `std::env::args().nth(1)`. `startup` takes it, so a reload does not reuse it.
- Produces: `fn settings_path(app: &AppHandle) -> PathBuf`, which is `app.path().app_config_dir()` joined with `settings.json`.
- Produces: the single-instance callback. On a second launch it computes `start_view(argv.get(1))`, emits the event `start` with the `StartView`, and focuses the main window.

- [ ] **Step 1: Write the failing tests.**
  - `open_remembers_on_success`: `open_and_remember` of the real set writes a settings file whose `last` is that folder.
  - `open_failure_remembers_nothing`: `open_and_remember` of an empty `TempDir` returns `Err`, and no settings file exists.
  - Keep the two plan 1 tests, changed to call `open_and_remember` with a temporary settings path.
- [ ] **Step 2: Run them and see them fail.** Expected: FAIL.
- [ ] **Step 3: Implement** the functions, add `tauri-plugin-single-instance = "2"`, register the plugin first in `run()`, manage `StartArg`, and register `startup`.
- [ ] **Step 4: Run all Rust tests.** Expected: PASS.
- [ ] **Step 5: Commit** with the US-002 ULID.

### Task 5: The prdf launcher

Covers US-004 (FR-021) and ADR-004.

**Files:**
- Create: `src-tauri/src/launcher.rs`
- Modify: `src-tauri/src/lib.rs`, `src-tauri/src/commands.rs` (command `install_prdf`)
- Test: in `launcher.rs`

**Interfaces:**
- Produces: `pub const MARKER: &str = "# prdf launcher for PRD Forge Viewer";`
- Produces: `pub fn launcher_script() -> String`. The script is:

```sh
#!/bin/sh
# prdf launcher for PRD Forge Viewer
target="${1:-$PWD}"
case "$target" in /*) ;; *) target="$PWD/$target" ;; esac
exec open -n -a "PRD Forge Viewer" --args "$target"
```

- Produces: `pub fn install_launcher(dir: &Path) -> Result<PathBuf, String>`. It writes `dir/prdf` with mode `0o755`. It returns `Err` when `dir/prdf` exists and does not contain `MARKER`.
- Produces: the command `install_prdf() -> Result<String, String>`. It installs to `~/.local/bin`, and the `Ok` text names the path and says whether `~/.local/bin` is on `PATH`.

- [ ] **Step 1: Write the failing tests.**
  - `script_has_marker_and_open`: the script contains `MARKER` and `open -n -a "PRD Forge Viewer" --args`.
  - `relative_path_made_absolute` (Review Focus 3): run the script with `sh -c` and a stub `open` on `PATH` that prints its arguments. From a `TempDir` as the current folder, `prdf docs/prd/x` prints an argument that starts with the `TempDir` path and ends with `/docs/prd/x`.
  - `installs_executable`: `install_launcher` writes a file with mode `0o755`.
  - `keeps_foreign_prdf` (Review Focus 5): a `prdf` with other content gives `Err`, and the file is unchanged.
  - `replaces_own_prdf`: a `prdf` that contains `MARKER` is replaced with no error.
- [ ] **Step 2: Run them and see them fail.** Expected: FAIL.
- [ ] **Step 3: Implement** the module and the command.
- [ ] **Step 4: Run the tests.** Expected: PASS.
- [ ] **Step 5: Commit** with the US-004 ULID.

### Task 6: The start screen and the app wiring

Covers US-002, US-004, US-005, and US-006, with WF-006 and WF-010.

**Files:**
- Create: `src/StartScreen.tsx`
- Modify: `src/types.ts`, `src/App.tsx`
- Test: `src/StartScreen.test.tsx`

**Interfaces:**
- Consumes: the commands `startup`, `open_set`, and `install_prdf`, and the event `start` (Task 4).
- Produces in `types.ts`: `SetRef { folder: string; product: string | null; found: boolean }` and `StartView`, a union on `kind`: `"open"`, `"choose"`, `"notFound"`, and `"welcome"`, with the fields of Task 3.
- Produces: `export function StartScreen(props: { view: Exclude<StartView, { kind: "open" }>; onOpen: (folder: string) => void }): JSX.Element`.
  - `notFound` (WF-006): the text "No PRD set in <folder>", then the heading "Known locations".
  - `choose` (WF-010): the text "More than one PRD set in <folder>. Select one.", the sets, then "Known locations".
  - `welcome`: "Known locations", or "No known locations yet" when the list is empty.
  - Each found set or location is a `button` with its product name and folder. A location with `found: false` shows "Not found" and is not a button.
- `App.tsx`: on mount it calls `startup`. `open` calls `open_set`. Other kinds show `StartScreen`. It listens for `start`. The toolbar gets **Install prdf command**, which asks with the dialog `ask` and then calls `install_prdf` and shows its text. Add `dialog:allow-ask` to the capability.

- [ ] **Step 1: Write the failing tests.**
  - `not_found_lists_known` (FR-021, criterion 3, FR-022, criterion 1): HTML contains "No PRD set in /work", "Alpha", and "Beta".
  - `missing_location_marked` (FR-022, criterion 3): a known ref with `found: false` shows "Not found" and has no `button` with its folder.
  - `choose_lists_sets_above_known` (FR-024, criterion 1): "Gamma" (a set) comes before "Alpha" (a known location).
  - `welcome_empty`: an empty known list shows "No known locations yet".
- [ ] **Step 2: Run them and see them fail.** Expected: FAIL.
- [ ] **Step 3: Implement** `StartScreen`, the types, and the wiring in `App.tsx`.
- [ ] **Step 4: Run all checks.** Run `bun run typecheck && bun test src && cargo test --manifest-path src-tauri/Cargo.toml`. Expected: all pass.
- [ ] **Step 5: Commit** with the EPIC-001 ULID.

### Task 7: Check by hand

Covers SC-006 and SC-009.

- [ ] **Step 1: Build the app.** Run `bun run tauri build`. Expected: `PRD Forge Viewer.app` in `src-tauri/target/release/bundle/macos/`.
- [ ] **Step 2: Install and check.** Copy the app to `/Applications`, open it, and select **Install prdf command**. In a terminal, run `prdf` in this repository. Expected: the list of the two sets in `docs/prd` (WF-010), with no set open. Select one, quit, and run `prdf` again. Expected: that set opens (FR-024, criterion 2). Run `prdf /tmp`. Expected: "No PRD set in /tmp" and the known locations (WF-006).

---

## Later plans

Plans 3 to 6 stay as plan 1 lists them.
