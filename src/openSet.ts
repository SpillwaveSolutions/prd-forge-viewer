import type { PrdSet } from "./types";

/** The set and the message to show after an open. An error clears the old set, and a cancel keeps it. */
export function applyResult(
    current: PrdSet | undefined,
    r: { set?: PrdSet; error?: string },
): { set: PrdSet | undefined; error: string | undefined } {
    return { set: r.error ? undefined : (r.set ?? current), error: r.error };
}

/** Ask for a folder, then load it. Cancel gives {}, a load error gives its message. */
export async function openSet(
    pick: () => Promise<string | null>,
    load: (path: string) => Promise<PrdSet>,
): Promise<{ set?: PrdSet; error?: string }> {
    const path = await pick();
    if (!path) return {};
    try {
        return { set: await load(path) };
    } catch (e) {
        return { error: String(e) };
    }
}
