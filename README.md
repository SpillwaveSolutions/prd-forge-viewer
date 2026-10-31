# PRD Forge Viewer

PRD Forge Viewer is a desktop app for macOS. It reads, searches, and exports
the PRD sets that the PRD Forge plugin makes
([SpillwaveSolutions/prd-forge](https://github.com/SpillwaveSolutions/prd-forge)).
The viewer is read-only. It never writes to a PRD set.

With the viewer, you can:

- Open a PRD set from the app or with the `prdf` command in a terminal.
- Read each section and each item, and follow an id to the item that it names.
- Open a diagram in a diagram window, and zoom and pan it.
- See the status, score, and blocking defects of every section in one table.
- Read the findings behind the grade of a section: the blocking defects and
  how to raise the grade.
- Read the backlog that is next to the set, and move between a requirement
  and the stories that build it.
- Search the set by term, in one or more categories or in all categories.
  The search opens in a drawer at the right of the window.
- Make the text larger or smaller, from 80% to 200%.
- See a save from the authoring tools in the window within 2 seconds.
- Export the set to PDF or Word with a theme, or print it. Diagrams show as
  pictures with captions.

The viewer shows only local content. No script in a document runs, and no
remote image loads.

Release 0.4.0 covers release 1 (REL-001) of the PRD, FR-001 to FR-024 except
FR-006, and release 2 (REL-002), FR-025 to FR-028. It follows PRD 0.7.0. For the full list of changes, see [CHANGELOG.md](CHANGELOG.md).

## User guide

The [user guide](docs/user_guide/README.md) tells you how to use each part of
the viewer.

## Install

The release has one disk image for Macs with Apple silicon.

1. Download `PRD.Forge.Viewer_0.4.0_aarch64.dmg` from the
   [v0.4.0 release](https://github.com/SpillwaveSolutions/prd-forge-viewer/releases/tag/v0.4.0).
2. Open the disk image.
3. Move **PRD Forge Viewer** to the **Applications** folder.
4. Start **PRD Forge Viewer**. Its icon is a PRD page with four colored
   status marks in the margin.
5. Click **Install prdf command** in the toolbar.
6. Confirm the install in the **Install prdf command** dialog.

The app writes the `prdf` command to `~/.local/bin/prdf`. If `~/.local/bin` is
not on your `PATH`, the app tells you to add it. For more information, see
[Open a PRD set](docs/user_guide/01-open-a-set.md).

PDF export needs Google Chrome on the Mac. Word export does not.

## Build

You must have [Bun](https://bun.sh) and a Rust toolchain on the Mac.

1. Install the packages:

   ```bash
   bun install
   ```

2. Build the app and the disk image:

   ```bash
   bun run tauri build
   ```

The build writes the app and the disk image to `src-tauri/target/release/bundle/`.

## Test

Run the Rust tests:

```bash
cargo test --manifest-path src-tauri/Cargo.toml
```

Run the UI tests:

```bash
bun test src
```

Run the end-to-end checks:

```bash
bun run test:e2e
```

The end-to-end command builds a debug app with the tauri MCP bridge. Then it
runs each check file in `e2e/checks/` against the real app, and reads back each
exported file.

## Known limits

- PDF export needs Google Chrome on the Mac. Word export does not.
- An export uses the PNG file of a diagram when it is next to the SVG file
  and is not older than the SVG file. If not, the export uses the SVG file.
  Word 2016 and later show an SVG picture. An older Word shows a blank
  picture in its place.
- Some non-functional checks have no full run yet: the network-off run, the
  checksum test, the full hostile fixture, the full keyboard audit, and a
  reader's accessibility checker on the exports. See section 4.2 of
  [ARC-001-TRAC-v1.0.md](projects/001-prd-forge-viewer/ARC-001-TRAC-v1.0.md).

## Project documents

- [docs/prd/prd-forge-viewer/](docs/prd/prd-forge-viewer/prd.md): the PRD, the
  only source of truth for what to build.
- [projects/](projects/): the architecture documents and decisions derived
  from the PRD.
- [docs/roadmap.md](docs/roadmap.md): the roadmap, generated from the work
  items.
