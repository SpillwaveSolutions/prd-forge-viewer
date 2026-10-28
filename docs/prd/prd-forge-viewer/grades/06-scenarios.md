---
doc: ../06-scenarios.md
score: 81
blocking: 0
graded: 2026-10-27
grader: prd-forge:prd-adversary
---

# Why scenarios scored 81

| Dimension | Score | Why |
| --- | --- | --- |
| Concreteness | 3 | SC-009 to SC-012 use real values. SC-001 step 4 gives no value for the new score. SC-005 and SC-007 give no item counts. |
| Bound to a journey | 4 | Every journey, stage, persona, and `branches_from` step exists. |
| One goal | 3 | SC-005 searches and shares under ST-009 alone. SC-011 joins the sponsor's rejection to the author's change-log entry. |
| Variant coverage | 3 | Each happy path has two unhappy paths. SC-003 is an `exception` with no failure. No scenario covers a folder with no PRD set (WF-006). |
| Outcome testability | 3 | SC-003 does not give the NFR-002 figure. "Best match first" in SC-005 has no order. SC-007 does not say what the developer can do next. |
| User's view | 3 | Some steps are system events (SC-003, SC-007, SC-012), and no step uses the "They" form. SC-001 to SC-008 link no wireframes. |
| First use, return and concurrency | 4 | SC-009 is first use, SC-006 is return, and SC-003 is concurrent. |
| Lifecycle | 3 | LC-001 has a rule and an actor for each move, but no move from review back to draft after a lower regrade. Only SC-006 names LC-001. Custom themes (FR-016 to FR-018) have no scenario. |
| Priority | 3 | Every must is on the release line. SC-004 is must, but it depends on FR-011 and FR-019, which are should. |

## Blocking defects

None.

## How to raise the grade

- **User's view (3 to 4):** Start each step with "They". Move system events into the trigger or the context. Add `shown_in` and `wireframes` to SC-001 to SC-008.
- **Lifecycle (3 to 4):** Add a review-to-draft move after a regrade under 70 or with a blocking defect. Name LC-001 from SC-010 and SC-011. Add a scenario where the author makes, changes, and deletes a custom theme.
- **Outcome testability (3 to 4):** Write "within 2 seconds of the save (NFR-002)" in SC-003. Name the matches and their order in SC-005. Say what the developer can do next in SC-007.
- **Priority (3 to 4):** Make SC-004 should, or raise FR-011 and FR-019 to must.
- **Variant coverage (3 to 4):** Make SC-003 an alternate, or give it a real failure. Add an exception for prdf in a folder with no PRD set.
- **One goal (3 to 4):** Give SC-005 `stages: [ST-009, ST-010]`. End SC-011 when the author receives the rejection.
- **Concreteness (3 to 4):** Give the new score in SC-001 and the item counts in SC-005 and SC-007.
