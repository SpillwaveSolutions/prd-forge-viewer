---
id: prd-forge-viewer-problem
kind: problem-opportunity
schema: prd-forge/problem-opportunity@1
title: Problem and opportunity
status: final
updated: 2026-10-26
domain: software product management
section: 1
order: 10
score: 75
blocking: 0
graded: 2026-10-26
problems:
  - id: P-001
    statement: >-
      The author cannot see the whole PRD in one place, go directly to one
      section, or find one item such as a requirement or a scenario. The PRD is
      18 separate files, so a discussion about one item starts with a search
      through the files.
    who: PRD author (PER-001), and a developer who uses the authoring tools (PER-002)
    evidence:
      - >-
        A PRD set has 18 files: one index and 17 section documents (the
        authoring tools' document layout, first release).
      - >-
        No usage counts exist. The authoring tools are new, and this PRD is one of
        the first sets made with them. See Q-001.
    why_now: >-
      The authoring tools had their first release in October 2026. Their
      adoption depends on whether authors find a finished PRD easy to read and
      discuss.
    cost_of_inaction: >-
      Not measured. The expected cost is time lost to finding sections during
      reviews, and authors who stop using the authoring tools. See Q-001.
  - id: P-002
    statement: >-
      A stakeholder who does not use the authoring tools cannot read the PRD.
      Feedback waits until the author packages the PRD by hand.
    who: PRD author (PER-001), and the readers of the export (PER-003, PER-004, PER-005)
    evidence:
      - >-
        A PRD set is plain-text files with machine-readable headers. A reader
        without the authoring tools sees raw text.
      - >-
        The only export today runs from a command line inside the authoring
        tools. It has one fixed appearance.
      - >-
        Before PRD Forge, the first stakeholder feedback on a PRD took about 10
        calendar days (estimate by the PRD owner from past PRDs, 2026-10-26).
      - >-
        The number of stakeholders per PRD, and how many have the tools, is not
        known. See Q-002.
    why_now: >-
      The authoring tools had their first release in October 2026. Teams adopt
      them only if stakeholders can review a PRD without them.
    cost_of_inaction: >-
      About 10 calendar days of waiting for the first feedback on each PRD
      version (owner estimate), against a target of 2 days (O-001). See Q-001.
  - id: P-003
    statement: >-
      The author cannot see at a glance which sections are weak. The grade, the
      count of blocking defects, and what is missing are in each file separately.
    who: PRD author (PER-001)
    evidence:
      - >-
        The authoring tools record a score, a count of blocking defects, and a
        grade date in each of the 17 section documents. The findings behind each
        grade are reported in the conversation and are not kept in the PRD set
        (Q-004).
    why_now: >-
      The authoring tools grade every section from their first release. The
      grades are only useful if the author can act on them.
    cost_of_inaction: >-
      Not measured. The expected cost is weak sections that go to stakeholders
      before the author fixes them. See Q-004.
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  next: { id: prd-forge-viewer-market, kind: customer-market, path: ./02-customer-market.md, title: Target customer and market }
  related:
    - { id: prd-forge-viewer-open-questions, kind: open-questions, path: ./13-open-questions.md, title: Open questions }
---

# Problem and opportunity

The authoring tools are new. They help teams write PRDs as a PRD set of 18
linked files. This PRD is one of the first PRD sets made with them.

| ID | Problem | Who |
| --- | --- | --- |
| P-001 | The author cannot see the whole PRD, go to one section, or find one item | PER-001, PER-002 |
| P-002 | A stakeholder without the authoring tools cannot read the PRD | PER-001, PER-003, PER-004, PER-005 |
| P-003 | The author cannot see at a glance which sections are weak | PER-001 |

## P-001. The author cannot see the whole PRD or go directly to one section

The PRD is 18 separate files, so a discussion about one section, requirement, or
scenario starts with a search through the files.

- **Evidence.** A PRD set has 18 files. No usage counts exist yet (Q-001).
- **Why now.** The authoring tools are new, and their adoption depends on readable
  output.
- **Cost of inaction.** Not measured. The expected cost is time lost to finding
  sections during reviews, and authors who stop using the authoring tools (Q-001).

## P-002. A stakeholder without the authoring tools cannot read the PRD

Feedback waits until the author packages the PRD by hand.

- **Evidence.** The set is plain-text files with machine-readable headers. The
  only export today runs from a command line and has one fixed appearance. The
  number of stakeholders per PRD is not known (Q-002).
- **Why now.** Teams adopt the authoring tools only if stakeholders can review a
  PRD without them.
- **Cost of inaction.** About 10 calendar days of waiting for the first feedback
  on each version (owner estimate), against a 2-day target (O-001).

## P-003. The author cannot see at a glance which sections are weak

The grade, the count of blocking defects, and what is missing are in each file
separately.

- **Evidence.** A score, a blocking count, and a grade date are in each of the 17
  section documents. The findings behind each grade are not kept (Q-004).
- **Why now.** The authoring tools grade every section.
- **Cost of inaction.** Not measured. The expected cost is weak sections that go
  to stakeholders before the author fixes them (Q-004).
