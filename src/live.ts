import type { Section } from "./types";

/** The documents that changed since the set opened, with the new ones added (FR-009). */
export function applyChange(changed: Set<string>, files: string[]): Set<string> {
    return new Set([...changed, ...files]);
}

/** Keep the selected item after a reload when the section still has it. */
export function keepSelection(selected: string | null, section: Section): string | null {
    return selected && section.items.some((i) => i.id === selected) ? selected : null;
}
