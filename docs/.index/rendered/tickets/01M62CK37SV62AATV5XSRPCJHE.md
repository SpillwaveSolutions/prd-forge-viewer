# Plan 3: read sections, items, and references

`01M62CK37SV62AATV5XSRPCJHE` · epic/feature · **open**

Phase 1 of the release 1 completion plan.

## Children

- [[Ticket-01M62CK386VS7C7CQR7W0G6AA5]] Task 1: items at any depth of the front matter — `items_of(yaml) -> Vec<Item>` finds each mapping with an id, its title, its parent id, and its other fields as text. (done)
- [[Ticket-01M62CK387T88WGKEFSBY44836]] Task 2: read one section safely — `read_section(dir, file)` returns the header, the body, and the items, only for a document that the root lists. (done)
- [[Ticket-01M62CK387T88WGKEFSBY44838]] Task 3: the item index and local assets — `item_index(dir)` maps each id to its file, title, and parent. (done)
- [[Ticket-01M62CK387T88WGKEFSBY4483A]] Task 4: render a body with no scripts and no remote images — `renderBody(markdown)` uses `marked` and DOMPurify, marks each local image for loading, and replaces each remote image with its alt text. (done)
- [[Ticket-01M62CK387T88WGKEFSBY4483C]] Task 5: the section page, the item view, and reference links — Each readable document in the list opens its section page (FR-005). (open)
- [[Ticket-01M62CK387T88WGKEFSBY4483E]] Task 6: MCP checks for phase 1 — `e2e/checks/phase-1-reading.mjs` checks FR-005 in one action, FR-023 with PER-001, FR-007 from FR-004 to ST-002 in J-001, a diagram that loads, and a remote image that does not load. (open)

Progress: 4/6 done
