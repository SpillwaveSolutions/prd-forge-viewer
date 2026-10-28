---
id: prd-forge-viewer-backlog-features
kind: features
schema: prd-forge/features@1
title: Features
status: draft
updated: '2026-10-28'
domain: software product management
order: 10
links:
  parent:
    id: prd-forge-viewer-backlog
    kind: backlog
    path: ./backlog.md
    title: PRD Forge Viewer backlog
  prev:
    id: prd-forge-viewer-backlog
    kind: backlog
    path: ./backlog.md
    title: PRD Forge Viewer backlog
  next:
    id: prd-forge-viewer-backlog-epics
    kind: epics
    path: ./02-epics.md
    title: Epics
features:
  - id: FEAT-001
    name: Open the PRD
    journey_stage: ST-001
    users:
      - PER-001
    outcome: The whole PRD, with the status of every section
    success_metric: 'O-001: Median calendar days from the day the author sends a PRD version to a stakeholder, to the day of the first written feedback from any stakeholder on that version. Target: 2 days or less.'
    acceptance:
      - Given a PRD set with 18 documents, when the author opens it, then the author sees the product name, the version, and the status of every document in order.
    objectives:
      - O-001
    requirements:
      - FR-001
      - FR-002
      - FR-003
      - FR-021
      - FR-022
      - FR-024
  - id: FEAT-002
    name: Check the grades
    journey_stage: ST-002
    users:
      - PER-001
    outcome: A list of the sections that are weak or not started
    success_metric: 'O-002: Count of blocking defects in a PRD version on the day the author sends it to a stakeholder, read from the grades in the export. Target: 0 blocking defects in every version sent.'
    acceptance:
      - Given a set with graded and ungraded sections, when the author checks the grades, then the author sees the score, blocking count, and grade date of each graded section, and which sections are not graded.
    objectives:
      - O-002
    requirements:
      - FR-004
      - FR-025
  - id: FEAT-003
    name: Go to a weak section
    journey_stage: ST-003
    users:
      - PER-001
      - PER-002
    outcome: The section or the item, with its status and grade
    success_metric: 'O-001: Median calendar days from the day the author sends a PRD version to a stakeholder, to the day of the first written feedback from any stakeholder on that version. Target: 2 days or less.'
    acceptance:
      - Given a weak section, when the author selects it or searches for one of its items, then the author reads it with its status, score, and blocking count.
    objectives:
      - O-001
    requirements:
      - FR-005
      - FR-006
      - FR-007
      - FR-008
      - FR-023
  - id: FEAT-004
    name: Fix the section
    journey_stage: ST-004
    users:
      - PER-001
    outcome: The changed section, with its new grade
    success_metric: 'O-001: Median calendar days from the day the author sends a PRD version to a stakeholder, to the day of the first written feedback from any stakeholder on that version. Target: 2 days or less.'
    acceptance:
      - Given the author reads a section in the viewer, when the authoring tools save a new version of it, then the author sees the new text and grade without any action.
    objectives:
      - O-001
    requirements:
      - FR-009
  - id: FEAT-005
    name: Export the PRD
    journey_stage: ST-005
    users:
      - PER-001
      - PER-002
      - PER-003
      - PER-004
    outcome: One file that a reader can open without the tools, or a printed copy
    success_metric: 'O-001: Median calendar days from the day the author sends a PRD version to a stakeholder, to the day of the first written feedback from any stakeholder on that version. Target: 2 days or less.'
    acceptance:
      - Given the author selects a format, a theme, and some sections, when the author exports, then the author has one file with only those sections, in that theme, that a reader opens without the authoring tools.
    objectives:
      - O-001
    requirements:
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
---

# Features

Each feature is one stage of the golden thread, J-001, that the viewer delivers.

| ID | Stage | Name | Requirements |
| --- | --- | --- | --- |
| FEAT-001 | ST-001 | Open the PRD | FR-001, FR-002, FR-003, FR-021, FR-022, FR-024 |
| FEAT-002 | ST-002 | Check the grades | FR-004, FR-025 |
| FEAT-003 | ST-003 | Go to a weak section | FR-005, FR-006, FR-007, FR-008, FR-023 |
| FEAT-004 | ST-004 | Fix the section | FR-009 |
| FEAT-005 | ST-005 | Export the PRD | FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020 |

## FEAT-001. Open the PRD

**Users:** PRD author (PER-001).

**Outcome:** The whole PRD, with the status of every section

**Success metric:** O-001: Median calendar days from the day the author sends a PRD version to a stakeholder, to the day of the first written feedback from any stakeholder on that version. Target: 2 days or less.

**Acceptance:**

- Given a PRD set with 18 documents, when the author opens it, then the author sees the product name, the version, and the status of every document in order.

## FEAT-002. Check the grades

**Users:** PRD author (PER-001).

**Outcome:** A list of the sections that are weak or not started

**Success metric:** O-002: Count of blocking defects in a PRD version on the day the author sends it to a stakeholder, read from the grades in the export. Target: 0 blocking defects in every version sent.

**Acceptance:**

- Given a set with graded and ungraded sections, when the author checks the grades, then the author sees the score, blocking count, and grade date of each graded section, and which sections are not graded.

## FEAT-003. Go to a weak section

**Users:** PRD author (PER-001), developer who uses the authoring tools (PER-002).

**Outcome:** The section or the item, with its status and grade

**Success metric:** O-001: Median calendar days from the day the author sends a PRD version to a stakeholder, to the day of the first written feedback from any stakeholder on that version. Target: 2 days or less.

**Acceptance:**

- Given a weak section, when the author selects it or searches for one of its items, then the author reads it with its status, score, and blocking count.

## FEAT-004. Fix the section

**Users:** PRD author (PER-001).

**Outcome:** The changed section, with its new grade

**Success metric:** O-001: Median calendar days from the day the author sends a PRD version to a stakeholder, to the day of the first written feedback from any stakeholder on that version. Target: 2 days or less.

**Acceptance:**

- Given the author reads a section in the viewer, when the authoring tools save a new version of it, then the author sees the new text and grade without any action.

## FEAT-005. Export the PRD

**Users:** PRD author (PER-001), developer who uses the authoring tools (PER-002), engineering lead (PER-003), product sponsor (PER-004).

**Outcome:** One file that a reader can open without the tools, or a printed copy

**Success metric:** O-001: Median calendar days from the day the author sends a PRD version to a stakeholder, to the day of the first written feedback from any stakeholder on that version. Target: 2 days or less.

**Acceptance:**

- Given the author selects a format, a theme, and some sections, when the author exports, then the author has one file with only those sections, in that theme, that a reader opens without the authoring tools.
