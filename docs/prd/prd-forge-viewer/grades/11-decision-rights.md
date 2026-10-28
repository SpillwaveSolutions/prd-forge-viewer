---
doc: ../11-decision-rights.md
score: 88
blocking: 0
graded: 2026-10-27
grader: prd-forge:prd-adversary
---

# Why decision rights scored 88

| Dimension | Score | Why |
| --- | --- | --- |
| Decision coverage | 4 | All 12 stages in section 5 are in a `stages` list. |
| Approver | 4 | Each rule names one persona with matching authority. TR-012 and TR-013 give PER-002 the developer's stages. |
| Delegation stance | 3 | The body says that the viewer can offer a default, such as the last theme, but TR-004 and TR-013 do not record it. The body says "two exceptions" and names three rules. |
| Evidence | 3 | TR-001 and TR-012 propose a set, but their evidence gives no reason and no known limit. TR-005 says "every section", but its rule covers the root too. |
| Escalation | 4 | Each rule says what happens when the approver is not available or disagrees. |
| Testability | 3 | TR-005's first criterion names 17 of the 18 documents. TR-007's criterion has an instruction, and the rejection path has no criterion. The second criteria of TR-001 and TR-012 are circular. TR-013 tests no theme. |
| No design | 4 | No model, threshold, agent design, or technology. |
| Reversal | 3 | TR-001 and TR-012 do not say that the next proposal is the set the person chose. TR-005 does not show which documents cause the "Draft" mark. |

## Blocking defects

None. Every stage has a rule, every approver has authority, no never-delegated rule is delegable, and every never-delegated rule has evidence.

## How to raise the grade

- **Delegation stance (3 to 4):** Record the default theme in TR-004 and TR-013 as `agent_role: proposes`, or delete the body sentence. Make "two exceptions" match the rules named.
- **Evidence (3 to 4):** In TR-001 and TR-012, add the reason (the set open at the end of the last session) and the limit. In TR-005, write "every document, root included".
- **Testability (3 to 4):** Correct TR-005's first criterion to 16 sections. Move TR-007's second sentence out, and add a rejection criterion. Replace the circular criteria in TR-001 and TR-012. Add a theme to TR-013.
- **Reversal (3 to 4):** Say that the viewer next proposes the set the person chose. Add a TR-005 criterion that shows which documents are not at final.
