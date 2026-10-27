# High-level design (HLD) review: PRD Forge Viewer

> **Template Origin**: Official | **ArcKit Version**: 6.18.3 | **Command**: `/arckit:hld-review`

## Document control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-001-HLDR-v1.1 |
| **Document Type** | High-Level Design Review |
| **Project** | PRD Forge Viewer (Project 001) |
| **Classification** | PUBLIC |
| **Status** | APPROVED |
| **Version** | 1.1 |
| **Created Date** | 2026-10-26 |
| **Last Modified** | 2026-10-26 |
| **Review Cycle** | On-Demand |
| **Next Review Date** | 2026-11-25 |
| **Owner** | Richard Hightower, PRD owner |
| **Reviewed By** | Richard Hightower, PRD owner and engineering lead |
| **Approved By** | Richard Hightower, PRD owner |
| **Distribution** | Project Team, Architecture Team |

## Revision history

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| 1.0 | 2026-10-26 | ArcKit AI | Initial creation from `/arckit:hld-review` command | [PENDING] | [PENDING] |
| 1.1 | 2026-10-26 | ArcKit AI | PRD owner decisions on BLOCKING-01, BLOCKING-02, ADV-01, ADV-02, ADV-03, ADV-07, and ADV-08. Signed off | Richard Hightower | 2026-10-26 |

## Document purpose

This review checks the high-level design of the PRD Forge Viewer before the
build starts. There is no vendor HLD. The design under review is ADR-001 to
ADR-005, diagrams DIAG-001 to DIAG-004, and the data model. The review checks it
against `ARC-000-PRIN-v1.0.md` and `ARC-001-REQ-v1.0.md`.

The same session that wrote the design wrote this review. Richard Hightower
signs as PRD owner and as engineering lead. No independent engineering check
took place (stakeholder risk SR-3).

Version 1.1 records the PRD owner decisions of 2026-10-26 (section 11).

---

## 1. executive summary

### 1.1 overall assessment

**Status: APPROVED.** Both blocking items are closed. The PRD owner decided the
PDF writer and confirmed the Motion license on 2026-10-26.

- **Coverage**: All 23 release 1 functional requirements (FR-001 to FR-024, except FR-006) map to a container and a component. All 15 NFRs have a design answer.
- **Principles**: 16 of 16 comply. Motion has an MIT LICENSE file (commit 6a159c0). Principle 16 now has one platform, macOS (C-004).
- **Biggest risk**: Release 1 is due 2026-10-27. No code exists.

### 1.2 key strengths

- Read-only access is enforced at the platform level (Tauri capabilities) and in one component (Command handler). C-002 and NFR-SEC-002 hold by design.
- The file contract with the authoring tools is the only integration (principle 9).
- The search index is a derived cache. The viewer rebuilds it from the files (principle 6).
- NFR-SEC-003 is now a PRD requirement (NFR-010).

### 1.3 key concerns

- The release 1 date (2026-10-27) leaves one day for the build. BR-003 is at risk.
- The PDF print engine on macOS is not chosen yet. The NFR-U-002 test decides it (ADR-002).
- The sponsor approved PRD version 0.3.2. Functional requirements stay at draft with one blocking defect: ST-008 has no `must` requirement.

### 1.4 conditions for approval

None open. ADV-04 to ADV-06 are build tasks for the engineering lead.

### 1.5 recommendation

Start the build. Record the PDF engine choice in ADR-002 after the first NFR-U-002 test.

---

## 2. review overview

### 2.1 purpose

Gate the build. Check principle compliance, requirement coverage, and quality.

### 2.2 HLD document under review

| Document | Version |
|----------|---------|
| `decisions/ARC-001-ADR-001-v1.1.md` to `ARC-001-ADR-005-v1.1.md` | 1.1, Accepted |
| `diagrams/ARC-001-DIAG-001-v1.0.md` to `ARC-001-DIAG-004-v1.0.md` | 1.0 |
| `ARC-001-DATA-v1.0.md` | 1.0 |

### 2.3 review participants

| Role | Name |
|------|------|
| Reviewer | ArcKit AI (same session as the design author) |
| Decider | Richard Hightower, PRD owner |
| Engineering lead | Richard Hightower. No independent check |

### 2.4 review criteria

- The 16 principles in `ARC-000-PRIN-v1.0.md`.
- The requirements in `ARC-001-REQ-v1.0.md`: 3 BR, 23 FR in release 1, 15 NFR, 5 INT, 7 DR.

---

## 3. architecture principles compliance

### 3.1 principle compliance checklist

| # | Principle | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Local first, no server | ✅ Compliant | DIAG-001: no network element. ADR-001 |
| 2 | Read-only on the PRD set | ✅ Compliant | Capabilities, Command handler, Export saver refuses set paths |
| 3 | Fail visibly, one document at a time | ✅ Compliant | Set reader marks unreadable files. DIAG-004 error branch |
| 4 | Security by design for a local reader | ✅ Compliant | CSP with no remote source, NFR-SEC-003 (PRD NFR-010). See finding ADV-05 |
| 5 | Free and open source | ✅ Compliant | Motion is MIT licensed. LICENSE file committed 2026-10-26 |
| 6 | Single source of truth | ✅ Compliant | SQLite index is a derived cache, rebuilt from files (ADR-003) |
| 7 | Format fidelity, version 1 | ✅ Compliant | Set reader reads front matter. Unknown fields kept (DATA) |
| 8 | No personal data | ✅ Compliant | DATA: 0 PII attributes |
| 9 | Files are the only contract | ✅ Compliant | INT-001 is file-based |
| 10 | Standard export formats | ✅ Compliant | PDF and .docx writers (ADR-002) |
| 11 | Performance targets | ✅ Compliant | Design answer for NFR-P-001 to NFR-P-004. Evidence due in tests |
| 12 | Accessible | ✅ Compliant | Tagged PDF from HTML (ADR-002). Evidence due in the NFR-U-001 and NFR-U-002 tests |
| 13 | Honest status | ✅ Compliant | Export assembly adds draft mark and grades. Missing grades show as missing |
| 14 | Maintainable, recorded decisions | ✅ Compliant | 5 ADRs, one module per responsibility (DIAG-003) |
| 15 | Automated tests on fixture sets | ✅ Compliant | Fixtures listed in DATA. Tests named in each ADR |
| 16 | Reproducible builds and releases | ✅ Compliant | macOS only (C-004). Developer ID signing (ADR-001) |

### 3.2 principle compliance details

#### Principle 5: Free and open source

The GitHub API returns no license for `SpillwaveSolutions/motion` [WEB-1-C1]. The
author, Richard Hightower, states that Motion is MIT licensed [WEB-1-C2].
The MIT LICENSE file was committed on 2026-10-26 (commit 6a159c0).

#### Principle 12: Accessible

ADR-002 v1.1 writes the PDF from themed HTML, which can embed fonts and write a
tagged PDF. **Action**: the NFR-U-002 test picks the print engine. ADV-04 covers
the UI.

#### Principle 16: Reproducible builds and releases

Release 1 runs on macOS only (C-004). One web engine (WebKit) and one signing
certificate apply.

---

## 4. requirements coverage analysis

### 4.1 functional requirements coverage

| FR | Covered by | Status |
|----|-----------|--------|
| FR-001 Open a set | Set reader, Web UI tree | ✅ |
| FR-002 Same set next session | Settings store (last open, last-session state), Change watcher | ✅ |
| FR-003 Unreadable documents | Set reader marks with name and reason | ✅ |
| FR-004 All grades together | Web UI grade view from E-002 | ✅ |
| FR-005 Go to any section | Web UI tree | ✅ |
| FR-006 Previous and next | WONT_HAVE | Not designed, as intended |
| FR-007 Follow a reference | Set reader (E-003 references), Web UI | ✅ |
| FR-008 Search | Search index, SQLite FTS5 BM25 (ADR-003) | ✅ |
| FR-009 Changes without action | Change watcher (ADR-005, DIAG-004) | ✅ |
| FR-010 PDF export | HTML to PDF writer, Export saver | ✅ |
| FR-011 Word export | Motion Word writer, Export saver | ✅ |
| FR-012 Selected sections | Export assembly layer | ✅ |
| FR-013 Print | Web UI, OS print service (INT-005) | ⚠️ No component in DIAG-003. ADV-06 |
| FR-014 Version and draft | Export assembly layer (BC-3) | ✅ |
| FR-015 Built-in themes | Motion themes: Ice Snowstorm, Clay | ✅ |
| FR-016 to FR-018 Custom themes | Motion theme dialogs, Settings store | ✅ |
| FR-019 Status and score in export | Export assembly layer | ✅ |
| FR-020 Themes kept | Settings store, atomic write | ✅ |
| FR-021 `prdf` | Launcher, Instance handler (ADR-004) | ✅ See ADV-02 |
| FR-022 Known locations | Settings store, WF-006 | ✅ |
| FR-023 Select an item in the tree | Web UI tree, E-003 | ✅ |
| FR-024 Choose one of several sets | Launcher, Web UI set list (ADR-004) | ✅ |

**Coverage**: 23 of 23 release 1 FRs have a component. FR-013 has an advisory (ADV-06).

### 4.2 Non-Functional requirements coverage

#### Performance requirements

| NFR | Design answer | Evidence | Status |
|-----|---------------|----------|--------|
| NFR-P-001 Open, 2 s | Rust reader, index after first view | Test not run | ✅ Design |
| NFR-P-002 Refresh, 2 s | OS events, debounce | Test not run | ✅ Design |
| NFR-P-003 Search, 0.5 s | SQLite FTS5 BM25 | Test not run | ✅ Design |
| NFR-P-004 Export, 10 s | Word writer, HTML to PDF | Test not run | ✅ Design |

#### Availability & Resilience

| NFR | Design answer | Status |
|-----|---------------|--------|
| NFR-A-001 No network | No network element | ✅ |
| NFR-A-002 Themes survive restart | Atomic write, last good copy | ✅ |
| NFR-A-003 Unreadable file | Per-document load | ✅ |

#### Security requirements

| NFR | Design answer | Status |
|-----|---------------|--------|
| NFR-SEC-001 No content leaves | No network use, no telemetry | ✅ |
| NFR-SEC-002 Read-only | Capabilities, Command handler, Export saver | ✅ |
| NFR-SEC-003 Inert content | CSP, sanitized rendering (PRD NFR-010) | ✅ |

#### Scalability requirements

Not in the PRD. All targets are for 18 documents. ADR-003 has an upgrade path.

#### Compliance requirements

None apply. NFR-I-001 (format version 1) and NFR-I-002 (PDF and .docx) are
covered by the Set reader and the writers.

**Usability**: NFR-U-001 ⚠️ (ADV-04), NFR-U-002 ✅ design (ADR-002).

**Portability**: NFR-I-003 (macOS only, C-004) ✅.

---

## 5. architecture quality assessment

### 5.1 system context diagram (C4 level 1)

DIAG-001 shows 9 elements, 0 line crossings, and no network element. Score: 9/10.

### 5.2 container diagram (C4 level 2)

DIAG-002 shows four containers. The UI reaches files only through the core.
Score: 8/10. The print path is not shown.

### 5.3 technology stack

| Layer | Choice | License | Note |
|-------|--------|---------|------|
| Shell | Tauri 2 | MIT or Apache-2.0 | Same as Motion |
| UI | TypeScript, system web view | Open source | Motion stack |
| Word export | `docx` library | Open source | From Motion |
| PDF export | HTML to PDF | Open source | Engine set by the NFR-U-002 test |
| Search | SQLite FTS5, BM25 | Public domain | ADR-003 |
| Settings | JSON file | Not applicable | ADR-004 |

### 5.4 data architecture

#### Data models

Seven entities, one per DR. E-001 to E-004 are read-only. Score: 9/10.

#### Data flow

Files → Rust core → Web UI → export files. No flow leaves the computer.

#### Data governance

No personal data. The author owns the content.

### 5.5 integration architecture

#### External system integrations

INT-001 to INT-005 each map to a container. INT-005 (print) has no component.

#### API design

Tauri IPC commands between UI and core. Command groups are listed in DIAG-003.
The command list and their argument types belong in the DLD.

---

## 6. security architecture review

### 6.1 threat model

| Threat | Source | Control | Status |
|--------|--------|---------|--------|
| Script in a markdown document | Hostile PRD set | CSP, sanitized rendering | ✅ Design |
| Script in an SVG diagram | Hostile PRD set | Show SVG as an image, never inline | ⚠️ ADV-05 |
| Remote image or link | Hostile PRD set | CSP blocks remote loads | ✅ Design |
| Write into the set | Viewer bug | Capabilities, Export saver check | ✅ |
| Content leaves the computer | Viewer feature | No network use | ✅ |

### 6.2 security controls

#### Authentication & Authorization

None needed. One local user.

#### Network security

No network use.

#### Data protection

Data stays on the computer. No encryption added. The files stay where the author keeps them.

#### Security monitoring

Local logs only. A dependency scan runs on every build (principle 4).

### 6.3 compliance mapping

None applies.

---

## 7. scalability & performance architecture

### 7.1 scalability strategy

Single user, single set. No PRD target beyond 18 documents.

### 7.2 performance optimization

- Per-file reread on change.
- Index built once per open, updated per document.
- Index build after the first view if open time is short of margin.

---

## 8. resilience & disaster recovery

### 8.1 resilience patterns

- Per-document load and parse.
- Polling fallback when file events are not available.
- Atomic settings write.

### 8.2 high availability architecture

Not applicable. A desktop app.

### 8.3 disaster recovery

The PRD set is owned by the authoring tools. The index rebuilds. Settings rely
on the computer's own backup.

---

## 9. operational architecture

### 9.1 observability

Local logs. Performance tests per release. No telemetry (NFR-SEC-001).

### 9.2 deployment architecture

A signed and notarized macOS package (C-004, ADR-001).

### 9.3 supportability

Errors name the file and the reason (principle 3).

---

## 10. cost architecture

### 10.1 cost estimation

The PRD gives no budget. No hosting cost. An Apple Developer ID membership
is the only known cost. Its price is not in the PRD.

### 10.2 FinOps Practices

Not applicable.

---

## 11. issues and recommendations

### 11.1 critical issues (BLOCKING)

| ID | Issue | Resolution | Status |
|----|-------|------------|--------|
| BLOCKING-01 | The Motion PDF writer does not embed fonts and has no tagged structure | PRD owner chose HTML to PDF, no spike (ADR-002 v1.1) | Closed 2026-10-26 |
| BLOCKING-02 | Motion has no license | Motion is MIT licensed. LICENSE file committed (6a159c0) | Closed 2026-10-26 |

### 11.2 high priority issues (ADVISORY)

| ID | Issue | Resolution | Owner | Status |
|----|-------|------------|-------|--------|
| ADV-01 | NFR-SEC-003 is not in the PRD | Accepted as PRD NFR-010: only local content shows | PRD owner | Closed |
| ADV-02 | More than one set in `docs/prd` | The viewer reopens the last set. If none was open before, it lists the sets (FR-024, PRD 0.3.3) | PRD owner | Closed |
| ADV-03 | No supported platform list | macOS only for release 1 (C-004) | PRD owner | Closed |
| ADV-04 | No evidence for keyboard-only use in the web view | Keyboard audit of the tree, search, and export in the first build | Engineering lead | Open, build task |
| ADV-05 | SVG diagrams can hold scripts | Show SVG as an image element, never inline. Add a hostile SVG fixture | Engineering lead | Open, build task |
| ADV-06 | Print (FR-013, INT-005) has no component in DIAG-003 | Add the print path to the DLD | Engineering lead | Open, build task |
| ADV-07 | Release 1 dated on the review day | REL-001 moves to 2026-10-27 | PRD owner | Closed |
| ADV-08 | In-memory index, not the interview's SQL index | BM25 in a local SQLite index (ADR-003 v1.1) | PRD owner | Closed |

### 11.3 low priority items (INFORMATIONAL)

- The 200-millisecond debounce in ADR-005 is a design value. Tune it in the NFR-P-002 test.
- The Tauri IPC command list belongs in a DLD.
- PRD 0.3.2 is approved. Functional requirements have one blocking defect (ST-008).
- E-007 now follows the Motion theme fields. The PRD says "sans-serif" and Motion says "sans". Keep the Motion values and show the PRD words in the UI.

---

## 12. review decision

### 12.1 final decision

**APPROVED.**

- Start now: the whole build, export included.
- Re-review: when the PDF engine choice is in ADR-002, or when a platform other than macOS is added.

### 12.2 Reviewer Sign-Off

| Role | Name | Decision | Date |
|------|------|----------|------|
| PRD owner | Richard Hightower | Approved | 2026-10-26 |
| Engineering lead | Richard Hightower | Approved. No independent check | 2026-10-26 |

---

## 13. appendices

### Appendix A: HLD Document Reference

| Document | Path |
|----------|------|
| ADR-001 Tauri app | `projects/001-prd-forge-viewer/decisions/ARC-001-ADR-001-v1.1.md` |
| ADR-002 Export | `projects/001-prd-forge-viewer/decisions/ARC-001-ADR-002-v1.1.md` |
| ADR-003 Search | `projects/001-prd-forge-viewer/decisions/ARC-001-ADR-003-v1.1.md` |
| ADR-004 `prdf` and settings | `projects/001-prd-forge-viewer/decisions/ARC-001-ADR-004-v1.1.md` |
| ADR-005 File changes | `projects/001-prd-forge-viewer/decisions/ARC-001-ADR-005-v1.1.md` |
| DIAG-001 to DIAG-004 | `projects/001-prd-forge-viewer/diagrams/` |
| Data model | `projects/001-prd-forge-viewer/ARC-001-DATA-v1.0.md` |

## External references

### Document register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| WEB-1 | SpillwaveSolutions/motion | Web URL | https://github.com/SpillwaveSolutions/motion | Read through the GitHub API on 2026-10-26 |
| PFVP | prd-forge-viewer-prd.pdf | PRD | `projects/001-prd-forge-viewer/external/` | The PRD, version 0.3.2 |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| WEB-1-C1 | WEB-1 | Repository metadata | License | The GitHub API returns no license for the repository |
| WEB-1-C2 | WEB-1 | Owner statement, 2026-10-26 | License | Motion is MIT licensed (Richard Hightower, author) |
| PFVP-C1 | PFVP | Section 13, REL-001 | Date | Release 1, read and export, target date 2026-10-27 |

### Unreferenced documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| README.md | `projects/001-prd-forge-viewer/external/` | Describes the PDF |

---

**Generated by**: ArcKit `/arckit:hld-review` command
**Generated on**: 2026-10-26
**ArcKit Version**: 6.18.3
**Project**: PRD Forge Viewer (Project 001)
**Model**: claude-opus-5-5
**Generation Context**: Version 1.1 adds the PRD owner decisions of 2026-10-26. ADR-001 to ADR-005, DIAG-001 to DIAG-004, ARC-001-DATA-v1.0, reviewed against ARC-000-PRIN-v1.0 and ARC-001-REQ-v1.0.
