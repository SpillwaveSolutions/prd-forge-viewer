import type { DocEntry, PrdSet } from "./types";

function DocLine({ doc, onOpen }: { doc: DocEntry; onOpen?: (file: string) => void }) {
    if (doc.unreadable) {
        return (
            <li className="unreadable">
                {doc.title} <strong>Unreadable</strong>: {doc.file} ({doc.unreadable})
            </li>
        );
    }
    return (
        <li>
            {onOpen ? (
                <button type="button" className="doc-link" onClick={() => onOpen(doc.file)}>{doc.title}</button>
            ) : (
                doc.title
            )}{" "}
            <span className={`status status-${doc.status}`}>{doc.status}</span>
        </li>
    );
}

/** The product name, version, executive summary, and every document in order (FR-001, FR-003, WF-001, WF-005). */
export function SetOverview({ set, onOpen }: { set: PrdSet; onOpen?: (file: string) => void }) {
    return (
        <section aria-label="PRD set">
            <h1>{set.product}</h1>
            <p className="version">Version {set.version}</p>
            <dl className="summary">
                {set.summary.map((s) => (
                    <div key={s.label}>
                        <dt>{s.label}</dt>
                        <dd>{s.text}</dd>
                    </div>
                ))}
            </dl>
            <h2>Documents</h2>
            <ol className="documents">
                {set.documents.map((d) => (
                    <DocLine key={d.file} doc={d} onOpen={onOpen} />
                ))}
            </ol>
        </section>
    );
}
