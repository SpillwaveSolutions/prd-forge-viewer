---
doc: ../06-scenarios.md
score: 92
blocking: 0
graded: 2026-10-26
grader: self-grade
---

# Why scenarios scored 92

| Dimension | Score | Why |
| --- | --- | --- |
| Concreteness | 4 | Real values from this PRD set. |
| Bound to a journey | 4 | Each names a journey and a stage that exist. |
| Variant coverage | 3 | Happy, alternate, and exception flows. The exceptions come from this session. |
| Outcome testability | 4 | Each expected outcome is pass or fail. |
| User's view | 4 | Each step is what the user sees or does. |
| Concurrency and resumption | 3 | SC-003 and SC-006 cover both. |

## Blocking defects

- None.

## How to raise the grade

- **Variant coverage (3 to 4):** add the exceptions that real authors report after release 1.
