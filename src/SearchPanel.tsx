import { useState } from "react";
import type { Category, Hit } from "./types";

/** The results of one search: the number of matches, then each result with its score (WF-003, WF-004). */
export function SearchResults({ term, hits, onOpenItem, seq }: { term: string; hits: Hit[]; onOpenItem: (id: string) => void; seq?: number }) {
    if (!hits.length) return <p className="no-match" role="status" data-seq={seq}>No matches for “{term}”</p>;
    return (
        <div className="results">
            <p role="status" data-seq={seq}>{hits.length === 1 ? "1 match" : `${hits.length} matches`}</p>
            <ol>
                {hits.map((h) => (
                    <li key={`${h.file}:${h.id}`}>
                        <button type="button" onClick={() => onOpenItem(h.id)}>
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
    onSearch: (term: string, category: string) => Promise<Hit[]>;
    onOpenItem: (id: string) => void;
}

/** Search the set by term, in one category or in all (FR-008). */
export function SearchPanel({ categories, onSearch, onOpenItem }: Props) {
    const [term, setTerm] = useState("");
    const [category, setCategory] = useState("all");
    const [shown, setShown] = useState<{ term: string; hits: Hit[]; seq: number }>();
    const [error, setError] = useState<string>();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!term.trim()) return setShown(undefined);
        try {
            const hits = await onSearch(term, category);
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
                <label>
                    in{" "}
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="all">All categories</option>
                        {categories.map((c) => (
                            <option key={c.kind} value={c.kind}>{c.title}</option>
                        ))}
                    </select>
                </label>{" "}
                <button type="submit">Search</button>{" "}
                {shown && <button type="button" onClick={() => setShown(undefined)}>Clear</button>}
            </form>
            {error && <p role="alert" className="error">{error}</p>}
            {shown && <SearchResults term={shown.term} hits={shown.hits} seq={shown.seq} onOpenItem={onOpenItem} />}
        </section>
    );
}
