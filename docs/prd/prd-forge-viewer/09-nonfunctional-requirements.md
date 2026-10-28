---
id: prd-forge-viewer-nfr
kind: nonfunctional-requirements
schema: prd-forge/nonfunctional-requirements@1
title: Non-functional requirements
status: final
updated: 2026-10-28
domain: software product management
section: 8
order: 90
score: 82
blocking: 0
graded: 2026-10-28
requirements:
  - id: NFR-001
    category: performance
    statement: The author sees a PRD set within 2 seconds of opening it.
    metric: >-
      Time from the open action to the moment the author sees the product name,
      the version, the executive summary, and the status of every document.
    target: p95 at most 2 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28
    measurement: >-
      On one day, open this PRD set 20 times on the test computer (OUT-003): 10
      times from the viewer, 5 times with prdf, and 5 times from the list of
      sets. Time each open from a screen recording, and take the 19th fastest
      time.
    priority: must
    applies_to:
      - FR-001
      - FR-002
      - FR-003
      - FR-021
      - FR-024
    source: >-
      PRD owner decision, Richard Hightower, 2026-10-26. The author opens the viewer several times a day while writing a PRD
      (Q-003). 2 seconds is within the 10-second limit of attention in
      "Response Times: The 3 Important Limits", Jakob Nielsen, Nielsen Norman Group, 1993, updated 2014, https://www.nngroup.com/articles/response-times-3-important-limits/
  - id: NFR-002
    category: performance
    statement: The author sees a change from the authoring tools within 2 seconds of the save.
    metric: >-
      Time from the moment the authoring tools save a section to the moment the
      author sees the new text and score in the viewer.
    target: p95 at most 2 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28
    measurement: >-
      On one day, change and save one section 20 times while the viewer shows
      it, on the test computer. Time each update from a screen recording, and
      take the 19th fastest time.
    priority: must
    applies_to:
      - FR-009
    source: >-
      PRD owner decision, Richard Hightower, 2026-10-26. The author checks each change while writing (Q-003, SC-003).
  - id: NFR-003
    category: performance
    statement: The developer sees search results within 0.5 seconds of searching.
    metric: Time from the search action to the moment the developer sees the results.
    target: p95 at most 0.5 seconds, for a PRD set of at most 18 documents and 176 KB of text, the size of this set on 2026-10-28
    measurement: >-
      On one day, run 20 searches with different terms and categories on this
      PRD set, on the test computer. Time each from a screen recording, and take
      the 19th fastest time.
    priority: must
    applies_to:
      - FR-008
    source: >-
      PRD owner decision, Richard Hightower, 2026-10-26. A search must not break the developer's flow of thought. Nielsen
      gives 1.0 second as the limit for an uninterrupted flow of thought, and
      0.5 seconds keeps half of that as a margin. "Response Times: The 3 Important Limits", Jakob Nielsen, Nielsen Norman Group, 1993, updated 2014, https://www.nngroup.com/articles/response-times-3-important-limits/
  - id: NFR-004
    category: performance
    statement: The author has the export file within 10 seconds of starting the export.
    metric: Time from the export action to the moment the file is ready to open.
    target: p95 at most 10 seconds, for the whole PRD set, at most 18 documents and 176 KB of text, the size of this set on 2026-10-28
    measurement: >-
      On one day, export this PRD set 20 times, 10 times in each format of
      IN-006, on the test computer. Time each export, and take the 19th fastest
      time.
    priority: must
    applies_to:
      - FR-010
      - FR-011
      - FR-012
    source: >-
      PRD owner decision, Richard Hightower, 2026-10-26. The author waits for the export and does not change to another
      task. Nielsen gives 10 seconds as the limit for keeping the user's
      attention. "Response Times: The 3 Important Limits", Jakob Nielsen, Nielsen Norman Group, 1993, updated 2014, https://www.nngroup.com/articles/response-times-3-important-limits/
  - id: NFR-005
    category: privacy
    statement: No content of a PRD set leaves the author's computer.
    metric: >-
      Number of network transfers that the viewer makes during a session. A
      transfer counts even if its content is encrypted.
    target: Zero
    measurement: >-
      On one day, record all network connections that the viewer opens on the
      test computer during a session that opens, searches, and exports this PRD
      set. Count every connection to a host other than the computer itself. The
      count is zero.
    priority: must
    source: >-
      PRD owner decision, Richard Hightower, 2026-10-26. A PRD set can hold client information, because the sponsor
      (PER-004) is a client executive. No feature needs to send it (NFR-010).
  - id: NFR-006
    category: availability
    statement: Every release 1 feature works without a network connection.
    metric: Share of the release 1 functional requirements that pass with the network off.
    target: 100% of the 23 functional requirements
    measurement: >-
      On one day, turn off all network connections on the test computer and run
      the acceptance criteria of FR-001 to FR-024, except FR-006.
    priority: must
    source: >-
      PRD owner decision, Richard Hightower, 2026-10-26. The viewer shows only local content (NFR-010), so no feature needs a
      network.
  - id: NFR-007
    category: accessibility
    statement: A person who uses only a keyboard can do every task in the viewer.
    metric: >-
      Share of the release 1 acceptance criteria that a tester completes with a
      keyboard only, and the count of failures of the WCAG 2.2 level AA success
      criteria, as WCAG2ICT applies them to non-web software.
    target: 100% of the acceptance criteria, and zero level AA failures
    measurement: >-
      In one week, a tester runs the acceptance criteria of FR-001 to FR-024,
      except FR-006, with a keyboard only. The tester then checks the viewer
      against each WCAG 2.2 level AA success criterion that WCAG2ICT applies to
      non-web software.
    priority: must
    source: >-
      PRD owner decision, Richard Hightower, 2026-10-26. The success criteria come from WCAG 2.2, applied to a desktop app
      by "Guidance on Applying WCAG 2 to Non-Web Information and Communications
      Technologies (WCAG2ICT)", W3C Group Note, 11 December 2025,
      https://www.w3.org/TR/wcag2ict-22/
  - id: NFR-008
    category: durability
    statement: >-
      Custom export themes, the known locations, and the last open PRD set are
      not lost when the viewer restarts.
    metric: >-
      Number of custom themes, theme values, known locations, or last-set
      records lost after a restart.
    target: Zero
    measurement: >-
      On one day, make 5 custom themes, open PRD sets from 3 locations, and
      leave one set open. Close the viewer, restart the computer, and open the
      viewer. Compare every theme value and every known location, and check
      that the same set is open.
    priority: must
    applies_to:
      - FR-002
      - FR-016
      - FR-020
      - FR-022
    source: >-
      PRD owner decision, Richard Hightower, 2026-10-26, extended on 2026-10-28 to the known locations and the last set.
      The author makes these once and expects to find them again.
  - id: NFR-009
    category: accessibility
    statement: A reader who uses a screen reader can read every export.
    metric: >-
      Number of errors that the accessibility checker of a reader for each
      format of IN-006 reports on an export.
    target: Zero errors, for each format of IN-006
    measurement: >-
      On one day, export this PRD set in each format of IN-006. Run the
      accessibility checker of a reader for that format on each file.
    priority: should
    applies_to:
      - FR-010
      - FR-011
      - FR-012
    source: >-
      PRD owner decision, Richard Hightower, 2026-10-26. Every reader of the export (PER-003, PER-004, PER-005) must be
      able to read it, also a reader who uses a screen reader.
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
      On one day, on the test computer, start a network monitor and open the
      test PRD set. Each test script, if it runs, changes the visible text of its
      section to SCRIPT RAN. Read every section, select the remote link, and
      count the sections that show SCRIPT RAN and the network requests.
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
    source: >-
      PRD owner decision, Richard Hightower, 2026-10-26. A PRD set can come from another person, and its content must not
      act on the author's computer.
not_applicable:
  - category: scale
    reason: >-
      One person opens one local PRD set at a time, and a set has at most 18
      documents. NFR-001 to NFR-004 give the largest set size. The viewer has no
      shared data and no other users.
  - category: retention
    reason: >-
      The viewer does not change a PRD set in release 1 (OUT-001). The PRD set
      stays where the authoring tools keep it. The viewer keeps only what it
      needs to search a set, and the author's settings.
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

The PRD owner accepted these targets on 2026-10-26, and extended NFR-008 on
2026-10-28. The test computer is the one in OUT-003. Each speed target holds for a
PRD set of at most 18 documents and 176 KB of text, the size of this set on
2026-10-28.

The speed targets follow the response time limits of Jakob Nielsen. 1.0 second
is the limit for an uninterrupted flow of thought, so search (NFR-003) has 0.5
seconds. 10 seconds is the limit of attention, so the export (NFR-004) has 10
seconds. The author opens the viewer several times a day while writing a PRD
(Q-003), so the open and update targets are 2 seconds.

| ID | Category | Requirement | Target |
| --- | --- | --- | --- |
| NFR-001 | performance | Open a PRD set, also with prdf and from the list of sets | p95 at most 2 s |
| NFR-002 | performance | Show a change from the authoring tools | p95 at most 2 s |
| NFR-003 | performance | Show search results | p95 at most 0.5 s |
| NFR-004 | performance | Make an export of the whole set | p95 at most 10 s |
| NFR-005 | privacy | No PRD content leaves the computer | zero network transfers |
| NFR-006 | availability | Every feature works offline | 100% of FR-001 to FR-024, except FR-006 |
| NFR-007 | accessibility | Keyboard-only use, WCAG 2.2 AA through WCAG2ICT | 100%, zero failures |
| NFR-008 | durability | Custom themes, known locations, and the last set survive a restart | zero lost |
| NFR-009 | accessibility | Exports work with a screen reader | zero checker errors |
| NFR-010 | security | Only local content shows. No script runs, nothing remote loads | zero scripts, zero requests |

## NFR-002. Show a change from the authoring tools

This sets the time limit that FR-009 and SC-003 refer to.

## NFR-005. No PRD content leaves the computer

The viewer never sends PRD content over a network. The test counts every
transfer, because a search of encrypted traffic cannot find PRD text.

## NFR-007. Keyboard use and WCAG

WCAG 2.2 is written for web content. WCAG2ICT, a W3C Group Note, says how each
success criterion applies to non-web software such as the viewer.

## NFR-010. Only local content shows

A PRD set can hold a script or a link to a remote image. The viewer shows the
text and the local files only. Each test script changes its section text to
SCRIPT RAN if it runs, so a tester can see it.

## Categories that do not apply

| Category | Reason |
| --- | --- |
| Scale | One person opens one local PRD set of at most 18 documents at a time. NFR-001 to NFR-004 give the largest set size. |
| Retention | The viewer does not change a PRD set in release 1 (OUT-001). The PRD set stays where the authoring tools keep it. The viewer keeps only what it needs to search a set, and the author's settings. |
| Observability | The viewer runs on the person's own computer and loads nothing remote (NFR-010). Failures show to that person, as in FR-003. |
