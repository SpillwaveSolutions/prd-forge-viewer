---
id: prd-forge-viewer-constraints
kind: constraints
schema: prd-forge/constraints@1
title: Constraints
status: final
updated: 2026-10-26
domain: software product management
section: 9
order: 100
score: 75
blocking: 0
graded: 2026-10-26
constraints:
  - id: C-001
    category: policy
    statement: >-
      Exports use the formats that the stakeholders already read. The
      fixed-layout document is PDF. The editable document is a Microsoft Word
      document (.docx).
    authority: >-
      PRD owner decision, Richard Hightower, 2026-10-26. The engineering lead, the
      sponsor, and the developers without the authoring tools read PDF and Word
      files.
    applies_to:
      - FR-010
      - FR-011
      - FR-012
      - FR-013
    verification: >-
      Open each export in a standard PDF reader and in a word processor that
      reads .docx files, on a computer without the authoring tools.
  - id: C-002
    category: firm
    statement: >-
      The viewer does not change any document of a PRD set. The author changes
      documents only in the authoring tools.
    authority: >-
      PRD owner decision, Richard Hightower, 2026-10-26 (Q-005). Edits go through
      the authoring tools so that they are graded.
    verification: >-
      Compare every document of a PRD set before and after a session in which the
      author opens, searches, and exports it. No document has changed.
  - id: C-003
    category: standard
    statement: >-
      The viewer reads PRD sets in the document layout of the authoring tools,
      version 1: one root document and 17 section documents with the headers and
      links that the authoring tools define.
    authority: >-
      The PRD Forge document format, version 1 (the prd-forge/*@1 schemas),
      published with PRD Forge 0.1.0.
    applies_to:
      - FR-001
      - FR-003
      - FR-004
    verification: >-
      Open a PRD set that passes the PRD Forge validator. Every document and
      every grade shows in the viewer.
  - id: C-004
    category: policy
    statement: >-
      Release 1 runs on macOS only. Other operating systems come in a later
      release, after the PRD owner decides.
    authority: >-
      PRD owner decision, Richard Hightower, 2026-10-26. The only test computer
      is an Apple silicon Mac with 16 GB of memory.
    verification: >-
      Install release 1 on the test computer and run the acceptance criteria of
      FR-001 to FR-024, except FR-006.
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer-nfr, kind: nonfunctional-requirements, path: ./09-nonfunctional-requirements.md, title: Non-functional requirements }
  next: { id: prd-forge-viewer-decision-rights, kind: decision-rights, path: ./11-decision-rights.md, title: Decision rights }
  related:
    - { id: prd-forge-viewer-functional-requirements, kind: functional-requirements, path: ./08-functional-requirements.md, title: Functional requirements }
---

# Constraints

| ID | Category | Rule | Authority |
| --- | --- | --- | --- |
| C-001 | policy | Exports are PDF (fixed-layout) and Word .docx (editable) | PRD owner, 2026-10-26 |
| C-002 | firm | The viewer never changes a document of a PRD set | PRD owner, 2026-10-26 |
| C-003 | standard | The viewer reads the PRD Forge document format, version 1 | PRD Forge 0.1.0 schemas |
| C-004 | policy | Release 1 runs on macOS only | PRD owner, 2026-10-26 |

## C-001. Export formats

The stakeholders read PDF and Word files. The requirements say "fixed-layout
document" and "editable document"; this constraint names the formats.

## C-002. The viewer is read-only

The author changes sections only in the authoring tools, so that every change is
graded.

## C-003. The PRD Forge document format

The viewer reads PRD sets that follow the PRD Forge version 1 layout and headers.

## C-004. Release 1 platform

Release 1 runs on macOS, the operating system of the only test computer. Other
operating systems wait for a later release.
