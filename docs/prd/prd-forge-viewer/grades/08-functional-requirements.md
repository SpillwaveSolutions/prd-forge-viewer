---
doc: ../08-functional-requirements.md
score: 88
blocking: 0
graded: 2026-10-27
grader: prd-forge:prd-adversary
---

# Why functional requirements scored 88

| Dimension | Score | Why |
| --- | --- | --- |
| Test 1, named user | 4 | Every requirement names a persona that exists. |
| Test 2, visible outcome | 3 | FR-014 and FR-019 say what the reader knows, not what the reader sees. |
| Test 3, acceptance | 3 | FR-016 and FR-021 have actions in the Given. FR-009 criterion 2 has two Whens. FR-024 criterion 3 depends on criterion 1. FR-013, FR-014, the export requirements, FR-023, and FR-007 lack a selected-sections, all-final, failed-export, empty, or missing-item case. FR-025 covers its empty case. |
| Test 4, priority | 3 | Every must is at ST-001 to ST-005 (12 of 25). Must FR-021 shows the known locations of should FR-022. FR-025 is wont for release 1 and is the only requirement of release 2. |
| Test 5, no technology | 4 | No technology, component, or screen is named. "docs/prd" stays for a recorded reason. |
| Atomicity | 3 | FR-008 joins six things. FR-013, FR-014, and FR-002 each join two. |
| Traceability | 4 | Every stage and objective exists. WF-003, WF-004, and WF-009 use other stages than FR-008 and FR-014. |
| Coverage | 4 | ST-001 to ST-005 each have a must, every must is in scope, and ST-006 and ST-007 are outside the product. |

## Blocking defects

None.

## How to raise the grade

- **Test 3 (3 to 4):** State the Givens of FR-016 and FR-021 as situations. Give FR-009 criterion 2 one When. Make FR-024 criterion 3 stand alone. Add the missing cases for FR-013, FR-014, the exports, FR-023, and FR-007.
- **Test 4 (3 to 4):** Remove the known-locations list from FR-021 criterion 3, or make FR-022 must.
- **Test 2 (3 to 4):** In FR-014 and FR-019, replace "knows" with what the reader sees.
- **Atomicity (3 to 4):** Split FR-008 into search with a category, the best match first, and the score.
