---
id: prd-forge-viewer-decision-rights
kind: decision-rights
schema: prd-forge/decision-rights@1
title: Decision rights
status: final
updated: 2026-10-27
domain: software product management
section: 10
order: 110
score: 88
blocking: 0
graded: 2026-10-27
decisions:
  - id: TR-001
    decision: Is this the correct PRD set and version (ST-001)
    stages: [ST-001]
    approver: PER-001
    delegable_to_agent: true
    never_delegated: false
    agent_role: proposes
    evidence_required: The product name and version of the PRD set that is open.
    escalation: >-
      The viewer proposes the PRD set from the last session. Nobody else
      decides. The author opens a different PRD set at any time.
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
    stages: [ST-002, ST-003]
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
    stages: [ST-004]
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
    decision: The format, the theme, and the sections of an export (ST-005)
    stages: [ST-005]
    approver: PER-001
    delegable_to_agent: false
    never_delegated: false
    evidence_required: The selected format, theme, and sections before the export starts.
    escalation: >-
      The export waits for the author. Nobody else decides.
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
    stages: [ST-005]
    approver: PER-001
    delegable_to_agent: true
    never_delegated: false
    agent_role: acts
    evidence_required: The status of every section in the PRD set at the time of export.
    escalation: >-
      PER-001 decides through the status of each section in the authoring tools.
      The viewer applies the rule, and no person can change the mark in the
      viewer. If the author thinks that the mark is wrong, the author changes the status
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
    stages: [ST-006]
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
    stages: [ST-007, ST-012]
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
    stages: [ST-007]
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
    stages: [ST-009]
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
    stages: [ST-003]
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
    stages: [ST-011]
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
  - id: TR-012
    decision: Is this the correct PRD set and version, in the developer's session (ST-008)
    stages: [ST-008]
    approver: PER-002
    delegable_to_agent: true
    never_delegated: false
    agent_role: proposes
    evidence_required: The product name and version of the PRD set that is open.
    escalation: >-
      The viewer proposes the PRD set from the last session. Nobody else
      decides. The developer opens a different PRD set at any time.
    acceptance:
      - >-
        Given the developer closed the viewer with a PRD set open, when the
        developer opens the viewer again, then the same PRD set is open and the
        developer sees its product name and version.
      - >-
        Given the same PRD set reopened, when the developer opens a different PRD
        set, then the different PRD set is open.
  - id: TR-013
    decision: The format, the theme, and the sections of a developer's export (ST-010)
    stages: [ST-010]
    approver: PER-002
    delegable_to_agent: false
    never_delegated: false
    evidence_required: The selected format, theme, and sections before the export starts.
    escalation: The export waits for the developer. Nobody else decides.
    acceptance:
      - >-
        Given the developer starts an export, when the developer has not
        selected any section, then the developer has no file.
      - >-
        Given the developer selects a format and two sections, when the export
        finishes, then the developer sees the selected format and only those two
        sections in the file.
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
proposes the PRD set from the last session (TR-001, TR-012), and the viewer decides if
an export shows "Draft" by a fixed rule (TR-005).

"Software may decide: No" and "Always a person: No" together mean that a person
decides, but the viewer can offer a default, such as the last theme used.

- PER-004 approves a version. PER-001, PER-002, PER-003, and PER-005 may not.
- PER-001 decides what goes to whom. The viewer may not send anything.
- No person may remove the "Draft" mark in the viewer.

| ID | Decision | Approver | Software may decide | Always a person |
| --- | --- | --- | --- | --- |
| TR-001 | Is this the correct PRD set and version | PER-001 | Yes, it proposes the last set | No |
| TR-002 | Which sections to fix first | PER-001 | No | Yes |
| TR-003 | If a section is good enough to send | PER-001 | No | Yes |
| TR-004 | Format, theme, and sections of an export | PER-001 | No | No |
| TR-005 | If an export shows "Draft" | PER-001, through section status | Yes | No |
| TR-006 | Who receives a version | PER-001 | No | Yes |
| TR-007 | Approve or reject a version | PER-004 | No | Yes |
| TR-008 | If the team can build from the PRD | PER-003 | No | Yes |
| TR-009 | Which items apply to the current work | PER-002 | No | No |
| TR-010 | Fix a section now, or send as a draft | PER-001 | No | Yes |
| TR-011 | Enough to decide, or ask the author first | PER-004 | No | Yes |
| TR-012 | Is this the correct PRD set, in the developer's session | PER-002 | Yes, it proposes the last set | No |
| TR-013 | Format, theme, and sections of a developer's export | PER-002 | No | No |

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

<!-- prd-forge:details -->

## Details

Every item in this document, with each of its fields.

### TR-001

**Decision:** Is this the correct PRD set and version (ST-001)

**Stages:** ST-001

**Approver:** PER-001

**Delegable to an agent:** yes

**Never delegated:** no

**Agent role:** proposes

**Evidence required:** The product name and version of the PRD set that is open.

**Escalation:** The viewer proposes the PRD set from the last session. Nobody else decides. The author opens a different PRD set at any time.

**Acceptance:**

1. Given the author closed the viewer with a PRD set open, when the author opens the viewer again, then the same PRD set is open and the author sees its product name and version.
2. Given the same PRD set reopened, when the author opens a different PRD set, then the different PRD set is open.

### TR-002

**Decision:** Which sections the author fixes before anyone else reads the PRD (ST-002, ST-003)

**Stages:** ST-002, ST-003

**Approver:** PER-001

**Delegable to an agent:** no

**Never delegated:** yes

**Evidence required:** The status, score, count of blocking defects, and grade date of every section, in one view.

**Escalation:** The decision waits for the author. Nobody else decides.

**Acceptance:**

1. Given sections with different scores, when the author views the grades, then the viewer shows every section and does not mark any section as "to fix" on its own.

### TR-003

**Decision:** If a section is good enough to send (ST-004)

**Stages:** ST-004

**Approver:** PER-001

**Delegable to an agent:** no

**Never delegated:** yes

**Evidence required:** The new score, count of blocking defects, and status of the changed section.

**Escalation:** The decision waits for the author. Nobody else decides.

**Acceptance:**

1. Given a section that the authoring tools changed, when the author views it, then the author sees its new score, count of blocking defects, and status before choosing to export.

### TR-004

**Decision:** The format, the theme, and the sections of an export (ST-005)

**Stages:** ST-005

**Approver:** PER-001

**Delegable to an agent:** no

**Never delegated:** no

**Evidence required:** The selected format, theme, and sections before the export starts.

**Escalation:** The export waits for the author. Nobody else decides.

**Acceptance:**

1. Given the author starts an export, when the author has not selected a format, then the author has no file.
2. Given the author starts an export, when the author has not selected any section, then the author has no file.
3. Given the author selects a format, a theme, and sections, when the export finishes, then the author sees the selected format, theme, and sections in the file.

### TR-005

**Decision:** If an export shows the word "Draft" (ST-005)

**Stages:** ST-005

**Approver:** PER-001

**Delegable to an agent:** yes

**Never delegated:** no

**Agent role:** acts

**Evidence required:** The status of every section in the PRD set at the time of export.

**Escalation:** PER-001 decides through the status of each section in the authoring tools. The viewer applies the rule, and no person can change the mark in the viewer. If the author thinks that the mark is wrong, the author changes the status of the sections in the authoring tools and exports again.

**Acceptance:**

1. Given the root document and 15 sections at final and 1 section at review, when the author exports, then the first page shows "Draft".
2. Given all 17 section documents and the root document at final, when the author exports, then the export does not show "Draft".
3. Given an export that shows "Draft", when the author tries to remove the mark in the viewer, then the mark stays.

### TR-006

**Decision:** Who receives a version of the PRD (ST-006)

**Stages:** ST-006

**Approver:** PER-001

**Delegable to an agent:** no

**Never delegated:** yes

**Evidence required:** The version and the draft mark of the export.

**Escalation:** The decision waits for the author. Nobody else decides.

**Acceptance:**

1. Given the author makes an export, when the export finishes, then the viewer has sent the file to nobody.

### TR-007

**Decision:** Approve or reject a version of the PRD (ST-007, ST-012)

**Stages:** ST-007, ST-012

**Approver:** PER-004

**Delegable to an agent:** no

**Never delegated:** yes

**Evidence required:** The export, with the version, the draft mark, and the status and score of every section.

**Escalation:** When the sponsor is not available, the approval waits. Nobody else approves (Q-006). When the sponsor rejects a version, the author records the rejection and its reason in the change log in section 15, fixes the PRD, and sends a new version.

**Acceptance:**

1. Given any export, when the sponsor opens it, then the export does not say that the PRD is approved. The author records the approval in the change log in section 15.

### TR-008

**Decision:** If the team can build the product from the PRD (ST-007)

**Stages:** ST-007

**Approver:** PER-003

**Delegable to an agent:** no

**Never delegated:** yes

**Evidence required:** The export, with every section and the status and score of each.

**Escalation:** The engineering lead sends comments to the author, who fixes the PRD in the authoring tools. If the engineering lead is not available, the decision waits.

**Acceptance:**

1. Given an export of the whole PRD set, when the engineering lead opens it, then every section is in the file, with its status and score.

### TR-009

**Decision:** Which items apply to the current work (ST-009)

**Stages:** ST-009

**Approver:** PER-002

**Delegable to an agent:** no

**Never delegated:** no

**Evidence required:** The matching items, each with its id and section.

**Escalation:** The decision waits for the developer. Nobody else decides.

**Acceptance:**

1. Given a search with matches, when the developer views the results, then the viewer selects no item on its own.

### TR-010

**Decision:** Fix a section now, or send the PRD as a draft (ST-003)

**Stages:** ST-003

**Approver:** PER-001

**Delegable to an agent:** no

**Never delegated:** yes

**Evidence required:** The status, score, and count of blocking defects of the section.

**Escalation:** The decision waits for the author. Nobody else decides.

**Acceptance:**

1. Given a section with 1 blocking defect, when the author exports, then the viewer makes the export and shows "Draft", and does not stop the export.

### TR-011

**Decision:** If the export has enough for a decision, or the author must answer questions first (ST-011)

**Stages:** ST-011

**Approver:** PER-004

**Delegable to an agent:** no

**Never delegated:** yes

**Evidence required:** The version, the draft mark, the executive summary, and the status and score of every section.

**Escalation:** The sponsor asks the author. The approval waits (Q-006).

**Acceptance:**

1. Given an export of the whole PRD set, when the sponsor opens it, then the first two pages show the version, the draft mark, the executive summary, and the contents list with the status and score of every section.

### TR-012

**Decision:** Is this the correct PRD set and version, in the developer's session (ST-008)

**Stages:** ST-008

**Approver:** PER-002

**Delegable to an agent:** yes

**Never delegated:** no

**Agent role:** proposes

**Evidence required:** The product name and version of the PRD set that is open.

**Escalation:** The viewer proposes the PRD set from the last session. Nobody else decides. The developer opens a different PRD set at any time.

**Acceptance:**

1. Given the developer closed the viewer with a PRD set open, when the developer opens the viewer again, then the same PRD set is open and the developer sees its product name and version.
2. Given the same PRD set reopened, when the developer opens a different PRD set, then the different PRD set is open.

### TR-013

**Decision:** The format, the theme, and the sections of a developer's export (ST-010)

**Stages:** ST-010

**Approver:** PER-002

**Delegable to an agent:** no

**Never delegated:** no

**Evidence required:** The selected format, theme, and sections before the export starts.

**Escalation:** The export waits for the developer. Nobody else decides.

**Acceptance:**

1. Given the developer starts an export, when the developer has not selected any section, then the developer has no file.
2. Given the developer selects a format and two sections, when the export finishes, then the developer sees the selected format and only those two sections in the file.

<!-- /prd-forge:details -->
