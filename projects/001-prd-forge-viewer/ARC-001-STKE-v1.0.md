# Stakeholder drivers and goals analysis: PRD Forge Viewer

> **Template Origin**: Official | **ArcKit Version**: 6.18.3 | **Command**: `/arckit:stakeholders`

## Document control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-001-STKE-v1.0 |
| **Document Type** | Stakeholder Drivers and Goals Analysis |
| **Project** | PRD Forge Viewer (Project 001) |
| **Classification** | PUBLIC |
| **Status** | DRAFT |
| **Version** | 1.0 |
| **Created Date** | 2026-10-26 |
| **Last Modified** | 2026-10-26 |
| **Review Cycle** | On-Demand |
| **Next Review Date** | 2027-01-26 |
| **Owner** | Richard Hightower, PRD owner |
| **Reviewed By** | PENDING |
| **Approved By** | PENDING |
| **Distribution** | PRD owner, sponsor, engineering lead, developers of the viewer |

## Revision history

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| 1.0 | 2026-10-26 | ArcKit AI | Initial creation from `/arckit:stakeholders` command | PENDING | PENDING |

---

## Executive summary

### Purpose

This document names the stakeholders of the PRD Forge Viewer, their drivers,
the goals that answer those drivers, and the outcomes that prove the goals. Every
stakeholder is a persona of the PRD (PER-001 to PER-005) or a party that the PRD
names. Every number comes from the PRD, version 0.3.1 [PFVP-C1].

### Key findings

The author (PER-001) has the most at stake and the most daily use. The author
wants to send a PRD today, and O-002 wants zero blocking defects in each version
sent. The viewer resolves this by showing the grades before the author sends
(FR-004) and by the fixed "Draft" rule (TR-005). Four of the five personas share
one driver: read the PRD without the authoring tools (P-002).

### Critical success factors

- Stakeholders give written feedback on a version within 2 days of the send, by 2027-03-31 (O-001).
- Every version sent has 0 blocking defects, by 2027-03-31 (O-002).
- People without the authoring tools read every export in PDF or Word (C-001).

### Stakeholder alignment score

**Overall Alignment**: HIGH

The personas want the same result: a PRD that people can read and act on
quickly. The one tension is between speed of sending and the quality gate. The
PRD owner already decided it (TR-005, TR-010). In this PRD set, one person is
both the PRD owner and the sponsor. The risk register records this (SR-3).

---

## Stakeholder identification

### Internal stakeholders

The PRD names the PRD owner and five personas. The personas are roles on a
consulting delivery, not named people.

| Stakeholder | Role/Department | Influence | Interest | Engagement Strategy |
|-------------|----------------|-----------|----------|---------------------|
| Richard Hightower | PRD owner. Decides content and scope of the viewer PRD | HIGH | HIGH | Decides each open question. Approves exceptions to the principles |
| PER-001 Author | PRD author, senior consultant or product lead | MEDIUM | HIGH | Primary user. Acceptance tests follow J-001 |
| PER-002 ToolsDeveloper | Developer who uses the authoring tools, did not write the PRD | LOW | HIGH | Search and partial export (J-002) |
| PER-003 EngineeringLead | Engineering lead on the team that builds the product | MEDIUM | MEDIUM | Reads exports. Decides if the team can build (TR-008) |
| PER-005 TeamDeveloper | Developer who does not use the authoring tools | LOW | MEDIUM | Reads the sections for current work in an export |

### External stakeholders

| Stakeholder | Organization | Relationship | Influence | Interest |
|-------------|--------------|--------------|-----------|----------|
| PER-004 Sponsor | Client executive | Approves or rejects each PRD version (TR-007) | HIGH | MEDIUM |
| PRD Forge maintainers | PRD Forge project, owned by Richard Hightower | Supplier of the document format (D-001, D-002) | HIGH | MEDIUM |

### UK government digital roles (GovS 005)

Not applicable. The PRD Forge Viewer is a free and open source desktop app. It
is not a UK Government system.

### UK government security roles (GovS 007)

Not applicable, for the same reason.

### Stakeholder Power-Interest Grid

```text
                          INTEREST
              Low                         High
        ┌─────────────────────┬─────────────────────┐
        │                     │                     │
        │   KEEP SATISFIED    │   MANAGE CLOSELY    │
   High │                     │                     │
        │  • PER-004 Sponsor  │  • PRD owner        │
        │  • PRD Forge        │                     │
 P      │    maintainers      │                     │
 O      ├─────────────────────┼─────────────────────┤
 W      │                     │                     │
 E      │      MONITOR        │    KEEP INFORMED    │
 R      │                     │                     │
   Low  │  • PER-005          │  • PER-001 Author   │
        │    TeamDeveloper    │  • PER-002          │
        │  • PER-003          │    ToolsDeveloper   │
        │    EngineeringLead  │                     │
        └─────────────────────┴─────────────────────┘
```

| Stakeholder | Power | Interest | Quadrant | Engagement Strategy |
|-------------|-------|----------|----------|---------------------|
| PRD owner | HIGH | HIGH | Manage Closely | Decides open questions Q-001 to Q-008 by their dates |
| PER-004 Sponsor | HIGH | MEDIUM | Keep Satisfied | Receives each version as a PDF. Approves through the change log |
| PRD Forge maintainers | HIGH | MEDIUM | Keep Satisfied | Keep the format stable until release 1 ships (D-001) |
| PER-001 Author | MEDIUM | HIGH | Keep Informed | Uses each build. Runs the J-001 acceptance criteria |
| PER-002 ToolsDeveloper | LOW | HIGH | Keep Informed | Tries search and partial export (J-002) |
| PER-003 EngineeringLead | MEDIUM | MEDIUM | Monitor | Reads exports. Sends missing items to the author |
| PER-005 TeamDeveloper | LOW | MEDIUM | Monitor | Receives section exports |

**Quadrant Interpretation:**

- **Manage Closely** (High Power, High Interest): The PRD owner decides scope and open questions.
- **Keep Satisfied** (High Power, Lower Interest): The sponsor approves versions. The PRD Forge maintainers control the format.
- **Keep Informed** (Low or Medium Power, High Interest): The daily users of the viewer.
- **Monitor** (Low or Medium Power, Medium Interest): Readers of exports only.

PER-003 has medium power over the PRD content, because the engineering lead
decides if the team can build (TR-008). The engineering lead has no power over
the viewer itself.

---

## Stakeholder drivers analysis

### SD-1: PER-001 Author - See what is weak, then send it today

**Stakeholder**: PER-001 Author

**Driver Category**: OPERATIONAL

**Driver Statement**: "Show me what is weak, then let me send it today."
[PFVP-C2]

**Context & Background**:
The PRD is 18 files. Finding one section or one item takes a search (P-001).
Grades and gaps are spread across 17 files (P-003). The author opens the viewer
several times a day while writing a PRD (Q-003).

**Driver Intensity**: CRITICAL

**Enablers**:

- One view of every section and its grade (FR-004, WF-001).
- A tree that goes directly to any section or item (FR-005, FR-023).
- Changes from the authoring tools show within 2 seconds (FR-009, NFR-002).

**Blockers**:

- A change to the PRD Forge format breaks the viewer (R-001).
- The viewer is slower than opening the files by hand.

**Related Stakeholders**: PER-004 (receives what the author sends), PRD Forge maintainers.

---

### SD-2: PER-001 Author - Stakeholders read the PRD without the tools

**Stakeholder**: PER-001 Author

**Driver Category**: CUSTOMER

**Driver Statement**: Send the PRD to stakeholders quickly, in a form they can
read without the tools [PFVP-C3].

**Context & Background**:
Stakeholders cannot read the files without the tools (P-002), so feedback waits.
The baseline is about 10 calendar days to first feedback, an estimate by the PRD
owner (O-001, Q-001).

**Driver Intensity**: CRITICAL

**Enablers**:

- PDF and Word exports (C-001, FR-010, FR-011).
- Themes that match the client (FR-015 to FR-018).
- The version and draft mark on every export (FR-014, TR-005).

**Blockers**:

- Stakeholders cannot open the export without an install (A-001 false).

**Related Stakeholders**: PER-003, PER-004, PER-005.

---

### SD-3: PER-002 ToolsDeveloper - Only the requirements for my story

**Stakeholder**: PER-002 ToolsDeveloper

**Driver Category**: OPERATIONAL

**Driver Statement**: "Give me the requirements for my story, nothing else."
[PFVP-C4]

**Context & Background**:
Finding one requirement or scenario across 18 files takes a search (P-001). The
developer is expert in software, but may not know the business domain.

**Driver Intensity**: HIGH

**Enablers**:

- Search by term and category (FR-008) with results in 0.5 seconds (NFR-003).
- Export of selected sections to share with the team (FR-012).

**Blockers**:

- Search that does not find an item, with no clear "no match" message (SC-007).

**Related Stakeholders**: PER-005 (receives the partial export).

---

### SD-4: PER-003 EngineeringLead - Can my team build this

**Stakeholder**: PER-003 EngineeringLead

**Driver Category**: RISK

**Driver Statement**: "Can my team build this, yes or no?" [PFVP-C5]

**Context & Background**:
The engineering lead does not use the authoring tools, so cannot read the set
without an export (P-002). The engineering lead decides if the team can build
from the PRD (TR-008).

**Driver Intensity**: HIGH

**Enablers**:

- A whole-set export with the grade and blocking defects of each section (FR-019).

**Blockers**:

- An export that hides gaps, or that looks final when it is not (TR-005).

**Related Stakeholders**: PER-001 (receives the gaps), PER-004.

---

### SD-5: PER-004 Sponsor - Two pages, then decide

**Stakeholder**: PER-004 Sponsor

**Driver Category**: STRATEGIC

**Driver Statement**: "Two pages, then I decide." [PFVP-C6]

**Context & Background**:
The sponsor approves or rejects the PRD and is the only persona who approves
(TR-007). The sponsor will not read 18 files (P-002). When the sponsor is not
available, the approval waits (Q-006).

**Driver Intensity**: HIGH

**Enablers**:

- A first page with the draft mark, the version, the executive summary, and the contents with grades (FR-014, FR-019, WF-009).

**Blockers**:

- An export that says the PRD is approved. Only the change log records an approval.

**Related Stakeholders**: PER-001.

---

### SD-6: PER-005 TeamDeveloper - Send me the part I need

**Stakeholder**: PER-005 TeamDeveloper

**Driver Category**: OPERATIONAL

**Driver Statement**: "Send me the part I need." [PFVP-C7]

**Context & Background**:
The developer does not use the authoring tools and cannot read the set without
an export (P-002). The developer has no authority over the PRD.

**Driver Intensity**: MEDIUM

**Enablers**:

- Section exports that the author or PER-002 sends (FR-012).

**Blockers**:

- An export with the whole PRD when only one section applies.

**Related Stakeholders**: PER-002.

---

### SD-7: PRD Forge maintainers - Keep the format stable

**Stakeholder**: PRD Forge maintainers

**Driver Category**: RISK

**Driver Statement**: Keep the version 1 document format stable until release 1
ships, so the viewer reads every valid set (D-001, C-003).

**Context & Background**:
The viewer reads the format that the authoring tools write. PRD Forge 0.2.0
delivered the grade findings (D-002), which release 2 shows.

**Driver Intensity**: MEDIUM

**Enablers**:

- A published schema for each document kind (`prd-forge/*@1`).

**Blockers**:

- A new PRD Forge schema field that the viewer does not expect (R-001).

**Related Stakeholders**: PER-001.

---

## Driver-to-Goal mapping

### Goal G-1: The author sees the whole set and every grade in one view

**Derived From Drivers**: SD-1

**Goal Owner**: PRD owner

**Goal Statement**: By release 1 (2026-10-26), the author opens a PRD set and sees
every section, its status, and its grade in one view within 2 seconds at p95,
for a set of 18 documents.

**Why This Matters**: SD-1 needs the weak sections before anyone else reads them.

**Success Metrics**:

- **Primary Metric**: Time to show a PRD set (NFR-001).
- **Secondary Metrics**:
  - Time to show a change after a save (NFR-002).
  - J-001 acceptance criteria pass (ST-001 to ST-005).

**Baseline**: No viewer. The author opens 18 files by hand.

**Target**: p95 at most 2 seconds for both metrics.

**Measurement Method**: Automated performance test on the reference computer, an
Apple silicon Mac with 16 GB.

**Dependencies**:

- D-001: the format stays stable.

**Risks to Achievement**:

- R-001: a format change breaks the viewer.

---

### Goal G-2: Stakeholders without the tools read every export

**Derived From Drivers**: SD-2, SD-4, SD-5, SD-6

**Goal Owner**: PRD owner

**Goal Statement**: By release 1, the author writes a themed PDF or Word export of
the whole set within 10 seconds at p95. Each export opens with no install and
has zero screen-reader errors.

**Why This Matters**: Three personas cannot read the PRD any other way (P-002).

**Success Metrics**:

- **Primary Metric**: Export time for 18 documents (NFR-004).
- **Secondary Metrics**:
  - Screen-reader errors per format (NFR-009).
  - Exports that open without the authoring tools (C-001 verification).

**Baseline**: The command-line export of the authoring tools (A-004).

**Target**: p95 at most 10 seconds. Zero screen-reader errors.

**Measurement Method**: Automated export test, then a manual check in a standard
PDF reader and word processor.

**Dependencies**:

- A-001: stakeholders open PDF and Word files without installing anything.

**Risks to Achievement**:

- A-001 is false, and C-001 changes.

---

### Goal G-3: Developers find their items in under a second

**Derived From Drivers**: SD-3, SD-6

**Goal Owner**: PRD owner

**Goal Statement**: By release 1, a developer searches a set of 18 documents by
term and category and sees results within 0.5 seconds at p95. The developer
exports the selected sections.

**Why This Matters**: SD-3 wants only the requirements for one story.

**Success Metrics**:

- **Primary Metric**: Search time (NFR-003).
- **Secondary Metrics**:
  - J-002 acceptance criteria pass (ST-008 to ST-010).

**Baseline**: A text search across 18 files.

**Target**: p95 at most 0.5 seconds.

**Measurement Method**: Automated performance test on the 18-document fixture set.

**Dependencies**: None.

**Risks to Achievement**:

- J-002 has only one unhappy path (Q-008).

---

### Goal G-4: No version goes out with a blocking defect

**Derived From Drivers**: SD-1, SD-4

**Goal Owner**: Richard Hightower, PRD owner

**Goal Statement**: Every PRD version sent to a stakeholder has 0 blocking
defects, by 2027-03-31 (O-002).

**Why This Matters**: The engineering lead cannot decide on a PRD with blocking
defects, and the author wants to fix them first.

**Success Metrics**:

- **Primary Metric**: Count of blocking defects in a version on the day it is sent.

**Baseline**: 1 blocking defect in version 0.2.0 of this PRD.

**Target**: 0 in every version sent.

**Measurement Method**: Read the grades in the export of each version sent.

**Dependencies**:

- The authoring tools grade each section.

**Risks to Achievement**:

- The author sends a draft with a blocking defect to meet a date (TR-010).

---

### Goal G-5: The sponsor decides from the first pages

**Derived From Drivers**: SD-5

**Goal Owner**: PER-004 Sponsor

**Goal Statement**: From release 1, every whole-set export starts with the draft
mark, the version, the executive summary, and the contents with each section's
status and grade.

**Why This Matters**: The sponsor reads a few pages only.

**Success Metrics**:

- **Primary Metric**: FR-014 and FR-019 acceptance criteria pass.

**Baseline**: No export first page.

**Target**: All acceptance criteria pass.

**Measurement Method**: Acceptance test on the exports of each release.

**Dependencies**: G-2.

**Risks to Achievement**:

- The sponsor is not available, and the approval waits (Q-006).

---

## Goal-to-Outcome mapping

The outcomes use the PRD objective IDs. This document adds no outcome that the
PRD does not have.

### Outcome O-001: Stakeholders give feedback on a PRD version sooner

**Supported Goals**: G-1, G-2, G-3, G-5

**Outcome Statement**: The median calendar days from the send of a PRD version to
the first written feedback falls to 2 days or less by 2027-03-31 [PFVP-C8].

**Measurement Details**:

- **KPI**: Median days from send to first written feedback
- **Current Value**: About 10 calendar days (estimate by the PRD owner, 2026-10-26). The first send of this PRD replaces it with a measured figure (Q-001).
- **Target Value**: 2 days or less
- **Measurement Frequency**: Each version sent
- **Data Source**: The send date and the first feedback date for each version
- **Report Owner**: Richard Hightower, PRD owner

**Business Value**:

- **Financial Impact**: Not measured in the PRD.
- **Strategic Impact**: The viewer shows that a PRD Forge set can be reviewed like one document.
- **Operational Impact**: Less waiting between versions.
- **Customer Impact**: Stakeholders read the PRD without the authoring tools.

**Timeline**:

- **Release 1 (2026-10-26)**: The viewer opens, searches, and exports.
- **Release 2 (2026-11-06)**: The viewer shows the grade findings.
- **2027-03-31**: Target date.

**Stakeholder Benefits**:

- **PER-001 Author**: Feedback comes sooner.
- **PER-003 EngineeringLead**: Reads each version without the tools.
- **PER-004 Sponsor**: Decides from the first pages.

**Leading Indicators**:

- Versions sent as an export, not as files.
- Exports that stakeholders open with no help.

**Lagging Indicators**:

- Median days from send to first feedback.

---

### Outcome O-002: Authors fix blocking defects before stakeholders see a version

**Supported Goals**: G-4, G-1

**Outcome Statement**: Every PRD version sent has 0 blocking defects, by
2027-03-31 [PFVP-C9].

**Measurement Details**:

- **KPI**: Blocking defects in a version on the day it is sent
- **Current Value**: 1, in version 0.2.0 of this PRD
- **Target Value**: 0 in every version sent
- **Measurement Frequency**: Each version sent
- **Data Source**: The grades in the export
- **Report Owner**: Richard Hightower, PRD owner

**Business Value**:

- **Financial Impact**: Not measured in the PRD.
- **Strategic Impact**: Stakeholders trust the grade in each export.
- **Operational Impact**: Fewer review cycles caused by blocking defects.
- **Customer Impact**: The engineering lead decides on a complete PRD.

**Timeline**:

- **Release 1 (2026-10-26)**: The grades show in one view and in each export.
- **Release 2 (2026-11-06)**: The findings behind each grade show.
- **2027-03-31**: Target date.

**Stakeholder Benefits**:

- **PER-001 Author**: Fixes defects before others see them.
- **PER-003 EngineeringLead**: Receives versions with no blocking defects.

**Leading Indicators**:

- Sections at review or final before a send.

**Lagging Indicators**:

- Blocking defects per version sent.

---

## Complete traceability matrix

### Stakeholder → Driver → Goal → Outcome

| Stakeholder | Driver ID | Driver Summary | Goal ID | Goal Summary | Outcome ID | Outcome Summary |
|-------------|-----------|----------------|---------|--------------|------------|-----------------|
| PER-001 Author | SD-1 | See what is weak | G-1 | Whole set and grades in one view | O-001 | Feedback within 2 days |
| PER-001 Author | SD-1 | See what is weak | G-4 | No blocking defects sent | O-002 | 0 blocking defects per version |
| PER-001 Author | SD-2 | Readable without tools | G-2 | Readable exports | O-001 | Feedback within 2 days |
| PER-002 ToolsDeveloper | SD-3 | Only my requirements | G-3 | Fast search and partial export | O-001 | Feedback within 2 days |
| PER-003 EngineeringLead | SD-4 | Can we build it | G-2 | Readable exports | O-001 | Feedback within 2 days |
| PER-003 EngineeringLead | SD-4 | Can we build it | G-4 | No blocking defects sent | O-002 | 0 blocking defects per version |
| PER-004 Sponsor | SD-5 | Two pages, then decide | G-5 | Decide from the first pages | O-001 | Feedback within 2 days |
| PER-005 TeamDeveloper | SD-6 | Only the part I need | G-3 | Fast search and partial export | O-001 | Feedback within 2 days |
| PRD Forge maintainers | SD-7 | Stable format | G-1 | Whole set and grades in one view | O-001 | Feedback within 2 days |

### Conflict analysis

**Competing Drivers**:

- **Conflict 1**: PER-001 wants to send today (SD-1). O-002 wants zero blocking defects in each version sent (G-4). A section with a blocking defect stops a same-day send.
  - **Resolution Strategy**: The author decides to fix now or send as a draft (TR-010). The grades show before the send (FR-004), and every export shows "Draft" until every document is final (TR-005). The author cannot remove the mark in the viewer.

- **Conflict 2**: PER-001 wants a clean document for stakeholders (SD-2). TR-005 puts "Draft" on every export of an unfinished set.
  - **Resolution Strategy**: The PRD owner decided the rule on 2026-10-26. To remove the mark, the author takes every section to final in the authoring tools.

**Synergies**:

- **Synergy 1**: SD-2, SD-4, SD-5, and SD-6 all need a PRD that people read without the tools. One export capability (G-2) satisfies four drivers.
- **Synergy 2**: SD-3 and SD-6 both want part of the PRD. Section export (FR-012) serves the developer who sends and the developer who receives.

---

## Communication & engagement plan

### Stakeholder-Specific messaging

#### PRD owner

**Primary Message**: The viewer meets O-001 and O-002 only if the open questions get answers by their dates.

**Key Talking Points**:

- Q-001 replaces the O-001 baseline estimate with a measured figure.
- Q-008 decides the second unhappy path of J-002.
- The principles and ADRs need approval before the build starts.

**Communication Frequency**: Weekly

**Preferred Channel**: The PRD set and the ArcKit documents in this repository

**Success Story**: Release 1 passes every J-001 acceptance criterion on the reference computer.

#### PER-004 sponsor

**Primary Message**: Each version arrives as a short PDF with the summary and the grades first.

**Key Talking Points**:

- The first page shows the draft mark, the version, and the contents with grades.
- The export never says the PRD is approved. Your approval goes in the change log.
- When you are not available, the approval waits (Q-006).

**Communication Frequency**: Each version sent

**Preferred Channel**: PDF export, by the channel that the author chooses

**Success Story**: The sponsor decides from the first two pages.

#### PER-001 author

**Primary Message**: See every grade in one view, fix the weak sections, and send a readable export the same day.

**Key Talking Points**:

- The tree goes to any section or item.
- Changes from the authoring tools show within 2 seconds.
- Exports carry your theme, the version, and the draft mark.

**Communication Frequency**: Each build

**Preferred Channel**: The `prdf` terminal command and the release notes

**Success Story**: The author sends a version with 0 blocking defects.

#### PER-002 ToolsDeveloper and PER-005 TeamDeveloper

**Primary Message**: Search finds your items in under a second, and a section export sends only what your team needs.

**Key Talking Points**:

- Search by term and category.
- Export selected sections in PDF or Word.

**Communication Frequency**: Each release

**Preferred Channel**: Release notes

**Success Story**: A developer finds the requirements for a story with one search.

#### PER-003 EngineeringLead

**Primary Message**: Each export shows the grade and blocking defects of every section, so you see the gaps first.

**Key Talking Points**:

- The contents show status, score, and blocking defects.
- A draft export says "Draft".

**Communication Frequency**: Each version sent

**Preferred Channel**: PDF or Word export

**Success Story**: The engineering lead decides if the team can build from one export.

#### PRD Forge maintainers

**Primary Message**: The viewer depends on the version 1 format until release 1 ships.

**Key Talking Points**:

- D-001 is committed. A format change is a new ADR for the viewer.

**Communication Frequency**: Each PRD Forge release

**Preferred Channel**: PRD Forge release notes

**Success Story**: Every set that passes the PRD Forge validator opens in the viewer.

---

## Change impact assessment

### Impact on Stakeholders

| Stakeholder | Current State | Future State | Change Magnitude | Resistance Risk | Mitigation Strategy |
|-------------|---------------|--------------|------------------|-----------------|---------------------|
| PER-001 Author | Opens 18 files and runs a command-line export | One view, live refresh, themed exports | HIGH | LOW | The viewer is read-only. The authoring flow does not change |
| PER-002 ToolsDeveloper | Text search across 18 files | Search by term and category | MED | LOW | Search results open the item |
| PER-003 EngineeringLead | Cannot read without an export | Reads a themed export with grades | LOW | LOW | Standard PDF and Word |
| PER-004 Sponsor | Cannot read without the tools | Reads the first pages of a PDF | LOW | LOW | No install needed |
| PER-005 TeamDeveloper | Cannot read without an export | Reads a section export | LOW | LOW | No install needed |

### Change readiness

**Champions**:

- PER-001 Author: the author has the most daily pain (P-001, P-003).
- PRD owner: owns both the PRD and the format.

**Fence-sitters**:

- PER-002 ToolsDeveloper: needs search to be faster than a text search (NFR-003).

**Resisters**:

- None named in the PRD. A-004 records the risk that authors find the command-line export enough. Strategy: measure O-001 with and without the viewer (Q-001).

---

## Risk Register (Stakeholder-Related)

The stakeholder risks use the prefix SR- so that they do not share IDs with the
PRD risks R-001 to R-003.

### Risk SR-1: The O-001 baseline is never measured

**Related Stakeholders**: PRD owner, PER-001

**Risk Description**: Nobody measures the baseline for O-001, so nobody can show success (R-003).

**Impact on Goals**: O-001

**Probability**: MEDIUM

**Impact**: MEDIUM

**Mitigation Strategy**: Q-001, due 2026-11-30.

**Contingency Plan**: Use the first measured version as the baseline.

---

### Risk SR-2: Few teams use PRD Forge

**Related Stakeholders**: PER-001, PER-002

**Risk Description**: Few teams use PRD Forge, so the viewer has few users (R-002).

**Impact on Goals**: O-001

**Probability**: MEDIUM

**Impact**: MEDIUM

**Mitigation Strategy**: Measure O-001 on this PRD first, and report it by 2027-03-31.

**Contingency Plan**: Keep the scope to release 1 and release 2.

---

### Risk SR-3: One person is both the PRD owner and the sponsor

**Related Stakeholders**: PRD owner, PER-004 Sponsor

**Risk Description**: For this PRD, Richard Hightower is the PRD owner and the
sponsor. The approval of a version is not independent of its author.

**Impact on Goals**: G-4, G-5

**Probability**: HIGH

**Impact**: LOW

**Mitigation Strategy**: For this PRD the risk is accepted. The viewer is free and
open source with one owner. For client PRDs, PER-004 is a client executive who
is not the author.

**Contingency Plan**: Ask an engineering lead (PER-003) to review a version
before the approval.

---

## Governance & decision rights

### Decision authority matrix (RACI)

The decision IDs are from section 10 of the PRD.

| Decision Type | Responsible | Accountable | Consulted | Informed |
|---------------|-------------|-------------|-----------|----------|
| TR-001 Correct PRD set and version | PER-001, PER-002 | PER-001 | None | None |
| TR-002 Which sections to fix first | PER-001 | PER-001 | PER-003 | None |
| TR-003 Section good enough to send | PER-001 | PER-001 | None | PER-004 |
| TR-004 Format, theme, and sections of an export | PER-001, PER-002 | PER-001 | None | PER-005 |
| TR-005 Export shows "Draft" | The viewer, by a fixed rule | PER-001, through section status | None | All readers |
| TR-006 Who receives a version | PER-001 | PER-001 | None | Receivers |
| TR-007 Approve or reject a version | PER-004 | PER-004 | PER-003 | PER-001 |
| TR-008 Team can build from the PRD | PER-003 | PER-003 | PER-001 | PER-004 |
| TR-009 Items for the current work | PER-002 | PER-002 | None | PER-005 |
| TR-010 Fix now or send as a draft | PER-001 | PER-001 | None | PER-004 |
| TR-011 Enough to decide, or ask first | PER-004 | PER-004 | PER-001 | None |
| Scope and open questions of the viewer PRD | PRD owner | PRD owner | PER-003 | PER-004 |
| Architecture decisions (ADRs) | Engineering lead of the viewer | PRD owner | PER-001 | PER-004 |

### Escalation path

1. **Level 1**: The PRD owner decides scope, open questions, and ADRs.
2. **Level 2**: The sponsor (PER-004) decides on approval of a version.
3. When the sponsor is not available, the approval waits. Nobody else approves (Q-006).

---

## Validation & Sign-off

### Stakeholder review

| Stakeholder | Review Date | Comments | Status |
|-------------|-------------|----------|--------|
| Richard Hightower, PRD owner | PENDING | PENDING | PENDING |

### Document approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Sponsor | Richard Hightower | PENDING | PENDING |
| Business Owner | Richard Hightower | PENDING | PENDING |
| Enterprise Architect | PENDING | PENDING | PENDING |

---

## Appendices

### Appendix a: stakeholder interview summaries

#### Interview with Richard Hightower, PRD owner - 2026-10-26

**Key Points**:

- The viewer is read-only. Editing is out of scope for release 1 (Q-005).
- Every export shows "Draft" until every document is final (TR-005).
- The viewer is free and open source for anyone who uses PRD Forge.

**Quotes**:

- The persona goal statements in section 4 of the PRD come from this interview.

**Follow-up Actions**:

- Answer Q-001 by 2026-11-30.
- Answer Q-008 by 2026-11-30.

---

### Appendix B: survey results

No survey was done.

---

### Appendix C: References

- `projects/000-global/ARC-000-PRIN-v1.0.md`, architecture principles.
- `docs/prd/prd-forge-viewer/`, the PRD set, version 0.3.1.

---

## Revision history

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-10-26 | ArcKit AI | First draft from PRD version 0.3.1 |

## External references

> This section provides traceability from generated content back to source documents.

### Document register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| PFVP | prd-forge-viewer-prd.pdf | PRD | `projects/001-prd-forge-viewer/external/` | Export of the PRD Forge Viewer PRD, version 0.3.2, 18 documents. Source: `docs/prd/prd-forge-viewer/` |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| PFVP-C1 | PFVP | Section 15, version 0.3.1 | Governance | WF-009 shows a pending section in the contents |
| PFVP-C2 | PFVP | Section 4, PER-001 | Driver | Show me what is weak, then let me send it today. |
| PFVP-C3 | PFVP | Section 4, PER-001 | Driver | Send the PRD to stakeholders quickly, in a form they can read without the tools |
| PFVP-C4 | PFVP | Section 4, PER-002 | Driver | Give me the requirements for my story, nothing else. |
| PFVP-C5 | PFVP | Section 4, PER-003 | Driver | Can my team build this, yes or no? |
| PFVP-C6 | PFVP | Section 4, PER-004 | Driver | Two pages, then I decide. |
| PFVP-C7 | PFVP | Section 4, PER-005 | Driver | Send me the part I need. |
| PFVP-C8 | PFVP | Section 3, O-001 | Outcome | Stakeholders give feedback on a PRD version sooner. |
| PFVP-C9 | PFVP | Section 3, O-002 | Outcome | Authors fix blocking defects before stakeholders see a version. |

### Unreferenced documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| README.md | `projects/001-prd-forge-viewer/external/` | Describes the PDF. No content to cite. |

---

**Generated by**: ArcKit `/arckit:stakeholders` command
**Generated on**: 2026-10-26
**ArcKit Version**: 6.18.3
**Project**: PRD Forge Viewer (Project 001)
**Model**: claude-opus-5-5

<!-- arckit-provenance:start -->

## Build provenance

*Stamped automatically by the ArcKit plugin's `provenance-stamp.mjs` PostToolUse hook. Complements (does not replace) the human-authored footer above. Carries only fields the model can't authoritatively self-report: build context from `.arckit/state.json` and effort levels derived from command frontmatter + the silent-downgrade matrix.*

| Field | Value |
|-------|-------|
| Requested Effort | `high` |
| Effective Effort | `high` |
| Stamped at | 2026-10-27T00:39:54.604Z |

<!-- arckit-provenance:end -->
