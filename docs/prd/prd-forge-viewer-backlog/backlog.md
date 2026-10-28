---
id: prd-forge-viewer-backlog
kind: backlog
schema: prd-forge/backlog-root@1
title: PRD Forge Viewer backlog
status: draft
updated: '2026-10-28'
domain: software product management
order: 0
product: PRD Forge Viewer
slug: prd-forge-viewer-backlog
prd: ../prd-forge-viewer/prd.md
prd_version: 0.6.0
release: REL-001
derived: '2026-10-28'
golden_thread: J-001
links:
  parent: null
  prev: null
  next:
    id: prd-forge-viewer-backlog-features
    kind: features
    path: ./01-features.md
    title: Features
  children:
    - id: prd-forge-viewer-backlog-features
      kind: features
      path: ./01-features.md
      title: Features
      order: 10
      status: draft
    - id: prd-forge-viewer-backlog-epics
      kind: epics
      path: ./02-epics.md
      title: Epics
      order: 20
      status: draft
    - id: prd-forge-viewer-backlog-stories
      kind: stories
      path: ./03-stories.md
      title: Stories
      order: 30
      status: draft
    - id: prd-forge-viewer-backlog-spikes
      kind: spikes
      path: ./04-spikes.md
      title: Spikes
      order: 40
      status: draft
---

# PRD Forge Viewer backlog

This backlog is derived from the PRD Forge Viewer PRD, version 0.6.0, on
2026-10-28. Every feature, epic, and story names the PRD ids that it comes from.
Derive the backlog again when the PRD changes.

The backlog has 5 features, 6 epics, 25 stories, and
1 spike. It has no tasks, subtasks, estimates, or sizes. The team writes
those in release planning and iteration planning.

## Release 1 story map

The stages of the golden thread, J-001, run across. The stories of each stage run
down, in the order of the epic. Every story in this map is above the release 1
line. ST-006 and ST-007 happen outside the viewer, with the workarounds in
section 6 of the PRD.

| ST-001 Open the PRD | ST-002 Check the grades | ST-003 Go to a weak section | ST-004 Fix the section | ST-005 Export the PRD | ST-006 Send the export | ST-007 Read and respond |
| --- | --- | --- | --- | --- | --- | --- |
| US-001 (must) | US-007 (must) | US-008 (must) | US-013 (must) | US-014 (must) | Outside the viewer | Outside the viewer |
| US-002 (should) |  | US-009 (must) |  | US-015 (should) |  |  |
| US-003 (must) |  | US-010 (should) |  | US-016 (must) |  |  |
| US-004 (must) |  | US-011 (must) |  | US-017 (should) |  |  |
| US-005 (should) |  | US-012 (must) |  | US-018 (must) |  |  |
| US-006 (should) |  |  |  | US-019 (must) |  |  |
|  |  |  |  | US-020 (should) |  |  |
|  |  |  |  | US-021 (must) |  |  |
|  |  |  |  | US-022 (should) |  |  |
|  |  |  |  | US-023 (should) |  |  |
|  |  |  |  | US-024 (should) |  |  |
|  |  |  |  | US-025 (should) |  |  |

## Release line

Release 1 (REL-001) delivers ST-001 to ST-005 in the viewer, and ST-006 and
ST-007 outside it. Release 2 (REL-002) adds EPIC-006, the findings behind each
grade (FR-025). Its stories are written in backlog refinement before release 2.

## Order of the epics

1. EPIC-001 comes first, because every other stage starts from an open PRD set.
2. EPIC-002 to EPIC-005 follow the stages of J-001, in release line order.
3. All five depend on D-001, the PRD Forge format, which is committed.
4. EPIC-005 serves O-001 most directly, because the export is what stakeholders
   read.
5. EPIC-006 is release 2. It depends on D-002, which is delivered.

## Gaps found in the PRD

- No must requirement is without a story.
- ST-006 and ST-007 have no requirements. The PRD records both as stages outside
  the viewer, with workarounds, so they are not holes.
- J-002 (ST-008 to ST-010) and J-003 (ST-011 and ST-012) have no requirements
  of their own. Their requirements sit on the J-001 stages, so their stories are
  in EPIC-001, EPIC-003, and EPIC-005.
- Release 1 had a target date of 2026-10-27, which is before this backlog was
  derived. The PRD owner must set a new date in section 13.

## What this backlog does not have

| Not here | Where it comes from | Who |
| --- | --- | --- |
| Feature and epic sizes | Release planning | Product owner and the team |
| Tasks | Iteration planning, from the ADRs and one story | Engineering team |
| Subtasks | Daily work | Each engineer |
| Changes to the story map | Story-mapping workshop and demo | Product, engineering, and practitioners |
