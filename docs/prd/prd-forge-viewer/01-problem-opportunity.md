---
id: prd-forge-viewer-problem
kind: problem-opportunity
schema: prd-forge/problem-opportunity@1
title: Problem and opportunity
status: review
updated: 2026-10-28
domain: software product management
section: 1
order: 10
score: 83
blocking: 0
graded: 2026-10-28
problems:
  - id: P-001
    statement: >-
      To discuss one requirement or one scenario, the author or a developer must
      first find which of the 18 files holds it. The files give no picture of
      the whole PRD, so each discussion starts with a search through them.
    who: PRD author (PER-001), and a developer who uses the authoring tools (PER-002)
    persona: PER-001
    evidence:
      - claim: >-
          A PRD set has 18 files: one index and 17 section documents.
        source: The document layout of the authoring tools, version 1 (C-003)
      - claim: >-
          This PRD set holds 25 functional requirements, 12 scenarios, and 10
          non-functional requirements in 18 files, about 176 KB of text.
        source: Count of this PRD set by the PRD owner
        as_of: 2026-10-28
      - claim: >-
          In one review of this PRD, the PRD owner searched the files for an
          item about 10 times, about 3 minutes each time.
        source: PRD owner estimate, answer to Q-009
        as_of: 2026-10-28
    status_quo: >-
      The author and the developers open the files one at a time and search them
      for the id.
    why_now: >-
      126 people cloned the authoring tools in the 14 days to 2026-10-28
      (public release and traffic pages of the repository of the authoring tools, read 2026-10-28). Each person who writes a PRD with them gets the same 18 files to
      search.
    cost_of_inaction: >-
      About 30 minutes of searching in each review of a PRD: about 10 searches,
      about 3 minutes each (PRD owner estimate, 2026-10-28, Q-009).
    desired_outcome: >-
      The author and the developers find any item of a PRD set without knowing
      which file holds it (O-001).
  - id: P-002
    statement: >-
      The author must package each PRD version by hand before a stakeholder
      without the authoring tools can read it, and the stakeholder's feedback
      waits for that copy.
    who: PRD author (PER-001), and the readers of the copy (PER-003, PER-004, PER-005)
    persona: PER-001
    evidence:
      - claim: >-
          A PRD set is plain-text files with machine-readable headers. A reader
          without the authoring tools sees raw text.
        source: The document layout of the authoring tools, version 1 (C-003)
      - claim: >-
          The only copy that the authoring tools make today comes from a command
          line inside them. It has one fixed appearance and holds the whole set.
        source: The authoring tools, current release
        as_of: 2026-10-28
      - claim: >-
          The historic PRDs, written before the authoring tools, took about 10
          calendar days to the first stakeholder feedback.
        source: PRD owner, from the historic PRDs, confirmed 2026-10-28
        as_of: 2026-10-28
      - claim: >-
          To package one PRD version for stakeholders by hand takes the author
          2 to 4 hours, about 3 hours.
        source: PRD owner estimate
        as_of: 2026-10-28
      - claim: >-
          This PRD does not count for review time. It is for a new tool, and
          only the PRD owner has read it, as the author and as the sponsor.
        source: PRD owner
        as_of: 2026-10-28
      - claim: >-
          The number of stakeholders for each PRD, and how many have the tools,
          is not known. See Q-002.
        source: PRD owner
        as_of: 2026-10-26
    status_quo: >-
      The author copies the sections into one document by hand, or runs the
      command-line copy and sends the whole set. A reader then gets every
      section, also the ones that the reader does not need.
    why_now: >-
      The authoring tools had 10 releases from 2026-10-26 to 2026-10-28
      (public release and traffic pages of the repository of the authoring tools, read 2026-10-28). Versions 0.4.0 and 0.5.1 of this set followed two of those
      releases, and each new version needs a new copy for the stakeholders.
    cost_of_inaction: >-
      About 3 hours of the author's time to package each PRD version (owner
      estimate, 2026-10-28), and about 10 calendar days to the first
      stakeholder feedback, as on the historic PRDs, against a target of 2 days
      (O-001).
    desired_outcome: >-
      Stakeholders read each PRD version without the authoring tools, and they
      give feedback within 2 days (O-001).
  - id: P-003
    statement: >-
      To find the weak sections, the author must open each graded section and
      its grade note, 14 of each in this set. No single place shows which
      sections have blocking defects.
    who: PRD author (PER-001)
    persona: PER-001
    evidence:
      - claim: >-
          This set keeps a score, a count of blocking defects, and a grade date
          in 14 of its 17 section documents, and the findings for each of them
          in a separate grade note, 14 notes in all.
        source: This PRD set
        as_of: 2026-10-28
      - claim: >-
          The sponsor approved version 0.3.2 while the functional requirements
          had 1 blocking defect (ST-008 had no must requirement). The defect
          stayed open in versions 0.3.2, 0.3.3, and 0.3.4, until version 0.4.0
          changed the release line.
        source: The change log of this PRD set (section 15), versions 0.3.2 to 0.4.0
        as_of: 2026-10-27
      - claim: >-
          Version 0.4.0 of this set changed 11 sections. 9 of them are graded
          sections.
        source: The change log of this PRD set (section 15), version 0.4.0
        as_of: 2026-10-27
    status_quo: >-
      The author opens each section and its grade note to find the weak
      sections.
    why_now: >-
      The authoring tools changed their checks twice in two days: release 0.8.1
      on 2026-10-27 and release 0.9.0 on 2026-10-28 (change log, versions 0.4.0
      and 0.5.1). The sponsor approved each of versions 0.3.0 to 0.5.0 within
      one day of the day it was written, so the author must know the weak
      sections within that day.
    cost_of_inaction: >-
      1 blocking defect stayed open in 3 versions over 2 days, 2026-10-26 to
      2026-10-27, and all 3 versions (0.3.2, 0.3.3, and 0.3.4) were approved
      with it. The adversarial grade found it.
    desired_outcome: >-
      The author knows which sections are weak without opening each section,
      and fixes blocking defects before stakeholders see a version (O-002).
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  next: { id: prd-forge-viewer-market, kind: customer-market, path: ./02-customer-market.md, title: Target customer and market }
  related:
    - { id: prd-forge-viewer-open-questions, kind: open-questions, path: ./13-open-questions.md, title: Open questions }
---

# Problem and opportunity

The authoring tools are new. They help teams write PRDs as a PRD set of 18
linked files. The authoring tools had 10 releases from 2026-10-26 to
2026-10-28, and 126 people cloned them in the 14 days to 2026-10-28. Both
counts come from the public release and traffic pages of the repository of the
authoring tools, read on 2026-10-28. Only the PRD owner has read this PRD, as
the author and as the sponsor.

| ID | Problem | Who |
| --- | --- | --- |
| P-001 | To discuss one item, the author must first find which of 18 files holds it | PER-001, PER-002 |
| P-002 | The author packages each version by hand before a stakeholder can read it | PER-001, PER-003, PER-004, PER-005 |
| P-003 | To find the weak sections, the author opens each section and its grade note | PER-001 |

## P-001. The author must find which file holds an item

To discuss one requirement or one scenario, the author or a developer must first
find which of the 18 files holds it. The files give no picture of the whole PRD.

- **Evidence.** This set holds 25 functional requirements, 12 scenarios, and 10
  non-functional requirements in 18 files, about 176 KB of text. In one review,
  the PRD owner searched for an item about 10 times, about 3 minutes each
  (owner estimate, 2026-10-28, Q-009).
- **Status quo.** The author and the developers open the files one at a time and
  search them for the id.
- **Why now.** 126 people cloned the authoring tools in 14 days. Each person who
  writes a PRD with them gets the same 18 files to search.
- **Cost of inaction.** About 30 minutes of searching in each review.
- **Desired outcome.** The author and the developers find any item without
  knowing which file holds it (O-001).

## P-002. The author packages each version by hand

A stakeholder without the authoring tools sees raw text. Feedback waits until
the author packages the PRD and sends it.

- **Evidence.** The only copy that the authoring tools make comes from a
  command line, holds the whole set, and has one fixed appearance. The historic
  PRDs took about 10 calendar days to the first stakeholder feedback. To package
  one version by hand takes 2 to 4 hours (owner estimate, 2026-10-28). This PRD
  does not count for review time, because it is for a new tool and only the PRD
  owner has read it. The number of stakeholders per PRD is not known (Q-002).
- **Status quo.** The author copies the sections into one document by hand, or
  sends the whole set from the command line. A reader gets every section, also
  the ones that the reader does not need.
- **Why now.** Versions 0.4.0 and 0.5.1 of this set followed releases of the
  authoring tools, and each version needs a new copy.
- **Cost of inaction.** About 3 hours of the author's time to package each
  version, and about 10 calendar days to the first feedback, as on the historic
  PRDs, against a 2-day target (O-001).
- **Desired outcome.** Stakeholders read each version without the authoring
  tools, and give feedback within 2 days (O-001).

## P-003. To find the weak sections, the author opens each section

To find the weak sections, the author must open each graded section and its
grade note, 14 of each in this set. No single place shows which sections have
blocking defects.

- **Evidence.** The sponsor approved version 0.3.2 while the functional
  requirements had 1 blocking defect (ST-008 had no must requirement). The
  defect stayed open until version 0.4.0. Version 0.4.0 changed 11 sections, 9
  of them graded.
- **Status quo.** The author opens each section and its grade note to find the
  weak sections.
- **Why now.** The authoring tools changed their checks on 2026-10-27 and
  2026-10-28. The sponsor approved each of versions 0.3.0 to 0.5.0 within one
  day of the day it was written, so the author must know the weak sections
  within that day.
- **Cost of inaction.** 1 blocking defect stayed open in 3 versions over 2 days,
  and all 3 versions (0.3.2, 0.3.3, and 0.3.4) were approved with it. The
  adversarial grade found it.
- **Desired outcome.** The author knows which sections are weak without opening
  each one, and fixes blocking defects before stakeholders see a version
  (O-002).
