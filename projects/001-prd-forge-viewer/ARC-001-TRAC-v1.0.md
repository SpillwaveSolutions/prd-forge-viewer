# Requirements traceability matrix: PRD Forge Viewer

> **Template Origin**: Official | **ArcKit Version**: 6.18.3 | **Command**: `/arckit:traceability`

## Document control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-001-TRAC-v1.0 |
| **Document Type** | Requirements Traceability Matrix |
| **Project** | PRD Forge Viewer (Project 001) |
| **Classification** | PUBLIC |
| **Status** | DRAFT |
| **Version** | 1.0 |
| **Created Date** | 2026-10-26 |
| **Last Modified** | 2026-10-29 |
| **Review Cycle** | On-Demand |
| **Next Review Date** | 2026-11-25 |
| **Owner** | Richard Hightower, PRD owner |
| **Reviewed By** | [PENDING] |
| **Approved By** | [PENDING] |
| **Distribution** | Project Team, Architecture Team |

## Revision history

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| 1.0 | 2026-10-26 | ArcKit AI | Initial creation from `/arckit:traceability` command | [PENDING] | [PENDING] |
| 1.0 | 2026-10-26 | ArcKit AI | Regenerated for PRD 0.3.2, ADR v1.1, and HLDR v1.1 | [PENDING] | [PENDING] |
| 1.0 | 2026-10-27 | ArcKit AI | Updated for PRD 0.4.0: FR-023 restated, the ST-008 gap closed because ST-008 is not on the release line | [PENDING] | [PENDING] |
| 1.0 | 2026-10-27 | ArcKit AI | Updated for PRD 0.5.0: nine requirements to SHOULD_HAVE, FR-025 added for REL-002 | [PENDING] | [PENDING] |
| 1.0 | 2026-10-28 | ArcKit AI | Updated for PRD 0.6.1: C-001, C-002, and C-004 retired, NFR-008 extended, release 1 on 2026-11-06 | [PENDING] | [PENDING] |
| 1.0 | 2026-10-29 | ArcKit AI | Build status for release 1: FR-001 to FR-024 except FR-006 built and tested by the tauri MCP checks in `e2e/checks/` | [PENDING] | [PENDING] |

## Document purpose

This matrix traces each requirement in `ARC-001-REQ-v1.0.md` to the design:
ADR-001 to ADR-005, DIAG-001 to DIAG-004, the data model (E-001 to E-007), and
the HLD review findings. A script computed the design references from the
documents. No code and no tests exist yet, so every implementation and test
column shows the planned test.

---

## 1. overview

### 1.1 purpose

- Show that each requirement has a design answer.
- Name the planned test for each requirement.
- Report orphans and gaps before the build starts.

### 1.2 traceability scope

| Layer | Source | State |
|-------|--------|-------|
| Requirements | `ARC-001-REQ-v1.0.md`, 54 requirements | Draft |
| Design | ADR-001 to ADR-005, DIAG-001 to DIAG-004, DATA, HLDR | Draft, Proposed |
| Implementation | None | Not started |
| Tests | Named in the ADRs and the REQ acceptance criteria | Planned |

### 1.3 document references

- `ARC-001-REQ-v1.0.md`
- `ARC-001-DATA-v1.0.md`
- `decisions/ARC-001-ADR-001-v1.0.md` to `ARC-001-ADR-005-v1.0.md`
- `diagrams/ARC-001-DIAG-001-v1.0.md` to `ARC-001-DIAG-004-v1.0.md`
- `vendors/internal/ARC-001-HLDR-v1.1.md`

---

## 2. traceability matrix

### 2.1 forward traceability: requirements → design → tests

"Design references" lists each design document that names the requirement, or a
range that holds it. "HLDR" is the HLD review finding that applies.

| Req ID | Requirement | Priority | Design component | Design references | HLDR | Planned test | Status |
|--------|-------------|----------|------------------|-------------------|------|--------------|--------|
| BR-001 | Stakeholders give feedback on a PRD version sooner | MUST_HAVE | All release 1 containers | ADR-002, ADR-003, ADR-004, ADR-005 |  | Baseline about 10 days from the historic PRDs (Q-001, answered) | ⏳ Planned |
| BR-002 | No version reaches a stakeholder with a blocking defect | MUST_HAVE | Export assembly layer (grades in export) | ADR-002 |  | Read grades of each version sent | ⏳ Planned |
| BR-003 | Deliver the two releases on their dates | MUST_HAVE | Not a design element | ADR-001, ADR-002, ADR-003, HLDR | ADV-07 (closed) | Release date check | ⏳ Planned |
| FR-001 | Open a PRD set and see its contents | MUST_HAVE | Set reader, Web UI tree | ADR-001, DATA, DIAG-001, DIAG-002, DIAG-003, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/plans-1-2.mjs`, `e2e/checks/phase-2-search.mjs` |
| FR-002 | Return to the same PRD set in the next session | SHOULD_HAVE | Settings store, Change watcher | ADR-001, ADR-004, ADR-005, DATA, DIAG-001, DIAG-002, DIAG-003, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/plans-1-2.mjs`, `e2e/checks/phase-2-search.mjs` |
| FR-003 | Open a PRD set that has incomplete or unreadable documents | MUST_HAVE | Set reader | ADR-001, ADR-005, DATA, DIAG-001, DIAG-002, DIAG-003, DIAG-004, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/plans-1-2.mjs` |
| FR-004 | See the grades of all sections together | MUST_HAVE | Web UI grade view | ADR-001, DATA, DIAG-001, DIAG-002, DIAG-003, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/plans-1-2.mjs`, `e2e/checks/phase-1-reading.mjs` |
| FR-005 | Go directly to any section | MUST_HAVE | Web UI tree | ADR-001, ADR-003, DATA, DIAG-001, DIAG-002, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-1-reading.mjs` |
| FR-006 | Move to the previous or the next section in reading order | WONT_HAVE | None (WONT_HAVE) | ADR-001, DIAG-001, HLDR |  | Acceptance criteria in REQ | ➖ Not delivered |
| FR-007 | Follow a reference from one item to the item it names | SHOULD_HAVE | Set reader, Web UI | ADR-001, ADR-003, DATA, DIAG-001, DIAG-002, DIAG-003, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-1-reading.mjs` |
| FR-008 | Search the PRD set by term, in one or more categories or in all categories | MUST_HAVE | Search index | ADR-001, ADR-003, DATA, DIAG-001, DIAG-002, DIAG-003, HLDR | ADV-08 (closed) | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-2-search.mjs` |
| FR-009 | See changes that the authoring tools make, without any action | MUST_HAVE | Change watcher, Set reader | ADR-001, ADR-005, DATA, DIAG-001, DIAG-002, DIAG-003, DIAG-004, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-3-live.mjs` |
| FR-010 | Export the PRD set as a fixed-layout document (IN-006) | MUST_HAVE | HTML to PDF writer, Export saver | ADR-001, ADR-002, DIAG-001, DIAG-002, DIAG-003, HLDR | BLOCKING-01 (closed) | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-5-export.mjs` |
| FR-011 | Export the PRD set as an editable document (IN-006) | SHOULD_HAVE | Web UI Word writer, Export saver | ADR-001, ADR-002, DIAG-001, DIAG-002, DIAG-003, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-5-export.mjs` |
| FR-012 | Export only selected sections | MUST_HAVE | Export assembly layer | ADR-001, ADR-002, ADR-003, DIAG-001, DIAG-002, DIAG-003, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-5-export.mjs` |
| FR-013 | Print the PRD set or selected sections | SHOULD_HAVE | Web UI, OS print service | ADR-001, ADR-002, DATA, DIAG-001, DIAG-002, HLDR | ADV-06 | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-5-export.mjs` |
| FR-014 | See the version of the PRD, and if it is a draft, in an export | MUST_HAVE | Export assembly layer | ADR-001, ADR-002, DATA, DIAG-001, DIAG-002, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-5-export.mjs` |
| FR-015 | Select an export theme from the built-in themes | MUST_HAVE | Motion themes | ADR-001, ADR-002, DATA, DIAG-001, DIAG-002, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-4-themes.mjs`, `e2e/checks/phase-5-export.mjs` |
| FR-016 | Make a custom export theme | SHOULD_HAVE | Theme dialogs, Settings store | ADR-001, ADR-002, DATA, DIAG-001, DIAG-002, DIAG-003, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-4-themes.mjs`, `e2e/checks/phase-5-export.mjs` |
| FR-017 | Change a custom export theme | SHOULD_HAVE | Theme dialogs, Settings store | ADR-001, ADR-002, DATA, DIAG-001, DIAG-002, DIAG-003, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-4-themes.mjs` |
| FR-018 | Delete a custom export theme | SHOULD_HAVE | Theme dialogs, Settings store | ADR-001, ADR-002, DATA, DIAG-001, DIAG-002, DIAG-003, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-4-themes.mjs` |
| FR-019 | See the status of every section in an export, and the grades when included | SHOULD_HAVE | Export assembly layer | ADR-001, ADR-002, DATA, DIAG-001, DIAG-002, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-5-export.mjs` |
| FR-020 | Keep custom export themes from one session to the next | SHOULD_HAVE | Settings store | ADR-001, ADR-002, DATA, DIAG-001, DIAG-002, DIAG-003, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-4-themes.mjs` |
| FR-021 | Start the viewer from a terminal with the command prdf | MUST_HAVE | prdf launcher, Instance handler | ADR-001, ADR-004, DATA, DIAG-001, DIAG-002, DIAG-003, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/plans-1-2.mjs` |
| FR-022 | Choose a PRD set from the locations the viewer remembers | SHOULD_HAVE | Settings store, Web UI | ADR-001, ADR-004, DATA, DIAG-001, DIAG-002, DIAG-003, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/plans-1-2.mjs` |
| FR-023 | Select one item of a section and read it without the whole section | MUST_HAVE | Web UI tree, Set reader | ADR-001, DATA, DIAG-001, DIAG-002, HLDR |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-1-reading.mjs` |
| FR-024 | Choose one PRD set when the docs/prd folder holds more than one | SHOULD_HAVE | prdf launcher, Web UI set list | ADR-001, ADR-004, DIAG-001, HLDR | ADV-02 (closed) | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/plans-1-2.mjs` |
| FR-025 | See the findings behind the grade of a section | WONT_HAVE (REL-002) | Set reader, Web UI grade view | DATA |  | Acceptance criteria in REQ | ⏳ Planned |
| FR-026 | Make the text larger or smaller | SHOULD_HAVE (REL-002) | Web UI, Settings store | ADR-001, ADR-004 |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-1-reading.mjs` |
| FR-027 | Keep search results in view while reading the items they find | SHOULD_HAVE (REL-002) | Web UI search drawer | ADR-001, ADR-003 |  | Acceptance criteria in REQ | ✅ Built and tested: `e2e/checks/phase-2-search.mjs` |
| FR-028 | Move between a requirement and the backlog stories that build it | SHOULD_HAVE (REL-002) | Set reader, Web UI | ADR-001 |  | Acceptance criteria in REQ | ⏳ Planned |
| NFR-P-001 | Open a PRD set | MUST_HAVE | Set reader, Search index | ADR-001, ADR-003, ADR-004, DIAG-001, DIAG-002, DIAG-003, DIAG-004, HLDR |  | Perf: open 18-document fixture, p95 | ✅ Tested: `plans-1-2.mjs`, 850 ms to first paint with app start |
| NFR-P-002 | Show a change from the authoring tools | MUST_HAVE | Change watcher | ADR-001, ADR-003, ADR-005, DATA, DIAG-001, DIAG-002, DIAG-003, DIAG-004, HLDR |  | Perf: 20 saves, screen recording, 19th fastest | ✅ Tested: `phase-3-live.mjs`, p95 621 ms over 20 saves |
| NFR-P-003 | Search response time | MUST_HAVE | Search index | ADR-001, ADR-003, DATA, DIAG-001, DIAG-002, DIAG-003, DIAG-004, HLDR |  | Perf: search 18-document fixture, p95 | ✅ Tested: `phase-2-search.mjs`, p95 55 ms over 20 searches |
| NFR-P-004 | Export time | MUST_HAVE | Export writers | ADR-001, ADR-002, DATA, DIAG-001, DIAG-002, DIAG-003, DIAG-004, HLDR |  | Perf: whole-set export, p95 | ✅ Tested: `phase-5-export.mjs`, p95 about 1.0 s over 20 exports |
| NFR-A-001 | Works without a network | MUST_HAVE | Whole app, no network | ADR-001, DIAG-001, DIAG-002, DIAG-003, DIAG-004, HLDR |  | Acceptance suite with the network off | ⏳ Planned |
| NFR-A-002 | Custom themes, known locations, and the last set survive a restart | MUST_HAVE | Settings store | ADR-002, ADR-004, DATA, DIAG-001, DIAG-002, DIAG-003, DIAG-004, HLDR |  | Restart test with custom themes, known locations, and the last set | ✅ Tested: `phase-4-themes.mjs` and `plans-1-2.mjs` restarts |
| NFR-A-003 | Fault tolerance for unreadable documents | MUST_HAVE | Set reader | DIAG-001, DIAG-002, DIAG-003, DIAG-004, HLDR |  | Acceptance criteria in REQ | ✅ Tested: `plans-1-2.mjs` (FR-003) |
| NFR-SEC-001 | No PRD content leaves the computer | MUST_HAVE | Whole app, no network | ADR-001, DATA, DIAG-001, DIAG-002, DIAG-003, DIAG-004, HLDR |  | Acceptance criteria in REQ | ⏳ Planned |
| NFR-SEC-002 | The viewer does not change the PRD set | MUST_HAVE | Command handler, Export saver, capabilities | ADR-001, ADR-003, ADR-004, ADR-005, DATA, DIAG-001, DIAG-002, DIAG-003, DIAG-004, HLDR |  | Checksum of every set file before and after | 🟡 Partly tested: no new file in the set (`phase-3-live.mjs`), exports refused in the set (`phase-5-export.mjs`); no checksum run |
| NFR-SEC-003 | Only local content shows | MUST_HAVE | CSP, sanitized rendering, SVG as image | ADR-001, DIAG-001, DIAG-002, DIAG-003, DIAG-004, HLDR | ADV-01 (closed), ADV-05 | Hostile fixture: script, remote image, SVG | 🟡 Partly tested: remote image blocked (`phase-1-reading.mjs`); no full hostile fixture |
| NFR-U-001 | Keyboard-only use | MUST_HAVE | Web UI | ADR-001, HLDR | ADV-04 | Keyboard-only run of every acceptance criterion | 🟡 Partly tested: keyboard checks in `plans-1-2.mjs` and `phase-4-themes.mjs`; no full keyboard audit |
| NFR-U-002 | Exports readable by a screen reader | SHOULD_HAVE | Export writers | ADR-002, HLDR | BLOCKING-01 (closed) | PDF and .docx accessibility check, screen reader; picks the PDF engine | 🟡 Partly tested: structure checks in `phase-5-export.mjs`; no reader checker run; PDF engine chosen (ADR-002) |
| NFR-I-001 | PRD Forge format version 1 | MUST_HAVE | Set reader | DATA, DIAG-003, HLDR |  | Acceptance criteria in REQ | ⏳ Planned |
| NFR-I-002 | Standard export formats | MUST_HAVE | Export writers | ADR-002, HLDR |  | Acceptance criteria in REQ | ⏳ Planned |
| NFR-I-003 | Release 1 platform | MUST_HAVE | macOS release package | HLDR | ADV-03 (closed) | Acceptance suite on the macOS test computer | ⏳ Planned |
| INT-001 | Integration with the PRD Forge authoring tools | MUST_HAVE | Set reader, Change watcher | ADR-005, DATA, DIAG-001, DIAG-004, HLDR |  | Acceptance criteria in REQ | ⏳ Planned |
| INT-002 | Integration with the terminal (`prdf`) | MUST_HAVE | prdf launcher | ADR-004, DATA, DIAG-001, HLDR |  | Acceptance criteria in REQ | ⏳ Planned |
| INT-003 | Integration with PDF readers | MUST_HAVE | PDF writer, Export saver | DATA, DIAG-001, HLDR |  | Acceptance criteria in REQ | ⏳ Planned |
| INT-004 | Integration with word processors (.docx) | MUST_HAVE | Word writer, Export saver | DATA, DIAG-001, HLDR |  | Acceptance criteria in REQ | ⏳ Planned |
| INT-005 | Integration with the operating system print service | SHOULD_HAVE | Web UI print path (not in DIAG-003) | DATA, DIAG-001, HLDR | ADV-06 | Acceptance criteria in REQ | ⏳ Planned |
| DR-001 | PRD set | UNSPECIFIED | E-001 | DATA |  | Fixture set loads, DATA quality metrics | ⏳ Planned |
| DR-002 | Document | UNSPECIFIED | E-002 | DATA |  | Fixture set loads, DATA quality metrics | ⏳ Planned |
| DR-003 | Item | UNSPECIFIED | E-003 | DATA |  | Fixture set loads, DATA quality metrics | ⏳ Planned |
| DR-004 | Grade findings | UNSPECIFIED | E-004 | DATA |  | Fixture set loads, DATA quality metrics | ⏳ Planned |
| DR-005 | Known location | UNSPECIFIED | E-005 | DATA |  | Fixture set loads, DATA quality metrics | ⏳ Planned |
| DR-006 | Search index entry | UNSPECIFIED | E-006 | DATA |  | Fixture set loads, DATA quality metrics | ⏳ Planned |
| DR-007 | Export theme | UNSPECIFIED | E-007 | DATA |  | Fixture set loads, DATA quality metrics | ⏳ Planned |

**Status key**: ⏳ Planned = design exists, no code. ⚠️ Blocked = an open blocking
HLD finding applies. ❌ Gap = no design reference. ➖ Not delivered = WONT_HAVE.

### 2.2 backward traceability: tests → design → requirements

The tauri MCP checks in `e2e/checks/` drive the real app and read its files.
Run them with `bun run test:e2e`. The unit tests run with `cargo test` and
`bun test src`.

| Test file | Design element | Requirements |
|-----------|----------------|--------------|
| `plans-1-2.mjs` | Set reader, Settings store, `prdf` launcher, Web UI grade view | FR-001 to FR-004, FR-021, FR-022, FR-024, NFR-001, NFR-007 |
| `phase-1-reading.mjs` | Set reader, Web UI tree, sanitized rendering | FR-004, FR-005, FR-007, FR-023, NFR-010 |
| `phase-2-search.mjs` | Search index | FR-001, FR-002, FR-008, NFR-003 |
| `phase-3-live.mjs` | Change watcher | FR-009, NFR-002, OUT-001 |
| `phase-4-themes.mjs` | Motion themes, Theme dialogs, Settings store | FR-015 to FR-018, FR-020, NFR-007 |
| `phase-5-export.mjs` | Export assembly layer, HTML to PDF writer, Word writer, Export saver | FR-010 to FR-016, FR-019, TR-005, TR-007, TR-010, NFR-004, NFR-009, OUT-001 |

Planned test groups that have no run yet: the network-off run (NFR-A-001,
NFR-SEC-001), the checksum test (NFR-SEC-002), the full hostile fixture
(NFR-SEC-003), the full keyboard audit (NFR-U-001), and a reader's
accessibility checker on each export (NFR-U-002).

---

## 3. coverage analysis

### 3.1 requirements coverage summary

Design coverage, by category. WONT_HAVE requirements are left out.

| Category | Total | Covered | Not covered | Coverage |
|----------|-------|---------|-------------|----------|
| Business | 3 | 3 | 0 | 100% |
| Functional | 23 | 23 | 0 | 100% |
| Non-functional | 15 | 15 | 0 | 100% |
| Integration | 5 | 5 | 0 | 100% |
| Data | 7 | 7 | 0 | 100% |
| **All** | 53 | 53 | | **100%** |

By MoSCoW priority:

| Priority | Total | Covered | Coverage |
|----------|-------|---------|----------|
| MUST_HAVE | 42 | 42 | 100% |
| SHOULD_HAVE | 4 | 4 | 100% |
| UNSPECIFIED | 7 | 7 | 100% |

Requirements with priority UNSPECIFIED: DR-001, DR-002, DR-003, DR-004, DR-005, DR-006, DR-007. The REQ document gives the
data entities no priority line. This is a gap in the REQ document, not in the
design.

### 3.2 design coverage

| Design element | Requirements traced |
|----------------|---------------------|
| ADR-001 Tauri app | All FRs run in this shell. NFR-A-001, NFR-SEC-001 to NFR-SEC-003, NFR-U-001, NFR-I-003 |
| ADR-002 Export | FR-010 to FR-020, NFR-P-004, NFR-U-002, NFR-I-002 |
| ADR-003 Search | FR-007, FR-008, NFR-P-003 |
| ADR-004 `prdf` and settings | FR-002, FR-021, FR-022, FR-024, NFR-A-002, INT-002 |
| ADR-005 File changes | FR-002, FR-009, NFR-P-002, INT-001 |
| DATA E-001 to E-007 | DR-001 to DR-007 |

### 3.3 test coverage

Implementation coverage: 23 of 23 release 1 functional requirements are built.
Each has a passing tauri MCP check (section 2.2). FR-025 is in release 2.

---

## 4. gap analysis

### 4.1 requirements without design

| Req ID | Requirement | Priority | Reason |
|--------|-------------|----------|--------|
| None | | | |

### 4.2 requirements without tests

Every release 1 functional requirement has a run test. These non-functional
requirements have no full run yet:

- NFR-A-001 and NFR-SEC-001: no network-off run.
- NFR-SEC-002: no checksum run. The e2e checks confirm that no file is added to the set and that an export into the set is refused.
- NFR-SEC-003: no full hostile fixture. The e2e checks confirm that a remote image does not load.
- NFR-U-001: no full keyboard audit (HLDR ADV-04).
- NFR-U-002: no reader's accessibility checker was available. The PDF engine is chosen (ADR-002), and the structure checks pass.

### 4.3 design components without requirements

| Design element | Note |
|----------------|------|
| `mcp-bridge` test feature (ADR-001) | Test tool only. Not in release builds. Supports principle 15 |
| Last-session file state in the settings file (ADR-005) | Supports FR-002. Not a new requirement |
| Export saver path check (DIAG-003) | Supports NFR-SEC-002 |

No design element exists without a requirement or principle behind it.

---

## 5. Non-Functional requirements traceability

### 5.1 performance requirements

| NFR | Target | Design | Test |
|-----|--------|--------|------|
| NFR-P-001 | Open, p95 at most 2 s | Rust reader, index after first view (ADR-003) | Perf test |
| NFR-P-002 | Change, p95 at most 2 s | OS events, debounce (ADR-005) | 20 saves, screen recording |
| NFR-P-003 | Search, p95 at most 0.5 s | SQLite FTS5 BM25 (ADR-003) | Perf test |
| NFR-P-004 | Export, p95 at most 10 s | Export writers (ADR-002) | Perf test |

### 5.2 security requirements

| NFR | Design | Test |
|-----|--------|------|
| NFR-SEC-001 | No network use (ADR-001) | Network monitor during open, search, export |
| NFR-SEC-002 | Capabilities, Command handler, Export saver | Checksum test |
| NFR-SEC-003 | CSP, sanitized rendering, SVG as image (HLDR ADV-05) | Hostile fixture |

### 5.3 availability & resilience

| NFR | Design | Test |
|-----|--------|------|
| NFR-A-001 | No network element | Network-off run |
| NFR-A-002 | Atomic settings write (ADR-004) | Restart test |
| NFR-A-003 | Per-document load (DIAG-003) | FR-003 acceptance |

### 5.4 compliance requirements

No regulation applies. NFR-I-001 (format version 1) and NFR-I-002 (PDF and
.docx) are traced in section 2.1.

---

## 6. change impact analysis

### 6.1 requirement changes

| Change | Impact |
|--------|--------|
| FR-006 dropped on 2026-10-26 | No design element. None needed |
| FR-024 added: choose one of several sets (HLDR ADV-02) | ADR-004, launcher, Web UI |
| C-004 added: macOS only (HLDR ADV-03) | ADR-001, NFR-I-003 |
| NFR-010 added: only local content (HLDR ADV-01) | NFR-SEC-003 now has a PRD source |
| Release 1 moved to 2026-10-27 (HLDR ADV-07) | BR-003 |
| C-001, C-002, and C-004 retired to IN-006, OUT-001, and OUT-003 (PRD 0.6.0) | NFR-SEC-002, NFR-I-003, FR-010, FR-011 |
| Release 1 moved to 2026-11-06 (PRD 0.6.1) | BR-003 |
| SQLite index (HLDR ADV-08) | ADR-003, E-006 |

---

## 7. Metrics and KPIs

### 7.1 traceability metrics

| Metric | Value |
|--------|-------|
| Requirements traced to design, excluding WONT_HAVE | 53 of 53 (100%) |
| Requirements with a planned test | All covered requirements |
| Requirements implemented | 0 |
| Requirements tested | 0 |
| Blocking HLD findings on requirements | None open |

### 7.2 coverage trends

First run. No trend yet.

---

## 8. action items

### 8.1 gap resolution

| Gap | Action | Owner |
|-----|--------|-------|
| PDF print engine | Pick it with the NFR-U-002 test | Engineering lead |
| DR priorities UNSPECIFIED | Add a priority line to each data entity in the REQ document | PRD owner |
| FR-013, INT-005 print path | Add to the DLD | Engineering lead |

### 8.2 orphan resolution

See section 4.1. Resolve each orphan before the build of its feature starts.

---

## 9. review and approval

### 9.1 review checklist

- [x] Every requirement in REQ appears in the matrix.
- [x] FR-006 shows as WONT_HAVE.
- [x] Coverage computed from the documents by script.
- [ ] Tests linked to code (no code yet).

### 9.2 approval

| Role | Name | Decision | Date |
|------|------|----------|------|
| PRD owner | Richard Hightower | [PENDING] | [PENDING] |

---

## 10. appendices

### Appendix a: full requirements list

See `ARC-001-REQ-v1.0.md`.

### Appendix B: design documents

See section 1.3.

### Appendix C: test plan

No test plan document exists. Section 2.2 lists the planned test groups.

### Appendix D: traceability tools

A script read the REQ document and searched the design documents for each ID
and each ID range.

## External references

### Document register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| PFVP | prd-forge-viewer-prd.pdf | PRD | `projects/001-prd-forge-viewer/external/` | The PRD, version 0.6.1 |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| PFVP-C1 | PFVP | Section 7, FR-006 | Scope | Dropped on 2026-10-26 by the PRD owner: the tree (FR-005, FR-023) moves the author to any section. |

### Unreferenced documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| README.md | `projects/001-prd-forge-viewer/external/` | Describes the PDF |

---

**Generated by**: ArcKit `/arckit:traceability` command
**Generated on**: 2026-10-28
**ArcKit Version**: 6.18.3
**Project**: PRD Forge Viewer (Project 001)
**Model**: claude-opus-5-5
**Generation Context**: ARC-001-REQ-v1.0, ADR-001 to ADR-005, DIAG-001 to DIAG-004, ARC-001-DATA-v1.0, ARC-001-HLDR-v1.0.
