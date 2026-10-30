---
wiki_key: design/current-code-walkthrough
doc_type: design
truth_state: current
generated_at: 2026-10-30T18:47:02Z
tag: v0.2.0
git_hash: d91ffd3718d28c0ab4a2e1d72c573581d9854e38
branch: docs-0.2.0-design
roadmap: docs/roadmap.md
---

# PRD Forge Viewer code walkthrough

This walkthrough is the guided tour of the code at tag `v0.2.0` (commit
`d91ffd3`). Every listing is quoted from that commit and cites `path:line`.
The design document in `docs/designs/current_design_doc.md` gives the
architecture. Where the code and the design documents differ, the code wins and
section 6 reports the gap.

## 1. orientation

### 1.1 The system in three sentences

The PRD Forge Viewer is a read-only macOS desktop app that opens a PRD Forge
set, shows its documents, grades, and items, and searches them. A Rust core
reads every file, checks every path, keeps a SQLite full-text index, and
watches the set for changes. A React UI renders the content safely, shows each
diagram as a drawing that opens in a zoom and pan window, and builds themed PDF
and Word exports with the diagrams as images, which the Rust core writes outside
the set.

### 1.2 Directory map

| Path | What lives there | Why |
|------|------------------|-----|
| `src-tauri/src/lib.rs` | App builder, plugins, managed state, command list | The one place that wires Tauri. |
| `src-tauri/src/commands.rs` | All 16 Tauri commands | The only IPC surface. Thin wrappers over the modules. |
| `src-tauri/src/prdset/` | Front matter, set, item, and section parsing | Pure code with no Tauri import, so it is easy to test. |
| `src-tauri/src/search.rs` | FTS5 index and BM25 ranking | ADR-003. |
| `src-tauri/src/watch.rs` | File watcher | ADR-005. |
| `src-tauri/src/export.rs` | Export path guard, file writes, headless Chrome | ADR-002 and OUT-001. |
| `src-tauri/src/settings.rs`, `start.rs`, `locate.rs`, `launcher.rs` | Settings file, start view, set discovery, `prdf` | ADR-004. |
| `src-tauri/tests/` | Rust integration tests | Start rules and set loading through the public API. |
| `src/App.tsx` | All UI state and every IPC call | The only UI file that imports Tauri. |
| `src/*.tsx` | Views and dialogs | Pure components with props. |
| `src/renderBody.ts` | Markdown to safe HTML | NFR-010. |
| `src/bodyClean.ts` | Removes the details block and each wireframe sketch that a drawing follows | One rule set for the viewer and the export, copied from `prd_export.py`. |
| `src/DiagramViewer.tsx`, `src/zoom.ts` | Diagram window and its zoom math | The math is pure, so a unit test covers it. |
| `src/styles.css` | Color tokens, dark mode, fonts, layout | The 0.2.0 visual design. |
| `src/export*.ts`, `src/themes.ts` | Export model, Motion block model, HTML and Word writers, fonts, themes | ADR-002. |
| `public/fonts/` | Source Serif 4, Source Sans 3, Source Code Pro | Embedded in every export. |
| `e2e/` | MCP-driven checks of the debug build | One check per PRD acceptance criterion. |
| `scripts/build.ts` | Bun bundle of the UI into `dist/` | Used by Tauri `beforeBuildCommand`. |

### 1.3 Architecture in one diagram

The diagram follows the real imports and `invoke` calls.

```mermaid
---
title: Call graph from the UI to the file system
---
flowchart LR
    subgraph ui[src/]
        App[App.tsx]
        SP[SectionPage.tsx]
        RB[renderBody.ts]
        BC[bodyClean.ts]
        DV[DiagramViewer.tsx]
        Z[zoom.ts]
        ER[exportRun.ts]
        EM[exportModel.ts]
        EH[exportHtml.ts]
        ED[exportDocx.ts]
    end
    subgraph rs[src-tauri/src/]
        C[commands.rs]
        L[prdset/load.rs]
        S[prdset/section.rs]
        I[prdset/items.rs]
        Q[search.rs]
        W[watch.rs]
        X[export.rs]
        ST[settings.rs]
        SV[start.rs]
    end
    App -->|invoke| C
    App --> SP --> RB --> BC
    SP --> DV --> Z
    App --> ER --> EM --> BC
    ER --> EH
    ER --> ED
    C --> L
    C --> S --> I
    C --> Q --> S
    C --> W
    C --> X
    C --> ST
    C --> SV
    W -.->|set-changed| App
```

## 2. Execution-order tour

### 2.1 Process start

The binary calls the library. `run()` reads the first argument, registers two
plugins, three state values, and the commands
(`src-tauri/src/lib.rs:15-50`).

```rust
let first_arg = std::env::args().nth(1).map(std::path::PathBuf::from);
tauri::Builder::default()
    // A second launch (prdf while the viewer is open) sends its path to this window.
    .plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {
        let settings = settings::load_settings(&commands::settings_path(app));
        let view = start::start_view(argv.get(1).map(std::path::Path::new), &settings);
        let _ = app.emit("start", view);
```

`src-tauri/src/lib.rs:16-22`

- **Receives.** The process arguments. `prdf` passes the folder as the first
  argument (`src-tauri/src/launcher.rs:13-15`).
- **Why.** `prdf` runs `open -n`, which always starts a new process. The
  single-instance plugin turns that process into an event on the open window,
  so the author has one window.
- **Can fail.** `.expect("error while running the PRD Forge Viewer")` ends the
  process if Tauri cannot start (`src-tauri/src/lib.rs:49`).

The MCP test bridge is compiled in only with the `mcp-bridge` feature and binds
to `127.0.0.1` (`src-tauri/src/lib.rs:35-39`).

### 2.2 The UI asks what to show

On mount, `App` loads the themes and calls `startup`
(`src/App.tsx:114-121`).

```tsx
void invoke<StartView>("startup").then(showStart);
const unlisten = listen<StartView>("start", (e) => showStart(e.payload));
```

`src/App.tsx:116-117`

`startup` takes the stored argument once, so a page reload does not reopen the
launch folder (`src-tauri/src/commands.rs:33-37`).

```rust
pub fn startup(app: AppHandle, arg: State<StartArg>) -> StartView {
    let arg = arg.0.lock().unwrap().take();
    start_view(arg.as_deref(), &load_settings(&settings_path(&app)))
}
```

`src-tauri/src/commands.rs:34-37`

### 2.3 The start rules

`start_view` is the decision table of FR-002, FR-021, FR-022, and FR-024
(`src-tauri/src/start.rs:22-47`).

```rust
let arg = &canon(arg);
let folder = arg.display().to_string();
if arg.join("prd.md").is_file() {
    return StartView::Open { folder };
}
let sets = find_sets(arg);
match sets.len() {
    0 => StartView::NotFound { folder, known: known(settings) },
    1 => StartView::Open { folder: sets[0].folder.clone() },
    _ => match sets.iter().find(|s| Some(s.folder.as_str()) == last) {
        Some(s) => StartView::Open { folder: s.folder.clone() },
        None => StartView::Choose { folder, sets, known: known(settings) },
    },
}
```

`src-tauri/src/start.rs:33-46`

- **Why canonical paths.** `prdf .` and a symlinked folder must match the saved
  last set, which `open_and_remember` stores in canonical form
  (`src-tauri/src/start.rs:23-26`, `src-tauri/src/commands.rs:17`).
- **Returns.** A tagged enum. Serde writes it as `{ "kind": "choose", ... }`
  in camel case (`src-tauri/src/start.rs:8-9`), which matches the `StartView`
  union in `src/types.ts:38-42`.

In the UI, `showStart` either opens the folder or shows `StartScreen`
(`src/App.tsx:79-87`).

### 2.4 Open a set

`open_and_remember` loads first and saves the settings only on success
(`src-tauri/src/commands.rs:16-24`).

```rust
let folder = std::fs::canonicalize(folder).map(|p| p.display().to_string()).unwrap_or_else(|_| folder.to_string());
let set = load_set(Path::new(&folder)).map_err(|e| e.to_string())?;
// ponytail: a failed save only loses the reopen; it must not stop the set from opening.
if let Err(e) = update_settings(settings_path, |s| remember(s, &folder)) {
    eprintln!("settings not saved to {}: {e}", settings_path.display());
}
Ok(set)
```

`src-tauri/src/commands.rs:17-23`

`load_set` reads only front matter. It puts the root first, sorts the children
by `order`, and turns a child that fails to read into an `unreadable` entry
instead of an error (`src-tauri/src/prdset/load.rs:91-129`).

```rust
for child in children {
    let file = child.path.trim_start_matches("./").to_string();
    let order = child.order.unwrap_or(0);
    documents.push(match read_header(&dir.join(&file)) {
        Ok(h) => entry(file, &h, order),
        Err(why) => DocEntry {
            file,
            title: child.title,
            section: child.section,
            order,
            status: "unreadable".into(),
            grade: None,
            unreadable: Some(why),
        },
    });
}
```

`src-tauri/src/prdset/load.rs:106-121`

- **Why.** FR-003 says a set with a broken section still opens, and the broken
  file is named.
- **Can fail.** Only a missing or unreadable root fails the whole open
  (`src-tauri/src/prdset/load.rs:92-96`).

Front matter parsing strips a BOM and CRLF line ends before it looks for the
fences (`src-tauri/src/prdset/header.rs:52-60`).

### 2.5 Per-set setup in the UI

A change of `set.folder` resets the page and starts three calls
(`src/App.tsx:43-54`).

```tsx
if (set) {
    void invoke("watch_set", { folder: set.folder }).catch((e) => setError(`Live updates are off: ${e}`));
    void invoke<ItemRef[]>("item_index", { folder: set.folder }).then(setIndex).catch(() => setIndex([]));
    void invoke<Category[]>("categories", { folder: set.folder }).then(setCategories).catch(() => setCategories([]));
}
```

`src/App.tsx:49-53`

The overview shows `SetOverview` and `GradesTable`. `GradesTable` lists every
document with a section number, and shows "Not graded" for a document with no
score (`src/GradesTable.tsx:4-37`).

### 2.6 Read a section

`read_section` checks the file against the root's list first, then reads it
through `inside` (`src-tauri/src/prdset/section.rs:57-73`).

```rust
pub(crate) fn inside(dir: &Path, rel: &str) -> Result<std::path::PathBuf, String> {
    let root = fs::canonicalize(dir).map_err(|e| e.to_string())?;
    let path = fs::canonicalize(root.join(rel)).map_err(|_| format!("{rel} was not found"))?;
    if path.starts_with(&root) { Ok(path) } else { Err(format!("{rel} is outside the PRD set")) }
}
```

`src-tauri/src/prdset/section.rs:35-39`

- **Why two checks.** `listed` limits reads to the documents of the set.
  `inside` stops a listed `../outside.md` or a symlink that points out of the
  folder (NFR-010).
- **Returns.** A `Section` with the body Markdown and every item from
  `items_of` (`src-tauri/src/prdset/section.rs:62-72`).

`items_of` walks the front matter tree. A mapping with an item ID becomes an
`Item`, and its children record it as `parent`
(`src-tauri/src/prdset/items.rs:75-97`).

```rust
let here = id.as_deref().or(parent);
for (_, child) in m {
    walk(child, here, out);
}
```

`src-tauri/src/prdset/items.rs:89-92`

In the UI, `SectionPage` renders the body once per section and then loads
images (`src/SectionPage.tsx:66-85`).

```tsx
for (const img of Array.from(el.querySelectorAll<HTMLImageElement>("img[data-asset]"))) {
    const rel = img.dataset.asset!;
    img.removeAttribute("data-asset");
    loadAsset?.(rel).then((url) => (img.src = url)).catch(() => img.replaceWith(`[image not found: ${img.alt}]`));
}
```

`src/SectionPage.tsx:72-76`

`read_asset` returns the image as a `data:` URL, which the CSP allows
(`src-tauri/src/prdset/section.rs:87-98`, `src-tauri/tauri.conf.json:22`).

#### Open a diagram

The same click listener that follows `.md` links also opens diagrams. It
finds the `img` inside the nearest `[data-diagram]` button and stores its `src`
and alt text (`src/SectionPage.tsx:77-82`).

```tsx
const img = (e.target as HTMLElement).closest<HTMLElement>("[data-diagram]")?.querySelector("img");
if (img?.src) setDiagram({ src: img.src, alt: img.alt });
```

`src/SectionPage.tsx:80-81`

- **Why `img.src`.** By the time of the click, `src` is the `data:` URL that
  `read_asset` returned, so the window needs no second read.
- **Can fail.** When the image did not load, the `img` was replaced by text,
  and the click does nothing.

`DiagramViewer` renders the image in a stage and moves it with one CSS
transform (`src/DiagramViewer.tsx:69-70`). The zoom math lives in `zoom.ts`:

```ts
export function zoomAt(v: View, factor: number, px: number, py: number): View {
    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale * factor));
    const k = scale / v.scale;
    return { scale, x: px - (px - v.x) * k, y: py - (py - v.y) * k };
}
```

`src/zoom.ts:16-20`

- **Why this formula.** The content point under the pointer is
  `(px - x) / scale`. Scaling the offset from the pointer by `k` keeps that
  point the same, so the diagram zooms about the pointer.
- **Input.** The wheel sends `exp(-deltaY * 0.002)`, or `exp(-deltaY * 0.01)`
  for a pinch, which arrives with `ctrlKey` (`src/DiagramViewer.tsx:34-38`).
- **Close.** Escape fires `cancel`. The handler prevents the native close and
  calls `onClose`, so the state in `SectionPage` stays the only record
  (`src/DiagramViewer.tsx:59`).

### 2.7 Render a body safely

`renderBody` cleans the Markdown, rewrites images and links while Marked
renders, then runs DOMPurify (`src/renderBody.ts:11-25`,
`src/renderBody.ts:35-56`).

```ts
const DETAILS = /<!-- prd-forge:details -->[\s\S]*?<!-- \/prd-forge:details -->\n?/g;
// ponytail: the next non-blank line must be an image; prd_export.py also checks that the file exists.
const SKETCH = /^```wireframe\n[\s\S]*?^```\n(?=\s*!\[[^\]]*\]\([^)\s]+\)\s*$)/gm;

export const cleanBody = (md: string) => md.replace(DETAILS, "").replace(SKETCH, "");
```

`src/bodyClean.ts:6-10`

- **Why a lookahead.** The image line stays in the body. Only the sketch
  above it goes. A sketch with no drawing after it stays, so no content is
  lost.
- **Why one module.** `renderBody` and `buildExport` both call it
  (`src/renderBody.ts:52`, `src/exportModel.ts:40`), so the screen and the
  export cannot disagree.

A local image becomes a button that opens the diagram window:

```ts
if (remote(href)) return `<span class="image-blocked">[image: ${esc(text || "remote image")}]</span>`;
// A local image is a button that opens it in the diagram window, with its alt text as a caption.
return `<button type="button" class="diagram" data-diagram aria-label="Open diagram: ${esc(text || "image")}"><img data-asset="${esc(href.replace(/^\.\//, ""))}" alt="${esc(text)}"><span class="caption">${esc(text)}</span></button>`;
```

`src/renderBody.ts:14-16`

```ts
purify.addHook("afterSanitizeAttributes", (node) => {
    if (node.nodeName === "IMG") {
        const src = node.getAttribute("src");
        node.removeAttribute("src");
        if (src && !remote(src)) node.setAttribute("data-asset", src.replace(/^\.\//, ""));
    }
    if (node.nodeName === "A") node.removeAttribute("href");
});
```

`src/renderBody.ts:43-50`

- **Why the hook.** Raw HTML in a body skips the Marked renderer. The hook
  catches raw `<img>` and `<a>` too, inside the sanitizer, so nothing changes
  its output afterwards.
- **Can fail.** With no working DOMPurify, the function returns the Markdown as
  plain text in `<pre>` (`src/renderBody.ts:38-42`).

### 2.8 Follow a reference

`linkify` splits text on the ID pattern. Each odd part is an ID, and it becomes
a button only when the item index knows it (`src/SectionPage.tsx:9-17`). The
click goes to `openItem`, which looks up the file in the index
(`src/App.tsx:65-68`).

```tsx
const openItem = useCallback((id: string) => {
    const ref = index.find((r) => r.id === id);
    if (ref) void openDoc(ref.file, id);
}, [index, openDoc]);
```

`src/App.tsx:65-68`

### 2.9 search

The `search` command passes the index path and the set to `SearchState`
(`src-tauri/src/commands.rs:69-72`). `SearchState::with` keeps one index open,
refreshes it before every query, and rebuilds it once on any error
(`src-tauri/src/search.rs:179-197`).

```rust
let (_, ix) = slot.as_mut().unwrap();
let first = ix.refresh().and_then(|_| f(ix));
if let Ok(v) = first {
    return Ok(v);
}
// The index is derived data: when it fails, delete it, build it again, and try once more.
*slot = None;
remove_files(db);
let mut ix = Index::open(db, set)?;
ix.refresh()?;
```

`src-tauri/src/search.rs:184-193`

`refresh` hashes front matter and body with FNV-1a and skips a document whose
hash is unchanged (`src-tauri/src/search.rs:96-104`). The query quotes each
word, so `NEAR`, `AND`, `*`, and quotes in the term are plain text
(`src-tauri/src/search.rs:66-69`).

```rust
"SELECT id, title, file, section, kind, bm25(items, 50.0, 10.0, 1.0) AS rank FROM items
 WHERE items MATCH ?1 AND (?2 = 'all' OR kind = ?2) ORDER BY rank, rowid LIMIT 200",
```

`src-tauri/src/search.rs:143-144`

The weights make an ID match count most, then the title, then the text. This
is FR-008 criterion 3. `bm25()` is lower for a better match, so the score is
`|rank| / |best| * 100` (`src-tauri/src/search.rs:157-159`).

### 2.10 Live changes

`watch_set` clears the slot first, so the old watcher drops before the new one
starts (`src-tauri/src/commands.rs:146-158`).

```rust
let mut slot = state.0.lock().unwrap_or_else(|e| e.into_inner());
*slot = None;
let Some(folder) = folder else { return Ok(()) };
```

`src-tauri/src/commands.rs:149-151`

`SetWatcher::start` runs an OS event watcher and a 1 s poll at the same time
(`src-tauri/src/watch.rs:82-88`).

```rust
let on = only_new_content(root, on_change);
let events = start_with::<RecommendedWatcher>(folder, Default::default(), on.clone()).ok();
let poll = Self::poll_every(folder, Duration::from_secs(1), on)?;
```

`src-tauri/src/watch.rs:84-86`

- **Why both.** File events can stop with no error, for example in a sandbox.
  The poll keeps NFR-002 (`src-tauri/src/watch.rs:80-81`).
- **Why the content filter.** Both watchers see each save. `only_new_content`
  passes a file on only when its hash differs from the last one passed on, so
  the UI reloads once (`src-tauri/src/watch.rs:44-77`).
- **Can fail.** An OS watcher that fails to start is ignored (`.ok()`). A poll
  that fails to start fails the command.

In the UI, the listener drops a reply when a later event or another set has
arrived (`src/App.tsx:95-100`).

```tsx
const mine = ++seq;
// A later change, or another set, wins over this one.
const stale = () => mine !== seq || current.current.set?.folder !== open.folder;
setChanged((c) => applyChange(c, e.payload.files));
const fresh = await invoke<PrdSet>("reload_set", { folder: open.folder }).catch(() => undefined);
if (stale()) return;
```

`src/App.tsx:95-100`

`reloadedPage` keeps the selected item when the new version still has it, and
goes back to the overview with a message when the section is gone
(`src/live.ts:16-19`).

### 2.11 export

`runExport` asks for the save path before any work. Cancel returns `false`, and
the dialog says "Export cancelled. Nothing was saved."
(`src/exportRun.ts:57-64`, `src/ExportDialog.tsx:48`).

```ts
const path = await deps.save(format, exportFileName(set, format));
if (!path) return false;
const { markdown, images, title, fonts } = await themedExport(set, selected, options, deps);
if (format === "pdf") await deps.writePdf(path, renderThemedHtml(markdown, theme, title, fontFaceCss(fonts), images));
else await deps.writeDocx(path, toBase64(new Uint8Array(await (await exportDocx(markdown, theme, title, fonts, images)).arrayBuffer())));
return true;
```

`src/exportRun.ts:58-63`

`options` comes from the **Include grades** box in `ExportDialog`, which is
clear by default (`src/ExportDialog.tsx:22`, `src/ExportDialog.tsx:89-90`).
`buildExport` writes the first page, the contents table, and the selected
sections in reading order (`src/exportModel.ts:20-43`). The grade columns are
in the contents table only when the author includes them:

```ts
options.grades
    ? "| Section | Status | Score | Blocking defects |\n| --- | --- | --- | --- |\n" +
      docs.map((d) => `| ${cell(d.title)} | ${d.status} | ${d.grade?.score ?? "not graded"} | ${d.grade?.blocking ?? "not graded"} |`).join("\n")
    : "| Section | Status |\n| --- | --- |\n" + docs.map((d) => `| ${cell(d.title)} | ${d.status} |`).join("\n"),
```

`src/exportModel.ts:30-33`

`themedExport` then loads the images that the Markdown names
(`src/exportRun.ts:51-54`):

```ts
export async function loadImages(md: string, asset: (rel: string) => Promise<string>): Promise<Map<string, string>> {
    const local = [...new Set([...md.matchAll(IMAGE)].map((m) => m[2] ?? "").filter((p) => p && !/^[a-z][a-z0-9+.-]*:/i.test(p)))];
    const pairs = await Promise.all(local.map(async (p) => [p, await asset(p.replace(/^\.\//, "").replace(/\.svg$/i, ".png")).catch(() => null)] as const));
    return new Map(pairs.filter((x): x is readonly [string, string] => !!x[1]));
}
```

`src/exportRun.ts:36-40`

- **Why the PNG.** The PRD Forge exporter embeds the PNG that it renders next
  to each SVG. Word needs a raster image, and the same PNG keeps the PDF and
  Word output the same.
- **Why a map.** The `data:` URLs stay out of the Markdown, which stays small
  to parse (`src/exportRun.ts:31-35`).
- **Can fail.** A missing PNG is not in the map. The HTML writer then prints
  the alt text, and the Word writer prints it in italics
  (`src/exportHtml.ts:75-79`, `src/exportDocx.ts:80`).

Both writers start from the same block list from `markdownToBlocks`
(`src/exportBlocks.ts:32-40`). A paragraph that holds only an image is an
`image` block (`src/exportBlocks.ts:57-62`). Word reads the PNG size from the
`IHDR` chunk and scales it down to fit 6.0 by 8.0 inches
(`src/exportDocx.ts:66-76`).

On the Rust side, both export commands build the list of known sets from the
open set and the settings file, not only from the window
(`src-tauri/src/commands.rs:120-123`).

```rust
fn known_sets(app: &AppHandle, folder: &str) -> Vec<PathBuf> {
    let s = load_settings(&settings_path(app));
    std::iter::once(folder.to_string()).chain(s.known).chain(s.last).map(PathBuf::from).collect()
}
```

`src-tauri/src/commands.rs:120-123`

`outside_set` then refuses any path in those sets
(`src-tauri/src/export.rs:10-21`). `export_pdf` writes the HTML to a job folder
in the app cache, runs Chrome with no network, and renames the result over the
target (`src-tauri/src/export.rs:65-98`).

```rust
.args(["--headless", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--disable-background-networking", "--disable-sync"])
.args(["--no-pdf-header-footer", "--generate-pdf-document-outline", "--proxy-server=127.0.0.1:9", "--proxy-bypass-list=<-loopback>"])
```

`src-tauri/src/export.rs:74-75`

- **Why Chrome.** The macOS web view writes a PDF with no structure tree, so it
  cannot meet NFR-009. Chrome writes a tagged PDF with an outline (ADR-002
  implementation note).
- **Can fail.** No Chrome, a non-zero exit, or more than 60 s. In each case
  the code removes the temp file, and an earlier export at the path stays
  (`src-tauri/src/export.rs:32-39`, `src-tauri/src/export.rs:83-93`).

Print reuses the same HTML. `runPrint` puts the body in a hidden `#print-root`,
adds print-only CSS, and calls `print_page`, which calls `window.print()`
(`src/exportRun.ts:75-92`, `src-tauri/src/commands.rs:135-137`).

### 2.12 Themes and settings

`ThemeDialog` edits only custom themes and blocks the save while any theme has
a blank name or a bad hex color (`src/ThemeDialog.tsx:25-30`,
`src/ThemeDialog.tsx:71`). `save_themes` calls `update_settings`, which holds a
process-wide lock across load, change, and save
(`src-tauri/src/settings.rs:50-56`).

```rust
pub fn update_settings(path: &Path, change: impl FnOnce(&mut Settings)) -> io::Result<()> {
    static LOCK: std::sync::Mutex<()> = std::sync::Mutex::new(());
    let _guard = LOCK.lock().unwrap_or_else(|e| e.into_inner());
    let mut s = load_settings(path);
    change(&mut s);
    save_settings(path, &s)
}
```

`src-tauri/src/settings.rs:50-56`

`save_settings` writes a unique temp file and renames it, so a crash never
leaves half a file (`src-tauri/src/settings.rs:38-46`). When the UI reads the
themes back, `sanitizeCustomThemes` drops anything that is not a valid custom
theme (`src/themes.ts:161-173`).

### 2.13 install `prdf`

After a confirm dialog (`src/App.tsx:142-145`), `install_prdf` writes
`~/.local/bin/prdf` and says whether that folder is on `PATH`
(`src-tauri/src/commands.rs:82-92`). `install_launcher` replaces only a file
that it wrote itself (`src-tauri/src/launcher.rs:21-35`).

```rust
if let Ok(meta) = fs::symlink_metadata(&path) {
    let ours = !meta.file_type().is_symlink()
        && fs::read(&path).map(|b| b.windows(MARKER.len()).any(|w| w == MARKER.as_bytes())).unwrap_or(false);
    if !ours {
        return Err(format!("{} already exists and is not the PRD Forge Viewer launcher. It was not changed.", path.display()));
    }
}
```

`src-tauri/src/launcher.rs:24-30`

### 2.14 Automation paths

There is no CI workflow in the repository at this tag. The automation is:

- `bun test src` for the UI unit tests (`package.json:9`).
- `cargo test` for the Rust tests.
- `bun run test:e2e`, which builds the MCP test build and runs each file in
  `e2e/checks/` in its own process (`e2e/run.mjs:1-15`).

The test build defines `__PFV_E2E__` as `true`
(`src-tauri/tauri.mcp.conf.json:3`, `scripts/build.ts:17`). Only then does the
UI read `window.__pfvSavePath` and `window.__pfvPrint`, because the checks
cannot drive the macOS save and print dialogs (`src/App.tsx:130-140`).

## 3. Load-bearing invariants

| Invariant | Enforced at | What breaks if it is violated |
|-----------|-------------|-------------------------------|
| The viewer never writes into a known PRD set. | `src-tauri/src/export.rs:10-21`, `src-tauri/src/commands.rs:120-123` | OUT-001. An export could overwrite a section. |
| An export write goes to a temp file and a rename, never through a link. | `src-tauri/src/export.rs:32-39` | A symlink or hard link at the target could change a set file. |
| Every read resolves inside the set folder. | `src-tauri/src/prdset/section.rs:35-39` | A child path or image could read any file on the Mac. |
| Only documents that the root lists are read as sections. | `src-tauri/src/prdset/section.rs:48-60` | Grade files and other files would open as sections. |
| A body is sanitized before it reaches the DOM. | `src/renderBody.ts:35-56` | NFR-010. A script or a remote load in a body. |
| Only `App.tsx` calls Tauri. | `src/App.tsx:2-4` | Components stop being testable without Tauri. |
| Settings change under one lock, with an atomic save. | `src-tauri/src/settings.rs:38-56` | A theme save and a set open could lose each other's change (NFR-008). |
| A built-in theme ID is never stored. | `src-tauri/src/settings.rs:26-30`, `src/themes.ts:133-139` | A custom theme could replace Clay or Ice Snowstorm (FR-017, FR-018). |
| The index is derived data. | `src-tauri/src/search.rs:189-196` | Do not store anything in it that cannot be rebuilt. |
| One watcher at a time, and the last `watch_set` wins. | `src-tauri/src/commands.rs:143-158` | Events from an old set would reload the wrong set. |
| The search term is never FTS syntax. | `src-tauri/src/search.rs:66-69` | A term such as `(export` would be a query error. |
| `src/types.ts` matches the serde output of the Rust types. | By hand only | The UI reads `undefined` with no compile error. |

## 4. Tests as executable specification

### 4.1 A listed path outside the set is refused

```rust
fn listed_paths_outside_the_set_are_refused() {
    let d = set_with_outside_files();
    let set = d.path().join("set");
    assert!(read_section(&set, "../outside.md").is_err());
    assert!(read_section(&set, "linked.md").is_err());
    assert!(!item_index(&set).iter().any(|r| r.file.contains("outside") || r.file.contains("linked")));
}
```

`src-tauri/src/prdset/section.rs:155-161`

**Rule.** A root that lists `../outside.md` or a symlink out of the folder
cannot make the viewer read that file, by section or by index. **Catches.** A
change that drops `inside` from `read`.

### 4.2 An ID match ranks first, and a title beats text

```rust
fn title_match_ranks_above_text_match() {
    let d = TempDir::new().unwrap();
    small_set(&d.path().join("s"), "Mentions export once");
    let mut ix = Index::open(&d.path().join("ix.sqlite"), &d.path().join("s")).unwrap();
    ix.refresh().unwrap();
    let ids: Vec<_> = ix.search("export", "all").unwrap().into_iter().map(|h| h.id).collect();
    assert_eq!(ids, vec!["FR-002", "FR-001"]);
}
```

`src-tauri/src/search.rs:249-256`

**Rule.** FR-008 criterion 3. **Catches.** A change to the `bm25()` weights.
The companion test `an_id_search_puts_that_item_first` covers the ID column
(`src-tauri/src/search.rs:336-339`).

### 4.3 A broken index is rebuilt, even when it is open

```rust
for breakage in ["DROP TABLE items", "DELETE FROM items_data WHERE id > 10"] {
```

`src-tauri/src/search.rs:343`

**Rule.** Search recovers from a damaged index in a fresh state and in a state
that already holds the open index (`src-tauri/src/search.rs:342-353`).
**Catches.** A change that removes the retry in `SearchState::with`.

### 4.4 Two watchers, one reload, and no lost last save

```rust
fs::write(d.path().join("04.md"), "first").unwrap();
on(vec!["04.md".into()]);
fs::write(d.path().join("04.md"), "second").unwrap();
on(vec!["04.md".into()]);
on(vec!["04.md".into()]); // the other watcher sees the same save
assert_eq!(rx.try_iter().count(), 2);
```

`src-tauri/src/watch.rs:129-134`

**Rule.** The same content passed twice reloads once. New content always
reloads. **Catches.** A filter on time instead of content, which would drop the
last save of a burst.

### 4.5 A link at the export target is replaced, not written through

```rust
fs::write(s.join("08.md"), "set file").unwrap();
std::os::unix::fs::symlink(s.join("08.md"), d.path().join("out.docx")).unwrap();
fs::hard_link(s.join("08.md"), d.path().join("hard.docx")).unwrap();
write_export(&[s.clone()], &d.path().join("out.docx"), b"export").unwrap();
write_export(&[s.clone()], &d.path().join("hard.docx"), b"export").unwrap();
assert_eq!(fs::read_to_string(s.join("08.md")).unwrap(), "set file");
```

`src-tauri/src/export.rs:148-153`

**Rule.** OUT-001 holds even when the target is a link into the set.
**Catches.** A change from rename to `fs::write` on the target.

### 4.6 Every remote load path in a body is removed

```ts
const html = renderBody(md, win);
expect(html).not.toContain("example.com");
```

`src/renderBody.test.ts:49-50`

**Rule.** NFR-010 for `srcset`, `<picture>`, SVG `<image>`, `background`,
`poster`, media, `<input type="image">`, raw `<img>`, and raw `<a>`
(`src/renderBody.test.ts:37-51`). **Catches.** A removed entry in
`FORBID_TAGS` or `FORBID_ATTR`.

### 4.7 Parallel opens and theme saves lose nothing

`theme_saves_and_opens_in_parallel_lose_nothing` runs eight threads, half
opening a set and half saving a theme, then checks that both changes are in
the file (`src-tauri/src/commands.rs:215-238`). **Rule.** NFR-008.
**Catches.** A removed lock in `update_settings`.

### 4.8 The export never says approved, and Draft follows status

The export model tests name their rule: `tr_005_draft_unless_every_document_is_final`,
`tr_007_the_export_never_says_approved`, and
`tr_010_a_blocking_defect_does_not_stop_the_export`
(`src/exportModel.test.ts:29`, `src/exportModel.test.ts:69`,
`src/exportModel.test.ts:74`).

### 4.9 End-to-end checks

Each e2e check is named after the PRD criterion it proves. Examples:
"FR-024 two sets and a last set reopens the last one"
(`e2e/checks/plans-1-2.mjs:73`), "NFR-002: 20 saves each show within 2 s"
(`e2e/checks/phase-3-live.mjs:44`), and "OUT-001: an export into the set
folder is refused" (`e2e/checks/phase-5-export.mjs:237`).

### 4.10 A sketch goes only when a drawing follows it

```ts
test("a_wireframe_sketch_with_no_drawing_stays", () => {
    const md = `${sketch}\n\nNo drawing here.\n`;
    expect(cleanBody(md)).toContain("```wireframe");
});
```

`src/bodyClean.test.ts:14-17`

- **Rule.** `cleanBody` never removes a sketch that has no drawing, so no
  content is lost. The test beside it proves that a sketch with a drawing goes
  and the image line stays (`src/bodyClean.test.ts:6-12`).
- **Catches.** A `SKETCH` pattern that drops the lookahead and removes every
  `wireframe` block.

### 4.11 Only a local PNG is loaded, and only a data image is drawn

```ts
test("each_local_image_gets_the_data_of_its_png", async () => {
    const asked: string[] = [];
    const images = await loadImages("![A](diagrams/A.svg)\n\n![B](https://x.test/b.png)\n", async (rel) => { asked.push(rel); return "data:image/png;base64,AAAA"; });
    expect(asked).toEqual(["diagrams/A.png"]);
    expect([...images]).toEqual([["diagrams/A.svg", "data:image/png;base64,AAAA"]]);
});
```

`src/exportImages.test.ts:19-24`

- **Rule.** A remote image is never requested, and an `.svg` link asks for
  its `.png` (NFR-010).
- **Catches.** A change that passes a URL to `read_asset`, or loads the SVG,
  which Word cannot embed. The HTML test in the same file proves that a
  missing image prints as its alt text and its path never reaches the HTML
  (`src/exportImages.test.ts:30-36`).

### 4.12 Grades are left out by default

```ts
test("fr_019_grades_are_left_out_by_default", () => {
    const md = buildExport(set, bodies, null);
    const contents = md.slice(md.indexOf("## Contents"));
    expect(contents).toContain("| Section | Status |");
    expect(contents).not.toContain("Score");
    expect(contents).not.toContain("Blocking");
});
```

`src/exportModel.test.ts:83-89`

- **Rule.** FR-019 as changed for 0.2.0: grades are in an export only when
  the author includes them.
- **Catches.** A default of `grades: true`, or a contents table that keeps the
  grade columns.

### 4.13 Zoom keeps the point under the pointer still

```ts
test("zoom_keeps_the_point_under_the_pointer_still", () => {
    const v = zoomAt({ scale: 1, x: 0, y: 0 }, 2, 100, 50);
    expect(v).toEqual({ scale: 2, x: -100, y: -50 });
    // The content point under the pointer is the same before and after.
    expect((100 - v.x) / v.scale).toBe(100);
});
```

`src/zoom.test.ts:10-15`

- **Rule.** The zoom formula in section 2.6.
- **Catches.** A zoom about the top left corner, which makes the diagram slide
  away from the pointer.

The e2e checks for this release are "The diagram window opens fitted, zooms,
pans, and closes with Escape" (`e2e/checks/phase-1-reading.mjs:82`) and
"Diagrams are images in the PDF, with no ASCII sketch and no details block"
(`e2e/checks/phase-5-export.mjs:91`).

## 5. Junior engineer orientation

### 5.1 Five things to internalize

1. The viewer is read-only. Rust owns every write, and every write path goes
   through `outside_set`.
2. Front matter is the record. The viewer reads items from YAML, not from the
   Markdown body.
3. `App.tsx` is the only UI file with side effects. Everything else is a pure
   function or a component with props.
4. The search index is a cache. Delete it whenever you like.
5. `src/types.ts` must match the Rust types by hand.

### 5.2 Where to start debugging

| Symptom | Start at |
|---------|----------|
| A set does not open | `load_set` (`src-tauri/src/prdset/load.rs:91-129`) |
| The wrong start screen | `start_view` (`src-tauri/src/start.rs:22-47`) |
| An item is missing or has the wrong parent | `walk` and `item_id` (`src-tauri/src/prdset/items.rs:38-97`) |
| A search result is wrong | `Index::refresh` and `Index::search` (`src-tauri/src/search.rs:90-160`) |
| A save does not show | `only_new_content` (`src-tauri/src/watch.rs:47-77`) and the listener (`src/App.tsx:90-112`) |
| A body shows wrongly | `renderBody` (`src/renderBody.ts:35-56`), then `cleanBody` (`src/bodyClean.ts:6-10`) |
| A diagram is missing from an export | `loadImages` (`src/exportRun.ts:36-40`). Check that the `.png` next to the `.svg` exists. |
| The diagram window zooms wrongly | `zoomAt` and `fitView` (`src/zoom.ts:10-20`) |
| An export looks wrong | `buildExport` (`src/exportModel.ts:20-43`), then `markdownToBlocks` (`src/exportBlocks.ts:32-40`) |

### 5.3 Where common changes go

| Change | Files |
|--------|-------|
| A new command | `src-tauri/src/commands.rs`, the list in `src-tauri/src/lib.rs:42-47`, a type in `src/types.ts`, a call in `src/App.tsx` |
| A new item title key | `TITLE_KEYS` (`src-tauri/src/prdset/items.rs:21-24`) |
| A new built-in theme | `src/themes.ts:72` and `src-tauri/src/settings.rs:22` |
| A new forbidden tag | `FORBID_TAGS` (`src/renderBody.ts:27`) |
| A new part of a body to hide | `src/bodyClean.ts`, with a test in `src/bodyClean.test.ts` |
| A new export option | `ExportOptions` (`src/exportModel.ts:18`), the box in `src/ExportDialog.tsx`, and `buildExport` |
| A color or font | The tokens on `:root` and the dark set (`src/styles.css:9-34`, `src/styles.css:35`). Keep every class name, role, and label that the e2e checks use. |
| A new search column or weight | `create` and the `bm25()` call, then bump `SCHEMA` (`src-tauri/src/search.rs:8`) |

### 5.4 Risky files

- `src-tauri/src/export.rs`: the OUT-001 guard and the Chrome flags. A wrong
  flag can let Chrome reach the network.
- `src-tauri/src/prdset/section.rs`: the path checks behind NFR-010.
- `src/renderBody.ts`: the sanitizer settings behind NFR-010.
- `src/App.tsx`: the `set-changed` listener depends on refs and a sequence
  number. A change can show an old set after a fast switch.
- `src-tauri/tauri.conf.json`: the CSP.
- `src/bodyClean.ts`: a wrong pattern hides content in the viewer and in
  every export.
- `src/styles.css`: the e2e checks find elements by class name, and one check
  measures the diagram height (`e2e/checks/phase-1-reading.mjs:75`).

## 6. Gaps and design drift

### 6.1 Design claims the code does not support

- **ADR-005 says polling is a fallback.** The code runs the 1 s poll at all
  times, beside OS events (`src-tauri/src/watch.rs:80-88`). **Confirmed.** The
  code comment gives the reason: OS events can stop with no error.
- **ADR-002 leaves the print engine open.** The build uses an installed Google
  Chrome. The ADR-002 implementation note of 2026-10-29 records this.
  **Confirmed.**

### 6.2 Code behavior that the design documents do not describe

- `known_sets` refuses exports into every set in the settings file, not only the
  open set (`src-tauri/src/commands.rs:120-123`).
- An export of a `pending` section writes "This section is not written yet."
  (`src/exportModel.ts:38`).
- The search category list is the set of document kinds that hold items, in
  reading order (`src-tauri/src/search.rs:163-171`).
- `cleanBody` drops a sketch when the next line has the shape of an image
  line. `prd_export.py` also checks that the image file exists
  (`src/bodyClean.ts:7`). The two can differ for a link to a missing drawing.
- The viewer shows the linked SVG, but the exports embed the PNG with the
  same name (`src/exportRun.ts:38`). A PNG that is older than its SVG exports
  an old drawing.
- `fitView` does not clamp to `MIN_SCALE`, so a diagram more than about 3.8
  times the stage size opens below 25% and jumps on the first zoom
  (`src/zoom.ts:11`).

### 6.3 Dead or apparently unused code

- `SetWatcher::start_polling` is public but only the tests call it
  (`src-tauri/src/watch.rs:91-93`).
- `joinFrontmatter` (`src/frontmatter.ts:35-41`), `hexToRgb`
  (`src/themes.ts:88-95`), and `runsToText` (`src/exportBlocks.ts:172-174`)
  are Motion copies with no caller in this repository. **Confirmed** by search
  at the tag.

### 6.4 Inconsistent schemas and comments

- `Hit.section` holds the document title (`h.title`), not a section number
  (`src-tauri/src/search.rs:113`). The UI shows it as the section name, which
  is correct, but the field name can mislead.
- The `src/frontmatter.ts` header talks about a WYSIWYG editor and a Save
  action (`src/frontmatter.ts:10-11`). The viewer has neither. The comment is
  from Motion.
- `src/types.ts` is a hand mirror of the Rust types with no check.

### 6.5 Missing tests

- No unit test covers `DiagramViewer` itself: the key map, the wheel factor,
  and focus return. Only the e2e check covers them
  (`e2e/checks/phase-1-reading.mjs:82`).
- No test covers an image inside other text. It is not an `image` block, and
  `inlineRuns` writes its alt text (`src/exportBlocks.ts:57-62`,
  `src/exportBlocks.ts:149-151`).

- No contract test between the Rust serde output and `src/types.ts`.
- `the_pdf_is_tagged_for_screen_readers` returns early when Chrome is missing,
  so it can pass with no check (`src-tauri/src/export.rs:187-188`).
- No CI runs any test.

### 6.6 Duplicated logic

- The built-in theme IDs: `src-tauri/src/settings.rs:22` and `src/themes.ts:72`.
- The custom theme limit of 24: `src/themes.ts:170` and
  `src/ThemeDialog.tsx:20`.
- The image path pattern: `loadImages` finds images with the `IMAGE` regex
  (`src/exportRun.ts:29`), and `markdownToBlocks` finds them with Marked
  (`src/exportBlocks.ts:57-62`). An image in a code block matches the regex,
  so its PNG is read and not used.
- The rules of `prd_export.py` exist again in `src/bodyClean.ts` and
  `fitImage` (`src/exportDocx.ts:72-76`).
- The item ID shape: `is_item_id` in Rust (`src-tauri/src/prdset/items.rs:26-32`)
  and the `ID` regex in the UI (`src/SectionPage.tsx:6`). They agree at this
  tag.
