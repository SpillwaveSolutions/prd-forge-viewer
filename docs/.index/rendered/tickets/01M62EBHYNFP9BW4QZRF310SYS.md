# Plan 4: search with ranked results

`01M62EBHYNFP9BW4QZRF310SYS` · epic/feature · **open**

Phase 2 of the release 1 completion plan.

## Children

- [[Ticket-01M62EBHZ3H52KPBDQCA3YYTVE]] Task 1: the per-set index with content hashes — `Index::open(dir, set)` opens or rebuilds the SQLite file for one set, and `refresh()` indexes only documents whose hash changed. (open)
- [[Ticket-01M62EBHZ3H52KPBDQCA3YYTVG]] Task 2: ranked search with a category filter — `search(term, category)` returns items ranked by `bm25()`, with title matches weighted above text, and a score from 0 to 100. (open)
- [[Ticket-01M62EBHZ3H52KPBDQCA3YYTVJ]] Task 3: the search command and its timing — The `search` and `categories` commands use one index for each open set. (open)
- [[Ticket-01M62EBHZ3H52KPBDQCA3YYTVM]] Task 4: the search bar and the results list — A search box, a category filter, the number of matches, each result with its score, id, title, and section, and a no-match message (WF-003, WF-004). (open)
- [[Ticket-01M62EBHZ3H52KPBDQCA3YYTVP]] Task 5: MCP checks for phase 2 — `e2e/checks/phase-2-search.mjs` checks the six FR-008 criteria and NFR-003 through the tauri MCP server. (open)

Progress: 0/5 done
