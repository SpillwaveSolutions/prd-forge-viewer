# Plan 5: live updates from the authoring tools

`01M62GWAS1QA1XNBMNG3MPNGRD` · epic/feature · **open**

Phase 3 of the release 1 completion plan.

## Children

- [[Ticket-01M62GWASEB3E2HFZ9GR8K5WEZ]] Task 1: watch the set folder — `SetWatcher::start(folder, on_change)` calls `on_change` with the changed top-level `.md` file names, at most once for each 200 ms window. (done)
- [[Ticket-01M62GWASEB3E2HFZ9GR8K5WF1]] Task 2: the watch and reload commands — `watch_set(folder)` starts the watcher and emits `set-changed`. (done)
- [[Ticket-01M62GWASEB3E2HFZ9GR8K5WF3]] Task 3: show changes in the window — On `set-changed`, the window reloads the set and the open section, keeps the selected item, marks each changed document, and shows a change notice on a changed page (FR-009, WF-002). (done)
- [[Ticket-01M62GWASEB3E2HFZ9GR8K5WF5]] Task 4: MCP checks for phase 3 — `e2e/checks/phase-3-live.mjs` changes a copy of the set while the window shows it, and checks all three FR-009 criteria and NFR-002. (done)

Progress: 4/4 done
