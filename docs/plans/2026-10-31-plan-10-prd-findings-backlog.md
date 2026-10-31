---
date: 2026-10-31
slug: plan-10-prd-findings-backlog
title: Plan 10: PRD catch-up, grade findings, backlog navigation, and release 0.4.0
epic: 01M67NH4X4JGDJB233B670SJFF
items: [01M67NH4XPWE52APES54MYFEV2, 01M67NH4XPWE52APES54MYFEV4, 01M67NH4XPWE52APES54MYFEV6, 01M67NH4XPWE52APES54MYFEV8, 01M67NH4XPWE52APES54MYFEVA, 01M67NH4XPWE52APES54MYFEVC]
git_hash: "915ce63cd1cf13862cc2eeb643f50ce030c5aa52"
---

# Plan 10: PRD catch-up, grade findings, backlog navigation, and release 0.4.0

**Goal:** The PRD describes every feature that the viewer has. The viewer shows the findings behind a grade (FR-025, issue #35) and moves between the PRD and its backlog in both directions (issue #199). Release 0.4.0 ships it.

**Sources:** issues #35 and #199, the 0.3.0 design doc findings, and the PRD owner's answers of 2026-10-30.

## Decisions from the PRD owner (2026-10-30)

- Always update the PRD when the viewer gets a new requirement.
- Build FR-025 and issue #199 now, then cut a release.
- Fix the two small faults from the 0.3.0 design docs, and keep the text size and the search pin in the settings file (ADR-004).

## Tasks

- [ ] (P0) Task 1: update the PRD for the new requirements
  Use the prd-wizard skill. Change FR-008 to one or more categories. Add FR-026 (text size), FR-027 (search drawer), and FR-028 (move between the PRD and its backlog). Move FR-025 from wont to should in this release. Update scope, the release plan, and the change log (0.7.0), run prd-details and the validator, export the PRD, and update REQ and TRAC.
- [ ] (P1) Task 2: fix the nav top and Command-F with no set
  The document nav uses the measured header height. Command-F does nothing when no set is open.
- [ ] (P1) Task 3: keep the text size and the search pin in settings.json
  Move both values from local storage into the settings file, with the same atomic save as the themes (ADR-004, NFR-008).
- [ ] (P0) Task 4: see the findings behind a grade (FR-025, #35)
  A Rust command reads `grades/<file>` inside the set. The grade on a section page opens the findings. A section with no grade note says that no findings are recorded.
- [ ] (P0) Task 5: move between the PRD and its backlog (FR-028, #199)
  The viewer finds the `<set>-backlog` folder next to the set, lists its documents on the overview, and opens them as sections. Story ids and requirement ids link both ways: a story links to its requirements, and a requirement lists the stories that build it.
- [ ] (P0) Task 6: checks, release 0.4.0, and install
  Unit tests and e2e checks for each task. Run every check, cut 0.4.0 with the release skill, install the DMG, and run the doc agents.
