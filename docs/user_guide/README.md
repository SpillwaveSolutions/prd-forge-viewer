# PRD Forge Viewer user guide

This guide is for the author of a PRD set. It tells you how to use PRD Forge
Viewer 0.2.1 to read, search, and export a PRD set that the PRD Forge plugin
makes.

The viewer is read-only. You change a PRD set with the authoring tools, and the
viewer shows each change. The viewer never writes to a PRD set folder.

## Pages

1. [Open a PRD set](01-open-a-set.md): the app, the `prdf` command, known
   locations, and folders with more than one set.
2. [Read sections and items](02-read-sections.md): the overview, a section, an
   item, references between items, and the diagram window.
3. [See the grades](03-grades.md): the status, score, and blocking defects of
   every section.
4. [Search a set](04-search.md): terms, categories, and scores.
5. [Live updates](05-live-updates.md): what the window does when the authoring
   tools save a file.
6. [Export themes](06-themes.md): the built-in themes and custom themes.
7. [Export and print](07-export-and-print.md): PDF, Word, the macOS print
   panel, diagrams, and grades.

## The toolbar

The toolbar is at the top of the window. It has these buttons:

| Button | What it does |
|---|---|
| **Open PRD set** | Opens a folder dialog. You select a PRD set folder or a project folder. |
| **Install prdf command** | Installs the `prdf` command in `~/.local/bin`. |
| **Themes** | Opens the **Themes** dialog. |
| **Export** | Opens the **Export** dialog. The button shows only when a set is open. |

## Before you start

- The viewer runs on macOS only.
- PDF export needs Google Chrome on the Mac. Word export and print do not.
- The viewer uses the light or dark appearance of macOS. To change it, open
  **System Settings** > **Appearance**.
