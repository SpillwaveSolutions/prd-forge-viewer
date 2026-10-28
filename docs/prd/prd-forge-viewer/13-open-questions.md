---
id: prd-forge-viewer-open-questions
kind: open-questions
schema: prd-forge/open-questions@1
title: Open questions
status: draft
updated: 2026-10-28
domain: software product management
section: 12
order: 130
questions:
  - id: Q-001
    question: >-
      How long does it take today from a finished PRD to stakeholder feedback?
      The PRD owner estimates about 10 days. Measure it on this PRD to replace
      the estimate.
    decider: Richard Hightower
    by: 2026-11-30
    answer: >-
      The historic PRDs took about 10 calendar days. This PRD does not count for
      review time, because it is for a new tool. The 10 days stay the baseline
      of O-001.
    answered: 2026-10-28
    blocks:
      - P-001
      - P-002
  - id: Q-002
    question: >-
      How many stakeholders review a typical PRD, and how many of them have
      Claude Code and PRD Forge?
    decider: Richard Hightower
    by: 2026-11-30
    blocks:
      - P-002
  - id: Q-003
    answered: 2026-10-26
    question: >-
      How often do the PRD author (PER-001) and the developer who uses PRD Forge
      (PER-002) open a PRD in the viewer?
    decider: Richard Hightower
    by: 2026-11-30
    blocks:
      - PER-001
      - PER-002
    answer: >-
      Answered on 2026-10-26. The author opens the viewer several times a day
      while writing a PRD. The frequency for PER-002 is not known.
  - id: Q-004
    answered: 2026-10-26
    question: >-
      The findings behind each grade (what is missing and what to improve) are
      not kept in the PRD set today. Must release 1 show them, and if so, who
      records them so that the author can see them later?
    decider: Richard Hightower
    by: 2026-11-30
    blocks:
      - ST-002
      - ST-003
      - P-003
    answer: >-
      Answered on 2026-10-26. Release 1 does not show the findings behind each
      grade. That is a later feature, and it depends on a change to the authoring
      tools so that they record the findings in the PRD set. Release 1 shows the
      status, score, blocking count, and grade date that the authoring tools
      already record.
  - id: Q-005
    answered: 2026-10-26
    question: Is editing text in the viewer in release 1?
    decider: Richard Hightower
    by: 2026-10-26
    answer: >-
      No. Editing in the viewer is a later feature. In release 1 the author
      changes sections only in the authoring tools. Section 6 records this as a
      non-goal for release 1.
  - id: Q-006
    answered: 2026-10-26
    question: >-
      When the sponsor (PER-004) is not available to approve a version, who
      approves it, or does the approval wait?
    decider: Richard Hightower
    by: 2026-11-30
    blocks:
      - TR-007
    answer: >-
      Answered on 2026-10-26. The approval waits until the sponsor is available.
      Nobody else approves.
  - id: Q-007
    answered: 2026-10-26
    question: >-
      By what date must PRD Forge record the findings behind each grade (D-002),
      and in which release does the viewer show them (OUT-002)?
    decider: Richard Hightower
    by: 2026-10-26
    blocks:
      - D-002
      - OUT-002
    answer: >-
      Answered on 2026-10-26. PRD Forge 0.2.0 already writes the reasons for
      each grade to a grades file beside each section, so D-002 is delivered.
      The PRD owner decides when the viewer shows them.
  - id: Q-008
    question: >-
      J-002 has one happy scenario (SC-005) and one exception (SC-007). What
      other way can a developer's search or export of selected sections go
      wrong, and must release 1 handle it?
    decider: Richard Hightower
    by: 2026-11-30
    answer: >-
      A developer exports a section that is still pending. The export has every
      selected section, and the pending one says that it is not written yet
      (SC-008). Release 1 handles it as a should.
    answered: 2026-10-27
    blocks:
      - J-002
  - id: Q-009
    answered: 2026-10-28
    question: >-
      In one review of this PRD, how many times does the author or a developer
      search for an item before the discussion can start, and how many minutes
      does each search take? Measure it to give P-001 its evidence and cost.
    decider: Richard Hightower
    by: 2026-11-30
    answer: >-
      About 10 searches in one review of this PRD, about 3 minutes each, so
      about 30 minutes for each review (PRD owner estimate, 2026-10-28). P-001
      records it.
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer-ard, kind: assumptions-risks-dependencies, path: ./12-assumptions-risks-dependencies.md, title: Assumptions, risks, and dependencies }
  next: { id: prd-forge-viewer-release-plan, kind: release-plan, path: ./14-release-plan.md, title: Release plan }
---

# Open questions

Questions are collected during the interview and consolidated later.

| ID | Question | Decider | By |
| --- | --- | --- | --- |
| Q-001 | How long from a finished PRD to stakeholder feedback today? Answered: about 10 days on the historic PRDs. | Richard Hightower | 2026-11-30 |
| Q-002 | How many stakeholders review a PRD, and how many have the tools? | Richard Hightower | 2026-11-30 |
| Q-003 | How often do PER-001 and PER-002 open a PRD in the viewer? Answered: the author, several times a day. | Richard Hightower | 2026-11-30 |
| Q-004 | Must release 1 show the findings behind each grade? Answered: no, later, after a change to the authoring tools. | Richard Hightower | 2026-11-30 |
| Q-005 | Is editing text in the viewer in release 1? Answered: no, it is a later feature. | Richard Hightower | 2026-10-26 |
| Q-006 | Who approves when the sponsor is not available? Answered: nobody, the approval waits. | Richard Hightower | 2026-11-30 |
| Q-007 | When must PRD Forge record grade findings? Answered: PRD Forge 0.2.0 does it now. | Richard Hightower | 2026-10-26 |
| Q-008 | What other unhappy path does J-002 need? Answered: an export with a pending section (SC-008). | Richard Hightower | 2026-11-30 |
| Q-009 | How often, and for how long, does a review start with a search for an item? Answered: about 10 searches of about 3 minutes. | Richard Hightower | 2026-11-30 |

## Q-001. Time from a finished PRD to stakeholder feedback

Measure it on this PRD as the baseline. Blocks the cost of inaction for P-001 and
P-002.

Answered on 2026-10-28: the historic PRDs took about 10 calendar days. This PRD
does not count for review time, because it is for a new tool.

## Q-002. Stakeholders per PRD, and how many have the tools

Blocks the evidence for P-002.

## Q-003. How often PER-001 and PER-002 open a PRD in the viewer

Answered on 2026-10-26: the author opens the viewer several times a day.

## Q-004. The findings behind each grade

Answered on 2026-10-26: the findings are a later feature. The feature depends on
a change to the authoring tools so that they record the findings in the PRD set.
Release 1 shows the status, score, blocking count, and grade date.

## Q-005. Editing text in the viewer

Answered on 2026-10-26: editing is a later feature, not in release 1. The author
changes sections only in the authoring tools. Section 6 records it as a non-goal
for release 1.

## Q-006. Approval when the sponsor is not available

Answered on 2026-10-26: the approval waits until the sponsor is available.

## Q-007. Date for the grade findings

Answered on 2026-10-26: PRD Forge 0.2.0 records the findings now (D-002 delivered).

## Q-008. A second unhappy path for J-002

J-002 has one happy scenario (SC-005) and one exception (SC-007), a search with
no match. The PRD owner decides by 2026-11-30 if release 1 needs another one.

Answered on 2026-10-27: a developer exports a section that is still pending
(SC-008). Release 1 handles it as a should.

## Q-009. Time to find an item

P-001 had no measured cost. The PRD owner counts the searches for an item in one
review of this PRD, and the minutes of each, by 2026-11-30.

Answered on 2026-10-28: about 10 searches in one review, about 3 minutes each
(owner estimate). P-001 records the cost, about 30 minutes for each review.
