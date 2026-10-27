---
id: prd-forge-viewer-market
kind: customer-market
schema: prd-forge/customer-market@1
title: Target customer and market
status: final
updated: 2026-10-26
domain: software product management
section: 2
order: 20
score: 70
blocking: 0
graded: 2026-10-26
segments:
  - id: S-001
    name: Teams that write PRDs with PRD Forge
    buyer: >-
      Nobody buys it. The viewer is free and open source. The PRD author chooses
      to install it.
    user: PER-001, PER-002
    size: Not known. PRD Forge had its first release in October 2026 (R-002, Q-001).
    willingness_to_pay: None needed. The viewer is free.
  - id: S-002
    name: Stakeholders who read PRDs from those teams
    buyer: Nobody buys it. They receive exports and can install the free viewer.
    user: PER-003, PER-004, PER-005
    size: Not known (Q-002).
    willingness_to_pay: None needed. The viewer is free.
competitors:
  - name: The status quo, reading the files in a text editor
    offer: >-
      The author and developers open each of the 18 files separately. The
      stakeholders get the files or a copy that the author makes by hand.
    our_edge: >-
      The author reads the whole set and every grade in one place, and sends a
      file that stakeholders open without the authoring tools.
  - name: The command-line export of the authoring tools
    offer: One PDF and one Word file of the whole set, in one fixed appearance.
    our_edge: >-
      The author selects the sections and the theme, and does not need a command
      line.
  - name: The stepper pane of the authoring tools
    offer: >-
      Steps through the sections one at a time, inside the authoring tools.
    our_edge: >-
      A developer or reader without the authoring tools can use the viewer, and
      it searches and exports.
why_we_win: >-
  A PRD author gets a readable, themed copy of the PRD to stakeholders without
  extra work, and the viewer costs nothing.
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer-problem, kind: problem-opportunity, path: ./01-problem-opportunity.md, title: Problem and opportunity }
  next: { id: prd-forge-viewer-objectives, kind: objectives-metrics, path: ./03-objectives-metrics.md, title: Objectives and success metrics }
---

# Target customer and market

The viewer is free and open source for anyone who uses PRD Forge. The PRD owner
decided this on 2026-10-26. Nobody buys it, so the market is the number of teams
that use PRD Forge, which is not known yet.

| ID | Segment | User | Size |
| --- | --- | --- | --- |
| S-001 | Teams that write PRDs with PRD Forge | PER-001, PER-002 | Not known (R-002) |
| S-002 | Stakeholders who read those PRDs | PER-003, PER-004, PER-005 | Not known (Q-002) |

| Alternative | Our edge |
| --- | --- |
| Status quo: 18 files in a text editor | One place to read, grades in one view, an export that anyone opens |
| The command-line export | Select sections and theme, no command line |
| The stepper pane in the authoring tools | Readers without the tools can use it, and it searches and exports |

Why we win: a PRD author gets a readable, themed copy to stakeholders without
extra work, and the viewer costs nothing.
