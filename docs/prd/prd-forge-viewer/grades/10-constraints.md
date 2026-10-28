---
doc: ../10-constraints.md
score: 85
blocking: 0
graded: 2026-10-28
grader: prd-forge:prd-adversary
---

# Why constraints scored 85

| Dimension | Score | Why |
| --- | --- | --- |
| Named authority | 4 | C-003 names the prd-forge/*@1 schemas, with a reference and the release read on 2026-10-28. |
| Non-negotiable | 3 | The viewer must read the PRD sets that the authoring tools already write. The PRD owner also owns the format (D-001), and the section does not name who outside the team depends on it. |
| Verification | 3 | The check has a failing case, but it tests only opening and display, and names no test set. |
| Linkage | 3 | `applies_to` leaves out FR-006, FR-014, FR-019, and FR-025, which also read the format. |
| Separation | 4 | C-001, C-002, and C-004 moved to section 6 as IN-006, OUT-001, and OUT-003. |

## Blocking defects

None.

## How to raise the grade

- **Non-negotiable (3 to 4):** Name the outside party that holds the format fixed, such as the PRD sets that users of the authoring tools already wrote.
- **Verification (3 to 4):** Name this PRD set as the test set. Add steps for FR-007, FR-008, FR-009, and FR-023.
- **Linkage (3 to 4):** Add FR-006, FR-014, and FR-019 to `applies_to`, and note that FR-025 is release 2.
- Repeat `applies_to` and the verification in the body.
- Check that the window of A-003 and D-001, "until release 1 ships", still fits after 2026-10-27.
