import type { DocEntry, PrdSet, Section } from "./types";

const cell = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");

/** Why the export shows "Draft", or null when the root and every section are final (TR-005). */
export function draftReason(documents: readonly DocEntry[]): string | null {
    const open = documents.filter((d) => d.status !== "final").length;
    return open ? `${open} of ${documents.length} documents are not final.` : null;
}

/**
 * The export as one markdown document: the first page (WF-009), then the selected documents in
 * reading order (FR-012). `selected` null means the whole set. The text that the viewer adds never
 * says that the PRD is approved (TR-007), and a blocking defect never stops an export (TR-010).
 */
export function buildExport(set: PrdSet, bodies: ReadonlyMap<string, Section>, selected: ReadonlySet<string> | null): string {
    const docs = [...set.documents].sort((a, b) => a.order - b.order);
    const draft = draftReason(docs);
    const first = [
        `# ${set.product} PRD`,
        `Version ${set.version}`,
        ...(draft ? [`**Draft.** ${draft} The mark goes away when every document is final.`] : []),
        "## Executive summary",
        ...set.summary.map((s) => `**${s.label}.** ${s.text}`),
        "## Contents",
        "| Section | Status | Score | Blocking defects |\n| --- | --- | --- | --- |\n" +
            docs.map((d) => `| ${cell(d.title)} | ${d.status} | ${d.grade?.score ?? "not graded"} | ${d.grade?.blocking ?? "not graded"} |`).join("\n"),
    ];
    const parts = docs
        .filter((d) => !selected || selected.has(d.file))
        .map((d) => {
            if (d.status === "pending") return `# ${d.title}\n\nThis section is not written yet.`;
            const s = bodies.get(d.file);
            return s ? s.body.trim() : `# ${d.title}\n\nThis section cannot be read.`;
        });
    return [...first, ...parts].join("\n\n") + "\n";
}
