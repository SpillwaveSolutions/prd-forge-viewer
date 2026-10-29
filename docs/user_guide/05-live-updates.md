---
doc_type: guide
slug: 05-live-updates
title: Live updates
truth_state: current
wiki_key: guide/05-live-updates
---
# Live updates

When the authoring tools save a document of the open set, the window shows the
change within 2 seconds. You do not have to do anything.

The viewer watches the documents in the set folder. It does not watch the
files in subfolders, for example `grades/` or `diagrams/`.

## What changes in the window

| What you see | What the viewer does |
|---|---|
| The overview | It shows the new status of each document and the new grades. Each changed document has the mark "changed" in the **Documents** list. |
| The section that changed | It shows the new version of the section with the notice "This section changed. You see the current version." The selected item stays selected if the section still has it. |
| A section that you removed | It goes back to the overview with the message "*file* was removed or cannot be read. You see the current set." |

The "changed" marks stay until you open a different set.

If two saves come close together, the window shows the last save.

A save that does not change the content of a file does not show as a change.

## If live updates stop

If the viewer cannot watch the set folder, it shows the message "Live updates
are off: ..." with the reason. To see the current content, open the set again.
