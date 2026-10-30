/** The text sizes, as a factor of the normal size. */
export const ZOOM_STEPS = [0.8, 0.9, 1, 1.15, 1.3, 1.5, 1.75, 2];

/** The next text size up (1) or down (-1), or the normal size (0). It stops at the smallest and the largest. */
export function nextZoom(zoom: number, dir: 1 | -1 | 0): number {
    if (dir === 0) return 1;
    const up = ZOOM_STEPS.find((s) => s > zoom + 1e-9);
    const down = [...ZOOM_STEPS].reverse().find((s) => s < zoom - 1e-9);
    return (dir === 1 ? up : down) ?? zoom;
}

/** The stored text size, if it is one of the steps. */
export function readZoom(stored: string | null): number {
    const z = Number(stored);
    return ZOOM_STEPS.includes(z) ? z : 1;
}
