---
doc_type: guide
slug: 01-open-a-set
title: Open a PRD set
truth_state: current
wiki_key: guide/01-open-a-set
---
# Open a PRD set

A PRD set is a folder that holds a root document, `prd.md`, and its section
documents. You can open a set from the app or with the `prdf` command in a
terminal.

## Open a set from the app

1. Click **Open PRD set** in the toolbar.
2. In the folder dialog, select a folder.
3. Click the open button of the dialog.

You can select the set folder itself, for example `docs/prd/prd-forge-viewer`.
You can also select a project folder that holds the sets in `docs/prd`. The
viewer uses these rules:

| What the folder holds | What the viewer does |
|---|---|
| A `prd.md` file | Opens the set in the folder. |
| One set in `docs/prd` | Opens that set. |
| More than one set in `docs/prd`, and one of them is the last set that you opened | Opens the last set. |
| More than one set in `docs/prd`, and none of them is the last set | Shows "More than one PRD set in *folder*. Select one." and lists the sets. |
| No set | Shows "No PRD set in *folder*" and the **Known locations** list. |

The viewer looks for sets only in the direct subfolders of `docs/prd`. A
subfolder must hold a `prd.md` file.

When a set opens, the window shows the overview of the set. For more
information, see [[Read sections and items|Read-sections-and-items]].

## Install the prdf command

The `prdf` command opens a set in the viewer from a terminal.

1. Click **Install prdf command** in the toolbar.
2. Confirm the install in the **Install prdf command** dialog.
3. Read the message below the toolbar.

The app writes the command to `~/.local/bin/prdf`. The message tells you the
result:

- "Installed ~/.local/bin/prdf. Run prdf in a project folder." The command is
  ready.
- "Installed ~/.local/bin/prdf. Add ~/.local/bin to your PATH to run prdf." Add
  `~/.local/bin` to the `PATH` of your shell.
- "... already exists and is not the PRD Forge Viewer launcher. It was not
  changed." Another tool owns `~/.local/bin/prdf`. The app does not replace it.

You can install the command again at any time. The app replaces only a `prdf`
file that it wrote.

## Open a set with prdf

1. In a terminal, go to a project folder or a set folder.
2. Type `prdf`.
3. Press **Return**.

The command sends the current folder to the viewer. The viewer then uses the
same rules as **Open PRD set**.

To open a different folder, give its path:

```bash
prdf docs/prd/prd-forge-viewer
```

A relative path starts at the current folder.

If the viewer is already open, `prdf` does not start a second window. The open
window shows the result and comes to the front.

## Known locations

The viewer keeps a list of known locations. Each time a set opens with no
error, the viewer puts its folder first in the list. The list has each folder
one time only.

The **Known locations** list shows when no set opens. Each line shows the
product name and the folder of a set. Click a line to open that set. If a
known folder no longer holds a set, its line shows "Not found", and you cannot
open it.

## The last set

The viewer remembers the last set that you opened. When you start the viewer
with no folder, it opens the last set again. If the last set is not there, the
viewer shows the **Known locations** list. Before you open your first set, the
list shows "No known locations yet".

## The settings file

The known locations, the last set, your custom themes, the text size, and the
pin of the search drawer are in one settings file:

```text
~/Library/Application Support/com.spillwave.prd-forge-viewer/settings.json
```

The viewer writes this file. Do not edit it. If the file is missing or damaged,
the viewer starts with empty settings.

## If a set does not open

| Message | Cause |
|---|---|
| "No PRD set in *folder*: prd.md was not found." | The folder has no `prd.md` file. |
| "The root document prd.md cannot be read: ..." | The viewer cannot read `prd.md` or its front matter. |

A section document that the viewer cannot read does not stop the set from
opening. The overview marks that document as **Unreadable**, with its file
name and the reason.
