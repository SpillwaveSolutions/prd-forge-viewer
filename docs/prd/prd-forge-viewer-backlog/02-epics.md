---
id: prd-forge-viewer-backlog-epics
kind: epics
schema: prd-forge/epics@1
title: Epics
status: draft
updated: '2026-10-28'
domain: software product management
order: 20
links:
  parent:
    id: prd-forge-viewer-backlog
    kind: backlog
    path: ./backlog.md
    title: PRD Forge Viewer backlog
  prev:
    id: prd-forge-viewer-backlog-features
    kind: features
    path: ./01-features.md
    title: Features
  next:
    id: prd-forge-viewer-backlog-stories
    kind: stories
    path: ./03-stories.md
    title: Stories
epics:
  - id: EPIC-001
    feature: FEAT-001
    release: REL-001
    goal: Open the right PRD set, from the viewer or the terminal, and see what it holds.
    in_scope:
      - 'IN-001: Open a PRD set and see the product name, the version, the executive summary, and the status of every document. The next session opens the same PRD set.'
    out_of_scope: []
    acceptance:
      - 'SC-002 passes: The PRD set opens. All 18 documents are listed. The one unreadable section is marked as unreadable with its file name, and the 17 other documents can be read.'
      - 'SC-006 passes: The viewer opens the same PRD set as in the last session, and every section shows its current version, including section 6 at draft.'
      - 'SC-009 passes: The viewer opens no set until the author selects one. After the author selects a set, the viewer shows that set with its product name and version.'
      - Every must story of this epic passes its acceptance criteria (REL-001 exit criteria).
    stories:
      - US-001
      - US-002
      - US-003
      - US-004
      - US-005
      - US-006
    measures:
      - O-001
  - id: EPIC-002
    feature: FEAT-002
    release: REL-001
    goal: See the grade of every section in one view.
    in_scope:
      - 'IN-002: See the status, score, count of blocking defects, and grade date of every section in one view.'
    out_of_scope:
      - OUT-002, the findings behind each grade, comes in release 2 (FR-025).
    acceptance:
      - 'SC-001 passes at ST-002: the author sees the score, blocking count, and grade date of each graded section.'
      - Every must story of this epic passes its acceptance criteria (REL-001 exit criteria).
    stories:
      - US-007
    measures:
      - O-002
  - id: EPIC-003
    feature: FEAT-003
    release: REL-001
    goal: Go directly to a weak section or item, or find it by search.
    in_scope:
      - 'IN-003: Go directly to any section and read it.'
      - 'IN-004: Search the PRD set by term, in one category or in all, and see the best matches first.'
    out_of_scope:
      - FR-006, previous and next section, was dropped by the PRD owner on 2026-10-26.
    acceptance:
      - 'SC-005 passes: The developer sees only the items that contain "export", best match first, each with its id and section. The team receives one file with only the two selected sections.'
      - 'SC-007 passes: The developer sees that no item contains "invoice", and sees no results.'
      - Every must story of this epic passes its acceptance criteria (REL-001 exit criteria).
    stories:
      - US-008
      - US-009
      - US-010
      - US-011
      - US-012
    measures:
      - O-001
  - id: EPIC-004
    feature: FEAT-004
    release: REL-001
    goal: See each change from the authoring tools while the section is open.
    in_scope:
      - 'IN-005: See each change that the authoring tools make to a section, without any action from the author.'
    out_of_scope:
      - OUT-001, editing in the viewer.
    acceptance:
      - 'SC-003 passes: The viewer shows score 75 and the new text of section 4, and the author did nothing to get it. Section 8 sets the time limit.'
      - Every must story of this epic passes its acceptance criteria (REL-001 exit criteria).
    stories:
      - US-013
    measures:
      - O-001
  - id: EPIC-005
    feature: FEAT-005
    release: REL-001
    goal: Export the selected sections, in a selected theme, as a file that a reader opens without the authoring tools.
    in_scope:
      - 'IN-006: Export the whole PRD set or selected sections as a fixed-layout document or an editable document, or print it. The fixed-layout document is PDF (ISO 32000). The editable document is a .docx file (ISO/IEC 29500). The readers already open these formats without installing anything (A-001). The export shows the version and the status of the PRD and of each section.'
      - 'IN-007: Select an export theme. The viewer includes the built-in themes, and the author can make, change, and delete custom themes.'
      - 'IN-008: Export only the sections that a developer selects.'
    out_of_scope:
      - OUT-003, operating systems other than macOS.
    acceptance:
      - 'SC-004 passes: The file shows the word "Draft" and version 0.1.0 on the first page. The contents list shows the status and score of every section. Each pending section says that it is not written yet.'
      - 'SC-008 passes: The file has both selected sections, in reading order. The pending section shows its status and says that it is not written yet, and the export shows "Draft".'
      - Every must story of this epic passes its acceptance criteria (REL-001 exit criteria).
    stories:
      - US-014
      - US-015
      - US-016
      - US-017
      - US-018
      - US-019
      - US-020
      - US-021
      - US-022
      - US-023
      - US-024
      - US-025
    measures:
      - O-001
  - id: EPIC-006
    feature: FEAT-002
    release: REL-002
    goal: See the findings behind the grade of each section.
    in_scope:
      - 'FR-025: See the findings behind the grade of a section (OUT-002 moves into scope).'
    out_of_scope:
      - OUT-001, editing in the viewer, unless the PRD owner adds it at the release 2 review on 2026-11-06.
    acceptance:
      - 'For each graded section, the author sees the findings behind its grade: what is missing and what to improve.'
    measures:
      - O-002
---

# Epics

Each epic is the part of one feature that one release delivers.

| ID | Feature | Release | Goal | Stories |
| --- | --- | --- | --- | --- |
| EPIC-001 | FEAT-001 | REL-001 | Open the right PRD set, from the viewer or the terminal, and see what it holds. | US-001, US-002, US-003, US-004, US-005, US-006 |
| EPIC-002 | FEAT-002 | REL-001 | See the grade of every section in one view. | US-007 |
| EPIC-003 | FEAT-003 | REL-001 | Go directly to a weak section or item, or find it by search. | US-008, US-009, US-010, US-011, US-012 |
| EPIC-004 | FEAT-004 | REL-001 | See each change from the authoring tools while the section is open. | US-013 |
| EPIC-005 | FEAT-005 | REL-001 | Export the selected sections, in a selected theme, as a file that a reader opens without the authoring tools. | US-014, US-015, US-016, US-017, US-018, US-019, US-020, US-021, US-022, US-023, US-024, US-025 |
| EPIC-006 | FEAT-002 | REL-002 | See the findings behind the grade of each section. | Written before REL-002 |

## EPIC-001. Open the right PRD set, from the viewer or the terminal, and see what it holds.

Feature FEAT-001, release REL-001.

**In scope:**

- IN-001: Open a PRD set and see the product name, the version, the executive summary, and the status of every document. The next session opens the same PRD set.

**Acceptance:**

- SC-002 passes: The PRD set opens. All 18 documents are listed. The one unreadable section is marked as unreadable with its file name, and the 17 other documents can be read.
- SC-006 passes: The viewer opens the same PRD set as in the last session, and every section shows its current version, including section 6 at draft.
- SC-009 passes: The viewer opens no set until the author selects one. After the author selects a set, the viewer shows that set with its product name and version.
- Every must story of this epic passes its acceptance criteria (REL-001 exit criteria).

## EPIC-002. See the grade of every section in one view.

Feature FEAT-002, release REL-001.

**In scope:**

- IN-002: See the status, score, count of blocking defects, and grade date of every section in one view.

**Out of scope:**

- OUT-002, the findings behind each grade, comes in release 2 (FR-025).

**Acceptance:**

- SC-001 passes at ST-002: the author sees the score, blocking count, and grade date of each graded section.
- Every must story of this epic passes its acceptance criteria (REL-001 exit criteria).

## EPIC-003. Go directly to a weak section or item, or find it by search.

Feature FEAT-003, release REL-001.

**In scope:**

- IN-003: Go directly to any section and read it.
- IN-004: Search the PRD set by term, in one category or in all, and see the best matches first.

**Out of scope:**

- FR-006, previous and next section, was dropped by the PRD owner on 2026-10-26.

**Acceptance:**

- SC-005 passes: The developer sees only the items that contain "export", best match first, each with its id and section. The team receives one file with only the two selected sections.
- SC-007 passes: The developer sees that no item contains "invoice", and sees no results.
- Every must story of this epic passes its acceptance criteria (REL-001 exit criteria).

## EPIC-004. See each change from the authoring tools while the section is open.

Feature FEAT-004, release REL-001.

**In scope:**

- IN-005: See each change that the authoring tools make to a section, without any action from the author.

**Out of scope:**

- OUT-001, editing in the viewer.

**Acceptance:**

- SC-003 passes: The viewer shows score 75 and the new text of section 4, and the author did nothing to get it. Section 8 sets the time limit.
- Every must story of this epic passes its acceptance criteria (REL-001 exit criteria).

## EPIC-005. Export the selected sections, in a selected theme, as a file that a reader opens without the authoring tools.

Feature FEAT-005, release REL-001.

**In scope:**

- IN-006: Export the whole PRD set or selected sections as a fixed-layout document or an editable document, or print it. The fixed-layout document is PDF (ISO 32000). The editable document is a .docx file (ISO/IEC 29500). The readers already open these formats without installing anything (A-001). The export shows the version and the status of the PRD and of each section.
- IN-007: Select an export theme. The viewer includes the built-in themes, and the author can make, change, and delete custom themes.
- IN-008: Export only the sections that a developer selects.

**Out of scope:**

- OUT-003, operating systems other than macOS.

**Acceptance:**

- SC-004 passes: The file shows the word "Draft" and version 0.1.0 on the first page. The contents list shows the status and score of every section. Each pending section says that it is not written yet.
- SC-008 passes: The file has both selected sections, in reading order. The pending section shows its status and says that it is not written yet, and the export shows "Draft".
- Every must story of this epic passes its acceptance criteria (REL-001 exit criteria).

## EPIC-006. See the findings behind the grade of each section.

Feature FEAT-002, release REL-002.

**In scope:**

- FR-025: See the findings behind the grade of a section (OUT-002 moves into scope).

**Out of scope:**

- OUT-001, editing in the viewer, unless the PRD owner adds it at the release 2 review on 2026-11-06.

**Acceptance:**

- For each graded section, the author sees the findings behind its grade: what is missing and what to improve.
