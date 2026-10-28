---
doc: ../09-nonfunctional-requirements.md
score: 82
blocking: 0
graded: 2026-10-28
grader: prd-forge:prd-adversary
---

# Why non-functional requirements scored 82

| Dimension | Score | Why |
| --- | --- | --- |
| Numbers | 4 | Every target has a quantity and a unit. |
| Percentiles | 4 | All four latency targets use p95, and the 19th fastest of 20 runs fits it. |
| Measurement | 3 | NFR-009 does not say which checker to run. NFR-002 does not say what on the recording marks the save. |
| Category coverage | 3 | The retention reason says that the viewer keeps a copy for search, but not how long it keeps it. |
| Derivation | 3 | The targets trace to Q-003 and to the Nielsen limits. The size bound is this set, not the largest set of the segment. PER-002 search frequency is not known. |
| No technology | 3 | The retention reason says "a derived cache", which is a design term. |
| Scope | 3 | NFR-010 covers the whole viewer but lists only 10 FRs in `applies_to`. |

## Blocking defects

None.

## How to raise the grade

- **Measurement (3 to 4):** In NFR-009, name the standard that the checker tests against for each format. In NFR-002, start the time when the save message of the authoring tools shows on the recording.
- **Category coverage (3 to 4):** Say how long the viewer keeps its search copy of a set after the set is deleted or removed from the known locations.
- **Derivation (3 to 4):** Give the largest set that the segment makes, with its source.
- **No technology (3 to 4):** Say "what the viewer keeps to search a set" in place of "a derived cache".
- **Scope (3 to 4):** Remove `applies_to` from NFR-010, so it holds for the whole viewer.
- Take one p95 for each format in NFR-004.
