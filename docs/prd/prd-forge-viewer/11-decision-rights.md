---
id: prd-forge-viewer-decision-rights
kind: decision-rights
schema: prd-forge/decision-rights@1
title: Decision rights
status: final
updated: 2026-10-26
domain: software product management
section: 10
order: 110
score: 96
blocking: 0
graded: 2026-10-26
decisions:
  - id: TR-001
    decision: Is this the correct PRD set and version (ST-001, ST-008)
    approver: >-
      PER-001 in the author's session, PER-002 in the developer's session. The
      viewer proposes the PRD set from the last session.
    delegable_to_agent: true
    never_delegated: false
    evidence_required: The product name and version of the PRD set that is open.
    escalation: >-
      Nobody else decides. The person who uses the viewer opens a different PRD
      set at any time.
    acceptance:
      - >-
        Given the author closed the viewer with a PRD set open, when the author
        opens the viewer again, then the same PRD set is open and the author sees
        its product name and version.
      - >-
        Given the same PRD set reopened, when the author opens a different PRD
        set, then the different PRD set is open.
  - id: TR-002
    decision: Which sections the author fixes before anyone else reads the PRD (ST-002, ST-003)
    approver: PER-001
    delegable_to_agent: false
    never_delegated: true
    evidence_required: >-
      The status, score, count of blocking defects, and grade date of every
      section, in one view.
    escalation: The decision waits for the author. Nobody else decides.
    acceptance:
      - >-
        Given sections with different scores, when the author views the grades,
        then the viewer shows every section and does not mark any section as
        "to fix" on its own.
  - id: TR-003
    decision: If a section is good enough to send (ST-004)
    approver: PER-001
    delegable_to_agent: false
    never_delegated: true
    evidence_required: The new score, count of blocking defects, and status of the changed section.
    escalation: The decision waits for the author. Nobody else decides.
    acceptance:
      - >-
        Given a section that the authoring tools changed, when the author views
        it, then the author sees its new score, count of blocking defects, and
        status before choosing to export.
  - id: TR-004
    decision: The format, the theme, and the sections of an export (ST-005, ST-010)
    approver: PER-001 for the whole PRD set or some sections, PER-002 for selected sections
    delegable_to_agent: false
    never_delegated: false
    evidence_required: The selected format, theme, and sections before the export starts.
    escalation: The export waits for the person who makes it. Nobody else decides.
    acceptance:
      - >-
        Given the author starts an export, when the author has not selected a
        format, then the author has no file.
      - >-
        Given the author starts an export, when the author has not selected any
        section, then the author has no file.
      - >-
        Given the author selects a format, a theme, and sections, when the
        export finishes, then the author sees the selected format, theme, and
        sections in the file.
  - id: TR-005
    decision: If an export shows the word "Draft" (ST-005)
    approver: >-
      PER-001, through the status of each section in the authoring tools. The
      viewer applies the rule, and no person can change the mark in the viewer.
    delegable_to_agent: true
    never_delegated: false
    evidence_required: The status of every section in the PRD set at the time of export.
    escalation: >-
      If the author thinks that the mark is wrong, the author changes the status
      of the sections in the authoring tools and exports again.
    acceptance:
      - >-
        Given the root document and 15 sections at final and 1 section at review, when the author
        exports, then the first page shows "Draft".
      - >-
        Given all 17 section documents and the root document at final, when the author
        exports, then the export does not show "Draft".
      - >-
        Given an export that shows "Draft", when the author tries to remove the
        mark in the viewer, then the mark stays.
  - id: TR-006
    decision: Who receives a version of the PRD (ST-006)
    approver: PER-001
    delegable_to_agent: false
    never_delegated: true
    evidence_required: The version and the draft mark of the export.
    escalation: The decision waits for the author. Nobody else decides.
    acceptance:
      - >-
        Given the author makes an export, when the export finishes, then the viewer has
        sent the file to nobody.
  - id: TR-007
    decision: Approve or reject a version of the PRD (ST-007, ST-012)
    approver: PER-004
    delegable_to_agent: false
    never_delegated: true
    evidence_required: >-
      The export, with the version, the draft mark, and the status and score of
      every section.
    escalation: >-
      When the sponsor is not available, the approval waits. Nobody else
      approves (Q-006). When the sponsor rejects a version, the author records
      the rejection and its reason in the change log in section 15, fixes the
      PRD, and sends a new version.
    acceptance:
      - >-
        Given any export, when the sponsor opens it, then the export does not
        say that the PRD is approved. The author records the approval in the
        change log in section 15.
  - id: TR-008
    decision: If the team can build the product from the PRD (ST-007)
    approver: PER-003
    delegable_to_agent: false
    never_delegated: true
    evidence_required: The export, with every section and the status and score of each.
    escalation: >-
      The engineering lead sends comments to the author, who fixes the PRD in the
      authoring tools. If the engineering lead is not available, the decision
      waits.
    acceptance:
      - >-
        Given an export of the whole PRD set, when the engineering lead opens it,
        then every section is in the file, with its status and score.
  - id: TR-009
    decision: Which items apply to the current work (ST-009)
    approver: PER-002
    delegable_to_agent: false
    never_delegated: false
    evidence_required: The matching items, each with its id and section.
    escalation: The decision waits for the developer. Nobody else decides.
    acceptance:
      - >-
        Given a search with matches, when the developer views the results, then
        the viewer selects no item on its own.
  - id: TR-010
    decision: Fix a section now, or send the PRD as a draft (ST-003)
    approver: PER-001
    delegable_to_agent: false
    never_delegated: true
    evidence_required: The status, score, and count of blocking defects of the section.
    escalation: The decision waits for the author. Nobody else decides.
    acceptance:
      - >-
        Given a section with 1 blocking defect, when the author exports, then the
        viewer makes the export and shows "Draft", and does not stop the export.
  - id: TR-011
    decision: If the export has enough for a decision, or the author must answer questions first (ST-011)
    approver: PER-004
    delegable_to_agent: false
    never_delegated: true
    evidence_required: The version, the draft mark, the executive summary, and the status and score of every section.
    escalation: The sponsor asks the author. The approval waits (Q-006).
    acceptance:
      - >-
        Given an export of the whole PRD set, when the sponsor opens it, then
        the first two pages show the version, the draft mark, the executive
        summary, and the contents list with the status and score of every
        section.
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer-constraints, kind: constraints, path: ./10-constraints.md, title: Constraints }
  next: { id: prd-forge-viewer-ard, kind: assumptions-risks-dependencies, path: ./12-assumptions-risks-dependencies.md, title: Assumptions, risks, and dependencies }
  related:
    - { id: prd-forge-viewer-journeys, kind: journeys, path: ./05-user-journeys.md, title: User journeys }
    - { id: prd-forge-viewer-personas, kind: personas, path: ./04-personas.md, title: Users and personas }
---

# Decision rights

![Who decides what](diagrams/decision-rights.svg)

A person makes every decision in the journeys, with two exceptions. The viewer
proposes the PRD set from the last session (TR-001), and the viewer decides if
an export shows "Draft" by a fixed rule (TR-005).

"Software may decide: No" and "Always a person: No" together mean that a person
decides, but the viewer can offer a default, such as the last theme used.

- PER-004 approves a version. PER-001, PER-002, PER-003, and PER-005 may not.
- PER-001 decides what goes to whom. The viewer may not send anything.
- No person may remove the "Draft" mark in the viewer.

| ID | Decision | Approver | Software may decide | Always a person |
| --- | --- | --- | --- | --- |
| TR-001 | Is this the correct PRD set and version | PER-001, PER-002 | Yes, it proposes the last set | No |
| TR-002 | Which sections to fix first | PER-001 | No | Yes |
| TR-003 | If a section is good enough to send | PER-001 | No | Yes |
| TR-004 | Format, theme, and sections of an export | PER-001, PER-002 | No | No |
| TR-005 | If an export shows "Draft" | PER-001, through section status | Yes | No |
| TR-006 | Who receives a version | PER-001 | No | Yes |
| TR-007 | Approve or reject a version | PER-004 | No | Yes |
| TR-008 | If the team can build from the PRD | PER-003 | No | Yes |
| TR-009 | Which items apply to the current work | PER-002 | No | No |
| TR-010 | Fix a section now, or send as a draft | PER-001 | No | Yes |
| TR-011 | Enough to decide, or ask the author first | PER-004 | No | Yes |

## TR-005. The "Draft" rule

An export shows "Draft" when any document in the PRD set is not at final. The
author cannot remove the mark in the viewer. To remove it, the author takes every
section to final in the authoring tools. The PRD owner decided this rule on 2026-10-26.

## TR-007. approval

Only the sponsor approves a version. The export never says that a PRD is
approved. The author records the approval in section 15. The escalation when the
sponsor is not available: the approval waits, and nobody else approves (Q-006).
When the sponsor rejects a version, the author records the rejection and its
reason in section 15, fixes the PRD, and sends a new version.
