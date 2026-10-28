// Mirrors the Rust PrdSet value from open_set (src-tauri/src/prdset/load.rs).
export interface Grade {
    score: number;
    blocking: number;
    graded: string | null;
}

export interface DocEntry {
    file: string;
    title: string;
    section: number | null;
    order: number;
    status: string;
    grade: Grade | null;
    unreadable: string | null;
}

export interface SummaryItem {
    label: string;
    text: string;
}

export interface PrdSet {
    folder: string;
    product: string;
    version: string;
    summary: SummaryItem[];
    documents: DocEntry[];
}

export interface SetRef {
    folder: string;
    product: string | null;
    found: boolean;
}

// Mirrors the Rust StartView from the startup command (src-tauri/src/start.rs).
export type StartView =
    | { kind: "open"; folder: string }
    | { kind: "choose"; folder: string; sets: SetRef[]; known: SetRef[] }
    | { kind: "notFound"; folder: string; known: SetRef[] }
    | { kind: "welcome"; known: SetRef[] };
