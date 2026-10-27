---
doc: ../08-functional-requirements.md
score: 91
blocking: 1
graded: 2026-10-26
grader: prd-forge:prd-adversary
---

# Why functional requirements scored 91

The adversarial pass scored 84 with 2 blocking defects. The FR-024 screen name is
removed, and FR-024 lists each set with its folder. One blocking defect stays.

| Dimension | Score | Why |
| --- | --- | --- |
| Test 1, named user | 4 | Every requirement names a persona that exists. |
| Test 2, visible outcome | 4 | Every outcome is something a person sees. |
| Test 3, acceptance | 3 | No rule says which wins when FR-002 and FR-024 both apply. FR-014 tests only the draft case. |
| Test 4, priority | 4 | Every requirement has a priority. All `must` items are in REL-001. |
| Test 5, no technology | 4 | The FR-024 body no longer names a screen. |
| Atomicity | 4 | One capability per requirement. |
| Traceability | 4 | Every stage and objective exists. |
| Coverage | 2 | REL-001 includes ST-008. No requirement has `journey_stage: ST-008`. |

## Blocking defects

- ST-008 (PER-002 opens the PRD) is a release-line stage with no `must` requirement.

## How to raise the grade

- **Coverage (2 to 4):** Add a `must` requirement for PER-002 at ST-008, or record that FR-001 and FR-021 serve ST-008. The PRD owner decides.
- **Test 3 (3 to 4):** Add an FR-024 criterion for a folder with two sets where one was open last session. Add an FR-014 criterion for a version where every document is final.
