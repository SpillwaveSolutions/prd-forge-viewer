---
id: prd-forge-viewer-backlog-stories
kind: stories
schema: prd-forge/stories@1
title: Stories
status: draft
updated: '2026-10-28'
domain: software product management
order: 30
links:
  parent:
    id: prd-forge-viewer-backlog
    kind: backlog
    path: ./backlog.md
    title: PRD Forge Viewer backlog
  prev:
    id: prd-forge-viewer-backlog-epics
    kind: epics
    path: ./02-epics.md
    title: Epics
  next:
    id: prd-forge-viewer-backlog-spikes
    kind: spikes
    path: ./04-spikes.md
    title: Spikes
stories:
  - id: US-001
    epic: EPIC-001
    persona: PER-001
    capability: Open a PRD set and see its contents
    outcome: The author sees the product name, the version, the executive summary, and every document of the set in order, each with its status.
    acceptance:
      - Given a PRD set with 18 documents, when the author opens it, then the author sees the product name, the version, the executive summary, and all 18 documents in order, each with its status.
      - 'NFR-001: The author sees a PRD set within 2 seconds of opening it. Target: p95 at most 2 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.'
      - 'NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.'
    priority: must
    requirements:
      - FR-001
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
      - 'C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.'
    journey_stage: ST-001
  - id: US-002
    epic: EPIC-001
    persona: PER-001
    capability: Return to the same PRD set in the next session
    outcome: The author continues with the same PRD set without selecting it again.
    acceptance:
      - Given the author closed the viewer while a PRD set was open, when the author opens the viewer again, then the same PRD set is open without any selection.
      - Given a section changed while the viewer was closed, when the author opens the viewer again, then the author sees the current version of that section.
      - Given the author closed the viewer with a PRD set open, when the author opens the viewer again, then the same PRD set is open and the author sees its product name and version. (TR-001)
      - Given the same PRD set reopened, when the author opens a different PRD set, then the different PRD set is open. (TR-001)
      - Given the developer closed the viewer with a PRD set open, when the developer opens the viewer again, then the same PRD set is open and the developer sees its product name and version. (TR-012)
      - Given the same PRD set reopened, when the developer opens a different PRD set, then the different PRD set is open. (TR-012)
      - 'NFR-001: The author sees a PRD set within 2 seconds of opening it. Target: p95 at most 2 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.'
      - 'NFR-008: Custom export themes, the known locations, and the last open PRD set are not lost when the viewer restarts. Target: Zero.'
    priority: should
    requirements:
      - FR-002
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
      - 'C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.'
    journey_stage: ST-001
  - id: US-003
    epic: EPIC-001
    persona: PER-001
    capability: Open a PRD set that has incomplete or unreadable documents
    outcome: The author reads every readable document and sees which documents cannot be read.
    acceptance:
      - Given a PRD set with 13 pending sections that have no content, when the author opens it, then all 18 documents are listed and each pending section shows its status as pending.
      - Given one section that cannot be read, when the author opens the set, then the author sees that section marked as unreadable with its file name, and can read the other 17 documents.
      - 'NFR-001: The author sees a PRD set within 2 seconds of opening it. Target: p95 at most 2 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.'
    priority: must
    requirements:
      - FR-003
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
      - 'C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.'
    journey_stage: ST-001
  - id: US-004
    epic: EPIC-001
    persona: PER-001
    capability: Start the viewer from a terminal with the command prdf
    outcome: The author sees the PRD set of the current directory in the viewer, with no other step.
    acceptance:
      - Given the current directory contains docs/prd with one PRD set, when the author runs prdf, then the viewer opens and shows that PRD set.
      - Given the author runs prdf with the path of a PRD set, when the viewer opens, then it shows that PRD set.
      - Given the current directory contains no PRD set, when the author runs prdf, then the author sees that no PRD set was found there, and sees the list of known PRD set locations (FR-022).
      - 'NFR-001: The author sees a PRD set within 2 seconds of opening it. Target: p95 at most 2 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.'
    priority: must
    requirements:
      - FR-021
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
    journey_stage: ST-001
  - id: US-005
    epic: EPIC-001
    persona: PER-001
    capability: Choose a PRD set from the locations the viewer remembers
    outcome: The author opens any PRD set opened before, without typing or finding its path.
    acceptance:
      - Given the author opened PRD sets in two different folders before, when the author opens a folder with no PRD set, then the author sees both locations, each with its product name.
      - Given the list of known locations, when the author selects one, then the viewer opens that PRD set.
      - Given a known location whose PRD set no longer exists, when the author sees the list, then that location is marked as not found.
      - 'NFR-008: Custom export themes, the known locations, and the last open PRD set are not lost when the viewer restarts. Target: Zero.'
    priority: should
    requirements:
      - FR-022
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
    journey_stage: ST-001
  - id: US-006
    epic: EPIC-001
    persona: PER-001
    capability: Choose one PRD set when the docs/prd folder holds more than one
    outcome: The author opens the intended PRD set without typing its path.
    acceptance:
      - Given the current directory contains docs/prd with two PRD sets, and neither set was open in the last session, when the author runs prdf, then the author sees both sets, each with its product name and folder, and the viewer opens neither set.
      - Given the current directory contains docs/prd with two PRD sets, and one of them was open in the last session, when the author runs prdf, then the viewer opens that set.
      - Given that list, when the author selects one set, then the viewer opens that PRD set.
      - 'NFR-001: The author sees a PRD set within 2 seconds of opening it. Target: p95 at most 2 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.'
    priority: should
    requirements:
      - FR-024
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
      - 'C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.'
    journey_stage: ST-001
  - id: US-007
    epic: EPIC-002
    persona: PER-001
    capability: See the grades of all sections together
    outcome: The author sees the status, score, count of blocking defects, and grade date of every section at the same time.
    acceptance:
      - Given section 4 has score 61 and 0 blocking defects and section 3 has score 75 and 1 blocking defect, when the author views the grades, then the author sees both sections with those values and their grade dates.
      - Given a section that has no grade, when the author views the grades, then that section shows that it is not graded.
      - Given sections with different scores, when the author views the grades, then the viewer shows every section and does not mark any section as "to fix" on its own. (TR-002)
    priority: must
    requirements:
      - FR-004
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
      - 'C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.'
    journey_stage: ST-002
  - id: US-008
    epic: EPIC-003
    persona: PER-001
    capability: Go directly to any section
    outcome: The author reads the selected section without opening other documents first.
    acceptance:
      - Given the author is reading the problem and opportunity section, when the author selects the functional requirements section, then the author sees it in one action.
      - 'NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.'
    priority: must
    requirements:
      - FR-005
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
      - 'C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.'
    journey_stage: ST-003
  - id: US-009
    epic: EPIC-003
    persona: PER-001
    capability: Select one item of a section and read it without the whole section
    outcome: The author reads one item, such as a persona or a requirement, without reading the whole section first.
    acceptance:
      - Given the users and personas section with PER-001 to PER-005, when the author asks for the items of that section, then the author sees the five persona ids.
      - Given the five persona ids of that section are in view, when the author selects PER-001, then the author sees PER-001 with the status and grade of its section.
      - 'NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.'
    priority: must
    requirements:
      - FR-023
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
      - 'C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.'
    journey_stage: ST-003
  - id: US-010
    epic: EPIC-003
    persona: PER-002
    capability: Follow a reference from one item to the item it names
    outcome: The developer reads the related item, such as the journey stage that a requirement serves.
    acceptance:
      - Given requirement FR-004 names stage ST-002, when the developer follows that reference, then the developer sees stage ST-002 in J-001.
      - 'NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.'
    priority: should
    requirements:
      - FR-007
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
      - 'C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.'
    journey_stage: ST-003
  - id: US-011
    epic: EPIC-003
    persona: PER-002
    capability: Search the PRD set by term, in one category or in all categories
    outcome: The developer sees the matching items, most relevant first, each with its id and section.
    acceptance:
      - Given the term "export" and the category functional requirements, when the developer searches, then the developer sees only the functional requirements that contain "export", each with its id and section.
      - Given the same term and the category "all", when the developer searches, then the developer sees matching items from every section, including scenarios.
      - Given a term that no item contains, when the developer searches, then the developer sees that there are no matches.
      - 'NFR-003: The developer sees search results within 0.5 seconds of searching. Target: p95 at most 0.5 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.'
      - 'NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.'
    priority: must
    requirements:
      - FR-008
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
      - 'C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.'
    journey_stage: ST-003
  - id: US-012
    epic: EPIC-003
    persona: PER-002
    capability: See the search results ranked by relevance, and open one result
    outcome: The developer sees the matching items, most relevant first, each with its id and section.
    acceptance:
      - Given item A has "export" in its title and item B has "export" only once in its text, when the developer searches for "export", then item A is above item B.
      - Given a search with matches, when the developer views the results, then each result shows its id, its title, its section, and a relevance score from 0 to 100, highest first.
      - Given a list of results, when the developer selects one result, then the developer sees that item in its section.
      - Given a search with matches, when the developer views the results, then the viewer selects no item on its own. (TR-009)
      - 'NFR-003: The developer sees search results within 0.5 seconds of searching. Target: p95 at most 0.5 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.'
      - 'NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.'
    priority: must
    requirements:
      - FR-008
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
      - 'C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.'
    journey_stage: ST-003
  - id: US-013
    epic: EPIC-004
    persona: PER-001
    capability: See changes that the authoring tools make, without any action
    outcome: The author sees the current version of each section without any action.
    acceptance:
      - Given the author reads section 4 with score 61, when the authoring tools save section 4 with score 75, then the author sees score 75 and the new text without any action, within the time limit in NFR-002.
      - Given the author reads section 4 when the authoring tools save it, when the new version shows, then the author sees that section 4 changed.
      - Given the authoring tools change a section the author is not reading, when the author views the grades, then that section shows its new status and score.
      - Given a section that the authoring tools changed, when the author views it, then the author sees its new score, count of blocking defects, and status before choosing to export. (TR-003)
      - 'NFR-002: The author sees a change from the authoring tools within 2 seconds of the save. Target: p95 at most 2 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.'
      - 'NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.'
    priority: must
    requirements:
      - FR-009
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
      - 'C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.'
    journey_stage: ST-004
  - id: US-014
    epic: EPIC-005
    persona: PER-001
    capability: Export the PRD set as a fixed-layout document (IN-006)
    outcome: The author has one fixed-layout document that a reader opens with software already on the computer, without the authoring tools.
    acceptance:
      - Given a PRD set with 18 documents, when the author exports the whole set as a fixed-layout document, then one file in the format that IN-006 names contains every document in order, and the sponsor opens it without the authoring tools.
      - Given the author starts an export, when the author has not selected a format, then the author has no file. (TR-004)
      - Given the author starts an export, when the author has not selected any section, then the author has no file. (TR-004)
      - Given the author selects a format, a theme, and sections, when the export finishes, then the author sees the selected format, theme, and sections in the file. (TR-004)
      - Given the author makes an export, when the export finishes, then the viewer has sent the file to nobody. (TR-006)
      - 'NFR-004: The author has the export file within 10 seconds of starting the export. Target: p95 at most 10 seconds, for the whole PRD set, at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.'
      - 'NFR-009: A reader who uses a screen reader can read every export. Target: Zero errors, for each format of IN-006.'
      - 'NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.'
    priority: must
    requirements:
      - FR-010
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
    journey_stage: ST-005
  - id: US-015
    epic: EPIC-005
    persona: PER-001
    capability: Export the PRD set as an editable document (IN-006)
    outcome: The author has one editable document that a reader opens with software already on the computer, without the authoring tools.
    acceptance:
      - Given a PRD set with 18 documents, when the author exports the whole set as an editable document, then one file in the format that IN-006 names contains every document in order, and the engineering lead opens it in a word processor without the authoring tools.
      - Given the author makes an export, when the export finishes, then the viewer has sent the file to nobody. (TR-006)
      - 'NFR-004: The author has the export file within 10 seconds of starting the export. Target: p95 at most 10 seconds, for the whole PRD set, at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.'
      - 'NFR-009: A reader who uses a screen reader can read every export. Target: Zero errors, for each format of IN-006.'
      - 'NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.'
    priority: should
    requirements:
      - FR-011
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
    journey_stage: ST-005
  - id: US-016
    epic: EPIC-005
    persona: PER-002
    capability: Export only selected sections
    outcome: The developer has one file with only the selected sections.
    acceptance:
      - Given the user journeys section and the functional requirements section are the only sections selected, when the developer exports them, then the file contains only those two sections, in reading order.
      - Given the developer starts an export, when the developer has not selected any section, then the developer has no file. (TR-013)
      - Given the developer selects a format and two sections, when the export finishes, then the developer sees the selected format and only those two sections in the file. (TR-013)
      - 'NFR-004: The author has the export file within 10 seconds of starting the export. Target: p95 at most 10 seconds, for the whole PRD set, at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.'
      - 'NFR-009: A reader who uses a screen reader can read every export. Target: Zero errors, for each format of IN-006.'
      - 'NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.'
    priority: must
    requirements:
      - FR-012
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
    journey_stage: ST-005
  - id: US-017
    epic: EPIC-005
    persona: PER-001
    capability: Print the PRD set or selected sections
    outcome: The author has a printed copy with the same content as the export.
    acceptance:
      - Given the whole PRD set is selected, when the author prints it, then the printed copy has the same documents, order, and draft mark as the fixed-layout export.
      - 'NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.'
    priority: should
    requirements:
      - FR-013
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
    journey_stage: ST-005
  - id: US-018
    epic: EPIC-005
    persona: PER-004
    capability: See the version of the PRD, and if it is a draft, in an export
    outcome: The sponsor knows which version is in the file, and if it is a draft.
    acceptance:
      - Given version 0.1.0 with sections at draft, when the sponsor opens the export, then the first page shows version 0.1.0 and the word "Draft".
    priority: must
    requirements:
      - FR-014
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
    journey_stage: ST-005
  - id: US-019
    epic: EPIC-005
    persona: PER-004
    capability: See "Draft" on every export until every document of the PRD set is final, and see no claim that the PRD is approved
    outcome: The sponsor knows from the export alone whether a version can be approved.
    acceptance:
      - Given the root document and 15 sections at final and 1 section at review, when the author exports, then the first page shows "Draft". (TR-005)
      - Given all 17 section documents and the root document at final, when the author exports, then the export does not show "Draft". (TR-005)
      - Given an export that shows "Draft", when the author tries to remove the mark in the viewer, then the mark stays. (TR-005)
      - Given a section with 1 blocking defect, when the author exports, then the viewer makes the export and shows "Draft", and does not stop the export. (TR-010)
      - Given any export, when the sponsor opens it, then the export does not say that the PRD is approved. The author records the approval in the change log in section 15. (TR-007)
    priority: must
    requirements:
      - FR-014
      - TR-005
      - TR-007
      - TR-010
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
    journey_stage: ST-005
  - id: US-020
    epic: EPIC-005
    persona: PER-003
    capability: See the status and score of every section in an export
    outcome: The engineering lead knows which sections are finished before reading them.
    acceptance:
      - Given 13 pending sections, when the engineering lead opens the export, then the contents list shows the status and score of every section.
      - Given a pending section, when the engineering lead reaches it in the export, then the section says that it is not written yet.
      - Given an export of the whole PRD set, when the engineering lead opens it, then every section is in the file, with its status and score. (TR-008)
      - Given an export of the whole PRD set, when the sponsor opens it, then the first two pages show the version, the draft mark, the executive summary, and the contents list with the status and score of every section. (TR-011)
    priority: should
    requirements:
      - FR-019
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
    journey_stage: ST-005
  - id: US-021
    epic: EPIC-005
    persona: PER-001
    capability: Select an export theme from the built-in themes
    outcome: The export has the colors and fonts of the selected theme.
    acceptance:
      - Given the built-in theme Clay, when the author exports with Clay, then the file has page color FAF9F5, text color 3D3D3A, heading color 141413, accent color D97757, a serif font for headings, and a sans-serif font for text.
      - Given the built-in theme Ice Snowstorm, when the author exports with it, then the file has page color F3F6FB, text color 111111, heading color 0B1F4B, accent color 1D4E89, and a sans-serif font for headings and text.
    priority: must
    requirements:
      - FR-015
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
    journey_stage: ST-005
  - id: US-022
    epic: EPIC-005
    persona: PER-001
    capability: Make a custom export theme
    outcome: The author exports with colors and fonts that the author selected.
    acceptance:
      - Given the author makes a theme named "Acme" with a page color, a text color, a heading color, an accent color, a text font, and a heading font, each font chosen from serif, sans-serif, and monospace, when the author exports with "Acme", then the file uses those colors and fonts.
      - Given an export with the theme "Acme", when a reader opens it on a computer that does not have those fonts installed, then the reader sees the same fonts as the author.
      - 'NFR-008: Custom export themes, the known locations, and the last open PRD set are not lost when the viewer restarts. Target: Zero.'
    priority: should
    requirements:
      - FR-016
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
    journey_stage: ST-005
  - id: US-023
    epic: EPIC-005
    persona: PER-001
    capability: Change a custom export theme
    outcome: Later exports use the changed colors and fonts.
    acceptance:
      - Given the custom theme "Acme", when the author changes its accent color and exports, then the file uses the new accent color.
      - Given a built-in theme, when the author tries to change it, then the built-in theme stays as it was.
    priority: should
    requirements:
      - FR-017
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
    journey_stage: ST-005
  - id: US-024
    epic: EPIC-005
    persona: PER-001
    capability: Delete a custom export theme
    outcome: The deleted theme is no longer available for export.
    acceptance:
      - Given the custom theme "Acme", when the author deletes it, then "Acme" is no longer available to select.
      - Given a built-in theme, when the author tries to delete it, then the built-in theme is still available.
    priority: should
    requirements:
      - FR-018
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
    journey_stage: ST-005
  - id: US-025
    epic: EPIC-005
    persona: PER-001
    capability: Keep custom export themes from one session to the next
    outcome: The author uses the same custom themes after the viewer restarts.
    acceptance:
      - Given the author made the custom theme "Acme", when the author closes and reopens the viewer, then "Acme" is available to select, with the same colors and fonts.
      - 'NFR-008: Custom export themes, the known locations, and the last open PRD set are not lost when the viewer restarts. Target: Zero.'
    priority: should
    requirements:
      - FR-020
    definition_of_done:
      - 'NFR-005: No content of a PRD set leaves the author''s computer.'
      - 'NFR-006: Every release 1 feature works without a network connection.'
      - 'NFR-007: A person who uses only a keyboard can do every task in the viewer.'
    journey_stage: ST-005
---

# Stories

Each story is one step of a journey for one persona. Its acceptance criteria are the PRD criteria, copied as written.
FR-008 is split into two stories: searching (US-011) and the ranked results (US-012).
US-019 is the story for the Draft gate of TR-005.

| ID | Epic | Priority | Story | Requirements | Wireframes |
| --- | --- | --- | --- | --- | --- |
| US-001 | EPIC-001 | must | As a PRD author, I want to open a PRD set and see its contents | FR-001 | WF-001 |
| US-002 | EPIC-001 | should | As a PRD author, I want to return to the same PRD set in the next session | FR-002 | WF-001 |
| US-003 | EPIC-001 | must | As a PRD author, I want to open a PRD set that has incomplete or unreadable documents | FR-003 | WF-001, WF-005 |
| US-004 | EPIC-001 | must | As a PRD author, I want to start the viewer from a terminal with the command prdf | FR-021 | WF-006 |
| US-005 | EPIC-001 | should | As a PRD author, I want to choose a PRD set from the locations the viewer remembers | FR-022 | WF-006, WF-010 |
| US-006 | EPIC-001 | should | As a PRD author, I want to choose one PRD set when the docs/prd folder holds more than one | FR-024 | WF-010 |
| US-007 | EPIC-002 | must | As a PRD author, I want to see the grades of all sections together | FR-004 | WF-001 |
| US-008 | EPIC-003 | must | As a PRD author, I want to go directly to any section | FR-005 | WF-001, WF-002 |
| US-009 | EPIC-003 | must | As a PRD author, I want to select one item of a section and read it without the whole section | FR-023 | WF-002, WF-003 |
| US-010 | EPIC-003 | should | As a developer who uses the authoring tools, I want to follow a reference from one item to the item it names | FR-007 | WF-002 |
| US-011 | EPIC-003 | must | As a developer who uses the authoring tools, I want to search the PRD set by term, in one category or in all categories | FR-008 | WF-003, WF-004 |
| US-012 | EPIC-003 | must | As a developer who uses the authoring tools, I want to see the search results ranked by relevance, and open one result | FR-008 | WF-003, WF-004 |
| US-013 | EPIC-004 | must | As a PRD author, I want to see changes that the authoring tools make, without any action | FR-009 | WF-001, WF-002 |
| US-014 | EPIC-005 | must | As a PRD author, I want to export the PRD set as a fixed-layout document (IN-006) | FR-010 | WF-007, WF-009 |
| US-015 | EPIC-005 | should | As a PRD author, I want to export the PRD set as an editable document (IN-006) | FR-011 | WF-007 |
| US-016 | EPIC-005 | must | As a developer who uses the authoring tools, I want to export only selected sections | FR-012 | WF-007 |
| US-017 | EPIC-005 | should | As a PRD author, I want to print the PRD set or selected sections | FR-013 | WF-007 |
| US-018 | EPIC-005 | must | As a product sponsor, I want to see the version of the PRD, and if it is a draft, in an export | FR-014 | WF-009 |
| US-019 | EPIC-005 | must | As a product sponsor, I want to see "Draft" on every export until every document of the PRD set is final, and see no claim that the PRD is approved | FR-014, TR-005, TR-007, TR-010 | WF-009 |
| US-020 | EPIC-005 | should | As an engineering lead, I want to see the status and score of every section in an export | FR-019 | WF-009 |
| US-021 | EPIC-005 | must | As a PRD author, I want to select an export theme from the built-in themes | FR-015 | WF-007, WF-008 |
| US-022 | EPIC-005 | should | As a PRD author, I want to make a custom export theme | FR-016 | WF-008 |
| US-023 | EPIC-005 | should | As a PRD author, I want to change a custom export theme | FR-017 | WF-008 |
| US-024 | EPIC-005 | should | As a PRD author, I want to delete a custom export theme | FR-018 | WF-008 |
| US-025 | EPIC-005 | should | As a PRD author, I want to keep custom export themes from one session to the next | FR-020 | WF-008 |

## US-001. Open a PRD set and see its contents

As a PRD author, I want to open a PRD set and see its contents, so that the author sees the product name, the version, the executive summary, and every document of the set in order, each with its status.

Epic EPIC-001, stage ST-001, priority must. Requirements: FR-001. Wireframes: WF-001.

**Acceptance:**

- Given a PRD set with 18 documents, when the author opens it, then the author sees the product name, the version, the executive summary, and all 18 documents in order, each with its status.
- NFR-001: The author sees a PRD set within 2 seconds of opening it. Target: p95 at most 2 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.
- NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.
- C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.

## US-002. Return to the same PRD set in the next session

As a PRD author, I want to return to the same PRD set in the next session, so that the author continues with the same PRD set without selecting it again.

Epic EPIC-001, stage ST-001, priority should. Requirements: FR-002. Wireframes: WF-001.

**Acceptance:**

- Given the author closed the viewer while a PRD set was open, when the author opens the viewer again, then the same PRD set is open without any selection.
- Given a section changed while the viewer was closed, when the author opens the viewer again, then the author sees the current version of that section.
- Given the author closed the viewer with a PRD set open, when the author opens the viewer again, then the same PRD set is open and the author sees its product name and version. (TR-001)
- Given the same PRD set reopened, when the author opens a different PRD set, then the different PRD set is open. (TR-001)
- Given the developer closed the viewer with a PRD set open, when the developer opens the viewer again, then the same PRD set is open and the developer sees its product name and version. (TR-012)
- Given the same PRD set reopened, when the developer opens a different PRD set, then the different PRD set is open. (TR-012)
- NFR-001: The author sees a PRD set within 2 seconds of opening it. Target: p95 at most 2 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.
- NFR-008: Custom export themes, the known locations, and the last open PRD set are not lost when the viewer restarts. Target: Zero.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.
- C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.

## US-003. Open a PRD set that has incomplete or unreadable documents

As a PRD author, I want to open a PRD set that has incomplete or unreadable documents, so that the author reads every readable document and sees which documents cannot be read.

Epic EPIC-001, stage ST-001, priority must. Requirements: FR-003. Wireframes: WF-001, WF-005.

**Acceptance:**

- Given a PRD set with 13 pending sections that have no content, when the author opens it, then all 18 documents are listed and each pending section shows its status as pending.
- Given one section that cannot be read, when the author opens the set, then the author sees that section marked as unreadable with its file name, and can read the other 17 documents.
- NFR-001: The author sees a PRD set within 2 seconds of opening it. Target: p95 at most 2 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.
- C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.

## US-004. Start the viewer from a terminal with the command prdf

As a PRD author, I want to start the viewer from a terminal with the command prdf, so that the author sees the PRD set of the current directory in the viewer, with no other step.

Epic EPIC-001, stage ST-001, priority must. Requirements: FR-021. Wireframes: WF-006.

**Acceptance:**

- Given the current directory contains docs/prd with one PRD set, when the author runs prdf, then the viewer opens and shows that PRD set.
- Given the author runs prdf with the path of a PRD set, when the viewer opens, then it shows that PRD set.
- Given the current directory contains no PRD set, when the author runs prdf, then the author sees that no PRD set was found there, and sees the list of known PRD set locations (FR-022).
- NFR-001: The author sees a PRD set within 2 seconds of opening it. Target: p95 at most 2 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.

## US-005. Choose a PRD set from the locations the viewer remembers

As a PRD author, I want to choose a PRD set from the locations the viewer remembers, so that the author opens any PRD set opened before, without typing or finding its path.

Epic EPIC-001, stage ST-001, priority should. Requirements: FR-022. Wireframes: WF-006, WF-010.

**Acceptance:**

- Given the author opened PRD sets in two different folders before, when the author opens a folder with no PRD set, then the author sees both locations, each with its product name.
- Given the list of known locations, when the author selects one, then the viewer opens that PRD set.
- Given a known location whose PRD set no longer exists, when the author sees the list, then that location is marked as not found.
- NFR-008: Custom export themes, the known locations, and the last open PRD set are not lost when the viewer restarts. Target: Zero.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.

## US-006. Choose one PRD set when the docs/prd folder holds more than one

As a PRD author, I want to choose one PRD set when the docs/prd folder holds more than one, so that the author opens the intended PRD set without typing its path.

Epic EPIC-001, stage ST-001, priority should. Requirements: FR-024. Wireframes: WF-010.

**Acceptance:**

- Given the current directory contains docs/prd with two PRD sets, and neither set was open in the last session, when the author runs prdf, then the author sees both sets, each with its product name and folder, and the viewer opens neither set.
- Given the current directory contains docs/prd with two PRD sets, and one of them was open in the last session, when the author runs prdf, then the viewer opens that set.
- Given that list, when the author selects one set, then the viewer opens that PRD set.
- NFR-001: The author sees a PRD set within 2 seconds of opening it. Target: p95 at most 2 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.
- C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.

## US-007. See the grades of all sections together

As a PRD author, I want to see the grades of all sections together, so that the author sees the status, score, count of blocking defects, and grade date of every section at the same time.

Epic EPIC-002, stage ST-002, priority must. Requirements: FR-004. Wireframes: WF-001.

**Acceptance:**

- Given section 4 has score 61 and 0 blocking defects and section 3 has score 75 and 1 blocking defect, when the author views the grades, then the author sees both sections with those values and their grade dates.
- Given a section that has no grade, when the author views the grades, then that section shows that it is not graded.
- Given sections with different scores, when the author views the grades, then the viewer shows every section and does not mark any section as "to fix" on its own. (TR-002)

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.
- C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.

## US-008. Go directly to any section

As a PRD author, I want to go directly to any section, so that the author reads the selected section without opening other documents first.

Epic EPIC-003, stage ST-003, priority must. Requirements: FR-005. Wireframes: WF-001, WF-002.

**Acceptance:**

- Given the author is reading the problem and opportunity section, when the author selects the functional requirements section, then the author sees it in one action.
- NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.
- C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.

## US-009. Select one item of a section and read it without the whole section

As a PRD author, I want to select one item of a section and read it without the whole section, so that the author reads one item, such as a persona or a requirement, without reading the whole section first.

Epic EPIC-003, stage ST-003, priority must. Requirements: FR-023. Wireframes: WF-002, WF-003.

**Acceptance:**

- Given the users and personas section with PER-001 to PER-005, when the author asks for the items of that section, then the author sees the five persona ids.
- Given the five persona ids of that section are in view, when the author selects PER-001, then the author sees PER-001 with the status and grade of its section.
- NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.
- C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.

## US-010. Follow a reference from one item to the item it names

As a developer who uses the authoring tools, I want to follow a reference from one item to the item it names, so that the developer reads the related item, such as the journey stage that a requirement serves.

Epic EPIC-003, stage ST-003, priority should. Requirements: FR-007. Wireframes: WF-002.

**Acceptance:**

- Given requirement FR-004 names stage ST-002, when the developer follows that reference, then the developer sees stage ST-002 in J-001.
- NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.
- C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.

## US-011. Search the PRD set by term, in one category or in all categories

As a developer who uses the authoring tools, I want to search the PRD set by term, in one category or in all categories, so that the developer sees the matching items, most relevant first, each with its id and section.

Epic EPIC-003, stage ST-003, priority must. Requirements: FR-008. Wireframes: WF-003, WF-004.

**Acceptance:**

- Given the term "export" and the category functional requirements, when the developer searches, then the developer sees only the functional requirements that contain "export", each with its id and section.
- Given the same term and the category "all", when the developer searches, then the developer sees matching items from every section, including scenarios.
- Given a term that no item contains, when the developer searches, then the developer sees that there are no matches.
- NFR-003: The developer sees search results within 0.5 seconds of searching. Target: p95 at most 0.5 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.
- NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.
- C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.

## US-012. See the search results ranked by relevance, and open one result

As a developer who uses the authoring tools, I want to see the search results ranked by relevance, and open one result, so that the developer sees the matching items, most relevant first, each with its id and section.

Epic EPIC-003, stage ST-003, priority must. Requirements: FR-008. Wireframes: WF-003, WF-004.

**Acceptance:**

- Given item A has "export" in its title and item B has "export" only once in its text, when the developer searches for "export", then item A is above item B.
- Given a search with matches, when the developer views the results, then each result shows its id, its title, its section, and a relevance score from 0 to 100, highest first.
- Given a list of results, when the developer selects one result, then the developer sees that item in its section.
- Given a search with matches, when the developer views the results, then the viewer selects no item on its own. (TR-009)
- NFR-003: The developer sees search results within 0.5 seconds of searching. Target: p95 at most 0.5 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.
- NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.
- C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.

## US-013. See changes that the authoring tools make, without any action

As a PRD author, I want to see changes that the authoring tools make, without any action, so that the author sees the current version of each section without any action.

Epic EPIC-004, stage ST-004, priority must. Requirements: FR-009. Wireframes: WF-001, WF-002.

**Acceptance:**

- Given the author reads section 4 with score 61, when the authoring tools save section 4 with score 75, then the author sees score 75 and the new text without any action, within the time limit in NFR-002.
- Given the author reads section 4 when the authoring tools save it, when the new version shows, then the author sees that section 4 changed.
- Given the authoring tools change a section the author is not reading, when the author views the grades, then that section shows its new status and score.
- Given a section that the authoring tools changed, when the author views it, then the author sees its new score, count of blocking defects, and status before choosing to export. (TR-003)
- NFR-002: The author sees a change from the authoring tools within 2 seconds of the save. Target: p95 at most 2 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.
- NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.
- C-003: The viewer reads PRD sets in the document layout of the authoring tools, version 1: one root document and the section documents, with the headers and links that the prd-forge/*@1 schemas define.

## US-014. Export the PRD set as a fixed-layout document (IN-006)

As a PRD author, I want to export the PRD set as a fixed-layout document (IN-006), so that the author has one fixed-layout document that a reader opens with software already on the computer, without the authoring tools.

Epic EPIC-005, stage ST-005, priority must. Requirements: FR-010. Wireframes: WF-007, WF-009.

**Acceptance:**

- Given a PRD set with 18 documents, when the author exports the whole set as a fixed-layout document, then one file in the format that IN-006 names contains every document in order, and the sponsor opens it without the authoring tools.
- Given the author starts an export, when the author has not selected a format, then the author has no file. (TR-004)
- Given the author starts an export, when the author has not selected any section, then the author has no file. (TR-004)
- Given the author selects a format, a theme, and sections, when the export finishes, then the author sees the selected format, theme, and sections in the file. (TR-004)
- Given the author makes an export, when the export finishes, then the viewer has sent the file to nobody. (TR-006)
- NFR-004: The author has the export file within 10 seconds of starting the export. Target: p95 at most 10 seconds, for the whole PRD set, at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.
- NFR-009: A reader who uses a screen reader can read every export. Target: Zero errors, for each format of IN-006.
- NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.

## US-015. Export the PRD set as an editable document (IN-006)

As a PRD author, I want to export the PRD set as an editable document (IN-006), so that the author has one editable document that a reader opens with software already on the computer, without the authoring tools.

Epic EPIC-005, stage ST-005, priority should. Requirements: FR-011. Wireframes: WF-007.

**Acceptance:**

- Given a PRD set with 18 documents, when the author exports the whole set as an editable document, then one file in the format that IN-006 names contains every document in order, and the engineering lead opens it in a word processor without the authoring tools.
- Given the author makes an export, when the export finishes, then the viewer has sent the file to nobody. (TR-006)
- NFR-004: The author has the export file within 10 seconds of starting the export. Target: p95 at most 10 seconds, for the whole PRD set, at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.
- NFR-009: A reader who uses a screen reader can read every export. Target: Zero errors, for each format of IN-006.
- NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.

## US-016. Export only selected sections

As a developer who uses the authoring tools, I want to export only selected sections, so that the developer has one file with only the selected sections.

Epic EPIC-005, stage ST-005, priority must. Requirements: FR-012. Wireframes: WF-007.

**Acceptance:**

- Given the user journeys section and the functional requirements section are the only sections selected, when the developer exports them, then the file contains only those two sections, in reading order.
- Given the developer starts an export, when the developer has not selected any section, then the developer has no file. (TR-013)
- Given the developer selects a format and two sections, when the export finishes, then the developer sees the selected format and only those two sections in the file. (TR-013)
- NFR-004: The author has the export file within 10 seconds of starting the export. Target: p95 at most 10 seconds, for the whole PRD set, at most 18 documents and 176 KB of text, the size of this set on 2026-10-28.
- NFR-009: A reader who uses a screen reader can read every export. Target: Zero errors, for each format of IN-006.
- NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.

## US-017. Print the PRD set or selected sections

As a PRD author, I want to print the PRD set or selected sections, so that the author has a printed copy with the same content as the export.

Epic EPIC-005, stage ST-005, priority should. Requirements: FR-013. Wireframes: WF-007.

**Acceptance:**

- Given the whole PRD set is selected, when the author prints it, then the printed copy has the same documents, order, and draft mark as the fixed-layout export.
- NFR-010: The viewer shows content only from files on the computer. No script in a PRD set runs, and no remote image or link loads. Target: Zero scripts run and zero network requests.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.

## US-018. See the version of the PRD, and if it is a draft, in an export

As a product sponsor, I want to see the version of the PRD, and if it is a draft, in an export, so that the sponsor knows which version is in the file, and if it is a draft.

Epic EPIC-005, stage ST-005, priority must. Requirements: FR-014. Wireframes: WF-009.

**Acceptance:**

- Given version 0.1.0 with sections at draft, when the sponsor opens the export, then the first page shows version 0.1.0 and the word "Draft".

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.

## US-019. See "Draft" on every export until every document of the PRD set is final, and see no claim that the PRD is approved

As a product sponsor, I want to see "Draft" on every export until every document of the PRD set is final, and see no claim that the PRD is approved, so that the sponsor knows from the export alone whether a version can be approved.

Epic EPIC-005, stage ST-005, priority must. Requirements: FR-014, TR-005, TR-007, TR-010. Wireframes: WF-009.

**Acceptance:**

- Given the root document and 15 sections at final and 1 section at review, when the author exports, then the first page shows "Draft". (TR-005)
- Given all 17 section documents and the root document at final, when the author exports, then the export does not show "Draft". (TR-005)
- Given an export that shows "Draft", when the author tries to remove the mark in the viewer, then the mark stays. (TR-005)
- Given a section with 1 blocking defect, when the author exports, then the viewer makes the export and shows "Draft", and does not stop the export. (TR-010)
- Given any export, when the sponsor opens it, then the export does not say that the PRD is approved. The author records the approval in the change log in section 15. (TR-007)

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.

## US-020. See the status and score of every section in an export

As an engineering lead, I want to see the status and score of every section in an export, so that the engineering lead knows which sections are finished before reading them.

Epic EPIC-005, stage ST-005, priority should. Requirements: FR-019. Wireframes: WF-009.

**Acceptance:**

- Given 13 pending sections, when the engineering lead opens the export, then the contents list shows the status and score of every section.
- Given a pending section, when the engineering lead reaches it in the export, then the section says that it is not written yet.
- Given an export of the whole PRD set, when the engineering lead opens it, then every section is in the file, with its status and score. (TR-008)
- Given an export of the whole PRD set, when the sponsor opens it, then the first two pages show the version, the draft mark, the executive summary, and the contents list with the status and score of every section. (TR-011)

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.

## US-021. Select an export theme from the built-in themes

As a PRD author, I want to select an export theme from the built-in themes, so that the export has the colors and fonts of the selected theme.

Epic EPIC-005, stage ST-005, priority must. Requirements: FR-015. Wireframes: WF-007, WF-008.

**Acceptance:**

- Given the built-in theme Clay, when the author exports with Clay, then the file has page color FAF9F5, text color 3D3D3A, heading color 141413, accent color D97757, a serif font for headings, and a sans-serif font for text.
- Given the built-in theme Ice Snowstorm, when the author exports with it, then the file has page color F3F6FB, text color 111111, heading color 0B1F4B, accent color 1D4E89, and a sans-serif font for headings and text.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.

## US-022. Make a custom export theme

As a PRD author, I want to make a custom export theme, so that the author exports with colors and fonts that the author selected.

Epic EPIC-005, stage ST-005, priority should. Requirements: FR-016. Wireframes: WF-008.

**Acceptance:**

- Given the author makes a theme named "Acme" with a page color, a text color, a heading color, an accent color, a text font, and a heading font, each font chosen from serif, sans-serif, and monospace, when the author exports with "Acme", then the file uses those colors and fonts.
- Given an export with the theme "Acme", when a reader opens it on a computer that does not have those fonts installed, then the reader sees the same fonts as the author.
- NFR-008: Custom export themes, the known locations, and the last open PRD set are not lost when the viewer restarts. Target: Zero.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.

## US-023. Change a custom export theme

As a PRD author, I want to change a custom export theme, so that later exports use the changed colors and fonts.

Epic EPIC-005, stage ST-005, priority should. Requirements: FR-017. Wireframes: WF-008.

**Acceptance:**

- Given the custom theme "Acme", when the author changes its accent color and exports, then the file uses the new accent color.
- Given a built-in theme, when the author tries to change it, then the built-in theme stays as it was.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.

## US-024. Delete a custom export theme

As a PRD author, I want to delete a custom export theme, so that the deleted theme is no longer available for export.

Epic EPIC-005, stage ST-005, priority should. Requirements: FR-018. Wireframes: WF-008.

**Acceptance:**

- Given the custom theme "Acme", when the author deletes it, then "Acme" is no longer available to select.
- Given a built-in theme, when the author tries to delete it, then the built-in theme is still available.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.

## US-025. Keep custom export themes from one session to the next

As a PRD author, I want to keep custom export themes from one session to the next, so that the author uses the same custom themes after the viewer restarts.

Epic EPIC-005, stage ST-005, priority should. Requirements: FR-020. Wireframes: WF-008.

**Acceptance:**

- Given the author made the custom theme "Acme", when the author closes and reopens the viewer, then "Acme" is available to select, with the same colors and fonts.
- NFR-008: Custom export themes, the known locations, and the last open PRD set are not lost when the viewer restarts. Target: Zero.

**Definition of done:**

- NFR-005: No content of a PRD set leaves the author's computer.
- NFR-006: Every release 1 feature works without a network connection.
- NFR-007: A person who uses only a keyboard can do every task in the viewer.
