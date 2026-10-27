---
id: prd-forge-viewer-change-log
kind: change-log
schema: prd-forge/change-log@1
title: Change log
status: draft
updated: 2026-10-26
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
  - version: 0.3.4
    date: 2026-10-27
    author: Richard Hightower
    summary: >-
      WF-006 uses neutral example folder names. The wireframes return to review
      until the sponsor approves this version.
    sections: [7]
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
| 0.3.3 | 2026-10-26 | Richard Hightower | FR-024 reopens the last set | None yet |
| 0.3.4 | 2026-10-27 | Richard Hightower | Neutral folder names in WF-006 | None yet |

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
