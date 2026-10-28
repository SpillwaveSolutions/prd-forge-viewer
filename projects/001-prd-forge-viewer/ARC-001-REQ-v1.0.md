# Project requirements: PRD Forge Viewer

> **Template Origin**: Official | **ArcKit Version**: 6.18.3 | **Command**: `/arckit:requirements`

## Document control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-001-REQ-v1.0 |
| **Document Type** | Business and Technical Requirements |
| **Project** | PRD Forge Viewer (Project 001) |
| **Classification** | PUBLIC |
| **Status** | DRAFT |
| **Version** | 1.0 |
| **Created Date** | 2026-10-26 |
| **Last Modified** | 2026-10-27 |
| **Review Cycle** | On-Demand |
| **Next Review Date** | 2026-11-25 |
| **Owner** | Richard Hightower, PRD owner |
| **Reviewed By** | [PENDING] |
| **Approved By** | [PENDING] |
| **Distribution** | Project Team, Architecture Team |

## Revision history

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| 1.0 | 2026-10-26 | ArcKit AI | Initial creation from `/arckit:requirements` command | [PENDING] | [PENDING] |
| 1.0 | 2026-10-26 | ArcKit AI | Regenerated from PRD 0.3.2: FR-024, NFR-SEC-003 from PRD NFR-010, NFR-I-003 from C-004, release 1 on 2026-10-27 | [PENDING] | [PENDING] |
| 1.0 | 2026-10-27 | ArcKit AI | Updated from PRD 0.4.0 (PRD Forge 0.8.1): FR-007 and FR-008 at ST-003, FR-012 at ST-005, FR-023 restated with no control, FR-012 and FR-013 Givens, WF-010 | [PENDING] | [PENDING] |
| 1.0 | 2026-10-27 | ArcKit AI | Updated from PRD 0.5.0: nine requirements to SHOULD_HAVE, FR-025 for REL-002, SC-008, WF-011, Q-008 answered | [PENDING] | [PENDING] |

---

## Document purpose

This document restates the PRD Forge Viewer PRD, version 0.5.0, as an
ArcKit requirements specification. The design documents (data model, ADRs,
diagrams, HLD review, and traceability) read it.

The PRD set in `docs/prd/prd-forge-viewer/` is the source of truth [PFVP-C1].
This document adds no functional requirement. Rules for the IDs:

- FR-001 to FR-024 are the PRD IDs, with the PRD capability, outcome, and
  acceptance criteria copied word for word. FR-006 is WONT_HAVE. The PRD owner
  dropped it on 2026-10-26.
- Each NFR has an ArcKit ID (for example NFR-P-001) and a **PRD Source** field
  with the PRD ID (for example NFR-001).
- BR, INT, and DR requirements are derived from the PRD. Each one names its PRD
  source.
- Other PRD IDs (C-, A-, R-, D-, Q-, TR-, WF-) keep their PRD meaning.
- Requirement conflicts use the prefix RC-, so that they do not share IDs with
  the PRD constraint C-003. C-001, C-002, and C-004 are retired (IN-006, OUT-001, OUT-003).

If the PRD changes, generate this document again. Do not change the copied text
here.

---

## Executive summary

### Business context

PRD authors cannot read an 18-file PRD Forge set as one document or see every
grade at once. Stakeholders without the authoring tools cannot read it at all,
so feedback waits [PFVP-C2].

The viewer shows the whole set and its grades in one place. It shows changes as
the authoring tools make them. It searches, and it makes themed export files
marked with the version and draft status (formats in IN-006).

The viewer is free and open source for anyone who uses PRD Forge. It is a local
desktop app with no server (A-002, NFR-006).

### Objectives

- O-001: Stakeholders give feedback on a PRD version sooner.
- O-002: Authors fix blocking defects before stakeholders see a version.
- Deliver release 1 by 2026-10-27 and release 2 by 2026-11-06.

### Expected outcomes

- Median days from the send of a version to the first written feedback: 2 days or less by 2027-03-31. Baseline about 10 days, an owner estimate (Q-001) [PFVP-C3].
- Blocking defects in each version sent: 0 by 2027-03-31. Baseline 1, in version 0.2.0 of this PRD [PFVP-C4].

### Project scope

**In Scope**:

- IN-001: Open a PRD set and see the product name, the version, the executive summary, and the status of every document. The next session opens the same PRD set. (FR-001, FR-002, FR-003, FR-021, FR-022, FR-024)
- IN-002: See the status, score, count of blocking defects, and grade date of every section in one view. (FR-004)
- IN-003: Go directly to any section and read it. (FR-005, FR-023)
- IN-004: Search the PRD set by term, in one category or in all, and see the best matches first. (FR-008, FR-007)
- IN-005: See each change that the authoring tools make to a section, without any action from the author. (FR-009)
- IN-006: Export the whole PRD set or selected sections as a fixed-layout or an editable document (IN-006), or print it. The export shows the version and the status of the PRD and of each section. (FR-010, FR-011, FR-013, FR-014, FR-019)
- IN-007: Select an export theme. The viewer includes the built-in themes, and the author can make, change, and delete custom themes. (FR-015, FR-016, FR-017, FR-018, FR-020)
- IN-008: Export only the sections that a developer selects. (FR-012)

**Out of Scope**:

- OUT-001: Editing the text of a section in the viewer (Q-005). Revisit: The PRD owner decides at the release 2 review, on 2026-11-06, if editing goes into a release.
- OUT-002: Showing the findings behind each grade, such as what is missing and what to improve (Q-004). Revisit: The authoring tools record the findings from PRD Forge 0.2.0 (D-002 delivered). Release 2 shows them (FR-025), on 2026-11-06.

---

## Stakeholders

From `ARC-001-STKE-v1.0.md`.

| Stakeholder | Role | Organization | Involvement Level |
|-------------|------|--------------|-------------------|
| Richard Hightower | PRD owner and sponsor for this PRD | PRD Forge project | Decision maker |
| PER-001 Author | PRD author | Consulting delivery team | Primary user, acceptance of J-001 |
| PER-002 ToolsDeveloper | Developer who uses the authoring tools | Consulting delivery team | User of search and partial export (J-002) |
| PER-003 EngineeringLead | Engineering lead | Client or delivery team | Reads exports, decides buildability (TR-008) |
| PER-004 Sponsor | Product sponsor | Client | Approves or rejects each version (TR-007) |
| PER-005 TeamDeveloper | Developer without the authoring tools | Client or delivery team | Reads section exports |
| PRD Forge maintainers | Format owner | PRD Forge project | Keeps the format stable (D-001) |

---

## Business requirements

### BR-001: Stakeholders give feedback on a PRD version sooner

**Description**: Stakeholders give written feedback on a PRD version within 2
calendar days of the send. PRD source: O-001.

**Rationale**: Stakeholders cannot read the set without the authoring tools, so
feedback waits (P-002). Serves goals G-1, G-2, G-3, and G-5.

**Acceptance Criteria**:

- [ ] The median calendar days from the send of a version to the first written feedback from any stakeholder is 2 days or less, by 2027-03-31.
- [ ] The first send of this PRD replaces the baseline estimate of about 10 days with a measured figure (Q-001, due 2026-11-30).

**Priority**: MUST_HAVE

**Stakeholder**: Richard Hightower, PRD owner

---

### BR-002: No version reaches a stakeholder with a blocking defect

**Description**: Authors fix blocking defects before stakeholders see a
version. PRD source: O-002.

**Rationale**: The engineering lead cannot decide on a PRD with blocking
defects (SD-4). Serves goal G-4.

**Acceptance Criteria**:

- [ ] The count of blocking defects in a version on the day it is sent is 0, for every version sent, by 2027-03-31. Baseline: 1 in version 0.2.0.

**Priority**: MUST_HAVE

**Stakeholder**: Richard Hightower, PRD owner

---

### BR-003: Deliver the two releases on their dates

**Description**: Release 1 (REL-001, read and export) is due 2026-10-27.
Release 2 (REL-002, grade findings) is due 2026-11-06. PRD source: section 13.

**Rationale**: The PRD owner set both dates on 2026-10-26. O-001 needs the
viewer in use well before 2027-03-31.

**Acceptance Criteria**:

- [ ] Every REL-001 requirement passes its acceptance criteria by 2026-10-27.
- [ ] REL-002 shows the findings behind each grade by 2026-11-06.

**Priority**: MUST_HAVE

**Stakeholder**: Richard Hightower, PRD owner

---

## Functional requirements

### User personas

#### Persona 1: Author (PER-001)

- **Role**: PRD author, a senior consultant or product lead at a consulting firm, who uses the authoring tools
- **Goals**: Show me what is weak, then let me send it today.; See the whole PRD and go directly to the section under discussion; See which sections are weak and what to fix before anyone else reads them; Send the PRD to stakeholders quickly, in a form they can read without the tools
- **Pain Points**: The PRD is 18 files, and finding one section or one item takes a search (P-001); Stakeholders cannot read the files without the tools (P-002); Grades and gaps are spread across 17 files (P-003)
- **Technical Proficiency**: Expert in the business domain. Uses the authoring tools. Often not an experienced product manager.
- **Authority**: Owns the PRD. Chooses which PRD set to open. Decides its content, which sections to fix, and the status of each section, which decides the draft mark. Chooses the format, theme, and sections of an export, and which version to send to whom. Cannot approve it.

#### Persona 2: ToolsDeveloper (PER-002)

- **Role**: Developer on the consulting delivery team who uses the authoring tools but did not write the PRD
- **Goals**: Give me the requirements for my story, nothing else.; Find the requirements, stories, and scenarios for the current work without reading the whole PRD; Export a part of the PRD to share with the team
- **Pain Points**: Finding one requirement or scenario across 18 files takes a search (P-001)
- **Technical Proficiency**: Expert in software and in the authoring tools. May not know the business domain.
- **Authority**: Chooses which PRD set to open. Decides which items apply to own work, and the format, theme, and sections of an export to share. Cannot approve the PRD.

#### Persona 3: EngineeringLead (PER-003)

- **Role**: Engineering lead on the client or delivery team that builds the product
- **Goals**: Can my team build this, yes or no?; Decide if the team can build the product from this PRD; Find what is missing or unclear, and send it back to the author
- **Pain Points**: Does not use the authoring tools, so cannot read the set without an export (P-002)
- **Technical Proficiency**: Expert in software. Usually does not use the authoring tools.
- **Authority**: Reviews and comments. Decides if the team can build from the PRD. Does not approve it.

#### Persona 4: Sponsor (PER-004)

- **Role**: Product sponsor, a client executive who approves the PRD
- **Goals**: Two pages, then I decide.; Read a short summary and decide to approve or reject the PRD
- **Pain Points**: Cannot read the set without the authoring tools, and will not read 18 files (P-002)
- **Technical Proficiency**: Expert in the business. Does not use the authoring tools. Reads a few pages only.
- **Authority**: Approves or rejects the PRD. The only persona who approves.

#### Persona 5: TeamDeveloper (PER-005)

- **Role**: Developer on the client or delivery team who does not use the authoring tools
- **Goals**: Send me the part I need.; Read the sections that apply to the current work
- **Pain Points**: Cannot read the set without an export (P-002)
- **Technical Proficiency**: Expert in software. Does not use the authoring tools.
- **Authority**: None for the PRD.


---

### Use cases

Each use case is a PRD journey. The main flow lists the journey stages and their
acceptance lines. The alternative flows are the PRD scenarios that are not the
happy path.

#### UC-1: Stakeholders have a version of the PRD they can read without the tools, and the author has their feedback. (J-001)

**Actor**: Author (PER-001)

**Preconditions**:

- The authoring tools finish or regrade one or more sections, and the author wants to send a version for review.

**Main Flow**:

1. ST-001 Open the PRD: Given a PRD set with 18 documents, when the author opens it, then the author sees the product name, the version, and the status of every document in order.
2. ST-002 Check the grades: Given a set with graded and ungraded sections, when the author checks the grades, then the author sees the score, blocking count, and grade date of each graded section, and which sections are not graded.
3. ST-003 Go to a weak section: Given a weak section, when the author selects it or searches for one of its items, then the author reads it with its status, score, and blocking count.
4. ST-004 Fix the section: Given the author reads a section in the viewer, when the authoring tools save a new version of it, then the author sees the new text and grade without any action.
5. ST-005 Export the PRD: Given the author selects a format, a theme, and some sections, when the author exports, then the author has one file with only those sections, in that theme, that a reader opens without the authoring tools.
6. ST-006 Send the export: Given an exported file, when the author sends it, then each chosen stakeholder has the file.
7. ST-007 Read and respond: Given a stakeholder has the file, when the stakeholder opens it, then the stakeholder sees the version and if it is a draft, and can reply with comments or a decision.

**Postconditions**:

- Each stakeholder has read the version, and the author has the comments and the sponsor's decision.

**Alternative and Exception Flows**:

- **SC-002** (exception, ST-001): The PRD set has 18 files. Thirteen sections are at pending and fail the authoring tools' check because they have no content yet. One section has a header that cannot be read. Expected: The PRD set opens. All 18 documents are listed. The one unreadable section is marked as unreadable with its file name, and the 17 other documents can be read.
- **SC-003** (exception, ST-004): The author reads section 4 in the viewer. Section 4 shows a score of 61. At the same time, the authoring tools rewrite section 4 and grade it at 75. Expected: The viewer shows score 75 and the new text of section 4, and the author did nothing to get it. Section 8 sets the time limit.
- **SC-004** (alternate, ST-005): The PRD set has the root document and 4 sections at draft, and 13 sections at pending. The engineering lead wants an early copy. Expected: The file shows the word "Draft" and version 0.1.0 on the first page. The contents list shows the status and score of every section. Each pending section says that it is not written yet.
- **SC-006** (alternate, ST-001): Yesterday the author read the PRD Forge Viewer PRD set and closed the viewer. Overnight the authoring tools changed section 6 from pending to draft. Expected: The viewer opens the same PRD set as in the last session, and every section shows its current version, including section 6 at draft.

**Golden Thread**: Yes

**Priority**: CRITICAL

---

#### UC-2: The developer has the sections and items for the current work, such as requirements, journeys, and scenarios, and can share those sections with the team. (J-002)

**Actor**: ToolsDeveloper (PER-002)

**Preconditions**:

- The developer starts work on a part of the product.

**Main Flow**:

1. ST-008 Open the PRD: Given a PRD set, when the developer opens it, then the developer sees the version and the list of sections.
2. ST-009 Search for the work: Given a search term and a category, when the developer searches, then the developer sees the matching items best first, each with its id and section, and opens one in one action.
3. ST-010 Share the items: Given the developer selects two sections, when the developer exports them, then the team has one file with only those two sections.

**Postconditions**:

- The developer has the items for the current work, and the team has a file with the sections that hold those items.

**Alternative and Exception Flows**:

- **SC-007** (exception, ST-009): The PRD set has its functional requirements and scenarios written. Expected: The developer sees that no item contains "invoice", and sees no results.
- **SC-008** (alternate, ST-010): The release plan section is still pending. Expected: The file has both selected sections, the pending one says that it is not written yet, and the export shows "Draft".

**Golden Thread**: No

**Priority**: HIGH

---

#### UC-3: The sponsor approves or rejects a version of the PRD, with a reason. (J-003)

**Actor**: Sponsor (PER-004)

**Preconditions**:

- The sponsor receives an export of a PRD version from the author.

**Main Flow**:

1. ST-011 Read the export: Given an export of a draft version, when the sponsor opens it, then the first page shows the version and the word Draft, then the summary and the status and score of every section.
2. ST-012 Decide and reply: Given the sponsor decided on a version, when the sponsor replies, then the author has the decision and its reason.

**Postconditions**:

- The author has the sponsor's decision and its reason for this version.

**Alternative and Exception Flows**:

- None in the PRD.

**Golden Thread**: No

**Priority**: HIGH

---


### Functional requirements detail

There are 24 functional requirements. All text is copied from
`08-functional-requirements.md` in the PRD.

#### FR-001: Open a PRD set and see its contents

**Description**: The author sees the product name, the version, the executive summary, and every document of the set in order, each with its status.

**Relates To**: BR-001, UC-1 (J-001), ST-001

**Rationale**: Author (PER-001) needs this at ST-001 (Open the PRD). It serves O-001. PRD source: Interview, 2026-10-26; SC-001.

**Acceptance Criteria**:

- [ ] Given a PRD set with 18 documents, when the author opens it, then the author sees the product name, the version, the executive summary, and all 18 documents in order, each with its status.

**Shown In**: screen

**Priority**: MUST_HAVE

**Release**: REL-001

---

#### FR-002: Return to the same PRD set in the next session

**Description**: The author continues with the same PRD set without selecting it again.

**Relates To**: BR-001, UC-1 (J-001), ST-001

**Rationale**: Author (PER-001) needs this at ST-001 (Open the PRD). It serves O-001. PRD source: Interview, 2026-10-26; SC-006.

**Acceptance Criteria**:

- [ ] Given the author closed the viewer while a PRD set was open, when the author opens the viewer again, then the same PRD set is open without any selection.
- [ ] Given a section changed while the viewer was closed, when the author opens the viewer again, then the author sees the current version of that section.

**Shown In**: screen

**Priority**: SHOULD_HAVE

**Release**: REL-001

---

#### FR-003: Open a PRD set that has incomplete or unreadable documents

**Description**: The author reads every readable document and sees which documents cannot be read.

**Relates To**: BR-001, UC-1 (J-001), ST-001

**Rationale**: Author (PER-001) needs this at ST-001 (Open the PRD). It serves O-001. PRD source: SC-002.

**Acceptance Criteria**:

- [ ] Given a PRD set with 13 pending sections that have no content, when the author opens it, then all 18 documents are listed and each pending section shows its status as pending.
- [ ] Given one section that cannot be read, when the author opens the set, then the author sees that section marked as unreadable with its file name, and can read the other 17 documents.

**Shown In**: screen

**Priority**: MUST_HAVE

**Release**: REL-001

---

#### FR-004: See the grades of all sections together

**Description**: The author sees the status, score, count of blocking defects, and grade date of every section at the same time.

**Relates To**: BR-002, UC-1 (J-001), ST-002

**Rationale**: Author (PER-001) needs this at ST-002 (Check the grades). It serves O-002. PRD source: Interview, 2026-10-26; P-003.

**Acceptance Criteria**:

- [ ] Given section 4 has score 61 and 0 blocking defects and section 3 has score 75 and 1 blocking defect, when the author views the grades, then the author sees both sections with those values and their grade dates.
- [ ] Given a section that has no grade, when the author views the grades, then that section shows that it is not graded.

**Shown In**: screen

**Priority**: MUST_HAVE

**Release**: REL-001

---

#### FR-005: Go directly to any section

**Description**: The author reads the selected section without opening other documents first.

**Relates To**: BR-001, UC-1 (J-001), ST-003

**Rationale**: Author (PER-001) needs this at ST-003 (Go to a weak section). It serves O-001. PRD source: Interview, 2026-10-26; P-001.

**Acceptance Criteria**:

- [ ] Given the author is reading the problem and opportunity section, when the author selects the functional requirements section, then the author sees it in one action.

**Shown In**: screen

**Priority**: MUST_HAVE

**Release**: REL-001

---

#### FR-006: Move to the previous or the next section in reading order

**Description**: The author reads the PRD set from start to end, one section after the other.

**Relates To**: BR-001, UC-1 (J-001), ST-003

**Rationale**: Author (PER-001) needs this at ST-003 (Go to a weak section). It serves O-001. PRD source: Interview, 2026-10-26. Dropped on 2026-10-26 by the PRD owner: the tree (FR-005, FR-023) moves the author to any section.

**Acceptance Criteria**:

- [ ] Given the author is reading section 4, when the author moves to the next section, then the author sees section 5, user journeys.
- [ ] Given the author is reading section 4, when the author moves to the previous section, then the author sees section 3, objectives and success metrics.
- [ ] Given the author is reading the last section, when the author tries to move to the next section, then the author stays on the last section and sees that it is the last one.
- [ ] Given the author is reading the root document, when the author tries to move to the previous section, then the author stays on the root document and sees that it is the first one.

**Shown In**: none

**Priority**: WONT_HAVE

**Release**: None (dropped)

---

#### FR-007: Follow a reference from one item to the item it names

**Description**: The developer reads the related item, such as the journey stage that a requirement serves.

**Relates To**: BR-001, UC-1 (J-001), ST-003, UC-2 (J-002)

**Rationale**: ToolsDeveloper (PER-002) needs this at ST-003 (Go to a weak section), the J-001 stage that holds search in release 1. It serves O-001. PRD source: J-002.

**Acceptance Criteria**:

- [ ] Given requirement FR-004 names stage ST-002, when the developer follows that reference, then the developer sees stage ST-002 in J-001.

**Shown In**: screen

**Priority**: SHOULD_HAVE

**Release**: REL-001

---

#### FR-008: Search the PRD set by term, in one category or in all categories

**Description**: The developer sees the matching items, most relevant first, each with its id and section.

**Relates To**: BR-001, UC-1 (J-001), ST-003, UC-2 (J-002)

**Rationale**: ToolsDeveloper (PER-002) needs this at ST-003 (Go to a weak section), the J-001 stage that holds search in release 1. It serves O-001. PRD source: Interview, 2026-10-26; SC-005.

**Acceptance Criteria**:

- [ ] Given the term "export" and the category functional requirements, when the developer searches, then the developer sees only the functional requirements that contain "export", each with its id and section.
- [ ] Given the same term and the category "all", when the developer searches, then the developer sees matching items from every section, including scenarios.
- [ ] Given item A has "export" in its title and item B has "export" only once in its text, when the developer searches for "export", then item A is above item B.
- [ ] Given a search with matches, when the developer views the results, then each result shows its id, its title, its section, and a relevance score from 0 to 100, highest first.
- [ ] Given a list of results, when the developer selects one result, then the developer sees that item in its section.
- [ ] Given a term that no item contains, when the developer searches, then the developer sees that there are no matches.

**Shown In**: screen

**Priority**: MUST_HAVE

**Release**: REL-001

---

#### FR-009: See changes that the authoring tools make, without any action

**Description**: The author sees the current version of each section without any action.

**Relates To**: BR-001, UC-1 (J-001), ST-004

**Rationale**: Author (PER-001) needs this at ST-004 (Fix the section). It serves O-001. PRD source: Interview, 2026-10-26; SC-003.

**Acceptance Criteria**:

- [ ] Given the author reads section 4 with score 61, when the authoring tools save section 4 with score 75, then the author sees score 75 and the new text without any action, within the time limit in NFR-002.
- [ ] Given the author reads section 4 when the authoring tools save it, when the new version shows, then the author sees that section 4 changed.
- [ ] Given the authoring tools change a section the author is not reading, when the author views the grades, then that section shows its new status and score.

**Shown In**: screen

**Priority**: MUST_HAVE

**Release**: REL-001

---

#### FR-010: Export the PRD set as a fixed-layout document (IN-006)

**Description**: The author has one fixed-layout document that a reader opens with software already on the computer, without the authoring tools.

**Relates To**: BR-001, UC-1 (J-001), ST-005

**Rationale**: Author (PER-001) needs this at ST-005 (Export the PRD). It serves O-001. PRD source: Interview, 2026-10-26; SC-001.

**Acceptance Criteria**:

- [ ] Given a PRD set with 18 documents, when the author exports the whole set as a fixed-layout document, then one file in the format that IN-006 names contains every document in order, and the sponsor opens it without the authoring tools.

**Shown In**: report

**Priority**: MUST_HAVE

**Release**: REL-001

---

#### FR-011: Export the PRD set as an editable document (IN-006)

**Description**: The author has one editable document that a reader opens with software already on the computer, without the authoring tools.

**Relates To**: BR-001, UC-1 (J-001), ST-005

**Rationale**: Author (PER-001) needs this at ST-005 (Export the PRD). It serves O-001. PRD source: Interview, 2026-10-26; SC-004.

**Acceptance Criteria**:

- [ ] Given a PRD set with 18 documents, when the author exports the whole set as an editable document, then one file in the format that IN-006 names contains every document in order, and the engineering lead opens it in a word processor without the authoring tools.

**Shown In**: report

**Priority**: SHOULD_HAVE

**Release**: REL-001

---

#### FR-012: Export only selected sections

**Description**: The developer has one file with only the selected sections.

**Relates To**: BR-001, UC-1 (J-001), ST-005, UC-2 (J-002)

**Rationale**: ToolsDeveloper (PER-002) needs this at ST-005 (Export the PRD), the J-001 stage that holds the export of selected sections in release 1. It serves O-001. PRD source: Interview, 2026-10-26; SC-005.

**Acceptance Criteria**:

- [ ] Given the user journeys section and the functional requirements section are the only sections selected, when the developer exports them, then the file contains only those two sections, in reading order.

**Shown In**: report

**Priority**: MUST_HAVE

**Release**: REL-001

---

#### FR-013: Print the PRD set or selected sections

**Description**: The author has a printed copy with the same content as the export.

**Relates To**: BR-001, UC-1 (J-001), ST-005

**Rationale**: Author (PER-001) needs this at ST-005 (Export the PRD). It serves O-001. PRD source: Interview, 2026-10-26.

**Acceptance Criteria**:

- [ ] Given the whole PRD set is selected, when the author prints it, then the printed copy has the same documents, order, and draft mark as the fixed-layout export.

**Shown In**: report

**Priority**: SHOULD_HAVE

**Release**: REL-001

---

#### FR-014: See the version of the PRD, and if it is a draft, in an export

**Description**: The sponsor knows which version is in the file, and if it is a draft.

**Relates To**: BR-001, UC-1 (J-001), ST-005

**Rationale**: Sponsor (PER-004) needs this at ST-005 (Export the PRD). It serves O-001. PRD source: Interview, 2026-10-26; SC-001, SC-004.

**Acceptance Criteria**:

- [ ] Given version 0.1.0 with sections at draft, when the sponsor opens the export, then the first page shows version 0.1.0 and the word "Draft".

**Shown In**: report

**Priority**: MUST_HAVE

**Release**: REL-001

---

#### FR-015: Select an export theme from the built-in themes

**Description**: The export has the colors and fonts of the selected theme.

**Relates To**: BR-001, UC-1 (J-001), ST-005

**Rationale**: Author (PER-001) needs this at ST-005 (Export the PRD). It serves O-001. PRD source: Interview, 2026-10-26.

**Acceptance Criteria**:

- [ ] Given the built-in theme Clay, when the author exports with Clay, then the file has page color FAF9F5, text color 3D3D3A, heading color 141413, accent color D97757, a serif font for headings, and a sans-serif font for text.
- [ ] Given the built-in theme Ice Snowstorm, when the author exports with it, then the file has page color F3F6FB, text color 111111, heading color 0B1F4B, accent color 1D4E89, and a sans-serif font for headings and text.

**Shown In**: screen

**Priority**: MUST_HAVE

**Release**: REL-001

---

#### FR-016: Make a custom export theme

**Description**: The author exports with colors and fonts that the author selected.

**Relates To**: BR-001, UC-1 (J-001), ST-005

**Rationale**: Author (PER-001) needs this at ST-005 (Export the PRD). It serves O-001. PRD source: Interview, 2026-10-26.

**Acceptance Criteria**:

- [ ] Given the author makes a theme named "Acme" with a page color, a text color, a heading color, an accent color, a text font, and a heading font, each font chosen from serif, sans-serif, and monospace, when the author exports with "Acme", then the file uses those colors and fonts.
- [ ] Given an export with the theme "Acme", when a reader opens it on a computer that does not have those fonts installed, then the reader sees the same fonts as the author.

**Shown In**: screen

**Priority**: SHOULD_HAVE

**Release**: REL-001

---

#### FR-017: Change a custom export theme

**Description**: Later exports use the changed colors and fonts.

**Relates To**: BR-001, UC-1 (J-001), ST-005

**Rationale**: Author (PER-001) needs this at ST-005 (Export the PRD). It serves O-001. PRD source: Interview, 2026-10-26.

**Acceptance Criteria**:

- [ ] Given the custom theme "Acme", when the author changes its accent color and exports, then the file uses the new accent color.
- [ ] Given a built-in theme, when the author tries to change it, then the built-in theme stays as it was.

**Shown In**: screen

**Priority**: SHOULD_HAVE

**Release**: REL-001

---

#### FR-018: Delete a custom export theme

**Description**: The deleted theme is no longer available for export.

**Relates To**: BR-001, UC-1 (J-001), ST-005

**Rationale**: Author (PER-001) needs this at ST-005 (Export the PRD). It serves O-001. PRD source: Interview, 2026-10-26.

**Acceptance Criteria**:

- [ ] Given the custom theme "Acme", when the author deletes it, then "Acme" is no longer available to select.
- [ ] Given a built-in theme, when the author tries to delete it, then the built-in theme is still available.

**Shown In**: screen

**Priority**: SHOULD_HAVE

**Release**: REL-001

---

#### FR-019: See the status and score of every section in an export

**Description**: The engineering lead knows which sections are finished before reading them.

**Relates To**: BR-001, UC-1 (J-001), ST-005

**Rationale**: EngineeringLead (PER-003) needs this at ST-005 (Export the PRD). It serves O-001. PRD source: SC-004.

**Acceptance Criteria**:

- [ ] Given 13 pending sections, when the engineering lead opens the export, then the contents list shows the status and score of every section.
- [ ] Given a pending section, when the engineering lead reaches it in the export, then the section says that it is not written yet.

**Shown In**: report

**Priority**: SHOULD_HAVE

**Release**: REL-001

---

#### FR-020: Keep custom export themes from one session to the next

**Description**: The author uses the same custom themes after the viewer restarts.

**Relates To**: BR-001, UC-1 (J-001), ST-005

**Rationale**: Author (PER-001) needs this at ST-005 (Export the PRD). It serves O-001. PRD source: Interview, 2026-10-26.

**Acceptance Criteria**:

- [ ] Given the author made the custom theme "Acme", when the author closes and reopens the viewer, then "Acme" is available to select, with the same colors and fonts.

**Shown In**: screen

**Priority**: SHOULD_HAVE

**Release**: REL-001

---

#### FR-021: Start the viewer from a terminal with the command prdf

**Description**: The author sees the PRD set of the current directory in the viewer, with no other step.

**Relates To**: BR-001, UC-1 (J-001), ST-001

**Rationale**: Author (PER-001) needs this at ST-001 (Open the PRD). It serves O-001. PRD source: Interview, 2026-10-26.

**Acceptance Criteria**:

- [ ] Given the current directory contains docs/prd with one PRD set, when the author runs prdf, then the viewer opens and shows that PRD set.
- [ ] Given the author runs prdf with the path of a PRD set, when the viewer opens, then it shows that PRD set.
- [ ] Given the current directory contains no PRD set, when the author runs prdf, then the author sees that no PRD set was found there, and sees the list of known PRD set locations (FR-022).

**Shown In**: screen

**Priority**: MUST_HAVE

**Release**: REL-001

---

#### FR-022: Choose a PRD set from the locations the viewer remembers

**Description**: The author opens any PRD set opened before, without typing or finding its path.

**Relates To**: BR-001, UC-1 (J-001), ST-001

**Rationale**: Author (PER-001) needs this at ST-001 (Open the PRD). It serves O-001. PRD source: Interview, 2026-10-26.

**Acceptance Criteria**:

- [ ] Given the author opened PRD sets in two different folders before, when the author opens a folder with no PRD set, then the author sees both locations, each with its product name.
- [ ] Given the list of known locations, when the author selects one, then the viewer opens that PRD set.
- [ ] Given a known location whose PRD set no longer exists, when the author sees the list, then that location is marked as not found.

**Shown In**: screen

**Priority**: SHOULD_HAVE

**Release**: REL-001

---

#### FR-023: Select one item of a section and read it without the whole section

**Description**: The author reads one item, such as a persona or a requirement, without reading the whole section first.

**Relates To**: BR-001, UC-1 (J-001), ST-003

**Rationale**: Author (PER-001) needs this at ST-003 (Go to a weak section). It serves O-001. PRD source: Interview, 2026-10-26.

**Acceptance Criteria**:

- [ ] Given the users and personas section with PER-001 to PER-005, when the author asks for the items of that section, then the author sees the five persona ids.
- [ ] Given the five persona ids of that section are in view, when the author selects PER-001, then the author sees PER-001 with the status and grade of its section.

**Shown In**: screen

**Priority**: MUST_HAVE

**Release**: REL-001

---

#### FR-024: Choose one PRD set when the docs/prd folder holds more than one

**Description**: The author opens the intended PRD set without typing its path.

**Relates To**: BR-001, UC-1 (J-001), ST-001

**Rationale**: Author (PER-001) needs this at ST-001 (Open the PRD). It serves O-001. PRD source: PRD owner decision, 2026-10-26 (HLD review ADV-02).

**Acceptance Criteria**:

- [ ] Given the current directory contains docs/prd with two PRD sets, and neither set was open in the last session, when the author runs prdf, then the author sees both sets, each with its product name and folder, and the viewer opens neither set.
- [ ] Given the current directory contains docs/prd with two PRD sets, and one of them was open in the last session, when the author runs prdf, then the viewer opens that set.
- [ ] Given that list, when the author selects one set, then the viewer opens that PRD set.

**Shown In**: screen

**Priority**: SHOULD_HAVE

**Release**: REL-001

---


#### FR-025: See the findings behind the grade of a section

**Description**: The author sees what is missing in a section and what to improve, without the authoring tools.

**Relates To**: BR-002, UC-1 (J-001), ST-002

**Rationale**: Author (PER-001) needs this at ST-002 (Check the grades). It serves O-002. PRD source: PRD owner decision, 2026-10-27; OUT-002, D-002.

**Acceptance Criteria**:

- [ ] Given section 7 has a grade with 1 blocking defect and 2 items to raise the grade, when the author views the findings of section 7, then the author sees the blocking defect and the 2 items.
- [ ] Given a section with no recorded findings, when the author views its findings, then the author sees that no findings are recorded.

**Shown In**: screen

**Priority**: WONT_HAVE (release 1). It is the only requirement of release 2.

**Release**: REL-002

---

## Non-Functional Requirements (NFRs)

### Performance requirements

All performance targets are for a PRD set of 18 documents on the test computer,
an Apple silicon Mac with 16 GB.

#### NFR-P-001: Open a PRD set

**PRD Source**: NFR-001 (performance)

**Requirement**: The author sees a PRD set within 2 seconds of opening it.

- Metric: Time from the open action to the moment the author sees the product name, the version, and the status of every document.
- Target: p95 at most 2 seconds, for a PRD set of 18 documents

**Measurement Method**: Open this PRD set 20 times on the test computer (OUT-003), time each open from a screen recording, and take the 19th fastest time.

**Applies To**: FR-001, FR-002, FR-003

**Rationale**: The author opens the viewer several times a day (Q-003). Serves G-1 and principle 11.

**Acceptance Criteria**:

- [ ] The measurement above meets the target: p95 at most 2 seconds, for a PRD set of 18 documents.

**Priority**: MUST_HAVE

---

#### NFR-P-002: Show a change from the authoring tools

**PRD Source**: NFR-002 (performance)

**Requirement**: The author sees a change from the authoring tools within 2 seconds of the save.

- Metric: Time from the moment the authoring tools save a section to the moment the author sees the new text and score in the viewer.
- Target: p95 at most 2 seconds

**Measurement Method**: Change and save one section 20 times while the viewer shows it, on the test computer, time each update from a screen recording, and take the 19th fastest time.

**Applies To**: FR-009

**Rationale**: A slow refresh breaks the loop between the authoring tools and the viewer (SD-1). Serves G-1 and principles 6 and 11.

**Acceptance Criteria**:

- [ ] The measurement above meets the target: p95 at most 2 seconds.

**Priority**: MUST_HAVE

---

#### NFR-P-003: Search response time

**PRD Source**: NFR-003 (performance)

**Requirement**: The developer sees search results within 0.5 seconds of searching.

- Metric: Time from the search action to the moment the developer sees the results.
- Target: p95 at most 0.5 seconds, for a PRD set of 18 documents

**Measurement Method**: Run 20 searches with different terms and categories on this PRD set, on the test computer, time each from a screen recording, and take the 19th fastest time.

**Applies To**: FR-008

**Rationale**: A developer wants only the items for one story (SD-3). Serves G-3 and principle 11.

**Acceptance Criteria**:

- [ ] The measurement above meets the target: p95 at most 0.5 seconds, for a PRD set of 18 documents.

**Priority**: MUST_HAVE

---

#### NFR-P-004: Export time

**PRD Source**: NFR-004 (performance)

**Requirement**: The author has the export file within 10 seconds of starting the export.

- Metric: Time from the export action to the moment the file is ready to open.
- Target: p95 at most 10 seconds, for the whole PRD set of 18 documents

**Measurement Method**: Export this PRD set 20 times, 10 times in each format of IN-006, on the test computer, time each export, and take the 19th fastest time.

**Applies To**: FR-010, FR-011, FR-012

**Rationale**: The author sends a version the same day (SD-1, SD-2). Serves G-2 and principle 11.

**Acceptance Criteria**:

- [ ] The measurement above meets the target: p95 at most 10 seconds, for the whole PRD set of 18 documents.

**Priority**: MUST_HAVE

---


### Availability and resilience requirements

The viewer is a local desktop app with no server. Uptime SLAs, RTO, and RPO do
not apply.

#### NFR-A-001: Works without a network

**PRD Source**: NFR-006 (availability)

**Requirement**: Every release 1 feature works without a network connection.

- Metric: Share of the release 1 functional requirements that pass with the network off.
- Target: 100% of the 23 functional requirements

**Measurement Method**: Turn off all network connections on the test computer and run the acceptance criteria of FR-001 to FR-024, except FR-006.

**Applies To**: All FRs

**Rationale**: The PRD set is local (A-002). Serves principle 1.

**Acceptance Criteria**:

- [ ] The measurement above meets the target: 100% of the 23 functional requirements.

**Priority**: MUST_HAVE

---

#### NFR-A-002: Custom themes survive a restart

**PRD Source**: NFR-008 (durability)

**Requirement**: Custom export themes are not lost when the viewer restarts.

- Metric: Number of custom themes, or theme values, lost after a restart.
- Target: Zero

**Measurement Method**: Make 5 custom themes, close the viewer, restart the computer, open the viewer, and compare every value of every theme.

**Applies To**: FR-016, FR-020

**Rationale**: The author makes a theme once for each client. Serves FR-020.

**Acceptance Criteria**:

- [ ] The measurement above meets the target: Zero.

**Priority**: MUST_HAVE

---


#### NFR-A-003: Fault tolerance for unreadable documents

**PRD Source**: FR-003, R-001

**Requirement**: One document that cannot be read does not stop the viewer from
showing the other documents.

**Rationale**: A change to the PRD Forge format can break the viewer (R-001).
Serves principle 3.

**Acceptance Criteria**:

- [ ] The FR-003 acceptance criteria pass.

**Priority**: MUST_HAVE

---

### Scalability requirements

Not applicable in the PRD. The viewer is single-user and local. Every target in
the PRD is for a set of 18 documents. The PRD sets no target for larger sets.

---

### Security requirements

The viewer has no accounts, no server, and no network use for its features.
Authentication, authorization, and secrets management do not apply.

#### NFR-SEC-001: No PRD content leaves the computer

**PRD Source**: NFR-005 (privacy)

**Requirement**: No content of a PRD set leaves the author's computer.

- Metric: Number of network transfers that contain any content of a PRD set.
- Target: Zero

**Measurement Method**: Record all network traffic from the test computer during a session that opens, searches, and exports this PRD set. Search the record for text from the PRD set. The count of matches is zero.

**Applies To**: All FRs

**Rationale**: PRD content is client material. Serves principles 1 and 8.

**Acceptance Criteria**:

- [ ] The measurement above meets the target: Zero.

**Priority**: MUST_HAVE

---


#### NFR-SEC-002: The viewer does not change the PRD set

**PRD Source**: OUT-001 (C-002 retired in PRD 0.6.0)

**Requirement**: The viewer does not change any document of a PRD set. The
author changes documents only in the authoring tools.

**Rationale**: Edits go through the authoring tools so that they are graded
(Q-005). Serves principle 2.

**Acceptance Criteria**:

- [ ] Compare every document of a PRD set before and after a session in which the author opens, searches, and exports it. No document has changed.

**Priority**: MUST_HAVE

---

#### NFR-SEC-003: Only local content shows

**PRD Source**: NFR-010 (security)

**Requirement**: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads.

- Metric: Number of scripts that run, and number of network requests that the viewer makes, while it shows a test PRD set that holds a script in a section, a script in a diagram, a remote image, and a remote link.
- Target: Zero scripts run and zero network requests

**Measurement Method**: On the test computer, start a network monitor, open the test PRD set, read every section, select the remote link, and count the scripts that run and the network requests.

**Applies To**: FR-001, FR-005, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-023

**Rationale**: An author can open a PRD set from any source. Active or remote content breaks NFR-005. Serves principles 1 and 4.

**Acceptance Criteria**:

- [ ] The measurement above meets the target: Zero scripts run and zero network requests.

**Priority**: MUST_HAVE

---


---

### Compliance and regulatory requirements

No regulation applies. The viewer holds no personal data (principle 8). PDF and
Word are a scope decision, not a regulation (IN-006).

---

### Usability requirements

#### NFR-U-001: Keyboard-only use

**PRD Source**: NFR-007 (accessibility)

**Requirement**: A person who uses only a keyboard can do every task in the viewer.

- Metric: Share of the release 1 acceptance criteria that a tester completes with a keyboard only, and the count of WCAG 2.2 level AA failures.
- Target: 100% of the acceptance criteria, and zero WCAG 2.2 AA failures

**Measurement Method**: A tester runs the acceptance criteria of FR-001 to FR-024, except FR-006, with a keyboard only, then checks the viewer against the WCAG 2.2 level AA success criteria.

**Applies To**: All FRs

**Rationale**: Every person must be able to use the viewer. Serves principle 12.

**Acceptance Criteria**:

- [ ] The measurement above meets the target: 100% of the acceptance criteria, and zero WCAG 2.2 AA failures.

**Priority**: MUST_HAVE

---

#### NFR-U-002: Exports readable by a screen reader

**PRD Source**: NFR-009 (accessibility)

**Requirement**: A reader who uses a screen reader can read every export.

- Metric: Number of errors that the built-in accessibility checker of the reader's software reports on an export.
- Target: Zero errors, for each format in IN-006

**Measurement Method**: Export this PRD set in each format of IN-006 and run the accessibility checker of a standard PDF reader and of a word processor on each file.

**Applies To**: FR-010, FR-011, FR-012

**Rationale**: Stakeholders read only the export (P-002). Serves G-2 and principles 10 and 12.

**Acceptance Criteria**:

- [ ] The measurement above meets the target: Zero errors, for each format in IN-006.

**Priority**: SHOULD_HAVE

---


---

### Maintainability and supportability requirements

The PRD sets no maintainability target. Principles 14, 15, and 16 apply.

---

### Portability and interoperability requirements

#### NFR-I-001: PRD Forge format version 1

**PRD Source**: C-003

**Requirement**: The viewer reads PRD sets in the document layout of the
authoring tools, version 1: one root document and 17 section documents with the
headers and links that the authoring tools define.

**Rationale**: The `prd-forge/*@1` schemas, published with PRD Forge 0.1.0, fix
the format. Serves principle 7.

**Acceptance Criteria**:

- [ ] Open a PRD set that passes the PRD Forge validator. Every document and every grade shows in the viewer.

**Priority**: MUST_HAVE

---

#### NFR-I-002: Standard export formats

**PRD Source**: IN-006 (C-001 retired in PRD 0.6.0)

**Requirement**: Exports use the formats that the stakeholders already read. The
fixed-layout document is PDF. The editable document is a Microsoft Word
document (.docx).

**Rationale**: The engineering lead, the sponsor, and the developers without the
authoring tools read PDF and Word files. Serves principle 10.

**Acceptance Criteria**:

- [ ] Open each export in a standard PDF reader and in a word processor that reads .docx files, on a computer without the authoring tools.

**Priority**: MUST_HAVE

---

#### NFR-I-003: Release 1 platform

**PRD Source**: OUT-003 (C-004 retired in PRD 0.6.0)

**Requirement**: Release 1 runs on macOS only. Other operating systems come in a
later release, after the PRD owner decides.

**Rationale**: The only test computer is an Apple silicon Mac with 16 GB of
memory. Serves principle 16.

**Acceptance Criteria**:

- [ ] Install release 1 on the test computer and run the acceptance criteria of FR-001 to FR-024, except FR-006.

**Priority**: MUST_HAVE

---

## Integration requirements

### External system integrations

All integrations are local. No integration uses a network.

#### INT-001: Integration with the PRD Forge authoring tools

**Purpose**: Read the PRD set that the authoring tools write, and show their
changes (FR-001 to FR-005, FR-009, FR-023).

**Integration Type**: File-based, local

**Data Exchanged**:

- **From the viewer to the authoring tools**: Nothing (NFR-SEC-002).
- **From the authoring tools to the viewer**: The root document, 17 section documents, the grade files in `grades/`, and the diagrams in `diagrams/`, on each save.

**Integration Pattern**: The viewer watches the PRD set folder and rereads a changed file.

**Authentication**: None. The operating system file permissions of the user.

**Error Handling**: A document that cannot be read shows by name with the reason (FR-003). The other documents still show.

**SLA**: A change shows within 2 seconds at p95 (NFR-P-002).

**Owner**: PRD Forge maintainers (D-001)

**Rationale**: The files are the only contract with the authoring tools (principle 9).

**Acceptance Criteria**:

- [ ] The FR-009 acceptance criteria pass.
- [ ] The viewer opens, searches, and exports a PRD set on a computer without the authoring tools.

**Priority**: MUST_HAVE

---

#### INT-002: Integration with the terminal (`prdf`)

**Purpose**: Start the viewer from a terminal on a folder, and choose a PRD set
from remembered locations (FR-021, FR-022).

**Integration Type**: Command-line program

**Data Exchanged**:

- **From the terminal to the viewer**: A folder path, or no argument.
- **From the viewer to the terminal**: Nothing that the PRD names.

**Integration Pattern**: The command starts the viewer. With no PRD set in the folder, the viewer shows the remembered locations (WF-006).

**Authentication**: None.

**Error Handling**: No PRD set in the folder shows the remembered locations, not an error (WF-006).

**SLA**: The PRD set shows within 2 seconds at p95 (NFR-P-001).

**Owner**: The viewer

**Rationale**: The author works in a terminal with the authoring tools.

**Acceptance Criteria**:

- [ ] The FR-021, FR-022, and FR-024 acceptance criteria pass.

**Priority**: MUST_HAVE

---

#### INT-003: Integration with PDF readers

**Purpose**: Stakeholders read a fixed-layout export (FR-010, IN-006).

**Integration Type**: File export

**Data Exchanged**:

- **From the viewer to the reader**: A PDF file of the whole set or of selected sections, with the theme, version, and draft mark.

**Integration Pattern**: The author saves the file and sends it by a channel of the author's choice. The viewer sends nothing (TR-006).

**Authentication**: None.

**Error Handling**: Not named in the PRD.

**SLA**: The whole-set export within 10 seconds at p95 (NFR-P-004). Zero screen-reader errors (NFR-U-002).

**Owner**: The viewer

**Rationale**: PER-003, PER-004, and PER-005 read only exports (P-002).

**Acceptance Criteria**:

- [ ] The FR-010 acceptance criteria pass.
- [ ] The NFR-I-002 acceptance criterion passes.

**Priority**: MUST_HAVE

---

#### INT-004: Integration with word processors (.docx)

**Purpose**: Stakeholders read and edit an export (FR-011, IN-006).

**Integration Type**: File export

**Data Exchanged**:

- **From the viewer to the word processor**: A .docx file of the whole set or of selected sections.

**Integration Pattern**: Same as INT-003.

**Authentication**: None.

**Error Handling**: Not named in the PRD.

**SLA**: Same as INT-003.

**Owner**: The viewer

**Rationale**: Same as INT-003.

**Acceptance Criteria**:

- [ ] The FR-011 acceptance criteria pass.
- [ ] The NFR-I-002 acceptance criterion passes.

**Priority**: MUST_HAVE

---

#### INT-005: Integration with the operating system print service

**Purpose**: Print the set or selected sections (FR-013).

**Integration Type**: Operating system service

**Data Exchanged**:

- **From the viewer to the printer**: The set or selected sections.

**Integration Pattern**: The standard print dialog of the operating system.

**Authentication**: None.

**Error Handling**: Not named in the PRD.

**SLA**: Not named in the PRD.

**Owner**: The viewer

**Rationale**: FR-013 is a SHOULD in the PRD.

**Acceptance Criteria**:

- [ ] The FR-013 acceptance criteria pass.

**Priority**: SHOULD_HAVE

---

## Data requirements

### Data entities

No entity holds personal data. Every entity is local to the author's computer.
The PRD gives no data volume except the 18-document set of the NFR targets.

#### Entity 1: PRD set (DR-001)

**Description**: One folder with a root document and 17 section documents in the
PRD Forge format, version 1 (C-003).

**Attributes**:

| Attribute | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| path | Folder path | Yes | Location on the local disk | Read-only (NFR-SEC-002) |
| product name | Text | Yes | From the root document | Front matter of `prd.md` |
| version | Text | Yes | PRD version | Front matter of `prd.md` |
| executive summary | Text | Yes | Body of the root document | Shown first (FR-001) |
| documents | List | Yes | Root and 17 sections, in `order` | From `links.children` |

**Relationships**:

- One-to-many with Document.

**Data Volume**: 18 documents for the NFR targets.

**Access Patterns**: Read all documents on open. Reread one document on change.

**Data Classification**: INTERNAL

**Data Retention**: Owned by the authoring tools. The viewer keeps no copy.

---

#### Entity 2: Document (DR-002)

**Description**: One markdown document of the set, with YAML front matter.

**Attributes**:

| Attribute | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| id | Text | Yes | Document ID | Unique in the set |
| kind | Text | Yes | Section kind | One of the `prd-forge/*@1` kinds |
| title | Text | Yes | Title | |
| section | Number | Yes | PRD section number | |
| order | Number | Yes | Reading order | |
| status | Enum | Yes | Document status | pending, draft, review, final |
| score | Number | No | Grade, 0 to 100 | Set only by a grading pass |
| blocking | Number | No | Count of blocking defects | Set only by a grading pass |
| graded | Date | No | Date of the grade | |
| links | Object | Yes | parent, prev, next, children, related | |
| items | List | No | The IDs the section defines | See Entity 3 |

**Relationships**:

- Many-to-one with PRD set. One-to-many with Item. Zero-or-one with Grade findings.

**Data Volume**: 18 per set for the NFR targets.

**Access Patterns**: Tree, search, and export read it. A change rereads it (FR-009).

**Data Classification**: INTERNAL

**Data Retention**: Owned by the authoring tools.

---

#### Entity 3: Item (DR-003)

**Description**: One identified entry in a section, such as a persona, a stage, a
requirement, or a wireframe. The ID prefixes are P-, PER-, O-, J-, ST-, SC-,
IN-, OUT-, FR-, NFR-, C-, TR-, A-, R-, D-, Q-, REL-, and WF-.

**Attributes**:

| Attribute | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| id | Text | Yes | Item ID | Stable, never renumbered |
| document | Reference | Yes | The section document | |
| fields | Object | Yes | The fields that the section schema defines | |
| references | List | No | IDs of other items that it names | FR-007 follows them |

**Relationships**:

- Many-to-one with Document. Many-to-many with Item through references.

**Data Volume**: Not in the PRD.

**Access Patterns**: Tree selection (FR-023), reference following (FR-007), and search (FR-008).

**Data Classification**: INTERNAL

**Data Retention**: Owned by the authoring tools.

---

#### Entity 4: Grade findings (DR-004)

**Description**: The reasons behind a section's grade, in `grades/`. PRD Forge
0.2.0 delivers them (D-002). Release 2 shows them (REL-002).

**Attributes**:

| Attribute | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| document | Reference | Yes | The graded section | Same file name in `grades/` |
| findings | Text | Yes | What is missing and what to improve | |

**Relationships**:

- One-to-one with Document.

**Data Volume**: At most one per section.

**Access Patterns**: Opened from a grade (REL-002).

**Data Classification**: INTERNAL

**Data Retention**: Owned by the authoring tools.

---

#### Entity 5: Known location (DR-005)

**Description**: A PRD set folder that the viewer remembers (FR-022), and the set
that was open at the end of the last session (FR-002).

**Attributes**:

| Attribute | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| path | Folder path | Yes | PRD set folder | Unique |
| product name | Text | No | From the root document when last read | |
| found | Boolean | Yes | The folder exists now | WF-006 shows "not found" |
| last open | Boolean | Yes | Open at the end of the last session | At most one is true |

**Relationships**:

- Zero-or-one with PRD set.

**Data Volume**: Not in the PRD.

**Access Patterns**: Read on start (FR-002, FR-021). Written when the author opens a set.

**Data Classification**: INTERNAL

**Data Retention**: Until the author removes it. The PRD sets no period.

---

#### Entity 6: Search index entry (DR-006)

**Description**: A derived, local entry for search by term and category (FR-008).
The viewer can delete and rebuild it at any time (principle 6).

**Attributes**:

| Attribute | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| item or document | Reference | Yes | What the entry finds | |
| category | Text | Yes | The category for the filter | From the section kind |
| text | Text | Yes | The searchable text | |
| relevance | Number | Yes | Relevance score, 0 to 100 | Shows the order only (WF-003) |

**Relationships**:

- Many-to-one with Item or Document.

**Data Volume**: Not in the PRD.

**Access Patterns**: Query by term and category within 0.5 seconds at p95 (NFR-P-003). Update when a document changes.

**Data Classification**: INTERNAL

**Data Retention**: Derived. Stored outside the PRD set folder (NFR-SEC-002).

---

#### Entity 7: Export theme (DR-007)

**Description**: A built-in or custom theme for exports (FR-015 to FR-018).
Custom themes survive a restart (FR-020, NFR-A-002).

**Attributes**:

| Attribute | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| name | Text | Yes | Theme name | Unique |
| built in | Boolean | Yes | Built-in themes cannot change | |
| font | Enum | Yes | serif, sans-serif, or monospace | Embedded in exports |
| colors | Object | Yes | Theme colors | |

**Relationships**:

- Used by many exports.

**Data Volume**: Not in the PRD.

**Access Patterns**: Read on export. Written on make, change, and delete.

**Data Classification**: INTERNAL

**Data Retention**: Until the author deletes the theme (FR-018).

---

### Data quality requirements

**Data Accuracy**: The viewer shows status, score, and blocking exactly as the front matter records them (principle 13).

**Data Completeness**: A missing grade shows as missing. A pending section shows as pending (FR-003).

**Data Consistency**: The front matter is authoritative over the body text.

**Data Timeliness**: A change shows within 2 seconds at p95 (NFR-P-002).

**Data Lineage**: Every derived entry (DR-006) names its source document.

---

### Data migration requirements

None. The viewer reads PRD sets in place and has no earlier version.

---

## Constraints and Assumptions

### Technical constraints

**C-001** (retired in PRD 0.6.0): The PRD now names the export formats, PDF and .docx, in scope item IN-006.

**C-002** (retired in PRD 0.6.0): The PRD now records the read-only rule as OUT-001, a release 1 non-goal that the PRD owner revisits on 2026-11-06.

**C-003** (standard): The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and 17 section documents with the headers and links that the authoring tools define. Verification: Open a PRD set that passes the PRD Forge validator. Every document and every grade shows in the viewer.

**C-004** (retired in PRD 0.6.0): The PRD now records macOS only for release 1 as OUT-003, out of scope, which the PRD owner revisits on 2026-11-06.

---

### Business constraints

**BC-1**: The viewer is free and open source for anyone who uses PRD Forge (PRD owner decision, 2026-10-26).

**BC-2**: Release 1 is due 2026-10-27. The PRD owner moved it from 2026-10-26 on 2026-10-26. Release 2 is due 2026-11-06.

**BC-3**: Every export shows "Draft" until every document is final (TR-005).

---

### Assumptions

**A-001**: Stakeholders open PDF and Word files without installing anything. If false: IN-006 changes, and FR-010 and FR-011 need other formats. Validated by: Send the first export of this PRD to PER-003 and PER-004 and ask.

**A-002**: The PRD set is on the same computer as the viewer. If false: FR-001 and FR-002 change, and NFR-005 and NFR-006 need new targets. Validated by: Ask the first three authors where they keep their PRD sets.

**A-003**: The PRD Forge version 1 format stays the same until release 1 ships. If false: C-003 changes, and FR-001, FR-003, and FR-004 can fail on new files (R-001). Validated by: D-001.

**A-004**: Authors want a viewer, and the current command-line export is not enough for them. If false: O-001 does not move because of the viewer, and P-001 and P-002 need a different answer. Validated by: Measure O-001 on this PRD with and without the viewer (Q-001).

**Validation Plan**: Each assumption has its own validation step above. The PRD owner owns all four.

---

## Success Criteria and KPIs

### Business success metrics

| Metric | Baseline | Target | Timeline | Measurement Method |
|---|---|---|---|---|
| O-001: Median calendar days from the day the author sends a PRD version to a stakeholder, to the day of the first written feedback from any stakeholder on that version. | About 10 calendar days, from past PRDs written before PRD Forge (estimate by the PRD owner, 2026-10-26). The first send of this PRD replaces it with a measured figure (Q-001). | 2 days or less | 2027-03-31 | PRD owner records each version sent |
| O-002: Count of blocking defects in a PRD version on the day the author sends it to a stakeholder, read from the grades in the export. | 1 blocking defect in version 0.2.0 of this PRD, sent on or after 2026-10-26. | 0 blocking defects in every version sent | 2027-03-31 | PRD owner records each version sent |

---

### Technical success metrics

| Metric | Target | Measurement Method |
|---|---|---|
| NFR-P-001 (NFR-001) Open a PRD set | p95 at most 2 seconds, for a PRD set of 18 documents | Open this PRD set 20 times on the test computer (OUT-003), time each open from a screen recording, and take the 19th fastest time. |
| NFR-P-002 (NFR-002) Show a change from the authoring tools | p95 at most 2 seconds | Change and save one section 20 times while the viewer shows it, on the test computer, time each update from a screen recording, and take the 19th fastest time. |
| NFR-P-003 (NFR-003) Search response time | p95 at most 0.5 seconds, for a PRD set of 18 documents | Run 20 searches with different terms and categories on this PRD set, on the test computer, time each from a screen recording, and take the 19th fastest time. |
| NFR-P-004 (NFR-004) Export time | p95 at most 10 seconds, for the whole PRD set of 18 documents | Export this PRD set 20 times, 10 times in each format of IN-006, on the test computer, time each export, and take the 19th fastest time. |
| NFR-SEC-001 (NFR-005) No PRD content leaves the computer | Zero | Record all network traffic from the test computer during a session that opens, searches, and exports this PRD set. Search the record for text from the PRD set. The count of matches is zero. |
| NFR-A-001 (NFR-006) Works without a network | 100% of the 23 functional requirements | Turn off all network connections on the test computer and run the acceptance criteria of FR-001 to FR-024, except FR-006. |
| NFR-U-001 (NFR-007) Keyboard-only use | 100% of the acceptance criteria, and zero WCAG 2.2 AA failures | A tester runs the acceptance criteria of FR-001 to FR-024, except FR-006, with a keyboard only, then checks the viewer against the WCAG 2.2 level AA success criteria. |
| NFR-A-002 (NFR-008) Custom themes survive a restart | Zero | Make 5 custom themes, close the viewer, restart the computer, open the viewer, and compare every value of every theme. |
| NFR-U-002 (NFR-009) Exports readable by a screen reader | Zero errors, for each format in IN-006 | Export this PRD set in each format of IN-006 and run the accessibility checker of a standard PDF reader and of a word processor on each file. |
| NFR-SEC-003 (NFR-010) Only local content shows | Zero scripts run and zero network requests | On the test computer, start a network monitor, open the test PRD set, read every section, select the remote link, and count the scripts that run and the network requests. |

---

### User adoption metrics

The PRD sets no adoption target. R-002 records the risk that few teams use PRD
Forge. The mitigation is to measure O-001 on this PRD first.

---

## Dependencies and Risks

### Dependencies

| Dependency | Description | Owner | Target Date | Status | Blocks |
|---|---|---|---|---|---|
| D-001 | PRD Forge keeps the version 1 document format stable until release 1 ships. | PRD Forge maintainers, owned by Richard Hightower | 2026-10-26 | committed | C-003, FR-001, FR-003, FR-004 |
| D-002 | PRD Forge records the findings behind each grade in the PRD set. | PRD Forge maintainers, owned by Richard Hightower | 2026-10-26 | delivered | OUT-002 |

---

### Risks

The risk IDs are the PRD IDs.

| Risk ID | Description | Probability | Impact | Mitigation Strategy | Owner |
|---|---|---|---|---|---|
| R-001 | A change to the PRD Forge document format breaks the viewer. | MEDIUM | HIGH | C-003 fixes the format at version 1. FR-003 shows each unreadable document by name. D-001 keeps the format stable for release 1. | Richard Hightower |
| R-002 | Few teams use PRD Forge, so the viewer has few users. | MEDIUM | MEDIUM | Measure O-001 on this PRD first, and report it by 2027-03-31. | Richard Hightower |
| R-003 | Nobody measures the baseline for O-001, so nobody can show success. | MEDIUM | MEDIUM | Q-001, due 2026-11-30. | Richard Hightower |

### Open questions

These questions come from the PRD. A requirement that needs a number that the
PRD does not have cites one of them.

| ID | Question | Decider | By | Blocks |
|---|---|---|---|---|
| Q-001 | How long does it take today from a finished PRD to stakeholder feedback? The PRD owner estimates about 10 days. Measure it on this PRD to replace the estimate. | Richard Hightower | 2026-11-30 | P-001, P-002 |
| Q-002 | How many stakeholders review a typical PRD, and how many of them have Claude Code and PRD Forge? | Richard Hightower | 2026-11-30 | P-002 |
| Q-003 | How often do the PRD author (PER-001) and the developer who uses PRD Forge (PER-002) open a PRD in the viewer? | Richard Hightower | 2026-11-30 | PER-001, PER-002 |
| Q-004 | The findings behind each grade (what is missing and what to improve) are not kept in the PRD set today. Must release 1 show them, and if so, who records them so that the author can see them later? | Richard Hightower | 2026-11-30 | ST-002, ST-003, P-003 |
| Q-005 | Is editing text in the viewer in release 1? | Richard Hightower | 2026-10-26 | None |
| Q-006 | When the sponsor (PER-004) is not available to approve a version, who approves it, or does the approval wait? | Richard Hightower | 2026-11-30 | TR-007 |
| Q-007 | By what date must PRD Forge record the findings behind each grade (D-002), and in which release does the viewer show them (OUT-002)? | Richard Hightower | 2026-10-26 | D-002, OUT-002 |

---

## Requirement conflicts & resolutions

> **Source**: The conflict analysis in `ARC-001-STKE-v1.0.md`.

### Conflict RC-1: Send today against zero blocking defects

**Conflicting Requirements**:

- **Requirement A**: FR-004 and FR-010 let the author see the grades and send an export the same day (SD-1).
- **Requirement B**: BR-002 wants 0 blocking defects in every version sent (O-002).

**Stakeholders Involved**:

- **PER-001 Author**: Wants to send today.
- **PER-003 EngineeringLead**: Needs a version without blocking defects to decide (TR-008).

**Nature of Conflict**:

- A section with a blocking defect stops a same-day send that meets BR-002.

**Trade-off Analysis**:

| Option | Pros | Cons | Impact |
|--------|------|------|--------|
| **Option 1**: The viewer blocks exports with blocking defects | BR-002 always met | The author cannot send a draft for early feedback | Engineering lead satisfied, author blocked |
| **Option 2**: The author decides, and the export shows the grades and "Draft" | Author keeps control. Readers see the defects | BR-002 depends on the author | Both partly satisfied |

**Resolution Strategy**: PRIORITIZE

**Decision**: Option 2. The author decides to fix now or send as a draft (TR-010). Each export shows the status, score, and blocking defects of every section (FR-019) and the "Draft" mark (FR-014, TR-005).

**Rationale**: The PRD gives TR-010 to the author. Exports never hide a defect.

**Decision Authority**: PER-001, by TR-010 in the PRD.

**Impact on Requirements**: None. The PRD already holds this decision.

**Stakeholder Management**:

- **PER-003 EngineeringLead**: Sees every blocking defect in the export contents.

**Future Consideration**:

- Release 2 shows the findings behind each grade, which helps the author fix defects faster (REL-002).

---

### Conflict RC-2: A clean export against the draft mark

**Conflicting Requirements**:

- **Requirement A**: The author wants a clean document for stakeholders (SD-2).
- **Requirement B**: FR-014 and TR-005 put "Draft" on every export of a set that is not all final.

**Stakeholders Involved**:

- **PER-001 Author**: Wants a clean document.
- **PER-004 Sponsor**: Must not see an unfinished PRD that looks final.

**Nature of Conflict**:

- An author cannot remove the mark in the viewer.

**Trade-off Analysis**:

| Option | Pros | Cons | Impact |
|--------|------|------|--------|
| **Option 1**: The author can turn the mark off | Clean document | An unfinished PRD can look approved | Sponsor at risk |
| **Option 2**: Fixed rule, no override | Readers always know the status | Author must take every section to final | Sponsor protected |

**Resolution Strategy**: PRIORITIZE

**Decision**: Option 2.

**Rationale**: The PRD owner decided the rule on 2026-10-26 (TR-005).

**Decision Authority**: PRD owner.

**Impact on Requirements**: None.

**Stakeholder Management**:

- **PER-001 Author**: To remove the mark, the author takes every section to final in the authoring tools.

**Future Consideration**:

- None.

---

## Timeline and Milestones

### High-Level milestones

| Milestone | Description | Target Date | Dependencies |
|---|---|---|---|
| REL-001 | Release 1, read and export | 2026-10-27 | FR-001, FR-002, FR-003, FR-004, FR-005, FR-007, FR-008, FR-0... |
| REL-002 | Release 2, grade findings | 2026-11-06 | FR-025 (depends on D-002) |

---

## Budget

### Cost estimate

The PRD gives no budget. The viewer is free and open source (BC-1). This
document adds no cost figure.

### Ongoing operational costs

None in the PRD. The viewer has no server or hosted service (principle 1).

---

## Approval

### Requirements review

| Reviewer | Role | Status | Date | Comments |
|----------|------|--------|------|----------|
| Richard Hightower | PRD owner | [ ] Approved | [PENDING] | |
| Richard Hightower | Sponsor (PER-004) | [ ] Approved | [PENDING] | |

### Sign-Off

| Stakeholder | Signature | Date |
|-------------|-----------|------|
| Richard Hightower, PRD owner and sponsor | [PENDING] | [PENDING] |

---

## Appendices

### Appendix A: Glossary

Copied from section 14 of the PRD.

| Term | Meaning |
|---|---|
| PRD set | One PRD as 18 linked documents: one root index with the executive summary, and 17 section documents. The unit of work for every persona. |
| section | One of the 17 section documents in a PRD set, such as problem and opportunity, user journeys, or functional requirements. |
| authoring tools | The tools that interview the author, write the PRD set, and grade each section. Today these are PRD Forge, used inside Claude Code. The viewer reads their output and does not replace them. |
| grade | The result of checking one section against its rubric: a score from 0 to 100, a count of blocking defects, and the date of the check. |
| blocking defect | A fault in a section that stops it from going to review or final, whatever its score. |
| status | The stage of a section or of the PRD set: pending (not interviewed), draft (written), review (with reviewers), or final (approved). |
| golden thread | The one journey that release 1 must deliver end to end. In this PRD it is J-001. |
| journey | The stages that one persona goes through to reach one goal, from start to end, including steps outside the product. |
| stage | One large step of a journey, with an actor, inputs, outputs, and a decision. |
| persona | One role that uses the product or approves something about it. |
| export | A copy of the whole PRD set or of selected sections, as one document file or as a printed copy, that a reader opens without the authoring tools. |
| export theme | A named set of colors and fonts that controls how an export looks. Some themes come with the viewer, and the author can make more. |
| MoSCoW priority | The priority of a requirement: must (release 1 needs it), should (important, not essential for release 1), could (if time allows), or won't (not in this release). |
| built-in theme | An export theme that comes with the viewer and that the author cannot change or delete. Release 1 has two: Ice Snowstorm and Clay. |
| fixed-layout document | An export file whose pages look the same on every computer and that the reader cannot easily change. IN-006 names the format. |
| editable document | An export file that the reader can open and change in a word processor. IN-006 names the format. |
| unreadable document | A document in a PRD set whose header the viewer cannot read, so its id, kind, title, or status is not known. A pending section with no content is not unreadable. |
| contents list | The list of every document of the PRD set, in reading order, at the start of an export. |
| reading order | The order of the documents in a PRD set: the root document first, then each section by its order number. |
| prdf | The terminal command that starts the viewer, short for PRD Forge. |
| item | Any entry in a PRD set that has an id, such as FR-008, SC-003, PER-002, or Q-004, and any glossary term. One search result is one item. |
| item title | The first named field of an item: its name, capability, statement, question, or term. |
| category | A filter for search: one category for each kind of section, such as functional requirements or scenarios, plus "all". |
| relevance score | A number from 0 to 100 on each search result. Matches in the item title score higher than matches in the text, and more matches score higher. |
| known location | A folder where the viewer opened a PRD set before. The viewer remembers it. |

### Appendix B: reference documents

- [PRD set](../../docs/prd/prd-forge-viewer/prd.md), version 0.5.0
- `projects/000-global/ARC-000-PRIN-v1.0.md`, architecture principles
- `ARC-001-STKE-v1.0.md`, stakeholder analysis

### Appendix C: Wireframes and Mockups

The wireframes are in section 7 of the PRD.

| ID | Title | Persona | Stage | Illustrates |
|---|---|---|---|---|
| [WF-001](../../docs/prd/prd-forge-viewer/diagrams/WF-001.svg) | The PRD set, with the scores | PER-001 | ST-001 | FR-001, FR-002, FR-003, FR-004, FR-005, FR-009 |
| [WF-002](../../docs/prd/prd-forge-viewer/diagrams/WF-002.svg) | One item, selected in the tree | PER-001 | ST-003 | FR-005, FR-007, FR-009, FR-023 |
| [WF-003](../../docs/prd/prd-forge-viewer/diagrams/WF-003.svg) | Search results | PER-002 | ST-009 | FR-008, FR-023 |
| [WF-004](../../docs/prd/prd-forge-viewer/diagrams/WF-004.svg) | A search with no match | PER-002 | ST-009 | FR-008 |
| [WF-005](../../docs/prd/prd-forge-viewer/diagrams/WF-005.svg) | A document that cannot be read | PER-001 | ST-001 | FR-003 |
| [WF-006](../../docs/prd/prd-forge-viewer/diagrams/WF-006.svg) | No PRD set in this folder | PER-001 | ST-001 | FR-021, FR-022 |
| [WF-007](../../docs/prd/prd-forge-viewer/diagrams/WF-007.svg) | Export | PER-001 | ST-005 | FR-010, FR-011, FR-012, FR-013, FR-015 |
| [WF-008](../../docs/prd/prd-forge-viewer/diagrams/WF-008.svg) | Themes | PER-001 | ST-005 | FR-015, FR-016, FR-017, FR-018, FR-020 |
| [WF-009](../../docs/prd/prd-forge-viewer/diagrams/WF-009.svg) | First page of an export | PER-004 | ST-011 | FR-014, FR-019, FR-010 |
| [WF-011](../../docs/prd/prd-forge-viewer/diagrams/WF-011.svg) | The findings behind a grade (release 2) | PER-001 | ST-002 | FR-025 |
| [WF-010](../../docs/prd/prd-forge-viewer/diagrams/WF-010.svg) | More than one PRD set in docs/prd (a state of WF-006) | PER-001 | ST-001 | FR-024, FR-022 |

### Appendix D: requirements traceability

| Requirement | Persona | Stage | BR | Stakeholder goal | Release |
|---|---|---|---|---|---|
| FR-001 | PER-001 | ST-001 | BR-001 | G-1 | REL-001 |
| FR-002 | PER-001 | ST-001 | BR-001 | G-1 | REL-001 |
| FR-003 | PER-001 | ST-001 | BR-001 | G-1 | REL-001 |
| FR-004 | PER-001 | ST-002 | BR-002 | G-1 | REL-001 |
| FR-005 | PER-001 | ST-003 | BR-001 | G-1 | REL-001 |
| FR-006 | PER-001 | ST-003 | BR-001 | G-1 | None (dropped) |
| FR-007 | PER-002 | ST-003 | BR-001 | G-3 | REL-001 |
| FR-008 | PER-002 | ST-003 | BR-001 | G-3 | REL-001 |
| FR-009 | PER-001 | ST-004 | BR-001 | G-1 | REL-001 |
| FR-010 | PER-001 | ST-005 | BR-001 | G-2 | REL-001 |
| FR-011 | PER-001 | ST-005 | BR-001 | G-2 | REL-001 |
| FR-012 | PER-002 | ST-005 | BR-001 | G-3 | REL-001 |
| FR-013 | PER-001 | ST-005 | BR-001 | G-2 | REL-001 |
| FR-014 | PER-004 | ST-005 | BR-001 | G-5 | REL-001 |
| FR-015 | PER-001 | ST-005 | BR-001 | G-2 | REL-001 |
| FR-016 | PER-001 | ST-005 | BR-001 | G-2 | REL-001 |
| FR-017 | PER-001 | ST-005 | BR-001 | G-2 | REL-001 |
| FR-018 | PER-001 | ST-005 | BR-001 | G-2 | REL-001 |
| FR-019 | PER-003 | ST-005 | BR-001 | G-5 | REL-001 |
| FR-020 | PER-001 | ST-005 | BR-001 | G-2 | REL-001 |
| FR-021 | PER-001 | ST-001 | BR-001 | G-1 | REL-001 |
| FR-022 | PER-001 | ST-001 | BR-001 | G-1 | REL-001 |
| FR-023 | PER-001 | ST-003 | BR-001 | G-1 | REL-001 |
| FR-024 | PER-001 | ST-001 | BR-001 | G-1 | REL-001 |
| FR-025 | PER-001 | ST-002 | BR-002 | G-1 | REL-002 |

---

**Document History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-10-26 | ArcKit AI | First draft from PRD version 0.3.4 |
| 1.0 | 2026-10-27 | ArcKit AI | Updated from PRD version 0.4.0 |
| 1.0 | 2026-10-27 | ArcKit AI | Updated from PRD version 0.5.0 |

## External references

> This section provides traceability from generated content back to source documents.

### Document register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| PFVP | prd-forge-viewer-prd.pdf | PRD | `projects/001-prd-forge-viewer/external/` | Export of the PRD Forge Viewer PRD, version 0.5.0, 18 documents. Source: `docs/prd/prd-forge-viewer/` |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| PFVP-C1 | PFVP | Section 15, version 0.3.2 | Governance | Decisions from the HLD review. Release 1 moves to 2026-10-27. |
| PFVP-C2 | PFVP | Root, executive summary | Problem | PRD authors cannot read an 18-file PRD Forge set as one document or see every grade at once. |
| PFVP-C3 | PFVP | Section 3, O-001 | Objective | Stakeholders give feedback on a PRD version sooner. |
| PFVP-C4 | PFVP | Section 3, O-002 | Objective | Authors fix blocking defects before stakeholders see a version. |

### Unreferenced documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| README.md | `projects/001-prd-forge-viewer/external/` | Describes the PDF. No content to cite. |

---

**Generated by**: ArcKit `/arckit:requirements` command
**Generated on**: 2026-10-27
**ArcKit Version**: 6.18.3
**Project**: PRD Forge Viewer (Project 001)
**Model**: claude-opus-5-5
**Generation Context**: PRD set version 0.5.0 front matter, `ARC-000-PRIN-v1.0.md`, and `ARC-001-STKE-v1.0.md`. FR and NFR text copied by a script from the PRD front matter.
