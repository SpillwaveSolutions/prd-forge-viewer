---
date: 2026-10-29
slug: plan-8-closeout
title: Plan 8: close out release 1
epic: 01M64C02ZSD81X83JWRWQDVYCH
items: [01M64C03048SWRXRJ3A59AD9W0, 01M64C03048SWRXRJ3A59AD9W2, 01M64C03048SWRXRJ3A59AD9W4, 01M64C03048SWRXRJ3A59AD9W6]
git_hash: "27c246d30192bafcdec66f6725b7a328e256b61e"
merged_in: 08f38c29f8f1f9780979581e4c0034bb6ded0746
---

# Plan 8: close out release 1

**Goal:** Every release 1 requirement is built and tested, the release build is installed, the ArcKit documents show the build status, and every release 1 story is closed and synced to GitHub Issues.

**Spec:** REL-001, FR-001 to FR-024 except FR-006, NFR-001 to NFR-010, and the phase 6 task of the release 1 completion plan.

## Tasks

- [ ] (P0) Task 1: check the real print dialog
  `e2e/checks/phase-5-export.mjs` prints once with no hook, sees the macOS print panel open, and closes it with Escape.
- [ ] (P0) Task 2: install the release build
  Build the release app, check that it has no MCP bridge and no e2e hooks, and install it in /Applications with the `prdf` launcher.
- [ ] (P1) Task 3: the build status in REQ and TRAC
  Add the build and test status of each release 1 requirement, with its e2e check, to the ArcKit requirements and traceability documents.
- [ ] (P0) Task 4: close and sync
  Run every unit test and e2e check. Close the release 1 stories and the phase items, render the roadmap, and sync the closed items to GitHub Issues.
