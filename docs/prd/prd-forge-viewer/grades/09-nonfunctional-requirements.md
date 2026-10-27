---
doc: ../09-nonfunctional-requirements.md
score: 86
blocking: 0
graded: 2026-10-26
grader: prd-forge:prd-adversary
---

# Why non-functional requirements scored 86

The adversarial pass scored 79 with 0 blocking defects. NFR-010 now applies to
search, change, and export requirements, and the hardware moved to C-004.

| Dimension | Score | Why |
| --- | --- | --- |
| Numbers | 4 | Every target has a quantity and a unit. |
| Percentiles | 4 | Latency targets use p95, measured as the 19th of 20 runs. |
| Measurement | 3 | NFR-010 does not say how a tester sees that a script ran. NFR-009 does not name the checker by what it checks. |
| Category coverage | 3 | Scale is N/A for a set of fixed size, but document length varies. FR-005 has no speed target. |
| Derivation | 2 | The 0.5-second search and 10-second export targets have no stated reason. |
| No technology | 4 | NFR-001 cites the test computer in C-004. |
| Scope | 4 | NFR-010 applies to display, search, change, and export requirements. |

## Blocking defects

- None.

## How to raise the grade

- **Derivation (2 to 4):** Record how long the author and the developer wait before they do something else, for each of NFR-001 to NFR-004.
- **Measurement (3 to 4):** Define the NFR-010 test set so each script leaves a visible trace. Count network transfers to any address in NFR-005.
- **Category coverage (3 to 4):** Add a size limit for which the speed targets hold, and a time for FR-005.
