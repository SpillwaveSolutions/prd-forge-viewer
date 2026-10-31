---
doc_type: guide
slug: 03-grades
title: See the grades
truth_state: current
wiki_key: guide/03-grades
---
# See the grades

The **Grades** table is on the overview of the set, below the **Documents**
list. It shows every section of the set in reading order. The root document
is not in the table.

The table has these columns:

| Column | What it shows |
|---|---|
| **Section** | The section number and title. |
| **Status** | The status of the section, for example `draft`, `review`, or `final`. |
| **Score** | The score from the last grading pass. |
| **Blocking defects** | The number of blocking defects from the last grading pass. |
| **Graded** | The date of the last grading pass, or "no date". |

A section with no grade shows "Not graded" in place of the score, the blocking
defects, and the date.

The viewer reads the status and the grade from the front matter of each
document. The viewer does not change a grade. To grade a section, use the
authoring tools.

The status and grade of a section also show at the top of its section page and
on each of its items. For more information, see
[[Read sections and items|Read-sections-and-items]].

When the authoring tools save a new grade, the table shows it with no action
from you. For more information, see [[Live updates|Live-updates]].

## Read the findings behind a grade

A grading pass writes a note for each section that it grades. The note gives
the blocking defects and tells you how to raise the grade. The authoring tools
keep each note in the `grades/` folder of the set, with the same file name as
its section.

1. Open a section.
2. Click **Findings**, next to the grade at the top of the section page.

The note shows below the grade. If the section has no note, the viewer shows
"No findings are recorded for this section."

To close the note, click **Findings** again. The note also closes when you
open a different document.

The viewer does not change a note. To grade a section again, use the
authoring tools. A backlog document has no **Findings** button.

## Grades in an export

An export leaves out the score and the blocking defects, unless you select
**Include grades** in the **Export** dialog. For more information, see
[[Export and print|Export-and-print]].
