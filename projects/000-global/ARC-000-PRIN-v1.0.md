# PRD Forge Viewer architecture principles

> **Template Origin**: Official | **ArcKit Version**: 6.18.3 | **Command**: `/arckit:principles`

## Document control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-000-PRIN-v1.0 |
| **Document Type** | Architecture Principles |
| **Project** | PRD Forge Viewer (Project 000, global) |
| **Classification** | PUBLIC |
| **Status** | DRAFT |
| **Version** | 1.0 |
| **Created Date** | 2026-10-26 |
| **Last Modified** | 2026-10-26 |
| **Review Cycle** | On-Demand |
| **Next Review Date** | 2027-01-26 |
| **Owner** | Richard Hightower, PRD owner |
| **Reviewed By** | PENDING |
| **Approved By** | PENDING |
| **Distribution** | PRD owner, sponsor, engineering lead, developers of the viewer |

## Revision history

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| 1.0 | 2026-10-26 | ArcKit AI | Initial creation from `/arckit:principles` command | PENDING | PENDING |

---

## Executive summary

These principles govern every architecture and technology decision for the PRD
Forge Viewer. The viewer is a free and open source desktop app. It reads,
searches, and exports PRD sets that the PRD Forge authoring tools write
[PFVP-C1].

The source of every principle is the PRD Forge Viewer PRD, version 0.3.1,
approved by the sponsor on 2026-10-26. Each principle cites the PRD ID that it
comes from. If a principle and the PRD disagree, the PRD wins, and this document
changes.

**Scope**: The PRD Forge Viewer, release 1 (REL-001) and release 2 (REL-002).

**Authority**: The PRD owner decides. The sponsor approves a version.

**Compliance**: Mandatory unless the PRD owner approves an exception (section VI).

**Philosophy**: The principles are technology-agnostic. They say what qualities
the viewer must have. The ADRs choose the technology.

**Out of scope**: The viewer is not a government system. It holds no personal
data. Government compliance frameworks and data-protection regimes do not apply.

---

## I. strategic principles

### 1. Local first, no server

**Principle Statement**:
The viewer MUST do every release 1 task on the author's computer, with no server
and no network connection.

**Rationale**:
The PRD set is a folder on the same computer as the viewer (A-002) [PFVP-C2].
Every release 1 feature must work without a network connection (NFR-006)
[PFVP-C3]. No content of a PRD set may leave the computer (NFR-005).

**Implications**:

- The viewer reads PRD sets from the local file system only.
- No component depends on a hosted service, an account, or a sign-in.
- Updates to the viewer are the only network use, and the user starts them.
- Search, export, and themes run on the local computer.

**Validation Gates**:

- [ ] Each of the 22 release 1 functional requirements passes its acceptance test with the network off.
- [ ] A network monitor shows zero outbound connections during open, search, and export.
- [ ] No design element needs a server, an account, or a cloud service.

**Example**:

- Good: The search index is a local file that the viewer builds from the PRD set.
- Bad: Search sends the query to a hosted search service.

**Common violations**: Crash reporting or usage analytics that send data by default.

---

### 2. Read-only on the PRD set (NON-NEGOTIABLE)

**Principle Statement**:
The viewer MUST NOT change, create, move, or delete any document of a PRD set.

**Rationale**:
Edits go through the authoring tools so that they are graded (C-002, Q-005)
[PFVP-C4]. Editing in the viewer is out of scope for release 1 (OUT-001).

**Implications**:

- The viewer opens PRD set files for reading only.
- The viewer writes its own data (index, themes, known locations) outside the PRD set folder.
- Exports go to a location that the author selects, never over a PRD document.

**Validation Gates**:

- [ ] A checksum of every PRD set file is the same before and after a session that opens, searches, and exports the set (C-002 verification).
- [ ] No code path opens a PRD set file for writing.
- [ ] The export dialog refuses a target path that is a document of the PRD set.

**Example**:

- Good: The viewer stores the search index in its own application data folder.
- Bad: The viewer writes a `.index` file into the PRD set folder.

**Common violations**: A cache or lock file written next to the PRD documents.

---

### 3. Fail visibly, one document at a time

**Principle Statement**:
When the viewer cannot read a document, it MUST show that document by name with
the reason, and it MUST show every other document.

**Rationale**:
A change to the PRD Forge format can break the viewer (R-001) [PFVP-C5]. FR-003
shows each unreadable document by name. One bad file must not hide the rest of
the set.

**Implications**:

- Each document loads on its own. A failure in one does not stop the others.
- The error names the file and the reason in words that the author can act on.
- A missing PRD set shows the known locations, not an empty window (FR-021, FR-022).

**Validation Gates**:

- [ ] A fixture set with one malformed document shows the other documents and one named error.
- [ ] A fixture folder with no PRD set shows the known-locations screen (WF-006).
- [ ] No error message shows a stack trace to the author.

**Example**:

- Good: "06-scenarios.md cannot be read: the front matter has no `kind`."
- Bad: An empty tree with "Error loading PRD".

**Common violations**: A single parse exception that stops the load of the whole set.

---

### 4. Security by design for a local reader (NON-NEGOTIABLE)

**Principle Statement**:
The viewer MUST treat every PRD set as untrusted input. It MUST NOT run code or
load remote content from a document.

**Rationale**:
An author can open a PRD set from any source. The viewer shows rich text from
the documents. Content that runs or loads from the network breaks NFR-005 and
puts the computer at risk.

**Implications**:

- The viewer renders document text with scripts and active content off.
- The viewer does not load remote images or links when it shows or exports a document.
- The viewer asks the operating system for the least file access that it needs.
- Signed release packages let the user check where the viewer comes from.

**Mandatory Controls**:

- [ ] Rendered document content cannot run scripts.
- [ ] Remote resources in a document do not load. The viewer shows the link as text.
- [ ] File access is limited to the PRD set folder that the author opens and the viewer's own data folder.
- [ ] Release packages are signed.
- [ ] Dependencies are scanned for known vulnerabilities on every build.

**Compliance Frameworks**: None apply. The viewer is a local, single-user
desktop app with no personal data and no server.

**Exceptions**:

- NONE. Security principles are non-negotiable.

**Validation Gates**:

- [ ] Threat model done for a hostile PRD set (script in markdown, remote image, path traversal in links).
- [ ] A fixture with a script tag and a remote image renders as inert text.
- [ ] Dependency scan shows no critical vulnerabilities.

---

### 5. Free and open source

**Principle Statement**:
The viewer MUST be free to use and its source MUST be open, for anyone who uses
PRD Forge. Every component MUST have a license that allows this.

**Rationale**:
The PRD owner decided on 2026-10-26 that the viewer is free and open source for
anyone who uses PRD Forge [PFVP-C6].

**Implications**:

- Every dependency has an open source license that is compatible with the viewer's license.
- No feature needs a paid service, a license key, or a commercial runtime.
- The build runs from the public source with public tools.

**Validation Gates**:

- [ ] A license report lists every dependency and its license, with no conflicts.
- [ ] A clean computer builds the viewer from the public repository.

**Common violations**: A font, theme, or export library with a license that forbids redistribution.

---

## II. data principles

### 6. The PRD set is the single source of truth

**Principle Statement**:
The PRD set files MUST be the only source of PRD content. Every other copy MUST
be derived from them and rebuilt when they change.

**Rationale**:
The authoring tools write the headers and links of each document [PFVP-C7]. The viewer shows changes from the authoring tools within 2 seconds of
the save (FR-009, NFR-002) [PFVP-C8].

**Implications**:

- The search index and any cache are disposable. The viewer can delete and rebuild them at any time.
- When front matter and body text disagree, the viewer shows the front matter values for status, score, and links.
- No derived copy is ever written back to the PRD set (principle 2).

**Validation Gates**:

- [ ] Delete the index and cache, restart, and the viewer shows the same content and search results.
- [ ] A save in the authoring tools shows in the viewer within 2 seconds at p95 (NFR-002).

**Example**:

- Good: The viewer rebuilds the index entry for one document when that file changes.
- Bad: The viewer shows a stale grade from its cache after the author regrades a section.

---

### 7. Format fidelity to PRD Forge version 1

**Principle Statement**:
The viewer MUST read the PRD Forge document format version 1 exactly as the
`prd-forge/*@1` schemas define it, and MUST NOT depend on anything outside it.

**Rationale**:
C-003 fixes the format at version 1 for release 1 [PFVP-C9]. D-001 keeps it
stable until release 1 ships. A-003 is false if the format changes, and R-001
then applies.

**Implications**:

- The viewer reads document kind, status, score, blocking, graded, and links from front matter.
- The viewer keeps unknown front matter fields and does not fail on them.
- A new format version is a new ADR and a new release, not a silent change.

**Validation Gates**:

- [ ] Every PRD set that passes the PRD Forge validator opens with every document and every grade shown (C-003 verification).
- [ ] A fixture with an extra, unknown front matter field opens with no error.

---

### 8. No personal data

**Principle Statement**:
The viewer MUST NOT collect, store, or send personal data.

**Rationale**:
The viewer reads PRD content and stores only its own settings. NFR-005 forbids
any PRD content to leave the computer.

**Implications**:

- The viewer stores only themes, known PRD set locations, and the search index.
- The viewer has no accounts, no analytics, and no telemetry that leaves the computer.
- A data model that adds a person-related field needs a new review.

**Data Classification Tiers**:

1. **Public**: The viewer's source and release packages.
2. **Internal**: PRD set content, themes, known locations, and the index. All stay on the author's computer.

**Validation Gates**:

- [ ] The data model (DATA) lists no personal data fields.
- [ ] Zero network traffic carries PRD content (NFR-005).

---

## III. integration principles

### 9. Files are the only contract with the authoring tools

**Principle Statement**:
The viewer MUST integrate with the authoring tools only through the PRD set
files. It MUST NOT need the authoring tools to run.

**Rationale**:
Developers and stakeholders read the PRD without the authoring tools [PFVP-C10].
A file contract lets the authoring tools and the viewer change and ship on their
own schedules.

**Implications**:

- No shared runtime, process, or plugin interface with the authoring tools.
- The viewer detects file changes on its own (FR-009).
- The terminal command `prdf` (FR-021) opens the viewer on a folder. It is the only entry point from the terminal.

**Validation Gates**:

- [ ] The viewer opens, searches, and exports a PRD set on a computer without the authoring tools.
- [ ] No design element calls into the authoring tools.

---

### 10. Standard export formats only

**Principle Statement**:
Exports MUST use the formats that the stakeholders already read: PDF for the
fixed layout, and Microsoft Word (.docx) for the editable document.

**Rationale**:
C-001 sets these two formats [PFVP-C11]. The engineering lead, the sponsor, and
developers without the authoring tools read PDF and Word files. Every export
shows "Draft" until every document is final (TR-005) [PFVP-C12]. Screen-reader
users must read every export (NFR-009).

**Implications**:

- Each export opens in a standard PDF reader and a word processor with no add-on.
- Fonts in a theme are embedded in the export.
- Exports carry the version and the draft mark from the PRD set, never a stronger status.
- Exports have tagged structure: headings, tables, and alternative text for images.

**Validation Gates**:

- [ ] Open each export in a standard PDF reader and a word processor on a computer without the authoring tools (C-001 verification).
- [ ] An export of a set with one draft document shows "Draft".
- [ ] An accessibility checker reports zero errors for each format (NFR-009).

---

## IV. quality attributes

### 11. Performance targets from the PRD

**Principle Statement**:
The viewer MUST meet the PRD performance targets on the reference computer for a
PRD set of 18 documents.

**Rationale**:
The author opens the viewer several times a day (Q-003). Slow refresh breaks the
loop between the authoring tools and the viewer. The test computer is an Apple
silicon Mac with 16 GB [PFVP-C13].

**Performance Targets**:

| PRD ID | Measure | Target |
|--------|---------|--------|
| NFR-001 | Open a PRD set | p95 at most 2 seconds |
| NFR-002 | Show a change after a save | p95 at most 2 seconds |
| NFR-003 | Show search results | p95 at most 0.5 seconds |
| NFR-004 | Write the whole-set export | p95 at most 10 seconds |

**Implications**:

- Work that is not on screen loads after the first view.
- File-change detection and index updates work on the changed file only.
- Performance tests run against the 18-document fixture set.

**Validation Gates**:

- [ ] An automated performance test measures each of the four targets at p95.
- [ ] Results are recorded per release.

---

### 12. Accessible to keyboard and screen-reader users

**Principle Statement**:
A person who uses only a keyboard MUST be able to do every task in the viewer.
The viewer MUST have zero WCAG 2.2 AA failures.

**Rationale**:
NFR-007 sets this target for every acceptance criterion [PFVP-C14].

**Implications**:

- The tree, search, export, and themes screens have a visible focus and a logical tab order.
- Every control has an accessible name.
- Color is never the only sign of a status or a grade.

**Validation Gates**:

- [ ] Each acceptance criterion passes with keyboard only.
- [ ] An accessibility audit reports zero WCAG 2.2 AA failures.

---

### 13. Honest status

**Principle Statement**:
The viewer MUST show the status, score, and blocking defects exactly as the PRD
set records them. It MUST NOT make a PRD look more approved than it is.

**Rationale**:
Stakeholders give feedback on what they see (O-001). The sponsor approves only
through the change log (Q-006). An export must not say that the PRD is approved
[PFVP-C15].

**Implications**:

- A missing grade shows as missing, not as zero or as passed.
- A pending section shows as pending in the tree and in the export contents (WF-009).
- The draft mark rule (TR-005) lives in one place and both export formats use it.

**Validation Gates**:

- [ ] A fixture with one ungraded and one pending section shows both states in the tree and in each export.

---

### 14. Maintainable and recorded decisions

**Principle Statement**:
The viewer MUST have clear module boundaries, and every significant technology
choice MUST have an ADR.

**Rationale**:
The PRD names no technology. The ADRs carry the technology choices and their
reasons. A single maintainer must be able to change one part without reading all
of them.

**Implications**:

- Separate modules for reading the PRD set, search, export, themes, and the user interface.
- The five candidate ADR topics from the PRD interview each get an ADR.
- Each ADR links the PRD IDs that drive it.

**Validation Gates**:

- [ ] Each module has one responsibility and a documented interface.
- [ ] Each technology in the build has an ADR.

---

## V. development practices

### 15. Automated tests against fixture PRD sets

**Principle Statement**:
Every change MUST pass automated tests against fixture PRD sets before it merges.

**Rationale**:
The PRD scenarios (SC-001 to SC-007) use fixture sets, such as an 18-document set
with 13 pending sections [PFVP-C16]. The same fixtures make the acceptance
criteria repeatable.

**Implications**:

- Each PRD scenario has a fixture set and an automated acceptance test.
- Fixtures include a malformed document, an unknown field, a hostile document, and a search with no match.
- A failing test blocks the merge.

**Validation Gates**:

- [ ] Each scenario SC-001 to SC-007 has an automated test.
- [ ] Each functional requirement in REL-001 has at least one test.

---

### 16. Reproducible builds and releases

**Principle Statement**:
Every release MUST come from an automated pipeline that builds, tests, scans,
signs, and packages the viewer from version control.

**Rationale**:
The viewer has no server, so releases are the only delivery path. A reproducible
pipeline lets any contributor build the same package (principle 5).

**Implications**:

- No manual release steps.
- Release packages carry the version and a checksum.
- The pipeline definition is in the repository.

**Validation Gates**:

- [ ] The pipeline runs on every change and on every release tag.
- [ ] The pipeline includes the dependency scan and the license report.

---

## VI. exception process

### Requesting architecture exceptions

The principles are mandatory unless the PRD owner approves a documented exception.

**Valid Exception Reasons**:

- A technical constraint that prevents compliance.
- A temporary state, with an end date.
- A prototype that does not ship.

**Exception Request Requirements**:

- [ ] Reason, with the PRD IDs that are affected.
- [ ] Other approach and compensating controls.
- [ ] Risk and how to reduce it.
- [ ] End date.
- [ ] Plan to comply.

**Approval Process**:

1. Write the exception in the ADR that needs it.
2. The PRD owner reviews it.
3. The sponsor approves an exception to principle 2 or principle 4. No other person can.
4. Record the exception in this document's revision history.
5. Review open exceptions at each release.

---

## VII. governance and compliance

### Architecture review gates

**Design**:

- [ ] The HLD review checks each principle.
- [ ] Each exception is approved.

**Before release**:

- [ ] The build matches the approved design.
- [ ] Every validation gate passes.

### Enforcement

- The HLD review is mandatory before release 1.
- A principle violation is fixed before release.
- Exceptions end on their end date.

---

## VIII. appendix

### Principle summary checklist

| # | Principle | Category | Criticality | PRD source |
|---|-----------|----------|-------------|------------|
| 1 | Local first, no server | Strategic | CRITICAL | A-002, NFR-005, NFR-006 |
| 2 | Read-only on the PRD set | Strategic | CRITICAL | C-002, OUT-001 |
| 3 | Fail visibly, one document at a time | Strategic | HIGH | FR-003, R-001 |
| 4 | Security by design for a local reader | Strategic | CRITICAL | NFR-005 |
| 5 | Free and open source | Strategic | HIGH | PRD owner decision, 2026-10-26 |
| 6 | The PRD set is the single source of truth | Data | CRITICAL | FR-009, NFR-002 |
| 7 | Format fidelity to PRD Forge version 1 | Data | HIGH | C-003, D-001, A-003 |
| 8 | No personal data | Data | HIGH | NFR-005 |
| 9 | Files are the only contract with the authoring tools | Integration | HIGH | FR-009, FR-021 |
| 10 | Standard export formats only | Integration | CRITICAL | C-001, TR-005, NFR-009 |
| 11 | Performance targets from the PRD | Quality | HIGH | NFR-001 to NFR-004 |
| 12 | Accessible to keyboard and screen-reader users | Quality | HIGH | NFR-007 |
| 13 | Honest status | Quality | HIGH | O-001, Q-006, TR-005 |
| 14 | Maintainable and recorded decisions | Quality | MEDIUM | Candidate ADR topics |
| 15 | Automated tests against fixture PRD sets | DevOps | HIGH | SC-001 to SC-007 |
| 16 | Reproducible builds and releases | DevOps | HIGH | Principle 5 |

---

**Document Version History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-10-26 | ArcKit AI | First draft from PRD version 0.3.1 |

## External references

> This section provides traceability from generated content back to source documents.

### Document register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| PFVP | prd-forge-viewer-prd.pdf | PRD | `projects/001-prd-forge-viewer/external/` | Export of the PRD Forge Viewer PRD, version 0.3.2, 18 documents. Source: `docs/prd/prd-forge-viewer/` |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| PFVP-C1 | PFVP | Root, executive summary | Scope | The viewer shows the whole set and its grades in one place, shows changes as the authoring tools make them, searches, and makes themed export files |
| PFVP-C2 | PFVP | Section 11, A-002 | Assumption | The PRD set is on the same computer as the viewer. |
| PFVP-C3 | PFVP | Section 8, NFR-006 | Availability | Every release 1 feature works without a network connection. |
| PFVP-C4 | PFVP | Section 9, C-002 | Constraint | The viewer does not change any document of a PRD set. |
| PFVP-C5 | PFVP | Section 11, R-001 | Risk | A change to the PRD Forge document format breaks the viewer. |
| PFVP-C6 | PFVP | Section 15, version 0.1.0 | Decision | The viewer is free and open source for anyone who uses PRD Forge. |
| PFVP-C7 | PFVP | Section 9, C-003 | Standard | One root document and 17 section documents with the headers and links that the authoring tools define. |
| PFVP-C8 | PFVP | Section 8, NFR-002 | Performance | The author sees a change from the authoring tools within 2 seconds of the save. |
| PFVP-C9 | PFVP | Section 9, C-003 | Standard | The viewer reads PRD sets in the document layout of the authoring tools, version 1. |
| PFVP-C10 | PFVP | Section 9, C-001 | Constraint | The developers without the authoring tools read PDF and Word files. |
| PFVP-C11 | PFVP | Section 9, C-001 | Constraint | The fixed-layout document is PDF. The editable document is a Microsoft Word document (.docx). |
| PFVP-C12 | PFVP | Section 10, TR-005 | Decision | Every export shows "Draft" until every document is final. |
| PFVP-C13 | PFVP | Section 15, version 0.2.0 | Test | The test computer is an Apple silicon Mac with 16 GB. |
| PFVP-C14 | PFVP | Section 8, NFR-007 | Accessibility | A person who uses only a keyboard can do every task in the viewer. |
| PFVP-C15 | PFVP | Section 10, decision rights | Governance | Given any export, when the sponsor opens it, then the export does not say that the PRD is approved. |
| PFVP-C16 | PFVP | Section 7, functional requirements | Test | Given a PRD set with 13 pending sections that have no content |

### Unreferenced documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| README.md | `projects/001-prd-forge-viewer/external/` | Describes the PDF. No content to cite. |

---

**Generated by**: ArcKit `/arckit:principles` command
**Generated on**: 2026-10-26
**ArcKit Version**: 6.18.3
**Project**: PRD Forge Viewer (Project 000)
**Model**: claude-opus-5-5

<!-- arckit-provenance:start -->

## Build provenance

*Stamped automatically by the ArcKit plugin's `provenance-stamp.mjs` PostToolUse hook. Complements (does not replace) the human-authored footer above. Carries only fields the model can't authoritatively self-report: build context from `.arckit/state.json` and effort levels derived from command frontmatter + the silent-downgrade matrix.*

| Field | Value |
|-------|-------|
| Requested Effort | `high` |
| Effective Effort | `high` |
| Stamped at | 2026-10-27T00:37:26.251Z |

<!-- arckit-provenance:end -->
