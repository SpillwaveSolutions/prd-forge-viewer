---
id: prd-forge-viewer-release-plan
kind: release-plan
schema: prd-forge/release-plan@1
title: Release plan
status: final
updated: 2026-10-26
domain: software product management
section: 13
order: 140
score: 92
blocking: 0
graded: 2026-10-26
releases:
  - id: REL-001
    name: Release 1, read and export
    outcomes:
      - >-
        The author opens a PRD set, sees the grade of every section in one view,
        goes to any section, and sees changes from the authoring tools without
        any action.
      - >-
        The author sends stakeholders a PDF or Word export, in a theme the author
        selects, that shows the version and the draft mark.
      - A developer searches the PRD set by term and category and exports selected sections.
    journey_stages:
      - ST-001
      - ST-002
      - ST-003
      - ST-004
      - ST-005
      - ST-008
      - ST-009
      - ST-010
    requirements:
      - FR-001
      - FR-002
      - FR-003
      - FR-004
      - FR-005
      - FR-007
      - FR-008
      - FR-009
      - FR-010
      - FR-011
      - FR-012
      - FR-013
      - FR-014
      - FR-015
      - FR-016
      - FR-017
      - FR-018
      - FR-019
      - FR-020
      - FR-021
      - FR-022
      - FR-023
      - FR-024
    objectives:
      - O-001
    target_date: 2026-10-27
  - id: REL-002
    name: Release 2, grade findings
    outcomes:
      - >-
        The author sees, for each section, the findings behind its grade: what is
        missing and what to improve.
    journey_stages:
      - ST-002
      - ST-003
    objectives:
      - O-001
      - O-002
    target_date: 2026-11-06
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer-open-questions, kind: open-questions, path: ./13-open-questions.md, title: Open questions }
  next: { id: prd-forge-viewer-glossary, kind: glossary, path: ./15-glossary.md, title: Glossary }
  related:
    - { id: prd-forge-viewer-scope, kind: scope, path: ./07-scope.md, title: Scope }
---

# Release plan

![The release line](diagrams/release-line.svg)

| ID | Release | Target date | Stages | Requirements |
| --- | --- | --- | --- | --- |
| REL-001 | Release 1, read and export | 2026-10-27 | ST-001 to ST-005, ST-008 to ST-010 | FR-001 to FR-024, except FR-006 |
| REL-002 | Release 2, grade findings | 2026-11-06 | ST-002, ST-003 | Added after D-002 |

## REL-001. Release 1, read and export

The author reads the whole PRD set, sees the grades, and sends a themed PDF or
Word export with a draft mark. A developer searches and exports selected
sections. ST-006 and ST-007 happen outside the viewer. The PRD owner moved the
target date from 2026-10-26 to 2026-10-27 on 2026-10-26. Release 1 runs on
macOS only (C-004).

## REL-002. Release 2, grade findings

The author sees the findings behind each grade. D-002 is delivered, so this release
can start when the PRD owner decides. Editing in the viewer (OUT-001) has no release yet.
