---
doc_type: guide
slug: 07-export-and-print
title: Export and print
truth_state: current
wiki_key: guide/07-export-and-print
---
# Export and print

You can export the whole set or selected sections to a PDF file or a Word
file. You can also print them with the macOS print panel.

## Before you export

PDF export needs Google Chrome. The viewer looks for it in
`/Applications/Google Chrome.app` and in `~/Applications/Google Chrome.app`.
Word export and print do not need Chrome.

## Export a set

1. Open the set.
2. Click **Export** in the toolbar.
3. Under **Format**, select **PDF** or **Word**.
4. In the **Theme** list, select a theme.
5. Under **Sections, in reading order**, select the documents to export.
6. Optional: select **Include grades (score and blocking defects)**.
7. Click **Export**.
8. In the save dialog, select a folder outside every PRD set folder.
9. Click **Save**.

When the file is saved, the dialog shows "Export saved." To close the dialog,
click **Close** or press **Escape**.

All documents are selected when the dialog opens. To select all documents,
click **Select all**. To clear all selections, click **Select none**.
**Export** and **Print** are not available when no document is selected.

To make or change a theme, click **Edit themes**. For more information, see
[Export themes](06-themes.md).

The default file name has the product name and the version, for example
`PRD-Forge-Viewer-PRD-0.6.2.pdf`.

## What the export holds

The first page shows:

- The product name and the version.
- The Draft mark, until every document is `final`.
- The executive summary.
- A contents table with the status of every section. When you select
  **Include grades**, the table also has the score and the blocking defects.

The contents table always lists every section, also when you export only some
sections. The selected documents follow the first page, in reading order.

- A section with the status `pending` shows "This section is not written yet."
- A section that the viewer cannot read shows "This section cannot be read."
- A diagram shows as a picture, with its alt text as a caption below it.
- The details block does not show.
- The text sketch of a wireframe does not show when the export can read its
  drawing. When the export cannot read the drawing, the text sketch shows.

The export embeds the Source Serif 4, Source Sans 3, and Source Code Pro fonts.
The export does not say that the PRD is approved. A blocking defect does not
stop an export.

## Grades in an export

The **Include grades (score and blocking defects)** check box is clear when
the dialog opens. With the check box clear, the export shows the status of
each section, but not its score or its blocking defects. Select the check box
to include them. Print uses the same setting.

## Diagrams in an export

For an SVG diagram, the export uses the PNG file with the same name next to
the SVG file. The export uses the SVG file in these cases:

- There is no PNG file.
- The PNG file is older than the SVG file. An export never shows an older
  drawing than the viewer.

The Word file embeds an SVG diagram as SVG. Word 2016 and later show it. An
older Word shows a blank picture in its place.

If the export cannot read the diagram, it shows the alt text of the diagram.

The PDF and print scale each diagram to fit the page width. The Word file
scales each diagram down to fit 6 by 8 inches.

## The Draft mark

When a document of the set is not `final`, the dialog shows the reason, for
example "Draft: 3 of 18 documents are not final. The mark goes away when every
document is final." The first page of the export shows the same mark.

## Print a set

1. Open the set.
2. Click **Export** in the toolbar.
3. Select the theme and the documents.
4. Optional: select **Include grades (score and blocking defects)**.
5. Click **Print**.
6. In the macOS print panel, select a printer.
7. Click **Print**.

Print uses the same content, order, diagrams, and Draft mark as the PDF
export. The
dialog then shows "Sent to the printer."

## Where you can save

The viewer never writes to a PRD set folder. It refuses a save into the open
set or into any known location. Save the export to a different folder.

## Messages

| Message | Cause | What to do |
|---|---|---|
| "Export cancelled. Nothing was saved." | You closed the save dialog with no file. | Click **Export** again. |
| "Not done: Save the export outside the PRD set folder. The viewer never writes to a PRD set." | The file is in a PRD set folder. | Select a different folder. |
| "Not done: PDF export needs Google Chrome. Install Google Chrome, or export to Word." | Chrome is not in one of the two folders. | Install Google Chrome, or select **Word**. |
| "Not done: Chrome did not finish the PDF within 60 seconds." | Chrome took too long. | Click **Export** again. |
| "Not done: The export must be a .pdf or .docx file." | The file name has a different extension. | Use the `.pdf` or `.docx` extension. |

If an export fails, an earlier file with the same name does not change.
