import type { DocEntry } from "./types";

/** "Not graded", or "<score>, <blocking> blocking, <date or no date>" (FR-004). */
export function gradeLabel(doc: DocEntry): string {
    if (!doc.grade) return "Not graded";
    const { score, blocking, graded } = doc.grade;
    return `${score}, ${blocking} blocking, ${graded ?? "no date"}`;
}
