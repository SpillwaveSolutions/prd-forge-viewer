import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DiagramViewer } from "./DiagramViewer";
import { renderBody } from "./renderBody";
import type { Item, Section } from "./types";

const ID = /\b([A-Z]{1,4}-\d{3})\b/g;

/** Text where each known id is a button that opens that item (FR-007). Unknown ids stay text. */
export function linkify(text: string, known: Set<string>, onOpenItem: (id: string) => void): ReactNode[] {
    return text.split(ID).map((part, i) =>
        i % 2 === 1 && known.has(part) ? (
            <button key={i} type="button" className="ref" onClick={() => onOpenItem(part)}>{part}</button>
        ) : (
            part
        ),
    );
}

function gradeText(s: Section) {
    return s.score === null ? "Not graded" : `${s.score}, ${s.blocking ?? 0} blocking, ${s.graded ?? "no date"}`;
}

function ItemView({ item, section, known, onOpenItem, builtBy = [] }: { item: Item; section: Section; known: Set<string>; onOpenItem: (id: string) => void; builtBy?: string[] }) {
    return (
        <article className="item" aria-label={`Item ${item.id}`}>
            <h3>
                {item.id} {item.title !== item.id && <span className="item-title">{item.title}</span>}
            </h3>
            {item.parent && <p className="parent">in {linkify(item.parent, known, onOpenItem)}</p>}
            <p className="item-section">
                {section.title}: <span className={`status status-${section.status}`}>{section.status}</span> {gradeText(section)}
            </p>
            <dl>
                {builtBy.length > 0 && (
                    <div className="built-by">
                        <dt>built by</dt>
                        <dd>{linkify(builtBy.join(", "), known, onOpenItem)}</dd>
                    </div>
                )}
                {item.fields.map((f) => (
                    <div key={f.name}>
                        <dt>{f.name.replace(/_/g, " ")}</dt>
                        <dd>{linkify(f.text, known, onOpenItem)}</dd>
                    </div>
                ))}
            </dl>
        </article>
    );
}

interface Props {
    section: Section;
    known: Set<string>;
    selected: string | null;
    onSelect: (id: string | null) => void;
    onOpenItem: (id: string) => void;
    onBack: () => void;
    onOpenDoc?: (file: string) => void;
    loadAsset?: (rel: string) => Promise<string>;
    renderHtml?: (markdown: string) => string;
    /** The list of documents, so that any other section is one action away (FR-005). */
    nav?: ReactNode;
    /** The authoring tools changed this document while it was open (FR-009, WF-002). */
    changed?: boolean;
    /** The backlog stories that build a requirement, by requirement id (FR-028). */
    builtBy?: (id: string) => string[];
    /** The findings behind the grade, as markdown, or null when the section has no grade note (FR-025). */
    loadFindings?: () => Promise<string | null>;
}

/** The findings behind a grade (FR-025, WF-011): the note that the grading pass wrote, shown on request. */
function useFindings(load: (() => Promise<string | null>) | undefined, renderHtml: (md: string) => string) {
    // undefined: not loaded yet; null: the section has no grade note.
    const [shown, setShown] = useState<{ open: boolean; html?: string | null }>({ open: false });
    const toggle = async () => {
        if (shown.open || !load) return setShown({ open: false });
        const md = await load().catch(() => null);
        setShown({ open: true, html: md ? renderHtml(md) : null });
    };
    const button = load && <button type="button" className="findings-toggle" aria-expanded={shown.open} aria-controls="findings" onClick={toggle}>Findings</button>;
    const panel = shown.open && (
        <section id="findings" aria-label="Findings" className="findings">
            {shown.html ? <div className="body" dangerouslySetInnerHTML={{ __html: shown.html }} /> : <p>No findings are recorded for this section.</p>}
        </section>
    );
    return { button, panel, reset: () => setShown({ open: false }) };
}

export function SectionPage({ section, known, selected, onSelect, onOpenItem, onBack, onOpenDoc, loadAsset, renderHtml = renderBody, nav, changed, loadFindings, builtBy }: Props) {
    const body = useRef<HTMLDivElement>(null);
    const item = section.items.find((i) => i.id === selected);
    // Render the body once for each section, not on every item click.
    const html = useMemo(() => renderHtml(section.body), [section.body, renderHtml]);
    const findings = useFindings(loadFindings, renderHtml);
    // Another section closes the findings of the last one.
    useEffect(() => findings.reset(), [section.file]); // eslint-disable-line react-hooks/exhaustive-deps
    const [diagram, setDiagram] = useState<{ src: string; alt: string } | null>(null);

    useEffect(() => {
        const el = body.current;
        if (!el) return;
        for (const img of Array.from(el.querySelectorAll<HTMLImageElement>("img[data-asset]"))) {
            const rel = img.dataset.asset!;
            img.removeAttribute("data-asset");
            loadAsset?.(rel).then((url) => (img.src = url)).catch(() => {
                // Show the wireframe sketch that the drawing replaced, if there is one.
                const p = img.closest(".diagram")?.parentElement;
                if (p?.previousElementSibling?.matches("[data-sketch]")) p.previousElementSibling.removeAttribute("hidden");
                img.replaceWith(`[image not found: ${img.alt}]`);
            });
        }
        const onClick = (e: MouseEvent) => {
            const a = (e.target as HTMLElement).closest<HTMLElement>("[data-doc]");
            if (a) { e.preventDefault(); onOpenDoc?.(a.dataset.doc!); }
            const img = (e.target as HTMLElement).closest<HTMLElement>("[data-diagram]")?.querySelector("img");
            if (img?.src) setDiagram({ src: img.src, alt: img.alt });
        };
        el.addEventListener("click", onClick);
        return () => el.removeEventListener("click", onClick);
    }, [html, loadAsset, onOpenDoc]);

    return (
        <div className="section-layout">
        {nav && <nav aria-label="Documents" className="doc-nav">{nav}</nav>}
        <section aria-label={section.title} className="section-page">
            <button type="button" onClick={onBack}>Back to the PRD set</button>
            <h1>{section.title}</h1>
            {changed && <p role="status" className="change-notice">This section changed. You see the current version.</p>}
            <p className="version">
                <span className={`status status-${section.status}`}>{section.status}</span> {gradeText(section)} {findings.button}
            </p>
            {findings.panel}
            {section.items.length > 0 && (
                <nav aria-label="Items" className="items">
                    {section.items.map((i) => (
                        <button key={i.id} type="button" aria-pressed={i.id === selected} onClick={() => onSelect(i.id === selected ? null : i.id)}>
                            {i.id}
                        </button>
                    ))}
                </nav>
            )}
            {item && <ItemView item={item} section={section} known={known} onOpenItem={onOpenItem} builtBy={builtBy?.(item.id)} />}
            <div ref={body} className="body" dangerouslySetInnerHTML={{ __html: html }} />
            {diagram && <DiagramViewer src={diagram.src} alt={diagram.alt} onClose={() => setDiagram(null)} />}
        </section>
        </div>
    );
}
