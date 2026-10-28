---
id: prd-forge-viewer-glossary
kind: glossary
schema: prd-forge/glossary@1
title: Glossary
status: draft
updated: 2026-10-28
domain: software product management
section: 14
order: 150
terms:
  - term: PRD set
    meaning: >-
      One PRD as 18 linked documents: one root index with the executive summary,
      and 17 section documents. The unit of work for every persona.
    see_also:
      - section
      - authoring tools
  - term: section
    meaning: >-
      One of the 17 section documents in a PRD set, such as problem and
      opportunity, user journeys, or functional requirements.
  - term: authoring tools
    meaning: >-
      The tools that interview the author, write the PRD set, and grade each
      section. Today these are PRD Forge, used inside Claude Code. The viewer
      reads their output and does not replace them.
    not: The viewer. The viewer reads and exports a PRD set; it does not write or grade it.
  - term: grade
    meaning: >-
      The result of checking one section against its rubric: a score from 0 to
      100, a count of blocking defects, and the date of the check.
    see_also:
      - blocking defect
  - term: blocking defect
    meaning: >-
      A fault in a section that stops it from going to review or final,
      whatever its score.
  - term: status
    meaning: >-
      The stage of a section or of the PRD set: pending (not interviewed),
      draft (written), review (with reviewers), or final (approved).
    not: A review meeting. "Review" is a status.
  - term: golden thread
    meaning: The one journey that release 1 must deliver end to end. In this PRD it is J-001.
  - term: journey
    meaning: >-
      The stages that one persona goes through to reach one goal, from start to
      end, including steps outside the product.
    see_also:
      - stage
  - term: stage
    meaning: One large step of a journey, with an actor, inputs, outputs, and a decision.
  - term: persona
    meaning: One role that uses the product or approves something about it.
  - term: export
    meaning: >-
      A copy of the whole PRD set or of selected sections, as one document file
      or as a printed copy, that a reader opens without the authoring tools.
    see_also:
      - export theme
  - term: export theme
    meaning: >-
      A named set of colors and fonts that controls how an export looks. Some
      themes come with the viewer, and the author can make more.
  - term: MoSCoW priority
    meaning: >-
      The priority of a requirement: must (release 1 needs it), should
      (important, not essential for release 1), could (if time allows), or won't
      (not in this release).
    not: >-
      A won't requirement is not a non-goal. It is out of release 1 and comes
      back in a later release, as FR-025 does in release 2. The source defines
      the priorities for any timebox. This set ties them to release 1.
    source: >-
      "What is MoSCoW Prioritization?", Agile Business Consortium,
      https://www.agilebusiness.org/?p=1907
  - term: acceptance criterion
    meaning: >-
      One test that shows a requirement works, in the form Given a situation,
      when a person acts, then a result that a tester can see.
    source: >-
      "Introducing BDD", Dan North, 20 Sep 2006,
      https://dannorth.net/blog/introducing-bdd/
  - term: built-in theme
    meaning: >-
      An export theme that comes with the viewer and that the author cannot
      change or delete. Release 1 has two: Ice Snowstorm and Clay.
    see_also:
      - export theme
  - term: fixed-layout document
    meaning: >-
      An export file whose pages look the same on every computer and that the
      reader cannot easily change. IN-006 names the format.
  - term: editable document
    meaning: >-
      An export file that the reader can open and change in a word processor.
      IN-006 names the format.
  - term: unreadable document
    meaning: >-
      A document in a PRD set whose header the viewer cannot read, so its id,
      kind, title, or status is not known. A pending section with no content is
      not unreadable.
  - term: contents list
    meaning: The list of every document of the PRD set, in reading order, at the start of an export.
  - term: reading order
    meaning: >-
      The order of the documents in a PRD set: the root document first, then
      each section by its order number.
  - term: prdf
    meaning: The terminal command that starts the viewer, short for PRD Forge.
  - term: item
    meaning: >-
      Any entry in a PRD set that has an id, such as FR-008, SC-003, PER-002, or
      Q-004, and any glossary term. One search result is one item.
  - term: item title
    meaning: >-
      The first named field of an item: its name, capability, statement,
      question, or term.
  - term: category
    meaning: >-
      A filter for search: one category for each kind of section, such as
      functional requirements or scenarios, plus "all".
  - term: relevance score
    meaning: >-
      A number from 0 to 100 on each search result. Matches in the item title
      score higher than matches in the text, and more matches score higher.
  - term: known location
    meaning: A folder where the viewer opened a PRD set before. The viewer remembers it.
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer-release-plan, kind: release-plan, path: ./14-release-plan.md, title: Release plan }
  next: { id: prd-forge-viewer-change-log, kind: change-log, path: ./16-change-log.md, title: Change log }
---

# Glossary

Each term enters the glossary when it first appears in the interview.

| Term | Meaning |
| --- | --- |
| PRD set | One PRD as 18 linked documents. The unit of work. |
| section | One of the 17 section documents in a PRD set. |
| authoring tools | The tools that write and grade the PRD set. Today: PRD Forge in Claude Code. |
| grade | A score from 0 to 100, a blocking-defect count, and a date. |
| blocking defect | A fault that stops a section from going to review or final. |
| status | pending, draft, review, or final. |
| golden thread | The one journey that release 1 must deliver end to end (J-001). |
| journey | The stages that one persona goes through to reach one goal. |
| stage | One large step of a journey. |
| persona | One role that uses the product or approves something about it. |
| export | A document file or printed copy that a reader opens without the authoring tools. |
| export theme | A named set of colors and fonts that controls how an export looks. |
| MoSCoW priority | must, should, could, or won't, for release 1. Source: Agile Business Consortium. |
| acceptance criterion | A Given, when, then test of one requirement. Source: Dan North, "Introducing BDD". |
| built-in theme | A theme that comes with the viewer: Ice Snowstorm or Clay. |
| fixed-layout document | An export whose pages look the same everywhere. Format in IN-006. |
| unreadable document | A document whose header the viewer cannot read. Pending is not unreadable. |
| contents list | The list of every document, in reading order, at the start of an export. |
| reading order | Root document first, then each section by its order number. |
| editable document | An export that a reader can change in a word processor. Format in IN-006. |
