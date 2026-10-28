---
id: prd-forge-viewer-nfr
kind: nonfunctional-requirements
schema: prd-forge/nonfunctional-requirements@1
title: Non-functional requirements
status: final
updated: 2026-10-27
domain: software product management
section: 8
order: 90
score: 79
blocking: 0
graded: 2026-10-27
requirements:
  - id: NFR-001
    category: performance
    statement: The author sees a PRD set within 2 seconds of opening it.
    metric: >-
      Time from the open action to the moment the author sees the product name,
      the version, and the status of every document.
    target: p95 at most 2 seconds, for a PRD set of 18 documents
    measurement: >-
      Open this PRD set 20 times on the test computer (C-004),
      time each open from a screen recording, and take the 19th
      fastest time.
    priority: must
    applies_to:
      - FR-001
      - FR-002
      - FR-003
  - id: NFR-002
    category: performance
    statement: The author sees a change from the authoring tools within 2 seconds of the save.
    metric: >-
      Time from the moment the authoring tools save a section to the moment the
      author sees the new text and score in the viewer.
    target: p95 at most 2 seconds
    measurement: >-
      Change and save one section 20 times while the viewer shows it, on the
      test computer, time each update from a screen recording, and take the
      19th fastest time.
    priority: must
    applies_to:
      - FR-009
  - id: NFR-003
    category: performance
    statement: The developer sees search results within 0.5 seconds of searching.
    metric: Time from the search action to the moment the developer sees the results.
    target: p95 at most 0.5 seconds, for a PRD set of 18 documents
    measurement: >-
      Run 20 searches with different terms and categories on this PRD set, on
      the test computer, time each from a screen recording, and take the 19th
      fastest time.
    priority: must
    applies_to:
      - FR-008
  - id: NFR-004
    category: performance
    statement: The author has the export file within 10 seconds of starting the export.
    metric: Time from the export action to the moment the file is ready to open.
    target: p95 at most 10 seconds, for the whole PRD set of 18 documents
    measurement: >-
      Export this PRD set 20 times, 10 times in each format of C-001, on the test
      computer, time each export, and take the 19th fastest time.
    priority: must
    applies_to:
      - FR-010
      - FR-011
      - FR-012
  - id: NFR-005
    category: privacy
    statement: No content of a PRD set leaves the author's computer.
    metric: Number of network transfers that contain any content of a PRD set.
    target: Zero
    measurement: >-
      Record all network traffic from the test computer during a session that
      opens, searches, and exports this PRD set. Search the record for text from
      the PRD set. The count of matches is zero.
    priority: must
  - id: NFR-006
    category: availability
    statement: Every release 1 feature works without a network connection.
    metric: Share of the release 1 functional requirements that pass with the network off.
    target: 100% of the 23 functional requirements
    measurement: >-
      Turn off all network connections on the test computer and run the
      acceptance criteria of FR-001 to FR-024, except FR-006.
    priority: must
  - id: NFR-007
    category: accessibility
    statement: A person who uses only a keyboard can do every task in the viewer.
    metric: >-
      Share of the release 1 acceptance criteria that a tester completes with a
      keyboard only, and the count of WCAG 2.2 level AA failures.
    target: 100% of the acceptance criteria, and zero WCAG 2.2 AA failures
    measurement: >-
      A tester runs the acceptance criteria of FR-001 to FR-024, except FR-006, with a keyboard
      only, then checks the viewer against the WCAG 2.2 level AA success
      criteria.
    priority: must
  - id: NFR-008
    category: durability
    statement: Custom export themes are not lost when the viewer restarts.
    metric: Number of custom themes, or theme values, lost after a restart.
    target: Zero
    measurement: >-
      Make 5 custom themes, close the viewer, restart the computer, open the
      viewer, and compare every value of every theme.
    priority: must
    applies_to:
      - FR-016
      - FR-020
  - id: NFR-009
    category: accessibility
    statement: A reader who uses a screen reader can read every export.
    metric: Number of errors that the built-in accessibility checker of the reader's software reports on an export.
    target: Zero errors, for each format in C-001
    measurement: >-
      Export this PRD set in each format of C-001 and run the accessibility
      checker of a standard PDF reader and of a word processor on each file.
    priority: should
    applies_to:
      - FR-010
      - FR-011
      - FR-012
  - id: NFR-010
    category: security
    statement: >-
      The viewer shows content only from files on the computer. No script in a
      PRD set runs, and no remote image or link loads.
    metric: >-
      Number of scripts that run, and number of network requests that the viewer
      makes, while it shows a test PRD set that holds a script in a section, a
      script in a diagram, a remote image, and a remote link.
    target: Zero scripts run and zero network requests
    measurement: >-
      On the test computer, start a network monitor, open the test PRD set, read
      every section, select the remote link, and count the scripts that run and
      the network requests.
    priority: must
    applies_to:
      - FR-001
      - FR-005
      - FR-007
      - FR-008
      - FR-009
      - FR-010
      - FR-011
      - FR-012
      - FR-013
      - FR-023
not_applicable:
  - category: scale
    reason: >-
      One person opens one local PRD set at a time, and a set has 18 documents.
      The viewer has no shared data and no other users.
  - category: retention
    reason: >-
      The viewer is read-only (C-002). The PRD set stays where the authoring
      tools keep it. The viewer keeps only a derived cache and its settings.
  - category: observability
    reason: >-
      The viewer runs on the person's own computer and loads nothing remote
      (NFR-010). Failures show to that person, as in FR-003. No service exists
      to monitor.
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer-wireframes, kind: wireframes, path: ./08-wireframes.md, title: Wireframes }
  next: { id: prd-forge-viewer-constraints, kind: constraints, path: ./10-constraints.md, title: Constraints }
  related:
    - { id: prd-forge-viewer-personas, kind: personas, path: ./04-personas.md, title: Users and personas }
    - { id: prd-forge-viewer-functional-requirements, kind: functional-requirements, path: ./08-functional-requirements.md, title: Functional requirements }
---

# Non-functional requirements

The PRD owner accepted these targets on 2026-10-26. The test computer is the one in
C-004. The author opens the viewer several times a day
while writing a PRD (Q-003), so the open and update targets are 2 seconds.

| ID | Category | Requirement | Target |
| --- | --- | --- | --- |
| NFR-001 | performance | Open a PRD set | p95 at most 2 s |
| NFR-002 | performance | Show a change from the authoring tools | p95 at most 2 s |
| NFR-003 | performance | Show search results | p95 at most 0.5 s |
| NFR-004 | performance | Make an export of the whole set | p95 at most 10 s |
| NFR-005 | privacy | No PRD content leaves the computer | zero transfers |
| NFR-006 | availability | Every feature works offline | 100% of FR-001 to FR-024, except FR-006 |
| NFR-007 | accessibility | Keyboard-only use, WCAG 2.2 AA | 100%, zero failures |
| NFR-008 | durability | Custom themes survive a restart | zero lost |
| NFR-009 | accessibility | Exports work with a screen reader | zero checker errors |
| NFR-010 | security | Only local content shows. No script runs, nothing remote loads | zero scripts, zero requests |

## NFR-002. Show a change from the authoring tools

This sets the time limit that FR-009 and SC-003 refer to.

## NFR-005. No PRD content leaves the computer

The viewer never sends PRD content over a network. The PRD owner accepted this
target on 2026-10-26.

## NFR-010. Only local content shows

A PRD set can hold a script or a link to a remote image. The viewer shows the
text and the local files only. The viewer has no accounts and no shared data.
The PRD owner accepted this target on 2026-10-26.

## Categories that do not apply

| Category | Reason |
| --- | --- |
| Scale | One person opens one local PRD set of 18 documents at a time. |
| Retention | The viewer is read-only (C-002). The PRD set stays where the authoring tools keep it. The viewer keeps only a derived cache and its settings. |
| Observability | The viewer runs on the person's own computer and loads nothing remote (NFR-010). Failures show to that person, as in FR-003. |
