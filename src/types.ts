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

// Mirrors src-tauri/src/prdset/items.rs and section.rs.
export interface Field {
    name: string;
    text: string;
}

export interface Item {
    id: string;
    title: string;
    parent: string | null;
    fields: Field[];
}

export interface Section {
    file: string;
    title: string;
    status: string;
    section: number | null;
    score: number | null;
    blocking: number | null;
    graded: string | null;
    body: string;
    items: Item[];
}

export interface ItemRef {
    id: string;
    title: string;
    file: string;
    parent: string | null;
}

// Mirrors src-tauri/src/search.rs.
export interface Hit {
    id: string;
    title: string;
    file: string;
    section: string;
    category: string;
    score: number;
}

export interface Category {
    kind: string;
    title: string;
}
