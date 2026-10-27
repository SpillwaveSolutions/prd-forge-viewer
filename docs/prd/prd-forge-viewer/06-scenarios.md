---
id: prd-forge-viewer-scenarios
kind: scenarios
schema: prd-forge/scenarios@1
title: Scenarios
status: final
updated: 2026-10-26
domain: software product management
section: 5
order: 60
score: 92
blocking: 0
graded: 2026-10-26
scenarios:
  - id: SC-001
    journey: J-001
    stage: ST-001
    persona: PER-001
    variant: happy
    priority: must
    context: >-
      The PRD Forge Viewer PRD set has 18 documents. The root document and 4
      sections are at draft, and 13 sections are at pending. Section 4 has a score of 61 and 0 blocking defects.
    trigger: The author wants to send version 0.1.0 to the sponsor for early comments.
    course:
      - The author opens the PRD set and sees the product name, version 0.1.0, and the status of all 18 documents.
      - The author sees that section 4 has a score of 61, the lowest of the graded sections.
      - The author goes directly to section 4 and reads it.
      - The author fixes section 4 in the authoring tools. The viewer shows the new text and the new score without any action from the author.
      - The author exports the whole PRD set as one fixed-layout document with the Clay theme.
      - The author sends the file to the product sponsor.
      - The sponsor opens the file without the authoring tools and sees on the first page that version 0.1.0 is a draft.
    expected_outcome: >-
      The sponsor has one fixed-layout document that shows version 0.1.0, the word "Draft",
      every section in order, and the status and score of each section.
  - id: SC-002
    journey: J-001
    stage: ST-001
    persona: PER-001
    variant: exception
    priority: must
    context: >-
      The PRD set has 18 files. Thirteen sections are at pending and fail the
      authoring tools' check because they have no content yet. One section has
      a header that cannot be read.
    trigger: The author opens the PRD set.
    course:
      - The author opens the PRD set.
      - The author sees all 18 documents in order, with the status of each.
      - The author sees which section has a header that cannot be read, and the name of its file.
      - The author reads the other 17 documents as usual.
    expected_outcome: >-
      The PRD set opens. All 18 documents are listed. The one unreadable section
      is marked as unreadable with its file name, and the 17 other documents can
      be read.
  - id: SC-003
    journey: J-001
    stage: ST-004
    persona: PER-001
    variant: exception
    priority: must
    context: >-
      The author reads section 4 in the viewer. Section 4 shows a score of 61.
      At the same time, the authoring tools rewrite section 4 and grade it at 75.
    trigger: The authoring tools save the new version of section 4.
    course:
      - The author reads section 4 in the viewer.
      - The authoring tools save a new version of section 4.
      - The author sees the new text and the score 75, without any action in the viewer.
      - The author sees that section 4 changed.
    expected_outcome: >-
      The viewer shows score 75 and the new text of section 4, and the author did
      nothing to get it. Section 8 sets the time limit.
  - id: SC-004
    journey: J-001
    stage: ST-005
    persona: PER-001
    variant: alternate
    priority: must
    context: >-
      The PRD set has the root document and 4 sections at draft, and 13
      sections at pending. The engineering lead
      wants an early copy.
    trigger: The author exports the PRD set before the interview covers all sections.
    course:
      - The author selects the whole PRD set, the editable document format, and the Ice Snowstorm theme.
      - The author saves the file and sends it to the engineering lead.
      - The engineering lead opens the file without the authoring tools.
    expected_outcome: >-
      The file shows the word "Draft" and version 0.1.0 on the first page. The
      contents list shows the status and score of every section. Each pending
      section says that it is not written yet.
  - id: SC-005
    journey: J-002
    stage: ST-009
    persona: PER-002
    variant: happy
    priority: must
    context: >-
      The PRD set has its functional requirements and scenarios written. The
      developer starts work on the export feature.
    trigger: The developer needs the requirements and scenarios about export.
    course:
      - The developer enters the search term "export" and selects the category "functional requirements".
      - The developer sees the matching requirements, best match first, each with its id and section.
      - The developer changes the category to "all" and sees the matching scenarios as well.
      - The developer exports the user journeys and functional requirements sections as one editable document and sends it to the team.
    expected_outcome: >-
      The developer sees only the items that contain "export", best match first,
      each with its id and section. The team receives one file with only the two
      selected sections.
  - id: SC-006
    journey: J-001
    stage: ST-001
    persona: PER-001
    variant: alternate
    priority: must
    context: >-
      Yesterday the author read the PRD Forge Viewer PRD set and closed the
      viewer. Overnight the authoring tools changed section 6 from pending to
      draft.
    trigger: The author opens the viewer the next day.
    course:
      - The author opens the viewer.
      - The author sees the same PRD set as yesterday, without selecting it again.
      - The author sees section 6 at draft, with its new text.
    expected_outcome: >-
      The viewer opens the same PRD set as in the last session, and every
      section shows its current version, including section 6 at draft.
  - id: SC-007
    journey: J-002
    stage: ST-009
    persona: PER-002
    variant: exception
    priority: must
    context: The PRD set has its functional requirements and scenarios written.
    trigger: The developer searches for a term that no item contains.
    course:
      - The developer enters the search term "invoice" and selects the category "all".
      - The viewer finds no item that contains "invoice".
    expected_outcome: >-
      The developer sees that no item contains "invoice", and sees no results.
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer-journeys, kind: journeys, path: ./05-user-journeys.md, title: User journeys }
  next: { id: prd-forge-viewer-scope, kind: scope, path: ./07-scope.md, title: Scope }
  related:
    - { id: prd-forge-viewer-journeys, kind: journeys, path: ./05-user-journeys.md, title: User journeys }
---

# Scenarios

![SC-001 scenario](diagrams/SC-001.svg)

![SC-002 scenario](diagrams/SC-002.svg)

![SC-003 scenario](diagrams/SC-003.svg)

![SC-004 scenario](diagrams/SC-004.svg)

![SC-005 scenario](diagrams/SC-005.svg)

![SC-006 scenario](diagrams/SC-006.svg)

![SC-007 scenario](diagrams/SC-007.svg)

SC-001 is the happy path of the golden thread. It is the end-to-end acceptance
test for release 1.

| ID | Journey | Stage | Variant | Summary |
| --- | --- | --- | --- | --- |
| SC-001 | J-001 | ST-001 | happy | The author fixes a weak section and sends a draft fixed-layout document to the sponsor |
| SC-002 | J-001 | ST-001 | exception | The PRD set has pending sections and one unreadable section |
| SC-003 | J-001 | ST-004 | exception | The authoring tools change a section while the author reads it |
| SC-004 | J-001 | ST-005 | alternate | The author exports a set that is not complete |
| SC-005 | J-002 | ST-009 | happy | A developer searches by category and exports two sections |
| SC-006 | J-001 | ST-001 | alternate | The author reopens the viewer the next day |
| SC-007 | J-002 | ST-009 | exception | A search finds no match |

## SC-001. The author sends a draft fixed-layout document to the sponsor

The author opens the set, sees that section 4 has the lowest score (61), fixes it
in the authoring tools, and sees the new score in the viewer. The author exports
the whole set as a fixed-layout document with the Clay theme. Expected outcome:
the sponsor's file
shows version 0.1.0, the word "Draft", every section in order, and the status
and score of each section.

## SC-002. The set has pending sections and one unreadable section

Expected outcome: the set opens, all 18 documents are listed, the unreadable
section is marked with its file name, and the other 17 can be read.

## SC-003. A section changes while the author reads it

Expected outcome: the viewer shows score 75 and the new text without any action
from the author. Section 8 sets the time limit.

## SC-004. The author exports a set that is not complete

Expected outcome: the editable document shows "Draft" and the version on the first page,
the status and score of every section in the contents list, and "not written
yet" for each pending section.

## SC-005. A developer searches by category and exports two sections

Expected outcome: the developer sees only the items that contain "export", best
match first, and the team receives one file with only the two selected sections.

## SC-006. The author reopens the viewer the next day

Expected outcome: the viewer opens the same PRD set as in the last session, and
every section shows its current version, including changes made while the viewer
was closed.

## SC-007. A search finds no match

Expected outcome: the developer sees that no item contains "invoice", and sees no
results (FR-008).
