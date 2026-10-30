import { useState } from "react";
import type { Category, Hit } from "./types";

/** The results of one search: the number of matches, then each result with its score (WF-003, WF-004). */
export function SearchResults({ term, hits, onOpenHit, seq }: { term: string; hits: Hit[]; onOpenHit: (hit: Hit) => void; seq?: number }) {
    if (!hits.length) return <p className="no-match" role="status" data-seq={seq}>No matches for “{term}”</p>;
    return (
        <div className="results">
            <p role="status" data-seq={seq}>{hits.length === 1 ? "1 match" : `${hits.length} matches`}</p>
            <ol>
                {hits.map((h) => (
                    <li key={`${h.file}:${h.id}`}>
                        <button type="button" onClick={() => onOpenHit(h)}>
                            <span className="score" aria-label={`relevance ${h.score}`}>{h.score}</span> <strong>{h.id}</strong> {h.title !== h.id && h.title}{" "}
                            <span className="folder">{h.section}</span>
                        </button>
                    </li>
                ))}
            </ol>
        </div>
    );
}

interface Props {
    categories: Category[];
    onSearch: (term: string, categories: string[]) => Promise<Hit[]>;
    onOpenHit: (hit: Hit) => void;
}

/** Search the set by term, in the categories that the author picks, or in all (FR-008). */
export function SearchPanel({ categories, onSearch, onOpenHit }: Props) {
    const [term, setTerm] = useState("");
    // The selected category kinds. None selected means all categories.
    const [picked, setPicked] = useState<string[]>([]);
    const [shown, setShown] = useState<{ term: string; hits: Hit[]; seq: number }>();
    const [error, setError] = useState<string>();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!term.trim()) return setShown(undefined);
        try {
            const hits = await onSearch(term, picked);
            setShown((s) => ({ term, hits, seq: (s?.seq ?? 0) + 1 }));
            setError(undefined);
        } catch (err) {
            setError(String(err));
        }
    };

    return (
        <section aria-label="Search" className="search">
            <form onSubmit={submit} role="search">
                <label>
                    Search <input type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Term" />
                </label>{" "}
                <button type="submit">Search</button>{" "}
                {shown && <button type="button" onClick={() => setShown(undefined)}>Clear</button>}
                <fieldset className="categories">
                    <legend>Categories</legend>
                    <label className="chip">
                        <input type="checkbox" value="all" checked={picked.length === 0} onChange={() => setPicked([])} /> All categories
                    </label>
                    {categories.map((c) => (
                        <label key={c.kind} className="chip">
                            <input type="checkbox" value={c.kind} checked={picked.includes(c.kind)}
                                onChange={() => setPicked((p) => (p.includes(c.kind) ? p.filter((k) => k !== c.kind) : categories.map((x) => x.kind).filter((k) => k === c.kind || p.includes(k))))} />{" "}
                            {c.title}
                        </label>
                    ))}
                </fieldset>
            </form>
            {error && <p role="alert" className="error">{error}</p>}
            {shown && <SearchResults term={shown.term} hits={shown.hits} seq={shown.seq} onOpenHit={onOpenHit} />}
        </section>
    );
}
