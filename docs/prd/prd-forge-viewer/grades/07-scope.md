---
doc: ../07-scope.md
score: 92
blocking: 0
graded: 2026-10-28
grader: prd-forge:prd-adversary
---

# Why scope scored 92

| Dimension | Score | Why |
| --- | --- | --- |
| Release line | 4 | ST-001 to ST-005 in the viewer and ST-006 and ST-007 outside it make one path to the end state of J-001. |
| Completeness of value | 4 | Every stage has an in-scope item or a workaround. |
| In-scope traceability | 3 | The release line says that release 1 delivers J-002, but no in-scope item names ST-008, ST-009, or ST-010. IN-006 and IN-008 both cover the export of selected sections. |
| Out of scope | 3 | OUT-001 and OUT-003 give a meeting date, not a condition. FR-006 is in no out-of-scope item or non-goal. |
| Non-goals | 4 | Six non-goals, each with a reason. |
| Honesty | 4 | It says no to editing, grade findings in release 1, and every operating system but macOS. |

## Blocking defects

None. An earlier pass on 2026-10-28 flagged "PRD Forge 0.2.0" in the OUT-002 revisit. The text now says "the authoring tools".

## How to raise the grade

- **In-scope traceability (3 to 4):** Name the J-002 stages in the release line, and map ST-008 to IN-001, ST-009 to IN-004, and ST-010 to IN-008. Remove "or selected sections" from IN-006.
- **Out of scope (3 to 4):** Write the OUT-001 and OUT-003 revisits as conditions. Add FR-006 as an out-of-scope item or a non-goal.
- Cite FR-024 next to FR-022 in the non-goal about several sets.
