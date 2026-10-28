---
doc: ../07-scope.md
score: 96
blocking: 0
graded: 2026-10-27
grader: prd-forge:prd-adversary
---

# Why scope scored 96

| Dimension | Score | Why |
| --- | --- | --- |
| Release line | 4 | It names J-001 ST-001 to ST-005 in the viewer and ST-006 and ST-007 outside it, each with a `workaround`. ST-007 reaches the J-001 end state. |
| Completeness of value | 4 | ST-001 to ST-005 each have an IN item, and the two outside stages say how the person does them today. |
| In-scope traceability | 3 | The stages agree with section 7. IN-008 names a developer at ST-005, whose actor is PER-001. IN-006 says "or selected sections" without FR-012. The IN-003 body row says "in the tree", and the front matter does not. IN-004 carries FR-007, but its summary does not mention following a reference. |
| Out of scope | 4 | OUT-001 has a checkable condition with an owner and a date. OUT-002 is tied to FR-025 and a date. |
| Non-goals | 4 | Six non-goals use `{statement, reason}`, and the body shows each reason. |
| Honesty | 4 | It says no to editing, grade findings in release 1, comments, and sending. |

## Blocking defects

None. The release line is one run of J-001 to its end state, every IN stage exists, `non_goals` has six entries, every must requirement has an in-scope item, and every cross-reference exists.

## How to raise the grade

- **In-scope traceability (3 to 4):** Merge IN-008 into IN-006 by adding FR-012 to IN-006, or remove "or selected sections" from IN-006 and say "that the author selects" in IN-008. Make the IN-003 body row match the front matter, without "in the tree". Add "and follow a reference to the item it names" to IN-004.
