---
id: prd-forge-viewer-objectives
kind: objectives-metrics
schema: prd-forge/objectives-metrics@1
title: Objectives and success metrics
status: review
updated: 2026-10-28
domain: software product management
section: 3
order: 30
score: 83
blocking: 0
graded: 2026-10-26
objectives:
  - id: O-001
    objective: Stakeholders give feedback on a PRD version sooner.
    problems: [P-001, P-002]
    metric: >-
      Median calendar days from the day the author sends a PRD version to a
      stakeholder, to the day of the first written feedback from any
      stakeholder on that version.
    baseline: >-
      About 10 calendar days, from the historic PRDs written before the
      authoring tools (PRD owner, 2026-10-26, confirmed 2026-10-28). This PRD
      does not count for review time, because it is for a new tool (Q-001).
    baseline_question: Q-001
    target: 2 days or less
    by: 2027-03-31
    owner: Richard Hightower, PRD owner
  - id: O-002
    objective: Authors fix blocking defects before stakeholders see a version.
    problems: [P-003]
    metric: >-
      Count of blocking defects in a PRD version on the day the author sends it
      to a stakeholder, read from the grades in the export.
    baseline: >-
      1 blocking defect in version 0.2.0 of this PRD, sent on or after
      2026-10-26.
    target: 0 blocking defects in every version sent
    by: 2027-03-31
    owner: Richard Hightower, PRD owner
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer-market, kind: customer-market, path: ./02-customer-market.md, title: Target customer and market }
  next: { id: prd-forge-viewer-personas, kind: personas, path: ./04-personas.md, title: Users and personas }
  related:
    - { id: prd-forge-viewer-problem, kind: problem-opportunity, path: ./01-problem-opportunity.md, title: Problem and opportunity }
    - { id: prd-forge-viewer-open-questions, kind: open-questions, path: ./13-open-questions.md, title: Open questions }
---

# Objectives and success metrics

| ID | Objective | Metric | Baseline | Target | By | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| O-001 | Stakeholders give feedback sooner | Median days from send to first written feedback | About 10 days (owner estimate) | 2 days or less | 2027-03-31 | Richard Hightower |
| O-002 | Blocking defects fixed before sending | Blocking defects in a version on the day it is sent | 1 (this PRD, 0.2.0) | 0 | 2027-03-31 | Richard Hightower |

## O-001. Stakeholders give feedback on a PRD version sooner

Metric: median calendar days from the day the author sends a PRD version to a
stakeholder, to the day of the first written feedback from any stakeholder on
that version. Serves P-001 and P-002.

Baseline: about 10 calendar days, from the historic PRDs written before the
authoring tools (PRD owner, 2026-10-26, confirmed 2026-10-28). This PRD does not
count for review time, because it is for a new tool (Q-001).

Target: 2 days or less by 2027-03-31. Owner: Richard Hightower, PRD owner.

## O-002. Authors fix blocking defects before stakeholders see a version

Metric: the count of blocking defects in a PRD version on the day the author
sends it. Serves P-003. Baseline: 1, in version 0.2.0 of this PRD. Target: 0 in
every version sent, by 2027-03-31.
