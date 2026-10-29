import { useEffect, useRef, useState } from "react";
import { draftReason } from "./exportModel";
import { findTheme, listThemes, type ExportTheme } from "./themes";
import type { PrdSet } from "./types";

export type ExportFormat = "pdf" | "docx";

/** The export dialog (WF-007): the format, the theme, the sections, the reason for Draft, Print, and Export. */
export function ExportDialog({ set, themes, themeId, onEditThemes, onClose, onExport, onPrint }: {
    set: PrdSet;
    themes: readonly ExportTheme[];
    themeId: string;
    onEditThemes: () => void;
    onClose: () => void;
    onExport: (format: ExportFormat, theme: ExportTheme, selected: Set<string>) => Promise<boolean>;
    onPrint: (theme: ExportTheme, selected: Set<string>) => Promise<void>;
}) {
    const docs = [...set.documents].sort((a, b) => a.order - b.order);
    const [format, setFormat] = useState<ExportFormat>("pdf");
    const [id, setId] = useState(themeId);
    const [selected, setSelected] = useState(() => new Set(docs.map((d) => d.file)));
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState<string>();
    // Counts finished jobs, so a check can tell a new "Export saved." from the last one.
    const [runs, setRuns] = useState(0);
    const theme = findTheme(id, themes);
    const draft = draftReason(set.documents);

    // A native modal dialog keeps the keyboard focus inside it and closes on Escape (NFR-007).
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        const back = document.activeElement as HTMLElement | null;
        ref.current?.showModal();
        return () => back?.focus();
    }, []);

    const toggle = (file: string) => setSelected((s) => {
        const next = new Set(s);
        if (!next.delete(file)) next.add(file);
        return next;
    });
    const run = async (job: () => Promise<unknown>, done: string) => {
        setBusy(true);
        setStatus(undefined);
        try {
            // A job returns false when the author cancels the save dialog.
            setStatus((await job()) === false ? "Export cancelled. Nothing was saved." : done);
        } catch (e) {
            setStatus(`Not done: ${e instanceof Error ? e.message : String(e)}`);
        } finally {
            setBusy(false);
            setRuns((n) => n + 1);
        }
    };

    return (
        <dialog ref={ref} className="modal" aria-label="Export" data-runs={runs} onCancel={(e) => { e.preventDefault(); if (!busy) onClose(); }}>
            <h2>Export</h2>
            <fieldset>
                <legend>Format</legend>
                <label><input type="radio" name="format" checked={format === "pdf"} onChange={() => setFormat("pdf")} /> PDF</label>
                <label><input type="radio" name="format" checked={format === "docx"} onChange={() => setFormat("docx")} /> Word</label>
            </fieldset>
            <label>
                Theme
                <select aria-label="Export theme" value={theme.id} onChange={(e) => setId(e.target.value)}>
                    {listThemes(themes).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
            </label>{" "}
            <button type="button" onClick={onEditThemes}>Edit themes</button>
            <fieldset>
                <legend>Sections, in reading order</legend>
                <button type="button" onClick={() => setSelected(new Set(docs.map((d) => d.file)))}>Select all</button>{" "}
                <button type="button" onClick={() => setSelected(new Set())}>Select none</button>
                <ul className="export-sections">
                    {docs.map((d) => (
                        <li key={d.file}>
                            <label><input type="checkbox" checked={selected.has(d.file)} onChange={() => toggle(d.file)} /> {d.title} <span className="muted">({d.status})</span></label>
                        </li>
                    ))}
                </ul>
            </fieldset>
            {draft && <p className="draft-reason">Draft: {draft} The mark goes away when every document is final.</p>}
            {status && <p role="status">{status}</p>}
            <div className="actions">
                <button type="button" disabled={busy} onClick={onClose}>Close</button>
                <button type="button" disabled={busy || selected.size === 0} onClick={() => run(() => onPrint(theme, selected), "Sent to the printer.")}>Print</button>
                <button type="button" disabled={busy || selected.size === 0} onClick={() => run(() => onExport(format, theme, selected), "Export saved.")}>Export</button>
            </div>
        </dialog>
    );
}
