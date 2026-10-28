---
id: prd-forge-viewer-functional-requirements
kind: functional-requirements
schema: prd-forge/functional-requirements@1
title: Functional requirements
status: final
updated: 2026-10-28
domain: software product management
section: 7
order: 80
score: 88
blocking: 0
graded: 2026-10-27
requirements:
  - id: FR-001
    shown_in: screen
    user: PER-001
    capability: Open a PRD set and see its contents
    outcome: >-
      The author sees the product name, the version, the executive summary, and
      every document of the set in order, each with its status.
    acceptance:
      - >-
        Given a PRD set with 18 documents, when the author opens it, then the
        author sees the product name, the version, the executive summary, and
        all 18 documents in order, each with its status.
    priority: must
    journey_stage: ST-001
    objective: O-001
    source: Interview, 2026-10-26; SC-001
  - id: FR-002
    shown_in: screen
    user: PER-001
    capability: Return to the same PRD set in the next session
    outcome: The author continues with the same PRD set without selecting it again.
    acceptance:
      - >-
        Given the author closed the viewer while a PRD set was open, when the
        author opens the viewer again, then the same PRD set is open without any
        selection.
      - >-
        Given a section changed while the viewer was closed, when the author
        opens the viewer again, then the author sees the current version of that
        section.
    priority: should
    journey_stage: ST-001
    objective: O-001
    source: Interview, 2026-10-26; SC-006
  - id: FR-003
    shown_in: screen
    user: PER-001
    capability: Open a PRD set that has incomplete or unreadable documents
    outcome: >-
      The author reads every readable document and sees which documents cannot
      be read.
    acceptance:
      - >-
        Given a PRD set with 13 pending sections that have no content, when the
        author opens it, then all 18 documents are listed and each pending
        section shows its status as pending.
      - >-
        Given one section that cannot be read, when the author opens the set,
        then the author sees that section marked as unreadable with its file
        name, and can read the other 17 documents.
    priority: must
    journey_stage: ST-001
    objective: O-001
    source: SC-002
  - id: FR-004
    shown_in: screen
    user: PER-001
    capability: See the grades of all sections together
    outcome: >-
      The author sees the status, score, count of blocking defects, and grade
      date of every section at the same time.
    acceptance:
      - >-
        Given section 4 has score 61 and 0 blocking defects and section 3 has
        score 75 and 1 blocking defect, when the author views the grades, then
        the author sees both sections with those values and their grade dates.
      - >-
        Given a section that has no grade, when the author views the grades, then
        that section shows that it is not graded.
    priority: must
    journey_stage: ST-002
    objective: O-002
    source: Interview, 2026-10-26; P-003
  - id: FR-005
    shown_in: screen
    user: PER-001
    capability: Go directly to any section
    outcome: The author reads the selected section without opening other documents first.
    acceptance:
      - >-
        Given the author is reading the problem and opportunity section, when
        the author selects the functional requirements section, then the author
        sees it in one action.
    priority: must
    journey_stage: ST-003
    objective: O-001
    source: Interview, 2026-10-26; P-001
  - id: FR-006
    user: PER-001
    capability: Move to the previous or the next section in reading order
    outcome: The author reads the PRD set from start to end, one section after the other.
    acceptance:
      - >-
        Given the author is reading section 4, when the author moves to the next
        section, then the author sees section 5, user journeys.
      - >-
        Given the author is reading section 4, when the author moves to the
        previous section, then the author sees section 3, objectives and success
        metrics.
      - >-
        Given the author is reading the last section, when the author tries to
        move to the next section, then the author stays on the last section and
        sees that it is the last one.
      - >-
        Given the author is reading the root document, when the author tries to
        move to the previous section, then the author stays on the root document
        and sees that it is the first one.
    priority: wont
    shown_in: none
    journey_stage: ST-003
    objective: O-001
    source: >-
      Interview, 2026-10-26. Dropped on 2026-10-26 by the PRD owner: FR-005
      and FR-023 move the author to any section.
  - id: FR-007
    shown_in: screen
    user: PER-002
    capability: Follow a reference from one item to the item it names
    outcome: >-
      The developer reads the related item, such as the journey stage that a
      requirement serves.
    acceptance:
      - >-
        Given requirement FR-004 names stage ST-002, when the developer follows
        that reference, then the developer sees stage ST-002 in J-001.
    priority: should
    journey_stage: ST-003
    objective: O-001
    source: J-002
  - id: FR-008
    shown_in: screen
    user: PER-002
    capability: Search the PRD set by term, in one category or in all categories
    outcome: >-
      The developer sees the matching items, most relevant first, each with its
      id and section.
    acceptance:
      - >-
        Given the term "export" and the category functional requirements, when
        the developer searches, then the developer sees only the functional
        requirements that contain "export", each with its id and section.
      - >-
        Given the same term and the category "all", when the developer searches,
        then the developer sees matching items from every section, including
        scenarios.
      - >-
        Given item A has "export" in its title and item B has "export" only once
        in its text, when the developer searches for "export", then item A is
        above item B.
      - >-
        Given a search with matches, when the developer views the results, then
        each result shows its id, its title, its section, and a relevance score
        from 0 to 100, highest first.
      - >-
        Given a list of results, when the developer selects one result, then the
        developer sees that item in its section.
      - >-
        Given a term that no item contains, when the developer searches, then
        the developer sees that there are no matches.
    priority: must
    journey_stage: ST-003
    objective: O-001
    source: Interview, 2026-10-26; SC-005
  - id: FR-009
    shown_in: screen
    user: PER-001
    capability: See changes that the authoring tools make, without any action
    outcome: The author sees the current version of each section without any action.
    acceptance:
      - >-
        Given the author reads section 4 with score 61, when the authoring tools
        save section 4 with score 75, then the author sees score 75 and the new
        text without any action, within the time limit in NFR-002.
      - >-
        Given the author reads section 4 when the authoring tools save it, when
        the new version shows, then the author sees that section 4 changed.
      - >-
        Given the authoring tools change a section the author is not reading,
        when the author views the grades, then that section shows its new status
        and score.
    priority: must
    journey_stage: ST-004
    objective: O-001
    source: Interview, 2026-10-26; SC-003
  - id: FR-010
    shown_in: report
    user: PER-001
    capability: Export the PRD set as a fixed-layout document (IN-006)
    outcome: >-
      The author has one fixed-layout document that a reader opens with software
      already on the computer, without the authoring tools.
    acceptance:
      - >-
        Given a PRD set with 18 documents, when the author exports the whole set
        as a fixed-layout document, then one file in the format that IN-006 names
        contains every document in order, and the sponsor opens it without the
        authoring tools.
    priority: must
    journey_stage: ST-005
    objective: O-001
    source: Interview, 2026-10-26; SC-001
  - id: FR-011
    shown_in: report
    user: PER-001
    capability: Export the PRD set as an editable document (IN-006)
    outcome: >-
      The author has one editable document that a reader opens with software
      already on the computer, without the authoring tools.
    acceptance:
      - >-
        Given a PRD set with 18 documents, when the author exports the whole set
        as an editable document, then one file in the format that IN-006 names
        contains every document in order, and the
        engineering lead opens it in a word processor without the authoring tools.
    priority: should
    journey_stage: ST-005
    objective: O-001
    source: Interview, 2026-10-26; SC-004
  - id: FR-012
    shown_in: report
    user: PER-002
    capability: Export only selected sections
    outcome: The developer has one file with only the selected sections.
    acceptance:
      - >-
        Given the user journeys section and the functional requirements section
        are the only sections selected, when the developer exports them, then the file
        contains only those two sections, in reading order.
    priority: must
    journey_stage: ST-005
    objective: O-001
    source: Interview, 2026-10-26; SC-005
  - id: FR-013
    shown_in: report
    user: PER-001
    capability: Print the PRD set or selected sections
    outcome: The author has a printed copy with the same content as the export.
    acceptance:
      - >-
        Given the whole PRD set is selected, when the author prints it,
        then the printed copy has the same documents, order, and draft mark as
        the fixed-layout export.
    priority: should
    journey_stage: ST-005
    objective: O-001
    source: Interview, 2026-10-26
  - id: FR-014
    shown_in: report
    user: PER-004
    capability: See the version of the PRD, and if it is a draft, in an export
    outcome: The sponsor knows which version is in the file, and if it is a draft.
    acceptance:
      - >-
        Given version 0.1.0 with sections at draft, when the sponsor opens the
        export, then the first page shows version 0.1.0 and the word "Draft".
    priority: must
    journey_stage: ST-005
    objective: O-001
    source: Interview, 2026-10-26; SC-001, SC-004
  - id: FR-015
    shown_in: screen
    user: PER-001
    capability: Select an export theme from the built-in themes
    outcome: The export has the colors and fonts of the selected theme.
    acceptance:
      - >-
        Given the built-in theme Clay, when the author exports with Clay, then the
        file has page color FAF9F5, text color 3D3D3A, heading color 141413,
        accent color D97757, a serif font for headings, and a sans-serif font
        for text.
      - >-
        Given the built-in theme Ice Snowstorm, when the author exports with it,
        then the file has page color F3F6FB, text color 111111, heading color
        0B1F4B, accent color 1D4E89, and a sans-serif font for headings and
        text.
    priority: must
    journey_stage: ST-005
    objective: O-001
    source: Interview, 2026-10-26
  - id: FR-016
    shown_in: screen
    user: PER-001
    capability: Make a custom export theme
    outcome: The author exports with colors and fonts that the author selected.
    acceptance:
      - >-
        Given the author makes a theme named "Acme" with a page color, a text
        color, a heading color, an accent color, a text font, and a heading
        font, each font chosen from serif, sans-serif, and monospace, when the
        author exports with "Acme", then the file uses those colors and fonts.
      - >-
        Given an export with the theme "Acme", when a reader opens it on a
        computer that does not have those fonts installed, then the reader sees
        the same fonts as the author.
    priority: should
    journey_stage: ST-005
    objective: O-001
    source: Interview, 2026-10-26
  - id: FR-017
    shown_in: screen
    user: PER-001
    capability: Change a custom export theme
    outcome: Later exports use the changed colors and fonts.
    acceptance:
      - >-
        Given the custom theme "Acme", when the author changes its accent color
        and exports, then the file uses the new accent color.
      - >-
        Given a built-in theme, when the author tries to change it, then the
        built-in theme stays as it was.
    priority: should
    journey_stage: ST-005
    objective: O-001
    source: Interview, 2026-10-26
  - id: FR-018
    shown_in: screen
    user: PER-001
    capability: Delete a custom export theme
    outcome: The deleted theme is no longer available for export.
    acceptance:
      - >-
        Given the custom theme "Acme", when the author deletes it, then "Acme" is
        no longer available to select.
      - >-
        Given a built-in theme, when the author tries to delete it, then the
        built-in theme is still available.
    priority: should
    journey_stage: ST-005
    objective: O-001
    source: Interview, 2026-10-26
  - id: FR-019
    shown_in: report
    user: PER-003
    capability: See the status and score of every section in an export
    outcome: The engineering lead knows which sections are finished before reading them.
    acceptance:
      - >-
        Given 13 pending sections, when the engineering lead opens the export,
        then the contents list shows the status and score of every section.
      - >-
        Given a pending section, when the engineering lead reaches it in the
        export, then the section says that it is not written yet.
    priority: should
    journey_stage: ST-005
    objective: O-001
    source: SC-004
  - id: FR-020
    shown_in: screen
    user: PER-001
    capability: Keep custom export themes from one session to the next
    outcome: The author uses the same custom themes after the viewer restarts.
    acceptance:
      - >-
        Given the author made the custom theme "Acme", when the author closes and
        reopens the viewer, then "Acme" is available to select, with the same
        colors and fonts.
    priority: should
    journey_stage: ST-005
    objective: O-001
    source: Interview, 2026-10-26
  - id: FR-021
    shown_in: screen
    user: PER-001
    capability: Start the viewer from a terminal with the command prdf
    outcome: >-
      The author sees the PRD set of the current directory in the viewer, with
      no other step.
    acceptance:
      - >-
        Given the current directory contains docs/prd with one PRD set, when the
        author runs prdf, then the viewer opens and shows that PRD set.
      - >-
        Given the author runs prdf with the path of a PRD set, when the viewer
        opens, then it shows that PRD set.
      - >-
        Given the current directory contains no PRD set, when the author runs
        prdf, then the author sees that no PRD set was found there, and sees the
        list of known PRD set locations (FR-022).
    priority: must
    journey_stage: ST-001
    objective: O-001
    source: >-
      Interview, 2026-10-26. The PRD owner keeps the name docs/prd on 2026-10-27,
      because it is the folder that the authoring tools use and that the author
      sees.
  - id: FR-022
    shown_in: screen
    user: PER-001
    capability: Choose a PRD set from the locations the viewer remembers
    outcome: >-
      The author opens any PRD set opened before, without typing or finding its
      path.
    acceptance:
      - >-
        Given the author opened PRD sets in two different folders before, when
        the author opens a folder with no PRD set, then the author sees both
        locations, each with its product name.
      - >-
        Given the list of known locations, when the author selects one, then the
        viewer opens that PRD set.
      - >-
        Given a known location whose PRD set no longer exists, when the author
        sees the list, then that location is marked as not found.
    priority: should
    journey_stage: ST-001
    objective: O-001
    source: Interview, 2026-10-26
  - id: FR-023
    shown_in: screen
    user: PER-001
    capability: Select one item of a section and read it without the whole section
    outcome: >-
      The author reads one item, such as a persona or a requirement, without
      reading the whole section first.
    acceptance:
      - >-
        Given the users and personas section with PER-001 to PER-005, when the
        author asks for the items of that section, then the author sees the five
        persona ids.
      - >-
        Given the five persona ids of that section are in view, when the author
        selects PER-001, then the author sees PER-001 with the status and grade
        of its section.
    priority: must
    journey_stage: ST-003
    objective: O-001
    source: Interview, 2026-10-26
  - id: FR-024
    shown_in: screen
    user: PER-001
    capability: Choose one PRD set when the docs/prd folder holds more than one
    outcome: >-
      The author opens the intended PRD set without typing its path.
    acceptance:
      - >-
        Given the current directory contains docs/prd with two PRD sets, and
        neither set was open in the last session, when the author runs prdf, then
        the author sees both sets, each with its product name and folder, and the
        viewer opens neither set.
      - >-
        Given the current directory contains docs/prd with two PRD sets, and one
        of them was open in the last session, when the author runs prdf, then the
        viewer opens that set.
      - >-
        Given that list, when the author selects one set, then the viewer opens
        that PRD set.
    priority: should
    journey_stage: ST-001
    objective: O-001
    source: PRD owner decision, 2026-10-26 (HLD review ADV-02)
  - id: FR-025
    shown_in: screen
    user: PER-001
    capability: See the findings behind the grade of a section
    outcome: >-
      The author sees what is missing in a section and what to improve, without
      the authoring tools.
    acceptance:
      - >-
        Given section 7 has a grade with 1 blocking defect and 2 items to raise
        the grade, when the author views the findings of section 7, then the
        author sees the blocking defect and the 2 items.
      - >-
        Given a section with no recorded findings, when the author views its
        findings, then the author sees that no findings are recorded.
    priority: wont
    journey_stage: ST-002
    objective: O-002
    source: PRD owner decision, 2026-10-27; OUT-002, D-002
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer-scope, kind: scope, path: ./07-scope.md, title: Scope }
  next: { id: prd-forge-viewer-wireframes, kind: wireframes, path: ./08-wireframes.md, title: Wireframes }
  related:
    - { id: prd-forge-viewer-journeys, kind: journeys, path: ./05-user-journeys.md, title: User journeys }
    - { id: prd-forge-viewer-scope, kind: scope, path: ./07-scope.md, title: Scope }
    - { id: prd-forge-viewer-scenarios, kind: scenarios, path: ./06-scenarios.md, title: Scenarios }
---

# Functional requirements

Each requirement uses MoSCoW priority: must, should, could, or won't.

| ID | User | Capability | Priority | Stage |
| --- | --- | --- | --- | --- |
| FR-001 | PER-001 | Open a PRD set and see its contents | must | ST-001 |
| FR-002 | PER-001 | Return to the same PRD set in the next session | should | ST-001 |
| FR-003 | PER-001 | Open a set with incomplete or unreadable documents | must | ST-001 |
| FR-004 | PER-001 | See the grades of all sections together | must | ST-002 |
| FR-005 | PER-001 | Go directly to any section | must | ST-003 |
| FR-006 | PER-001 | Move to the previous or next section. Dropped: FR-005 and FR-023 cover it | wont | ST-003 |
| FR-007 | PER-002 | Follow a reference to the item it names | should | ST-003 |
| FR-008 | PER-002 | Search by term and category | must | ST-003 |
| FR-009 | PER-001 | See changes from the authoring tools without any action | must | ST-004 |
| FR-010 | PER-001 | Export as a fixed-layout document | must | ST-005 |
| FR-011 | PER-001 | Export as an editable document | should | ST-005 |
| FR-012 | PER-002 | Export only selected sections | must | ST-005 |
| FR-013 | PER-001 | Print the set or selected sections | should | ST-005 |
| FR-014 | PER-004 | See the version, and if it is a draft, in an export | must | ST-005 |
| FR-015 | PER-001 | Select a built-in export theme | must | ST-005 |
| FR-016 | PER-001 | Make a custom export theme | should | ST-005 |
| FR-017 | PER-001 | Change a custom export theme | should | ST-005 |
| FR-018 | PER-001 | Delete a custom export theme | should | ST-005 |
| FR-019 | PER-003 | See the status and score of every section in an export | should | ST-005 |
| FR-020 | PER-001 | Keep custom themes from one session to the next | should | ST-005 |
| FR-021 | PER-001 | Start the viewer from a terminal with prdf | must | ST-001 |
| FR-022 | PER-001 | Choose a PRD set from remembered locations | should | ST-001 |
| FR-023 | PER-001 | Select one item of a section and read it | must | ST-003 |
| FR-024 | PER-001 | Choose one PRD set when docs/prd holds more than one | should | ST-001 |
| FR-025 | PER-001 | See the findings behind the grade of a section, in release 2 | wont | ST-002 |

## FR-001. Open a PRD set and see its contents

Given a PRD set with 18 documents, when the author opens it, then the author sees
the product name, the version, the executive summary, and all 18 documents in
order, each with its status.

## FR-002. Return to the same PRD set in the next session

The same PRD set opens without any selection, and each section shows its current
version.

## FR-003. Open a set with incomplete or unreadable documents

All documents are listed. Pending sections show pending. An unreadable section is
marked with its file name, and the other documents can be read.

## FR-004. See the grades of all sections together

The author sees status, score, blocking count, and grade date for every section.
A section with no grade shows that it is not graded.

## FR-005. Go directly to any section

From any section, the author reaches any other section in one action.

## FR-006. Move to the previous or next section

Dropped on 2026-10-26. FR-005 and FR-023 move the author to any section and
item, so the viewer has no previous and next links. The ID stays, and nobody
reuses it.

## FR-007. Follow a reference to the item it names

From FR-004, the developer follows the reference to ST-002 in J-001.

## FR-008. Search by term and category

Each result shows its id, title, section, and a relevance score from 0 to 100,
highest first. Selecting a result opens the item. A search with no match says so.

## FR-009. See changes from the authoring tools without any action

The author sees a new score and new text without any action, within the time
limit in section 8.

## FR-010. Export as a fixed-layout document

One fixed-layout document (IN-006) holds every document in order. A reader opens it without the
authoring tools.

## FR-011. Export as an editable document

One editable document (IN-006) holds every document in order. A reader opens it without the
authoring tools.

## FR-012. Export only selected sections

The file contains only the selected sections, in reading order.

## FR-013. Print the set or selected sections

The printed copy matches the fixed-layout export in documents, order, and draft mark.

## FR-014. See the version, and if it is a draft, in an export

The first page shows the version and "Draft".

## FR-015. Select a built-in export theme

The built-in themes are Ice Snowstorm and Clay. The acceptance criteria give the
colors and fonts of each.

## FR-016. Make a custom export theme

The author selects a page color, a text color, a heading color, an accent color,
and a text font and a heading font from serif, sans-serif, and monospace. Exports
carry their fonts, so every reader sees the same fonts.

## FR-017. Change a custom export theme

Later exports use the changed values. Built-in themes cannot change.

## FR-018. Delete a custom export theme

The deleted theme is no longer available. Built-in themes cannot be deleted.

## FR-019. See the status and score of every section in an export

The contents list shows the status and score of every section. Each pending
section says that it is not written yet.

## FR-020. Keep custom themes from one session to the next

A custom theme is still available, with the same values, after the viewer
restarts.

## FR-021. Start the viewer from a terminal with prdf

The command `prdf` opens the viewer on the PRD set in the current directory, or
on the path that the author gives.

## FR-022. Choose a PRD set from remembered locations

The viewer remembers every PRD set location that it opened. In a folder with no
PRD set, the author picks one from that list.

## FR-023. Select one item of a section and read it

The author asks for the items of a section, sees them by id, and selects one
item to read it with the status and grade of its section.

## FR-024. Choose one of several PRD sets

When docs/prd holds more than one PRD set, prdf reopens the set that was open in
the last session. If none of them was open before, the viewer shows a list of the
sets it found, and the author selects one. The PRD owner decided this on
2026-10-26.

## FR-025. See the findings behind the grade of a section

The author sees the blocking defects and the items to raise the grade of a
section. The authoring tools record these findings (D-002). FR-025 is the
only requirement of release 2 (REL-002). Its priority is wont, because the priority
says what release 1 must handle, and release 1 does not have it.
