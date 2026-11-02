---
doc: ../08-functional-requirements.md
score: 81
blocking: 0
graded: 2026-11-01
grader: prd-forge:prd-adversary
---

# Why functional requirements scored 81

| Dimension | Score | Why |
| --- | --- | --- |
| Test 1, named user | 4 | Every requirement names a persona that exists. |
| Test 2, visible outcome | 3 | FR-014 and FR-019 say what the reader knows, not what the reader sees. |
| Test 3, acceptance | 3 | Twelve requirements have only a happy path: FR-001, FR-005, FR-007, FR-010 to FR-016, FR-020, and FR-023. FR-009 criterion 2 has two Whens. FR-013 has no criterion for selected sections. |
| Test 4, priority | 3 | Every must is in REL-001. FR-025 is wont, but FR-026 to FR-028 were should, and all four are in release 2. |
| Test 5, no technology | 3 | No vendor, component, or screen is named. FR-021 and FR-024 use the folder path `docs/prd` and the command `prdf` in a capability and a criterion. |
| Atomicity | 3 | FR-019, FR-026, FR-027, and FR-014 each join two capabilities. |
| Traceability | 3 | Every stage and objective exists. FR-007, FR-008, FR-027, and FR-028 (PER-002) use ST-003, whose actor is PER-001. FR-012 and FR-014 use ST-005, not the J-002 and J-003 stages. |
| Coverage | 4 | ST-001 to ST-005 each have a must, and every must is in an IN- item. |

An earlier pass on the same day scored 78 with 1 blocking defect: FR-027
criterion 1 named "the search box". The author changed it to "can type a term
at once" before this pass.

## Blocking defects

None.

## Changes after this pass

- **Test 4:** The PRD owner made FR-026, FR-027, and FR-028 wont, the same as
  FR-025. All four requirements of release 2 now use one rule.
- **Scope:** OUT-004 now holds FR-026 to FR-028 for release 2, the same as
  OUT-002 holds FR-025.

- **Test 3:** Twelve requirements now have an error or empty case: FR-001,
  FR-005, FR-007, FR-010 to FR-016, FR-020, and FR-023. FR-009 criterion 2 has
  one When. FR-013 covers selected sections.

The next grading pass scores these changes.

## How to raise the grade

- **Test 2 (3 to 4):** In FR-014 and FR-019, replace "knows" with what the
  reader sees, for example "sees the version, and the word Draft, on the first
  page".
- **Test 3 (3 to 4):** Add one error or empty case to each happy-path-only
  requirement, for example FR-012 with no section selected, or FR-014 with every
  section final. Give FR-009 criterion 2 one When. Add a selected-sections
  criterion to FR-013.
- **Test 5 (3 to 4):** In the FR-024 capability, write "the folder where the
  authoring tools keep PRD sets" in place of `docs/prd`.
- **Atomicity (3 to 4):** Split FR-019 into the status in an export and the
  grades when included. Split keeping the text size out of FR-026, as FR-020
  does for themes. Split hiding search out of FR-027.
- **Traceability (3 to 4):** Trace FR-008 and FR-027 to ST-009, FR-012 to
  ST-010, and FR-014 to ST-011. Or record why the owner chose the J-001 stages.
