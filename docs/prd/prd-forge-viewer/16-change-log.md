---
id: prd-forge-viewer-change-log
kind: change-log
schema: prd-forge/change-log@1
title: Change log
status: draft
updated: 2026-10-27
domain: software product management
section: 15
order: 160
changes:
  - version: 0.1.0
    date: 2026-10-26
    author: Richard Hightower
    summary: >-
      First draft of all 15 sections from the PRD Forge interview. Decisions on
      2026-10-26: editing is not in release 1 (Q-005); grade findings wait for a
      later release (Q-004); search and custom themes are in release 1; exports
      always show "Draft" until every section is final (TR-005); PDF and Word
      are a constraint (C-001); approval waits for the sponsor (Q-006); release
      1 target date is 2027-01-31; the viewer is free and open source.
    sections: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    resolves: [Q-004, Q-005, Q-006]
  - version: 0.2.0
    date: 2026-10-26
    author: Richard Hightower
    summary: >-
      Engineering review fixes and new decisions. Added FR-021 (the prdf command)
      and FR-022 (remembered PRD set locations). Search results show a relevance
      score from 0 to 100 and open the item when selected. Custom themes use
      serif, sans-serif, or monospace fonts, embedded in exports. The test
      computer is an Apple silicon Mac with 16 GB. The author opens the viewer
      several times a day (Q-003). PRD Forge 0.2.0 delivers the grade findings
      (D-002); the viewer shows them in release 2. Ten sections moved to review. Added O-002 and four non-goals.
      Release 1 is 2026-10-26 and release 2 is 2026-11-06.
    sections: [2, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14]
    resolves: [Q-003, Q-007]
  - version: 0.3.0
    date: 2026-10-26
    author: Richard Hightower
    summary: >-
      Updated to PRD Forge 0.5.1. Added persona short names, stage acceptance,
      scenario priorities, SC-007 (a search with no match), and Q-008. Added the
      wireframes section with WF-001 to WF-009, approved by the PRD owner, and
      shown_in on each requirement. Added FR-023 (expand a section in the tree
      and select an item). Dropped FR-006 (previous and next section) because
      the tree covers it.
    sections: [4, 5, 7, 12]
    approvals:
      - name: Richard Hightower
        role: Sponsor (PER-004)
        date: 2026-10-26
        decision: approved
  - version: 0.3.1
    date: 2026-10-26
    author: Richard Hightower
    summary: >-
      WF-009 shows a pending section in the contents, and sections 1 and 4 as
      final. The wireframes section returns to review until the sponsor
      approves this version.
    sections: [7]
    approvals:
      - name: Richard Hightower
        role: Sponsor (PER-004)
        date: 2026-10-26
        decision: approved
  - version: 0.3.2
    date: 2026-10-26
    author: Richard Hightower
    summary: >-
      Decisions from the HLD review. Release 1 moves to 2026-10-27. Release 1
      runs on macOS only (C-004). FR-024 adds a choice of PRD set when docs/prd
      holds more than one. NFR-010 shows only local content. Six sections
      return to review until the sponsor approves this version.
    sections: [6, 7, 8, 9, 13]
    approvals:
      - name: Richard Hightower
        role: Sponsor (PER-004)
        date: 2026-10-26
        decision: approved
  - version: 0.3.3
    date: 2026-10-26
    author: Richard Hightower
    summary: >-
      FR-024 reopens the set that was open in the last session. The list of
      sets shows only when none of them was open before.
    sections: [7]
    approvals:
      - name: Richard Hightower
        role: Sponsor (PER-004)
        date: 2026-10-27
        decision: approved
  - version: 0.3.4
    date: 2026-10-27
    author: Richard Hightower
    summary: >-
      WF-006 uses neutral example folder names. The wireframes return to review
      until the sponsor approves this version.
    sections: [7]
    approvals:
      - name: Richard Hightower
        role: Sponsor (PER-004)
        date: 2026-10-27
        decision: approved
  - version: 0.4.0
    date: 2026-10-27
    author: Richard Hightower
    summary: >-
      Updated to PRD Forge 0.8.1. The release line is ST-001 to ST-007 of J-001.
      ST-006 and ST-007 are recorded as stages outside the viewer, with their
      workarounds. Search (IN-004) is part of ST-003, and the export of selected
      sections (IN-008) is part of ST-005. REL-001 lists ST-001 to ST-007, its
      date is committed, and it has exit criteria. REL-002 is indicative and
      depends on D-002. SC-005 and SC-007 are should. FR-008 and FR-012 stay
      must in release 1, and FR-007 stays should. FR-007 and FR-008 move to
      ST-003, and FR-012 moves to ST-005. FR-023 states the user need and no
      longer names a control. WF-010 is the state of WF-006 when docs/prd holds
      more than one PRD set. The front matter now records competitor kinds, the
      primary persona, the approver, the problems that each objective and
      persona serves, a persona id for each decision approver, and the questions
      that each change answers. The wireframes show version 0.4.0, and section
      11 gives the correct release 1 date, 2026-10-27.
    sections: [2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 15]
    approvals:
      - name: Richard Hightower
        role: Sponsor (PER-004)
        date: 2026-10-27
        decision: approved
  - version: 0.5.0
    date: 2026-10-27
    author: Richard Hightower
    summary: >-
      Answers from the open questions. Section 8 records scale, retention, and
      observability as not applicable, with reasons. Nine requirements move from
      must to should: FR-002, FR-011, FR-016, FR-017, FR-018, FR-019, FR-020,
      FR-022, and FR-024. They stay in release 1. SC-008 adds an export with a
      pending section to J-002 (Q-008). FR-025 shows the findings behind a
      grade. It is the only requirement of REL-002, so its priority is wont for
      release 1. WF-011 draws it. The release plan says why REL-002 comes second, and that the REL-001 date is
      committed to the sponsor. TR-012 and TR-013 record
      the developer's decisions at ST-008 and ST-010. SC-009 adds first use,
      SC-010 to SC-012 add J-003, and LC-001 records the lifecycle of a
      section. SC-006 is should. OUT-001 is revisited at the release 2 review.
      Each non-goal has its reason. FR-021 records why docs/prd stays.
    sections: [5, 6, 7, 8, 10, 12, 13, 15]
    resolves: [Q-008]
    approvals:
      - name: Richard Hightower
        role: Sponsor (PER-004)
        date: 2026-10-27
        decision: approved
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer-glossary, kind: glossary, path: ./15-glossary.md, title: Glossary }
  next: null
---

# Change log

| Version | Date | Author | Summary | Approvals |
| --- | --- | --- | --- | --- |
| 0.1.0 | 2026-10-26 | Richard Hightower | First draft of all 15 sections | None yet |
| 0.2.0 | 2026-10-26 | Richard Hightower | prdf, known locations, search scores, fonts; 10 sections to review | None yet |
| 0.3.0 | 2026-10-26 | Richard Hightower | PRD Forge 0.5.1 fields, wireframes WF-001 to WF-009, FR-023 added, FR-006 dropped | Richard Hightower, sponsor, approved 2026-10-26 |
| 0.3.1 | 2026-10-26 | Richard Hightower | WF-009 shows a pending section | Richard Hightower, sponsor, approved 2026-10-26 |
| 0.3.2 | 2026-10-26 | Richard Hightower | HLD review decisions: date, macOS, FR-024, NFR-010 | Richard Hightower, sponsor, approved 2026-10-26 |
| 0.3.3 | 2026-10-26 | Richard Hightower | FR-024 reopens the last set | Richard Hightower, sponsor, approved 2026-10-27 |
| 0.3.4 | 2026-10-27 | Richard Hightower | Neutral folder names in WF-006 | Richard Hightower, sponsor, approved 2026-10-27 |
| 0.4.0 | 2026-10-27 | Richard Hightower | PRD Forge 0.8.1: release line ST-001 to ST-007, WF-010, new front matter fields | Richard Hightower, sponsor, approved 2026-10-27 |
| 0.5.0 | 2026-10-27 | Richard Hightower | Answers from the open questions: NFR categories, must share, FR-025, SC-008 to SC-012, TR-012, TR-013 | Richard Hightower, sponsor, approved 2026-10-27 |

## 0.1.0. First draft

The interview wrote all 15 sections. The decisions recorded on 2026-10-26:

- Editing in the viewer is not in release 1 (Q-005, OUT-001).
- Grade findings wait for a later release and a PRD Forge change (Q-004, D-002).
- Search and custom export themes are in release 1.
- Every export shows "Draft" until every document is final (TR-005).
- PDF and Word are the export formats (C-001).
- When the sponsor is not available, the approval waits (Q-006).
- The release 1 target date is 2027-01-31.
- The viewer is free and open source for anyone who uses PRD Forge.

Versions 0.1.0 and 0.2.0 have no approval.

## 0.3.0. Approved by the sponsor

Richard Hightower approved version 0.3.0 as the sponsor (PER-004) on
2026-10-26. The 14 graded sections moved from review to final. The root, open
questions, glossary, and change log stay at draft, so every export still shows
"Draft" (TR-005).

## 0.3.1. A pending section in WF-009

WF-009 now shows how a pending section looks in the contents of an export. The
wireframes section returned to review. Richard Hightower approved version 0.3.1
as the sponsor (PER-004) on 2026-10-26, and the wireframes moved to final.

## 0.3.2. Decisions from the HLD review

The PRD owner decided four items from the HLD review on 2026-10-26:

- REL-001 moves from 2026-10-26 to 2026-10-27 (ADV-07).
- Release 1 runs on macOS only. Other operating systems come later (C-004, ADV-03).
- When docs/prd holds more than one PRD set, the author picks one in the viewer (FR-024, ADV-02).
- The viewer shows only local content. No script runs, and nothing remote loads (NFR-010, ADV-01).

Scope, functional requirements, wireframes, non-functional requirements,
constraints, and the release plan returned to review. Richard Hightower approved
version 0.3.2 as the sponsor (PER-004) on 2026-10-26. Five of them moved to
final. Functional requirements stay at draft: the adversarial grade found one
blocking defect (ST-008 has no `must` requirement).

## 0.3.3. FR-024 reopens the last set

When docs/prd holds more than one PRD set, the viewer reopens the set that was
open in the last session. The list of sets shows only when none of them was open
before. This settles which rule wins between FR-002 and FR-024. Functional
requirements stay at draft until ST-008 has a `must` requirement.

## 0.3.4. Neutral folder names in WF-006

The example folders in WF-006 no longer name a client. The wireframes returned to
review until the sponsor approves this version.

## 0.4.0. Updated to PRD Forge 0.8.1

PRD Forge 0.8.1 checks that the release line is one run of J-001 stages, and
that REL-001 lists exactly those stages. The PRD owner made these decisions on
2026-10-27:

- The release line is ST-001 to ST-007. ST-006 and ST-007 happen outside the
  viewer, and section 6 records the workaround for each.
- Search (IN-004) is part of ST-003, and the export of selected sections
  (IN-008) is part of ST-005. Release 1 still lets a developer do the work of
  J-002.
- SC-005 and SC-007 are should, because they are on J-002. FR-008 and FR-012
  stay must in release 1, and FR-007 stays should.
- FR-007 and FR-008 move to ST-003, and FR-012 moves to ST-005, to agree with
  the scope.
- FR-023 says "Select one item of a section and read it without the whole
  section". It no longer names a control.
- The REL-001 date is committed. The REL-002 date is indicative.
- WF-010 shows the list of PRD sets in docs/prd. It is a state of WF-006, and
  WF-006 keeps marks 1 to 3.

The other changes copy facts that the PRD text already states into the new
front matter fields. FR-012 and FR-013 state a situation in each Given. The root
document and section 11 now give the correct release 1 date, 2026-10-27. The
wireframes show version 0.4.0. The sponsor approved versions 0.3.3, 0.3.4, and
0.4.0 on 2026-10-27, and the changed sections returned to final.

## 0.5.0. Answers from the open questions

The PRD owner answered these questions on 2026-10-27:

- Scale, retention, and observability do not apply to the viewer. Section 8
  gives the reason for each.
- Nine requirements move from must to should: FR-002, FR-011, FR-016, FR-017,
  FR-018, FR-019, FR-020, FR-022, and FR-024. They stay in release 1. Release 1
  can ship without them.
- SC-008 adds a second unhappy path to J-002: an export with a pending section
  (Q-008).
- FR-025 shows the findings behind the grade of a section. It is the only
  requirement of release 2 (REL-002). Its priority is wont, because release 1
  does not have it. WF-011 draws it.
- SC-009 is the first use of the viewer, with two PRD sets in docs/prd.
- SC-010 is the J-003 happy path. SC-011 (a rejection with a reason) and SC-012
  (the sponsor is not available) come from TR-007 and Q-006.
- LC-001 records how a section moves from pending to final.
- SC-006 is should, because FR-002 is should.
- The PRD owner decides on OUT-001 (editing) at the release 2 review, on
  2026-11-06.
- Each non-goal has a reason. The viewer shows one PRD set at a time, because
  every journey works on one PRD.
- FR-021 and FR-024 keep the folder name docs/prd, because the authoring tools
  use it and the author sees it. WF-010 keeps its example set names.
- TR-012 and TR-013 give the developer (PER-002) the decisions at ST-008 and
  ST-010. TR-001 and TR-004 keep only the author's stages.
- Release 1 comes first because it delivers the golden thread J-001. Release 2
  comes second because findings are useful only after the author sees all
  grades in one view (FR-004).

The sponsor approved version 0.5.0 on 2026-10-27, and the changed sections
moved to final.
