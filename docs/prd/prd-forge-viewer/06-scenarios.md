---
id: prd-forge-viewer-scenarios
kind: scenarios
schema: prd-forge/scenarios@1
title: Scenarios
status: final
updated: 2026-10-27
domain: software product management
section: 5
order: 60
score: 81
blocking: 0
graded: 2026-10-27
lifecycles:
  - id: LC-001
    subject: A section of the PRD set
    states:
      - name: pending
        meaning: The section is not written yet.
      - name: draft
        meaning: The section is written, and it is not graded high enough for review.
      - name: review
        meaning: The section has a score of 70 or more and no blocking defects.
      - name: final
        meaning: The sponsor approved the version that holds this section.
    initial: pending
    final: [final]
    transitions:
      - from: pending
        to: draft
        when: The author writes the section in the authoring tools.
        rule: The section has content that the authoring tools can read.
        by: PER-001
      - from: draft
        to: review
        when: A grading pass in the authoring tools gives the section its grade.
        rule: A score of 70 or more and 0 blocking defects.
        by: PER-001
      - from: review
        to: final
        when: The sponsor approves the version.
        rule: The change log records the approval.
        by: PER-004
      - from: final
        to: review
        when: The author changes an approved section.
        rule: The section stays at review until the sponsor approves the new version.
        by: PER-001
scenarios:
  - id: SC-001
    journey: J-001
    stage: ST-001
    stages: [ST-001, ST-002, ST-003, ST-004, ST-005, ST-006, ST-007]
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
    situation: concurrent
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
    priority: should
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
    priority: should
    situation: return
    lifecycles: [LC-001]
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
    priority: should
    context: The PRD set has its functional requirements and scenarios written.
    trigger: The developer searches for a term that no item contains.
    course:
      - The developer enters the search term "invoice" and selects the category "all".
      - The viewer finds no item that contains "invoice".
    expected_outcome: >-
      The developer sees that no item contains "invoice", and sees no results.
  - id: SC-008
    journey: J-002
    stage: ST-010
    persona: PER-002
    variant: alternate
    priority: should
    branches_from: { scenario: SC-005, step: 4 }
    context: >-
      The PRD set has 18 documents. The functional requirements section is at
      final, and the release plan section is still at pending.
    trigger: The developer needs both sections for the team.
    course:
      - The developer selects the functional requirements section and the release plan section.
      - The developer exports them as one editable document.
      - The developer opens the file and sees both sections. The release plan section says that it is not written yet.
    expected_outcome: >-
      The file has both selected sections, in reading order. The pending section
      shows its status and says that it is not written yet, and the export shows
      "Draft".
  - id: SC-009
    journey: J-001
    stage: ST-001
    persona: PER-001
    variant: alternate
    priority: should
    situation: first-use
    branches_from: { scenario: SC-001, step: 1 }
    shown_in: screen
    wireframes: [WF-010]
    context: >-
      The author has not used the viewer before. The docs/prd folder of the
      project holds two PRD sets.
    trigger: The author runs prdf in the project folder for the first time.
    course:
      - The author runs prdf in the project folder.
      - The author sees the two PRD sets, each with its product name and folder, and sees that no set is open.
      - The author selects one set.
      - The author sees that set open, with its product name and version.
    expected_outcome: >-
      The viewer opens no set until the author selects one. After the author
      selects a set, the viewer shows that set with its product name and version.
  - id: SC-010
    journey: J-003
    stage: ST-011
    stages: [ST-011, ST-012]
    persona: PER-004
    variant: happy
    priority: should
    shown_in: report
    wireframes: [WF-009]
    context: >-
      The author sent version 0.5.0 of the PRD Forge Viewer PRD as a fixed-layout
      document. Four sections are at review, and the others are at final.
    trigger: The sponsor opens the file to decide on version 0.5.0.
    course:
      - The sponsor opens the file without the authoring tools.
      - The sponsor sees version 0.5.0 and the word "Draft" on the first page.
      - The sponsor reads the executive summary and sees the status and score of every section in the contents.
      - The sponsor approves the version and sends the decision and the reason to the author.
    expected_outcome: >-
      In the first two pages, the sponsor sees the version, the draft mark, the
      executive summary, and the status and score of every section. The author
      receives the decision and its reason.
  - id: SC-011
    journey: J-003
    stage: ST-012
    persona: PER-004
    variant: exception
    priority: should
    branches_from: { scenario: SC-010, step: 4 }
    context: >-
      The sponsor read version 0.5.0. Section 5 has a score of 72, the lowest in
      the set.
    trigger: The sponsor decides that section 5 is not good enough to approve.
    course:
      - The sponsor rejects version 0.5.0, outside the viewer.
      - The sponsor sends the decision and the reason, "section 5 scores 72", to the author.
      - The author records the rejection and its reason in the change log.
    expected_outcome: >-
      The author has the rejection and its reason. The change log records the
      rejection with a note, and the next export of the set still shows "Draft".
  - id: SC-012
    journey: J-003
    stage: ST-012
    persona: PER-004
    variant: alternate
    priority: should
    branches_from: { scenario: SC-010, step: 4 }
    context: >-
      The author sent version 0.5.0. The sponsor is not available for a week.
    trigger: The author asks who else can approve the version.
    course:
      - The author sees that nobody else can approve (TR-007, Q-006).
      - The approval waits until the sponsor is available.
    expected_outcome: >-
      Version 0.5.0 has no approval until the sponsor decides, and every export
      of it shows "Draft".
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

![LC-001 lifecycle of A section of the PRD set](diagrams/LC-001.svg)

![SC-007 scenario](diagrams/SC-007.svg)

![SC-008 scenario](diagrams/SC-008.svg)

![SC-009 scenario](diagrams/SC-009.svg)

![WF-010 drawing](diagrams/WF-010.svg)

![SC-010 scenario](diagrams/SC-010.svg)

![WF-009 drawing](diagrams/WF-009.svg)

![SC-011 scenario](diagrams/SC-011.svg)

![SC-012 scenario](diagrams/SC-012.svg)

SC-001 is the happy path of the golden thread. It is the end-to-end acceptance
test for release 1.

SC-005, SC-007, and SC-008 are on J-002, and SC-010 to SC-012 are on J-003, so
their priority is should. SC-006 and SC-009 are should because their requirements
(FR-002 and FR-024) are should. A should scenario is still in release 1, but
release 1 can ship without it.

| ID | Journey | Stage | Variant | Summary |
| --- | --- | --- | --- | --- |
| SC-001 | J-001 | ST-001 | happy | The author fixes a weak section and sends a draft fixed-layout document to the sponsor |
| SC-002 | J-001 | ST-001 | exception | The PRD set has pending sections and one unreadable section |
| SC-003 | J-001 | ST-004 | exception | The authoring tools change a section while the author reads it |
| SC-004 | J-001 | ST-005 | alternate | The author exports a set that is not complete |
| SC-005 | J-002 | ST-009 | happy | A developer searches by category and exports two sections |
| SC-006 | J-001 | ST-001 | alternate | The author reopens the viewer the next day |
| SC-007 | J-002 | ST-009 | exception | A search finds no match |
| SC-008 | J-002 | ST-010 | alternate | A developer exports a section that is still pending |
| SC-009 | J-001 | ST-001 | alternate | The author runs the viewer for the first time, with two sets in docs/prd |
| SC-010 | J-003 | ST-011 | happy | The sponsor reads the export and decides |
| SC-011 | J-003 | ST-012 | exception | The sponsor rejects a version with a reason |
| SC-012 | J-003 | ST-012 | alternate | The sponsor is not available, and the approval waits |

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

## SC-008. A developer exports a section that is still pending

The developer exports two sections, and one is still pending. Expected outcome:
the file has both sections, the pending one says that it is not written yet, and
the export shows "Draft" (FR-012, FR-019, TR-005). This answers Q-008.

## SC-009. The author runs the viewer for the first time

The author runs prdf for the first time where docs/prd holds two PRD sets.
Expected outcome: the viewer lists both sets and opens neither until the author
selects one (FR-024, WF-010).

## SC-010. The sponsor reads the export and decides

The sponsor opens version 0.5.0 without the authoring tools. Expected outcome:
the first two pages show the version, the draft mark, the summary, and every
grade, and the author receives the decision and its reason (FR-014, FR-019,
WF-009, TR-007).

## SC-011. The sponsor rejects a version with a reason

The sponsor rejects version 0.5.0 because section 5 scores 72. Expected outcome:
the author has the reason, and the change log records the rejection with a note
(TR-007).

## SC-012. The sponsor is not available

Nobody else approves. Expected outcome: the version waits for the sponsor, and
every export shows "Draft" (TR-007, Q-006).

## LC-001. The lifecycle of a section

A section moves from pending to draft when the author writes it, to review at a
score of 70 or more with 0 blocking defects, and to final when the sponsor
approves the version. A change to an approved section returns it to review. The
author makes each move in the authoring tools, and the sponsor (PER-004) makes
the move to final. The viewer only shows the state.
