---
date: 2026-10-28
slug: plan-3-reading
title: Plan 3: read sections, items, and references
epic: 01M62CK37SV62AATV5XSRPCJHE
items: [01M62CK386VS7C7CQR7W0G6AA5, 01M62CK387T88WGKEFSBY44836, 01M62CK387T88WGKEFSBY44838, 01M62CK387T88WGKEFSBY4483A, 01M62CK387T88WGKEFSBY4483C, 01M62CK387T88WGKEFSBY4483E]
git_hash: "88025c36dfe68859df4a91c37ef3a56c555f8b0f"
merged_in: 5ca9ad2cbc964d19c6431e739d73a399430cde41
---

# Plan 3: read sections, items, and references

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task by task.

**Goal:** The author clicks any document and reads it, lists the items of a section, reads one item with the status and grade of its section, and follows an id in an item to the item that it names.

**Architecture:** Rust adds `prdset/items.rs` (items at any depth of the front matter, with their parent), `read_section`, `item_index`, and `read_asset`. The UI adds a section page that renders the body with `marked` and DOMPurify, loads local images through `read_asset`, and blocks remote images.

**Tech stack:** Plans 1 and 2, plus `marked`, `dompurify`, and the Rust `base64` crate.

**Spec:** FR-005, FR-023, FR-007 (`docs/prd/prd-forge-viewer/08-functional-requirements.md`), NFR-010, WF-001, WF-002, stories US-008, US-009, US-010.

## Global constraints

- All earlier constraints stay: read-only (OUT-001), no network (NFR-005, NFR-006), keyboard only (NFR-007), macOS only (OUT-003).
- No script in a PRD set runs, and no remote image loads (NFR-010). Bodies go through DOMPurify. An image with an `http` or `https` source shows its alt text only.
- `read_section` and `read_asset` read only files inside the set folder. A path with `..`, or one that resolves outside the folder, is refused.
- An item is any mapping in the front matter that has an `id` such as `FR-008` or `ST-002`, plus each glossary `term` and each change log `version`. Its title is its first field among `name`, `title`, `capability`, `statement`, `question`, `term`, `objective`, `decision`, `assumption`, `risk`, `need`, `summary`, `goal`, and `subject`.

## Review focus

1. **Path traversal.** `read_section(folder, "../x.md")` and `read_asset(folder, "../../etc/passwd")` are refused. Tests in tasks 2 and 3.
2. **A script or an event handler in a body.** `<script>` and `onerror=` never reach the page. Test in task 4.
3. **A remote image.** `![x](https://example.com/a.png)` shows "x" and makes no request. Tests in task 4 and the e2e check.
4. **An id that names nothing.** `XX-999` in a field is plain text, not a link. Test in task 5.
5. **A nested item.** ST-002 opens with "in J-001". Tests in task 1 and the e2e check.

## Tasks

- [ ] (P0) Task 1: items at any depth of the front matter
  `items_of(yaml) -> Vec<Item>` finds each mapping with an id, its title, its parent id, and its other fields as text. Tests: the personas section gives PER-001 to PER-005, ST-002 has parent J-001, FR-008's title is its capability, and a glossary term is an item.
- [ ] (P0) Task 2: read one section safely
  `read_section(dir, file)` returns the header, the body, and the items, only for a document that the root lists. Tests: the functional requirements section has 25 requirements, and `../x.md` and an unlisted file are refused.
- [ ] (P0) Task 3: the item index and local assets
  `item_index(dir)` maps each id to its file, title, and parent. `read_asset(dir, rel)` returns a data URL for an image inside the set, and refuses any path outside it. Tests: FR-004 is in the functional requirements file, ST-002 is in the journeys file, a real SVG gives `data:image/svg+xml;base64,`, and `../` is refused.
- [ ] (P0) Task 4: render a body with no scripts and no remote images
  `renderBody(markdown)` uses `marked` and DOMPurify, marks each local image for loading, and replaces each remote image with its alt text. Tests: `<script>` and `onerror` are removed, a local image gets `data-asset`, and a remote image becomes its alt text.
- [ ] (P0) Task 5: the section page, the item view, and reference links
  Each readable document in the list opens its section page (FR-005). The page lists the item ids. Selecting one shows the item with the status and grade of its section (FR-023, WF-002). A known id in an item field is a link to that item (FR-007). Tests: the five persona ids show, PER-001 shows with the section status and grade, and XX-999 is not a link.
- [ ] (P0) Task 6: MCP checks for phase 1
  `e2e/checks/phase-1-reading.mjs` checks FR-005 in one action, FR-023 with PER-001, FR-007 from FR-004 to ST-002 in J-001, a diagram that loads, and a remote image that does not load.
