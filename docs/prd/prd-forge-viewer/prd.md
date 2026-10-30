---
id: prd-forge-viewer
kind: prd
schema: prd-forge/prd-root@1
title: PRD Forge Viewer PRD
status: draft
updated: 2026-10-30
domain: software product management
product: PRD Forge Viewer
slug: prd-forge-viewer
version: 0.6.2
owner: Richard Hightower
stakeholders:
  - Engineering lead (PER-003)
  - Product sponsor (PER-004)
  - Developers (PER-002, PER-005)
created: 2026-10-26
golden_thread: J-001
primary_persona: PER-001
approvers: [PER-004]
summary:
  problem: >-
    A PRD Forge set is 18 linked files. Authors cannot read it as one document
    or see all grades at once, and stakeholders without the authoring tools
    cannot read it, so feedback waits.
  users: >-
    PRD authors and developers who use the authoring tools, and the engineering
    lead, sponsor, and developers who read the exported PRD.
  why_now: >-
    The authoring tools had their first release in October 2026, and teams adopt
    them only if stakeholders can review a PRD without them.
  bet: >-
    The author reads the whole PRD and its grades in one place, sees changes
    as they happen, and sends stakeholders a themed export marked with its
    version and draft status.
  measure: >-
    Median days from sending a PRD version to the first stakeholder feedback:
    target 2 days or less by 2027-03-31; baseline about 10 days (owner estimate).
links:
  parent: null
  children:
    - { id: prd-forge-viewer-problem, kind: problem-opportunity, path: ./01-problem-opportunity.md, title: Problem and opportunity, section: 1, order: 10, status: final }
    - { id: prd-forge-viewer-market, kind: customer-market, path: ./02-customer-market.md, title: Target customer and market, section: 2, order: 20, status: final }
    - { id: prd-forge-viewer-objectives, kind: objectives-metrics, path: ./03-objectives-metrics.md, title: Objectives and success metrics, section: 3, order: 30, status: final }
    - { id: prd-forge-viewer-personas, kind: personas, path: ./04-personas.md, title: Users and personas, section: 4, order: 40, status: final }
    - { id: prd-forge-viewer-journeys, kind: journeys, path: ./05-user-journeys.md, title: User journeys, section: 5, order: 50, status: final }
    - { id: prd-forge-viewer-scenarios, kind: scenarios, path: ./06-scenarios.md, title: Scenarios, section: 5, order: 60, status: final }
    - { id: prd-forge-viewer-scope, kind: scope, path: ./07-scope.md, title: Scope, section: 6, order: 70, status: final }
    - { id: prd-forge-viewer-functional-requirements, kind: functional-requirements, path: ./08-functional-requirements.md, title: Functional requirements, section: 7, order: 80, status: final }
    - { id: prd-forge-viewer-wireframes, kind: wireframes, path: ./08-wireframes.md, title: Wireframes, section: 7, order: 85, status: final }
    - { id: prd-forge-viewer-nfr, kind: nonfunctional-requirements, path: ./09-nonfunctional-requirements.md, title: Non-functional requirements, section: 8, order: 90, status: final }
    - { id: prd-forge-viewer-constraints, kind: constraints, path: ./10-constraints.md, title: Constraints, section: 9, order: 100, status: final }
    - { id: prd-forge-viewer-decision-rights, kind: decision-rights, path: ./11-decision-rights.md, title: Decision rights, section: 10, order: 110, status: final }
    - { id: prd-forge-viewer-ard, kind: assumptions-risks-dependencies, path: ./12-assumptions-risks-dependencies.md, title: Assumptions, risks, and dependencies, section: 11, order: 120, status: review }
    - { id: prd-forge-viewer-open-questions, kind: open-questions, path: ./13-open-questions.md, title: Open questions, section: 12, order: 130, status: draft }
    - { id: prd-forge-viewer-release-plan, kind: release-plan, path: ./14-release-plan.md, title: Release plan, section: 13, order: 140, status: review }
    - { id: prd-forge-viewer-glossary, kind: glossary, path: ./15-glossary.md, title: Glossary, section: 14, order: 150, status: draft }
    - { id: prd-forge-viewer-change-log, kind: change-log, path: ./16-change-log.md, title: Change log, section: 15, order: 160, status: draft }
---

# PRD Forge Viewer PRD

PRD authors cannot read an 18-file PRD Forge set as one document or see every
grade at once. Stakeholders without the authoring tools cannot read it at all,
so feedback waits. The viewer shows the whole set and its grades in one place,
shows changes as the authoring tools make them, searches, and makes themed
export files marked with the version and draft status (formats in IN-006). Release 1 is due
2026-11-06 and delivers J-001, the golden thread. Success is feedback within 2
days of sending a version, by 2027-03-31.

| Section | Document |
| --- | --- |
| 1 | [Problem and opportunity](./01-problem-opportunity.md) |
| 2 | [Target customer and market](./02-customer-market.md) |
| 3 | [Objectives and success metrics](./03-objectives-metrics.md) |
| 4 | [Users and personas](./04-personas.md) |
| 5 | [User journeys](./05-user-journeys.md) and [Scenarios](./06-scenarios.md) |
| 6 | [Scope](./07-scope.md) |
| 7 | [Functional requirements](./08-functional-requirements.md) |
| 7 | [Wireframes](./08-wireframes.md) |
| 8 | [Non-functional requirements](./09-nonfunctional-requirements.md) |
| 9 | [Constraints](./10-constraints.md) |
| 10 | [Decision rights](./11-decision-rights.md) |
| 11 | [Assumptions, risks, and dependencies](./12-assumptions-risks-dependencies.md) |
| 12 | [Open questions](./13-open-questions.md) |
| 13 | [Release plan](./14-release-plan.md) |
| 14 | [Glossary](./15-glossary.md) |
| 15 | [Change log](./16-change-log.md) |

<!-- prd-forge:details -->

## Details

Every item in this document, with each of its fields.

**Version:** 0.6.2

**Owner:** Richard Hightower

**Stakeholders:**

- Engineering lead (PER-003)
- Product sponsor (PER-004)
- Developers (PER-002, PER-005)

**Created:** 2026-10-26

**Golden thread:** J-001

**Primary persona:** PER-001

**Approvers:** PER-004

**Summary:**

- **Problem:** A PRD Forge set is 18 linked files. Authors cannot read it as one document or see all grades at once, and stakeholders without the authoring tools cannot read it, so feedback waits.
- **Users:** PRD authors and developers who use the authoring tools, and the engineering lead, sponsor, and developers who read the exported PRD.
- **Why now:** The authoring tools had their first release in October 2026, and teams adopt them only if stakeholders can review a PRD without them.
- **Bet:** The author reads the whole PRD and its grades in one place, sees changes as they happen, and sends stakeholders a themed export marked with its version and draft status.
- **Measure:** Median days from sending a PRD version to the first stakeholder feedback: target 2 days or less by 2027-03-31; baseline about 10 days (owner estimate).

<!-- /prd-forge:details -->
