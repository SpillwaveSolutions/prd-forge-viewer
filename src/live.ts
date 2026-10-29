import type { Section } from "./types";

/** The documents that changed since the set opened, with the new ones added (FR-009). */
export function applyChange(changed: Set<string>, files: string[]): Set<string> {
    return new Set([...changed, ...files]);
}

/** Keep the selected item after a reload when the section still has it. */
export function keepSelection(selected: string | null, section: Section): string | null {
    return selected && section.items.some((i) => i.id === selected) ? selected : null;
}

type Page = { section: Section; selected: string | null };

/** The page after a reload of the open section. A section that cannot be read goes back to the overview. */
export function reloadedPage(shown: Page, section: Section | undefined): { page?: Page; error?: string } {
    if (!section) return { error: `${shown.section.file} was removed or cannot be read. You see the current set.` };
    return { page: { section, selected: keepSelection(shown.selected, section) } };
}
