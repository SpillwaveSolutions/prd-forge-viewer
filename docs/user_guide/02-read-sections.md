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
- The version, for example "Version 0.6.1".
- The executive summary from the root document.
- The **Documents** list. It shows each document in reading order, with its
  status.
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

A list of all the documents is at the side of the page. Click a title in the
list to open that document. The title of the open document is marked.

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
| A local image in the set folder | The image. The viewer loads SVG, PNG, JPEG, and GIF files. |
| A local image that is missing | "[image not found: *alt text*]". |
| A remote image | "[image: *alt text*]". The image does not load. |

The viewer does not load an image from outside the set folder. No script in a
body runs.
