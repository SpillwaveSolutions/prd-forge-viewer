import type { DocEntry, PrdSet } from "./types";

export function doc(over: Partial<DocEntry>): DocEntry {
    return { file: "x.md", title: "X", section: null, order: 0, status: "draft", grade: null, unreadable: null, ...over };
}

export function sampleSet(documents: DocEntry[]): PrdSet {
    return {
        folder: "/tmp/set",
        product: "PRD Forge Viewer",
        version: "0.6.1",
        summary: [{ label: "Problem", text: "A PRD set is 18 linked files." }],
        documents,
    };
}
