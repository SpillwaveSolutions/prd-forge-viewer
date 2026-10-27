---
doc: ../08-wireframes.md
score: 94
blocking: 0
graded: 2026-10-26
grader: prd-forge:prd-adversary
---

# Why wireframes scored 94

The adversarial pass scored 88 with 0 blocking defects. The status counts in
WF-001, WF-002, and WF-007 and the version in WF-009 now match the set.

| Dimension | Score | Why |
| --- | --- | --- |
| Coverage | 3 | WF-006 lists FR-024 but does not draw the list of several sets. |
| Traceability | 4 | Every WF names its requirements, persona, and stage. |
| The person's view | 4 | Each sketch is that persona's screen at that stage. |
| Real content | 4 | Version and status counts match version 0.3.2. |
| Marks explained | 3 | The fourth `shows` line of WF-006 has no mark in the sketch. |
| No design | 4 | No platform, vendor, or component library. |
| States | 4 | SC-002, SC-004, and SC-007 are drawn. |
| Every control earns its place | 4 | Every control traces to a requirement. |

## Blocking defects

- None.

## How to raise the grade

- **Coverage and marks (3 to 4):** Draw the FR-024 state, as WF-010 or inside WF-006, with a mark on the list of sets.
