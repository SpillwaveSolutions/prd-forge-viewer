import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { GradesTable } from "./GradesTable";
import { SetOverview } from "./SetOverview";
import { applyResult, openSet } from "./openSet";
import type { PrdSet } from "./types";

const pickFolder = async () => {
    const picked = await open({ directory: true, title: "Open PRD set" });
    return typeof picked === "string" ? picked : null;
};
const loadSet = (path: string) => invoke<PrdSet>("open_set", { path });

export function App() {
    const [set, setSet] = useState<PrdSet>();
    const [error, setError] = useState<string>();

    const onOpen = async () => {
        const next = applyResult(set, await openSet(pickFolder, loadSet));
        setSet(next.set);
        setError(next.error);
    };

    return (
        <main>
            <header className="toolbar">
                <button type="button" onClick={onOpen} autoFocus>
                    Open PRD set
                </button>
            </header>
            {error && <p role="alert" className="error">{error}</p>}
            {set ? (
                <>
                    <SetOverview set={set} />
                    <GradesTable documents={set.documents} />
                </>
            ) : (
                !error && <h1>PRD Forge Viewer</h1>
            )}
        </main>
    );
}
