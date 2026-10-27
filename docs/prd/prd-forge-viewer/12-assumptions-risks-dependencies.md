---
id: prd-forge-viewer-ard
kind: assumptions-risks-dependencies
schema: prd-forge/assumptions-risks-dependencies@1
title: Assumptions, risks, and dependencies
status: final
updated: 2026-10-26
domain: software product management
section: 11
order: 120
score: 96
blocking: 0
graded: 2026-10-26
assumptions:
  - id: A-001
    assumption: Stakeholders open PDF and Word files without installing anything.
    if_false: C-001 changes, and FR-010 and FR-011 need other formats.
    validated_by: Send the first export of this PRD to PER-003 and PER-004 and ask.
    owner: Richard Hightower
  - id: A-002
    assumption: The PRD set is on the same computer as the viewer.
    if_false: FR-001 and FR-002 change, and NFR-005 and NFR-006 need new targets.
    validated_by: Ask the first three authors where they keep their PRD sets.
    owner: Richard Hightower
  - id: A-003
    assumption: The PRD Forge version 1 format stays the same until release 1 ships.
    if_false: C-003 changes, and FR-001, FR-003, and FR-004 can fail on new files (R-001).
    validated_by: D-001.
    owner: Richard Hightower
  - id: A-004
    assumption: >-
      Authors want a viewer, and the current command-line export is not enough
      for them.
    if_false: >-
      O-001 does not move because of the viewer, and P-001 and P-002 need a
      different answer.
    validated_by: Measure O-001 on this PRD with and without the viewer (Q-001).
    owner: Richard Hightower
risks:
  - id: R-001
    risk: A change to the PRD Forge document format breaks the viewer.
    likelihood: medium
    impact: high
    mitigation: >-
      C-003 fixes the format at version 1. FR-003 shows each unreadable document
      by name. D-001 keeps the format stable for release 1.
    owner: Richard Hightower
  - id: R-002
    risk: Few teams use PRD Forge, so the viewer has few users.
    likelihood: medium
    impact: medium
    mitigation: Measure O-001 on this PRD first, and report it by 2027-03-31.
    owner: Richard Hightower
  - id: R-003
    risk: Nobody measures the baseline for O-001, so nobody can show success.
    likelihood: medium
    impact: medium
    mitigation: Q-001, due 2026-11-30.
    owner: Richard Hightower
dependencies:
  - id: D-001
    need: PRD Forge keeps the version 1 document format stable until release 1 ships.
    from: PRD Forge maintainers, owned by Richard Hightower
    by: 2026-10-26
    status: committed
    blocks:
      - C-003
      - FR-001
      - FR-003
      - FR-004
  - id: D-002
    need: PRD Forge records the findings behind each grade in the PRD set.
    from: PRD Forge maintainers, owned by Richard Hightower
    by: 2026-10-26
    status: delivered
    blocks:
      - OUT-002
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer-decision-rights, kind: decision-rights, path: ./11-decision-rights.md, title: Decision rights }
  next: { id: prd-forge-viewer-open-questions, kind: open-questions, path: ./13-open-questions.md, title: Open questions }
  related:
    - { id: prd-forge-viewer-open-questions, kind: open-questions, path: ./13-open-questions.md, title: Open questions }
---

# Assumptions, risks, and dependencies

Release 1 target date: 2026-10-26. Release 2 target date: 2026-11-06. The PRD
owner set both on 2026-10-26.

| ID | Assumption | If it is false |
| --- | --- | --- |
| A-001 | Stakeholders open PDF and Word without installing anything | C-001, FR-010, and FR-011 change |
| A-002 | The PRD set is on the same computer as the viewer | FR-001, FR-002, NFR-005, and NFR-006 change |
| A-003 | The PRD Forge version 1 format is stable until release 1 | C-003, FR-001, FR-003, and FR-004 can fail |
| A-004 | Authors want a viewer, not only the command-line export | O-001 does not move |

| ID | Risk | Likelihood | Impact | Owner |
| --- | --- | --- | --- | --- |
| R-001 | A PRD Forge format change breaks the viewer | medium | high | Richard Hightower |
| R-002 | Few teams use PRD Forge | medium | medium | Richard Hightower |
| R-003 | Nobody measures the O-001 baseline | medium | medium | Richard Hightower |

| ID | Need | From | By | Status | Blocks |
| --- | --- | --- | --- | --- | --- |
| D-001 | Stable PRD Forge version 1 format | PRD Forge | 2026-10-26 | committed | C-003, FR-001, FR-003, FR-004 |
| D-002 | PRD Forge records grade findings | PRD Forge | 2026-10-26 | delivered | OUT-002 |

D-002 was delivered in PRD Forge 0.2.0, which writes the reasons for each grade
beside each section.
