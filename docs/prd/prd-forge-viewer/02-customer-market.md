---
id: prd-forge-viewer-market
kind: customer-market
schema: prd-forge/customer-market@1
title: Target customer and market
status: final
updated: 2026-10-28
domain: software product management
section: 2
order: 20
score: 85
blocking: 0
graded: 2026-10-28
segments:
  - id: S-001
    name: People who use the authoring tools
    buyer: >-
      Nobody buys it. The viewer is free and open source. The PRD author decides
      to install it.
    buyer_persona: PER-001
    user: PER-001, PER-002
    user_personas: [PER-001, PER-002]
    size: >-
      126 people cloned the authoring tools in the 14 days to 2026-10-28, in 294
      clones. The count is of people who use the tools, authors and developers,
      not of authors only. The count can be high, because one person can clone from more than
      one computer and automated clones count. It can also be low, because it
      leaves out people who got the tools before that period. The number of
      teams is not known (R-002).
    size_source: >-
      GitHub traffic page of the authoring tools,
      https://github.com/SpillwaveSolutions/prd-forge, read by the PRD owner
    size_as_of: 2026-10-28
    size_method: bottom-up
    size_unit: people
    willingness_to_pay: None needed. The viewer is free.
    adoption_barriers:
      - Release 1 runs on macOS only (OUT-003).
      - The author must install one more app beside the authoring tools.
  - id: S-002
    name: Stakeholders who read PRDs made with the authoring tools
    buyer: >-
      No buyer. Nobody buys it, and no one decides for the readers. Each reader
      decides to install the free viewer, or reads only the copy that the
      author sends.
    user: PER-003, PER-004, PER-005
    user_personas: [PER-003, PER-004, PER-005]
    size: >-
      Not known. Q-002 asks the PRD owner to count the reviewers of each PRD,
      and how many of them have the authoring tools, by 2026-11-30.
    size_as_of: 2026-10-28
    size_unit: people
    willingness_to_pay: None needed. The viewer is free.
    adoption_barriers:
      - A reader who has the copy can read the PRD without the viewer (IN-006).
competitors:
  - name: The status quo, a copy that the author packages by hand
    kind: status-quo
    offer: >-
      The author copies the sections into one document by hand and sends the
      file. It takes 2 to 4 hours for each version (P-002).
    our_edge: >-
      The author has a stakeholder-ready copy of a new version in seconds, 10
      seconds at p95 for a set of up to 18 documents (NFR-004), not after 2 to
      4 hours of packaging by hand (P-002).
  - name: A shared online document that the author pastes the PRD into
    kind: direct
    offer: >-
      Stakeholders read and comment on one document in a web browser.
    our_edge: >-
      Each export shows the version and the draft mark (FR-014) and the score
      of every section (FR-019), so the sponsor and the engineering lead can
      check which graded version they read. The viewer makes no network
      transfer (NFR-005). The viewer does not offer comments, and the shared
      document does.
  - name: A script that the team writes to join the files
    kind: build-in-house
    offer: >-
      The team writes and maintains its own script that joins the 18 files into
      one document.
    our_edge: >-
      The engineering lead sees the status and score of every section (FR-019),
      and the sponsor sees the version and the draft mark (FR-014). The team
      has no script to write or maintain.
  - name: The command-line copy of the authoring tools
    kind: indirect
    offer: One PDF and one Word file of the whole set, in one fixed appearance.
    our_edge: >-
      A developer sends a file with only the sections for the current work
      (FR-012), and the team reads it without the authoring tools, not all 18
      documents.
  - name: The stepper pane of the authoring tools
    kind: indirect
    offer: >-
      Steps through the sections one at a time, inside the authoring tools.
    our_edge: >-
      The author exports the set (FR-010), and a reader without the authoring
      tools reads it. The stepper pane works only inside the authoring tools.
why_we_win: >-
  In the author's words: "Show me what is weak, then let me send it today." The
  viewer shows every grade in one view (FR-004), and has a copy ready in
  seconds (NFR-004, p95), not after 2 to 4 hours of packaging by hand (P-002).
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer-problem, kind: problem-opportunity, path: ./01-problem-opportunity.md, title: Problem and opportunity }
  next: { id: prd-forge-viewer-objectives, kind: objectives-metrics, path: ./03-objectives-metrics.md, title: Objectives and success metrics }
---

# Target customer and market

The viewer is free and open source for anyone who uses the authoring tools. The
PRD owner decided this on 2026-10-26. Nobody buys it. The market is the people who use
the authoring tools (S-001), 126 of whom cloned them in the 14 days to
2026-10-28, and the readers of their PRDs (S-002).

| ID | Segment | Buyer | User | Size |
| --- | --- | --- | --- | --- |
| S-001 | People who use the authoring tools | Nobody buys. The author decides to install (PER-001) | PER-001, PER-002 | 126 people cloned the tools in 14 days, to 2026-10-28 |
| S-002 | Stakeholders who read PRDs made with the authoring tools | No buyer. Each reader decides | PER-003, PER-004, PER-005 | Not known (Q-002) |

The S-001 count is of people who use the tools, not of authors only. It can be
high, because one person can clone from more than one computer and automated
clones count. It can also be low, because it leaves out people who got the tools
earlier. Release 1 runs on macOS only (OUT-003), which limits adoption.

| Substitute | Kind | Our edge |
| --- | --- | --- |
| A copy that the author packages by hand | status quo | A stakeholder-ready copy in seconds (NFR-004, p95), not 2 to 4 hours (P-002) |
| A shared online document | direct | Each export shows its version, draft mark, and scores. No network transfer. No comments |
| A script that the team writes | build in house | Scores, version, and draft mark in each export, with no script to maintain |
| The command-line copy | indirect | A developer exports only the sections for the current work |
| The stepper pane | indirect | A reader without the authoring tools reads the export |

Why we win, in the author's words: "Show me what is weak, then let me send it
today." The viewer shows every grade in one view, and has a copy ready in
seconds, not after 2 to 4 hours of packaging by hand.

<!-- prd-forge:details -->

## Details

Every item in this document, with each of its fields.

**Why we win:** In the author's words: "Show me what is weak, then let me send it today." The viewer shows every grade in one view (FR-004), and has a copy ready in seconds (NFR-004, p95), not after 2 to 4 hours of packaging by hand (P-002).

### Segments in detail

#### S-001

**Name:** People who use the authoring tools

**Buyer:** Nobody buys it. The viewer is free and open source. The PRD author decides to install it.

**Buyer persona:** PER-001

**User:** PER-001, PER-002

**User personas:** PER-001, PER-002

**Size:** 126 people cloned the authoring tools in the 14 days to 2026-10-28, in 294 clones. The count is of people who use the tools, authors and developers, not of authors only. The count can be high, because one person can clone from more than one computer and automated clones count. It can also be low, because it leaves out people who got the tools before that period. The number of teams is not known (R-002).

**Size source:** GitHub traffic page of the authoring tools, https://github.com/SpillwaveSolutions/prd-forge, read by the PRD owner

**Size as of:** 2026-10-28

**Size method:** bottom-up

**Size unit:** people

**Willingness to pay:** None needed. The viewer is free.

**Adoption barriers:**

- Release 1 runs on macOS only (OUT-003).
- The author must install one more app beside the authoring tools.

#### S-002

**Name:** Stakeholders who read PRDs made with the authoring tools

**Buyer:** No buyer. Nobody buys it, and no one decides for the readers. Each reader decides to install the free viewer, or reads only the copy that the author sends.

**User:** PER-003, PER-004, PER-005

**User personas:** PER-003, PER-004, PER-005

**Size:** Not known. Q-002 asks the PRD owner to count the reviewers of each PRD, and how many of them have the authoring tools, by 2026-11-30.

**Size as of:** 2026-10-28

**Size unit:** people

**Willingness to pay:** None needed. The viewer is free.

**Adoption barriers:** A reader who has the copy can read the PRD without the viewer (IN-006).

### Competitors in detail

#### The status quo, a copy that the author packages by hand

**Kind:** status-quo

**Offer:** The author copies the sections into one document by hand and sends the file. It takes 2 to 4 hours for each version (P-002).

**Our edge:** The author has a stakeholder-ready copy of a new version in seconds, 10 seconds at p95 for a set of up to 18 documents (NFR-004), not after 2 to 4 hours of packaging by hand (P-002).

#### A shared online document that the author pastes the PRD into

**Kind:** direct

**Offer:** Stakeholders read and comment on one document in a web browser.

**Our edge:** Each export shows the version and the draft mark (FR-014) and the score of every section (FR-019), so the sponsor and the engineering lead can check which graded version they read. The viewer makes no network transfer (NFR-005). The viewer does not offer comments, and the shared document does.

#### A script that the team writes to join the files

**Kind:** build-in-house

**Offer:** The team writes and maintains its own script that joins the 18 files into one document.

**Our edge:** The engineering lead sees the status and score of every section (FR-019), and the sponsor sees the version and the draft mark (FR-014). The team has no script to write or maintain.

#### The command-line copy of the authoring tools

**Kind:** indirect

**Offer:** One PDF and one Word file of the whole set, in one fixed appearance.

**Our edge:** A developer sends a file with only the sections for the current work (FR-012), and the team reads it without the authoring tools, not all 18 documents.

#### The stepper pane of the authoring tools

**Kind:** indirect

**Offer:** Steps through the sections one at a time, inside the authoring tools.

**Our edge:** The author exports the set (FR-010), and a reader without the authoring tools reads it. The stepper pane works only inside the authoring tools.

<!-- /prd-forge:details -->
