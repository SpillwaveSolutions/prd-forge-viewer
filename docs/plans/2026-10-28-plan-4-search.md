---
date: 2026-10-28
slug: plan-4-search
title: Plan 4: search with ranked results
epic: 01M62EBHYNFP9BW4QZRF310SYS
items: [01M62EBHZ3H52KPBDQCA3YYTVE, 01M62EBHZ3H52KPBDQCA3YYTVG, 01M62EBHZ3H52KPBDQCA3YYTVJ, 01M62EBHZ3H52KPBDQCA3YYTVM, 01M62EBHZ3H52KPBDQCA3YYTVP]
git_hash: "5ca9ad2cbc964d19c6431e739d73a399430cde41"
---

# Plan 4: search with ranked results

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task by task.

**Goal:** The developer searches the PRD set by term, in one category or in all of them, sees the matching items ranked with a score from 0 to 100, and opens one result in its section.

**Architecture:** Rust adds `search.rs`: one SQLite file for each set in the app data folder, with an FTS5 table of the items from plan 3 and a content hash for each document (ADR-003). Each search refreshes only the changed documents, then ranks with `bm25()`. The UI adds a search bar and a results list (WF-003, WF-004), and opens a result with the plan 3 `openItem`.

**Tech stack:** Plans 1 to 3, plus `rusqlite` with the `bundled` feature, which includes FTS5.

**Spec:** FR-008 (six criteria), NFR-003, WF-003, WF-004, stories US-011 and US-012, ADR-003, and the glossary terms item, item title, category, and relevance score.

## Global constraints

- All earlier constraints stay. The index is derived data: a damaged or old index file is deleted and rebuilt, never shown as an error.
- The index lives in the app data folder, never in the PRD set folder (OUT-001).
- Title matches rank above text matches (FR-008, criterion 3). The score is the best `bm25` divided by this result's `bm25`, times 100, so the best result scores 100 (ADR-003).
- A category is the document kind, such as `functional-requirements` or `scenarios`, plus "all".
- Search shows results within 0.5 seconds, p95, for this set (NFR-003).

## Review focus

1. **Search syntax in the term.** A term with `"`, `*`, `(`, or `NEAR` searches for the words and gives no SQL or FTS error. Test in task 2.
2. **A damaged index file.** The index file holds junk bytes. The next search rebuilds it and returns results. Test in task 1.
3. **A changed document.** A word added to one file is found on the next search, and the other files are not indexed again. Test in task 1.
4. **An empty term.** No query runs, and no results show. Test in task 2.
5. **Two sets.** Each set has its own index file, and results never mix. Test in task 1.

## Tasks

- [ ] (P0) Task 1: the per-set index with content hashes
  `Index::open(dir, set)` opens or rebuilds the SQLite file for one set, and `refresh()` indexes only documents whose hash changed. Tests: a damaged file is rebuilt, a changed document is found, unchanged documents are not reindexed, and two sets have two files.
- [ ] (P0) Task 2: ranked search with a category filter
  `search(term, category)` returns items ranked by `bm25()`, with title matches weighted above text, and a score from 0 to 100. Tests: all six FR-008 criteria in Rust, search syntax in the term, and an empty term.
- [ ] (P0) Task 3: the search command and its timing
  The `search` and `categories` commands use one index for each open set. Test: 20 searches on this set, each within 0.5 seconds in a release build.
- [ ] (P0) Task 4: the search bar and the results list
  A search box, a category filter, the number of matches, each result with its score, id, title, and section, and a no-match message (WF-003, WF-004). Selecting a result opens the item in its section. Tests in `bun test`.
- [ ] (P0) Task 5: MCP checks for phase 2
  `e2e/checks/phase-2-search.mjs` checks the six FR-008 criteria and NFR-003 through the tauri MCP server.
