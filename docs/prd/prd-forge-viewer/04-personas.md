---
id: prd-forge-viewer-personas
kind: personas
schema: prd-forge/personas@1
title: Users and personas
status: final
updated: 2026-10-26
domain: software product management
section: 4
order: 40
score: 86
blocking: 0
graded: 2026-10-26
personas:
  - id: PER-001
    name: PRD author, a senior consultant or product lead at a consulting firm, who uses the authoring tools
    short_name: Author
    goals:
      - "Show me what is weak, then let me send it today."
      - See the whole PRD and go directly to the section under discussion
      - See which sections are weak and what to fix before anyone else reads them
      - Send the PRD to stakeholders quickly, in a form they can read without the tools
    pains:
      - The PRD is 18 files, and finding one section or one item takes a search (P-001)
      - Stakeholders cannot read the files without the tools (P-002)
      - Grades and gaps are spread across 17 files (P-003)
    frequency: >-
      Opens the viewer several times a day while writing a PRD (Q-003). Exports
      once for each version sent to stakeholders, including draft versions.
    authority: >-
      Owns the PRD. Chooses which PRD set to open. Decides its content, which
      sections to fix, and the status of each section, which decides the draft
      mark. Chooses the format, theme, and sections of an export, and which
      version to send to whom. Cannot approve it.
    proficiency: >-
      Expert in the business domain. Uses the authoring tools. Often not an
      experienced product manager.
  - id: PER-002
    name: Developer on the consulting delivery team who uses the authoring tools but did not write the PRD
    short_name: ToolsDeveloper
    goals:
      - "Give me the requirements for my story, nothing else."
      - Find the requirements, stories, and scenarios for the current work without reading the whole PRD
      - Export a part of the PRD to share with the team
    pains:
      - Finding one requirement or scenario across 18 files takes a search (P-001)
    frequency: Not known (Q-003).
    authority: >-
      Chooses which PRD set to open. Decides which items apply to own work, and
      the format, theme, and sections of an export to share. Cannot approve the
      PRD.
    proficiency: Expert in software and in the authoring tools. May not know the business domain.
  - id: PER-003
    name: Engineering lead on the client or delivery team that builds the product
    short_name: EngineeringLead
    goals:
      - "Can my team build this, yes or no?"
      - Decide if the team can build the product from this PRD
      - Find what is missing or unclear, and send it back to the author
    pains:
      - Does not use the authoring tools, so cannot read the set without an export (P-002)
    frequency: Reads once for each version received, including drafts.
    authority: Reviews and comments. Decides if the team can build from the PRD. Does not approve it.
    proficiency: Expert in software. Usually does not use the authoring tools.
  - id: PER-004
    name: Product sponsor, a client executive who approves the PRD
    short_name: Sponsor
    goals:
      - "Two pages, then I decide."
      - Read a short summary and decide to approve or reject the PRD
    pains:
      - Cannot read the set without the authoring tools, and will not read 18 files (P-002)
    frequency: Reads once for each version received, including drafts.
    authority: Approves or rejects the PRD. The only persona who approves.
    proficiency: Expert in the business. Does not use the authoring tools. Reads a few pages only.
  - id: PER-005
    name: Developer on the client or delivery team who does not use the authoring tools
    short_name: TeamDeveloper
    goals:
      - "Send me the part I need."
      - Read the sections that apply to the current work
    pains:
      - Cannot read the set without an export (P-002)
    frequency: Reads once for each version received, including drafts.
    authority: None for the PRD.
    proficiency: Expert in software. Does not use the authoring tools.
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer-objectives, kind: objectives-metrics, path: ./03-objectives-metrics.md, title: Objectives and success metrics }
  next: { id: prd-forge-viewer-journeys, kind: journeys, path: ./05-user-journeys.md, title: User journeys }
  related:
    - { id: prd-forge-viewer-problem, kind: problem-opportunity, path: ./01-problem-opportunity.md, title: Problem and opportunity }
---

# Users and personas

PER-001 is the primary persona. Release 1 is designed around the PRD author. The
personas work in a consulting engagement: the author's firm writes the PRD, and
the client's executive approves it.
PER-003, PER-004, and PER-005 usually read the exported PRD. They can also use
the viewer, so it must be usable without training.

| ID | Persona | Uses the authoring tools | Reads the PRD in | Authority |
| --- | --- | --- | --- | --- |
| PER-001 | PRD author, senior consultant or product lead | Yes | The viewer | Owns the PRD |
| PER-002 | Developer with the authoring tools | Yes | The viewer | Chooses own items and exports |
| PER-003 | Engineering lead, client or delivery team | Usually no | The export | Reviews |
| PER-004 | Product sponsor, client executive | No | The export | Approves |
| PER-005 | Developer without the authoring tools | No | The export | None |

## PER-001. PRD author

"Show me what is weak, then let me send it today." Goals: see the whole PRD and go to one section, see which sections are weak, and
send the PRD to stakeholders quickly. Pains: P-001, P-002, P-003. Authority: owns
the PRD and cannot approve it.

## PER-002. Developer who uses the authoring tools

Goals: find the requirements, stories, and scenarios for the current work, and
export a part of the PRD. Pain: P-001. Authority: chooses own items and exports;
cannot approve the PRD.

## PER-003. Engineering lead

Goals: decide if the team can build from the PRD, and send back what is missing.
Pain: P-002. Authority: reviews, does not approve.

## PER-004. Product sponsor

"Two pages, then I decide." Goal: read a short summary and approve or reject the PRD. Journey: J-003. Pain: P-002. Authority:
the only persona who approves.

## PER-005. Developer who does not use the authoring tools

Goal: read the sections for the current work. Pain: P-002. Authority: none.
