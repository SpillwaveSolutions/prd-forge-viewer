import type { PrdSet } from "./types";

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
