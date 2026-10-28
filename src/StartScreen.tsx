import type { SetRef, StartView } from "./types";

function SetList({ refs, onOpen }: { refs: SetRef[]; onOpen: (folder: string) => void }) {
    return (
        <ul className="set-list">
            {refs.map((r) => (
                <li key={r.folder}>
                    {r.found ? (
                        <button type="button" onClick={() => onOpen(r.folder)}>
                            <strong>{r.product ?? "PRD set"}</strong> <span className="folder">{r.folder}</span>
                        </button>
                    ) : (
                        <span className="not-found">
                            <span className="folder">{r.folder}</span> Not found
                        </span>
                    )}
                </li>
            ))}
        </ul>
    );
}

function Known({ refs, onOpen }: { refs: SetRef[]; onOpen: (folder: string) => void }) {
    return (
        <>
            <h2>Known locations</h2>
            {refs.length ? <SetList refs={refs} onOpen={onOpen} /> : <p>No known locations yet</p>}
        </>
    );
}

/** The screen when no set is open: WF-006 (no set here), WF-010 (several sets), or the welcome. */
export function StartScreen({ view, onOpen }: { view: Exclude<StartView, { kind: "open" }>; onOpen: (folder: string) => void }) {
    switch (view.kind) {
        case "notFound":
            return (
                <section aria-label="Start">
                    <p>No PRD set in {view.folder}</p>
                    <Known refs={view.known} onOpen={onOpen} />
                </section>
            );
        case "choose":
            return (
                <section aria-label="Start">
                    <p>More than one PRD set in {view.folder}. Select one.</p>
                    <SetList refs={view.sets} onOpen={onOpen} />
                    <Known refs={view.known} onOpen={onOpen} />
                </section>
            );
        case "welcome":
            return (
                <section aria-label="Start">
                    <Known refs={view.known} onOpen={onOpen} />
                </section>
            );
    }
}
