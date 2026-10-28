---
id: prd-forge-viewer-constraints
kind: constraints
schema: prd-forge/constraints@1
title: Constraints
status: review
updated: 2026-10-28
domain: software product management
section: 9
order: 100
score: 85
blocking: 0
graded: 2026-10-28
constraints:
  - id: C-003
    category: standard
    statement: >-
      The viewer reads PRD sets in the document layout of the authoring tools,
      version 1: one root document and the section documents, with the headers
      and links that the prd-forge/*@1 schemas define.
    authority: >-
      The PRD Forge document format, version 1: the prd-forge/*@1 schemas in
      the schemas folder of https://github.com/SpillwaveSolutions/prd-forge.
      Release 0.9.0 of the authoring tools, read on 2026-10-28, uses them for
      18 documents.
    applies_to:
      - FR-001
      - FR-002
      - FR-003
      - FR-004
      - FR-005
      - FR-007
      - FR-008
      - FR-009
      - FR-023
      - FR-024
    verification: >-
      Open a PRD set that passes the validator of the authoring tools, release
      0.9.0. Every document and every grade shows in the viewer. Then change one
      section header so that it fails the schema, and open the set again. That
      section shows as unreadable, as FR-003 says.
links:
  parent: { id: prd-forge-viewer, kind: prd, path: ./prd.md, title: PRD Forge Viewer PRD }
  prev: { id: prd-forge-viewer-nfr, kind: nonfunctional-requirements, path: ./09-nonfunctional-requirements.md, title: Non-functional requirements }
  next: { id: prd-forge-viewer-decision-rights, kind: decision-rights, path: ./11-decision-rights.md, title: Decision rights }
  related:
    - { id: prd-forge-viewer-functional-requirements, kind: functional-requirements, path: ./08-functional-requirements.md, title: Functional requirements }
---

# Constraints

Constraints are rules that the product team cannot change by agreement. C-003
comes from the published PRD Forge format. The viewer must read the PRD sets
that the authoring tools already write, so the team cannot change the format.

| ID | Category | Rule | Authority |
| --- | --- | --- | --- |
| C-003 | standard | The viewer reads the PRD Forge document format, version 1 | The prd-forge/*@1 schemas |

## C-003. The PRD Forge document format

The viewer reads PRD sets that follow the PRD Forge version 1 layout and headers.

## Retired constraints

C-001 (the export formats), C-002 (the viewer is read-only), and C-004 (release
1 runs on macOS only) were retired in version 0.6.0. Each is a release 1
decision that the PRD owner can change, not an outside rule. Section 6 records
them: IN-006 names the export formats, OUT-001 records the read-only rule, and
OUT-003 records macOS only. The PRD owner revisits OUT-001 and OUT-003 at the
release 2 review on 2026-11-06. The ids C-001, C-002, and C-004 are not used
again.
