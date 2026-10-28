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
