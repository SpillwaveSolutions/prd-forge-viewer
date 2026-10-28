import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { ask, open } from "@tauri-apps/plugin-dialog";
import { GradesTable } from "./GradesTable";
import { SetOverview } from "./SetOverview";
import { StartScreen } from "./StartScreen";
import { applyResult, applyStart, openSet } from "./openSet";
import type { PrdSet, StartView } from "./types";

const pickFolder = async () => {
    const picked = await open({ directory: true, title: "Open PRD set" });
    return typeof picked === "string" ? picked : null;
};
const loadSet = (path: string) => invoke<PrdSet>("open_set", { path });

export function App() {
    const [set, setSet] = useState<PrdSet>();
    const [error, setError] = useState<string>();
    const [start, setStart] = useState<Exclude<StartView, { kind: "open" }>>();
    const [notice, setNotice] = useState<string>();

    const show = useCallback(async (pick: () => Promise<string | null>) => {
        const next = applyResult(set, await openSet(pick, loadSet));
        setSet(next.set);
        setError(next.error);
        if (next.set) setStart(undefined);
    }, [set]);

    const showStart = useCallback((view: StartView) => {
        if (view.kind === "open") void show(async () => view.folder);
        else {
            const next = applyStart(view);
            setSet(next.set);
            setError(next.error);
            setStart(next.start);
        }
    }, [show]);

    useEffect(() => {
        void invoke<StartView>("startup").then(showStart);
        const unlisten = listen<StartView>("start", (e) => showStart(e.payload));
        return () => void unlisten.then((f) => f());
        // Run once at start; later launches arrive as "start" events.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // A picked folder goes through the same start rules as prdf: one set opens, several are listed,
    // and a folder with no set shows the known locations (FR-022, FR-024).
    const pickAndStart = async () => {
        const folder = await pickFolder().catch(() => null);
        if (folder) showStart(await invoke<StartView>("start_for", { path: folder }));
    };

    const installPrdf = async () => {
        if (!(await ask("Install the prdf command in ~/.local/bin?", { title: "Install prdf command" }))) return;
        setNotice(await invoke<string>("install_prdf").catch(String));
    };

    return (
        <main>
            <header className="toolbar">
                <button type="button" onClick={pickAndStart} autoFocus>
                    Open PRD set
                </button>{" "}
                <button type="button" onClick={installPrdf}>
                    Install prdf command
                </button>
            </header>
            {notice && <p role="status">{notice}</p>}
            {error && <p role="alert" className="error">{error}</p>}
            {set ? (
                <>
                    <SetOverview set={set} />
                    <GradesTable documents={set.documents} />
                </>
            ) : start ? (
                <StartScreen view={start} onOpen={(folder) => show(async () => folder)} />
            ) : (
                !error && <h1>PRD Forge Viewer</h1>
            )}
        </main>
    );
}
