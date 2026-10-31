---
doc_type: guide
slug: 02-read-sections
title: Read sections and items
truth_state: current
wiki_key: guide/02-read-sections
---
# Read sections and items

## The overview of a set

When a set opens, the window shows its overview:

- The product name.
- The version, for example "Version 0.6.2".
- The executive summary from the root document.
- The **Documents** list. It shows each document in reading order, with its
  status. A colored mark next to each document shows its status.

The executive summary and the **Documents** list show side by side. In a
narrow window, the list shows below the summary.
- The **Grades** table. For more information, see [See the grades](03-grades.md).

A document that the viewer cannot read shows **Unreadable**, its file name, and
the reason. You cannot open it.

## Open a section

1. In the **Documents** list, click the title of a document.

The section page shows:

- The **Back to the PRD set** button.
- The title of the section.
- The status and the grade of the section. The grade has the score, the number
  of blocking defects, and the date of the grade. A section with no grade shows
  "Not graded".
- A row of buttons, one for each item id in the section.
- The body of the section.

A list of all the documents is at the side of the page. Each title has a
colored mark for its status. Click a title in the list to open that document.
The title of the open document is marked.

To go back to the overview, click **Back to the PRD set**.

## Read one item

1. Click the button of an item id, for example **PER-001**.

The item shows above the body of the section. It has:

- The id and the title of the item.
- The item that holds it, when it has one. For example, a stage shows "in
  J-001".
- The title, status, and grade of its section.
- Each field of the item.

To close the item, click its button again.

## Follow a reference

An item field can name another item by its id, for example `ST-002`. When the
set has an item with that id, the id is a button.

1. Click the id button.

The viewer opens the section that holds the item and shows the item. An id
that names no item in the set stays as text.

## Links and images in a body

The viewer shows the body of a section as formatted text. It changes links and
images to keep all content local:

| In the body | What the viewer shows |
|---|---|
| A link to a `.md` document | A button that opens the document. |
| Any other link | The link text only. The viewer does not follow the link. |
| A local image in the set folder | The image, with its alt text as a caption. The viewer loads SVG, PNG, JPEG, and GIF files. |
| A local image that is missing | "[image not found: *alt text*]". |
| A remote image | "[image: *alt text*]". The image does not load. |

The viewer does not load an image from outside the set folder. No script in a
body runs.

## Parts of a body that do not show

The authoring tools add some parts to a body that the viewer does not show:

- The details block. It repeats the front matter of the document.
- The text sketch of a wireframe, when a drawing of the wireframe follows it.
  The viewer shows the drawing only. If the drawing cannot load, the viewer
  shows the text sketch and "[image not found: *alt text*]".

The exports also leave out these parts. An export keeps a text sketch when
it cannot read the drawing.

## Open a diagram

A diagram fits the width of the reading column. To see a large diagram in
more detail, open it in the diagram window.

1. Click the diagram.

The diagram window shows the diagram as large as fits. A very large diagram
opens at 25%, the minimum zoom level. The top of the window
shows the name of the diagram and the zoom level, for example "150%".

| To do this | Use the pointer | Use the keyboard |
|---|---|---|
| Zoom in | Scroll up, pinch out, or click **+**. | Press `+`. |
| Zoom out | Scroll down, pinch in, or click **-**. | Press `-`. |
| Fit the diagram to the window | Click **Fit**. | Press `0`. |
| Move the diagram | Drag it. | Press an arrow key. |
| Close the window | Click **Close**. | Press **Escape**. |

The zoom level is from 25% to 800%. When the window closes, the section page
shows again.

## Change the text size

You can make the text larger or smaller. The size applies to all text in the
window.

| To do this | Click | Or press |
|---|---|---|
| Make the text larger | **A+** | Command-plus |
| Make the text smaller | **A−** | Command-minus |
| Go back to the normal size | the percentage | Command-0 |

The text size is from 80% to 200%. At 80%, **A−** is not available. At 200%,
**A+** is not available. The viewer keeps the text size for the next time you
open it.
