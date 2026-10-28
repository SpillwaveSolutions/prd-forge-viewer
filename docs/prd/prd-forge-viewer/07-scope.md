---
id: prd-forge-viewer-scope
kind: scope
schema: prd-forge/scope@1
title: Scope
status: final
updated: 2026-10-27
domain: software product management
section: 6
order: 70
score: 96
blocking: 0
graded: 2026-10-27
release: REL-001, Release 1, read and export
release_line: >-
  J-001 stages ST-001 to ST-005 happen in the viewer: open the PRD set, check the
  grades, go to or search for a section, see the fixed section, and export it.
  ST-006 and ST-007 happen outside the viewer: the author sends the file, and the
  stakeholders read it and respond. Together they reach the end state of J-001.
  Release 1 also lets a developer (PER-002) do the work of J-002. Search is part
  of ST-003, and the export of selected sections is part of ST-005.
outside_product:
  - stage: ST-006
    workaround: >-
      The author sends the export to the stakeholders with the tools that the
      author already uses.
  - stage: ST-007
    workaround: >-
      Each stakeholder opens the export without the authoring tools and replies
      to the author by the means that the team already uses.
in_scope:
  - id: IN-001
    summary: >-
      Open a PRD set and see the product name, the version, the executive
      summary, and the status of every document. The next session opens the same
      PRD set.
    journey_stage: ST-001
    requirements:
      - FR-001
      - FR-002
      - FR-003
      - FR-021
      - FR-022
      - FR-024
  - id: IN-002
    summary: >-
      See the status, score, count of blocking defects, and grade date of every
      section in one view.
    journey_stage: ST-002
    requirements:
      - FR-004
  - id: IN-003
    summary: Go directly to any section and read it.
    journey_stage: ST-003
    requirements:
      - FR-005
      - FR-023
  - id: IN-004
    summary: >-
      Search the PRD set by term, in one category or in all, and see the best
      matches first.
    journey_stage: ST-003
    requirements:
      - FR-008
      - FR-007
  - id: IN-005
    summary: >-
      See each change that the authoring tools make to a section, without any
      action from the author.
    journey_stage: ST-004
    requirements:
      - FR-009
  - id: IN-006
    summary: >-
      Export the whole PRD set or selected sections as a fixed-layout or an
      editable document (C-001), or
      print it. The export shows the version and the status of the PRD and of
      each section.
    journey_stage: ST-005
    requirements:
      - FR-010
      - FR-011
      - FR-013
      - FR-014
      - FR-019
  - id: IN-007
    summary: >-
      Select an export theme. The viewer includes the built-in themes, and the
      author can make, change, and delete custom themes.
    journey_stage: ST-005
    requirements:
      - FR-015
      - FR-016
      - FR-017
      - FR-018
      - FR-020
  - id: IN-008
    summary: Export only the sections that a developer selects.
    journey_stage: ST-005
    requirements:
      - FR-012
out_of_scope:
  - id: OUT-001
    summary: Editing the text of a section in the viewer (Q-005).
    revisit: >-
      The PRD owner decides at the release 2 review, on 2026-11-06, if editing
      goes into a release.
  - id: OUT-002
    summary: >-
      Showing the findings behind each grade, such as what is missing and what to
      improve (Q-004).
    revisit: >-
      The authoring tools record the findings from PRD Forge 0.2.0 (D-002
      delivered). Release 2 shows them (FR-025), on 2026-11-06.
non_goals:
  - statement: We are not building a tool that writes or grades a PRD.
    reason: >-
      The authoring tools do that, and the viewer only reads and exports their output.
  - statement: We are not building a way to send files to stakeholders.
    reason: >-
      The author sends the export with the tools the author already uses.
  - statement: We are not building comments inside the viewer.
    reason: >-
      Stakeholders reply outside the viewer, and the author records the result in the authoring tools.
  - statement: We are not building a view of several PRD sets at once.
    reason: >-
      Every journey works on one PRD. No persona needs to compare two sets, and FR-022 already switches between sets.
  - statement: We are not building accounts, cloud copies, or shared links.
    reason: >-
      Everything stays on the author's computer (NFR-005).
  - statement: We are not building a viewer for PRDs in other formats.
    reason: >-
      The viewer reads only the PRD Forge format (C-003).
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer-scenarios, kind: scenarios, path: ./06-scenarios.md, title: Scenarios }
  next: { id: prd-forge-viewer-functional-requirements, kind: functional-requirements, path: ./08-functional-requirements.md, title: Functional requirements }
  related:
    - { id: prd-forge-viewer-journeys, kind: journeys, path: ./05-user-journeys.md, title: User journeys }
---

# Scope

Release 1 delivers J-001, the golden thread, from ST-001 to ST-005 in the viewer.
ST-006 and ST-007 happen outside the viewer, and the author and the stakeholders
use the tools that they already use. Release 1 also lets a developer do the work
of J-002: search is part of ST-003, and the export of selected sections is part
of ST-005.

| ID | In scope for release 1 | Stage |
| --- | --- | --- |
| IN-001 | Open a PRD set and see every document's status; reopen the same set next time | ST-001 |
| IN-002 | See status, score, blocking count, and grade date of every section | ST-002 |
| IN-003 | Go directly to any section or item in the tree | ST-003 |
| IN-004 | Search by term and category, best matches first | ST-003 |
| IN-005 | See changes from the authoring tools without any action | ST-004 |
| IN-006 | Export the whole set or selected sections as a fixed-layout or editable document (C-001), or print, with version and status | ST-005 |
| IN-007 | Select a built-in theme, or make, change, and delete custom themes | ST-005 |
| IN-008 | Export only the sections that a developer selects | ST-005 |

## Out of scope for release 1

| ID | Item | Revisit when |
| --- | --- | --- |
| OUT-001 | Editing section text in the viewer | The PRD owner decides at the release 2 review, on 2026-11-06 |
| OUT-002 | The findings behind each grade | Release 2, on 2026-11-06, with FR-025 (D-002 delivered). |

## Non-goals

| Non-goal | Reason |
| --- | --- |
| We are not building a tool that writes or grades a PRD. | The authoring tools do that, and the viewer only reads and exports their output. |
| We are not building a way to send files to stakeholders. | The author sends the export with the tools the author already uses. |
| We are not building comments inside the viewer. | Stakeholders reply outside the viewer, and the author records the result in the authoring tools. |
| We are not building a view of several PRD sets at once. | Every journey works on one PRD. No persona needs to compare two sets, and FR-022 already switches between sets. |
| We are not building accounts, cloud copies, or shared links. | Everything stays on the author's computer (NFR-005). |
| We are not building a viewer for PRDs in other formats. | The viewer reads only the PRD Forge format (C-003). |
