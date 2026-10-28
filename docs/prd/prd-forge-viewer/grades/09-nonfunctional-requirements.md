---
doc: ../09-nonfunctional-requirements.md
score: 79
blocking: 0
graded: 2026-10-27
grader: prd-forge:prd-adversary
---

# Why non-functional requirements scored 79

| Dimension | Score | Why |
| --- | --- | --- |
| Numbers | 4 | Every target has a quantity and a unit. |
| Percentiles | 4 | All four latency targets use p95. |
| Measurement | 3 | NFR-010 does not say how a tester sees that a script ran. NFR-005 searches for text, which cannot find content in encrypted traffic. NFR-007 does not say how WCAG 2.2 applies to a desktop app. No method has a window. |
| Category coverage | 3 | All core categories are covered or not applicable. The scale reason fixes the document count but not the length. The body had two not-applicable sections with different reasons. |
| Derivation | 2 | No entry has a `source`. The 0.5-second search and 10-second export targets have no stated reason. |
| No technology | 3 | NFR-009 names a PDF reader and a word processor, outside C-001. |
| Scope | 3 | NFR-001 does not apply to FR-021 and FR-024, and its metric leaves out the executive summary. Nothing keeps the known locations (FR-022) or the last set (FR-002) across a restart. |

## Blocking defects

None.

## How to raise the grade

- **Derivation (2 to 4):** Add a `source` to every entry, and give the reason for the 0.5-second and 10-second targets.
- **Category coverage (3 to 4):** Keep one not-applicable section. Give the speed targets a size limit.
- **Measurement (3 to 4):** Make each test script leave a visible trace. Count every network transfer in NFR-005. Name WCAG2ICT in NFR-007. Add a window to each method.
- **No technology (3 to 4):** In NFR-009, write "a reader for each format of C-001".
- **Scope (3 to 4):** Add FR-021 and FR-024 to NFR-001, and the executive summary to its metric. Keep FR-022 and FR-002 across a restart.
