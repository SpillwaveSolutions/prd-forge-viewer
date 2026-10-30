/** The scale and offset, in pixels, of a diagram in the diagram window. */
export type View = { scale: number; x: number; y: number };
type Size = { width: number; height: number };

export const MIN_SCALE = 0.25;
export const MAX_SCALE = 8;
const FILL = 0.95;

/** The diagram as large as fits inside the window, with a margin, and centered. A very large diagram opens at the minimum scale. */
export function fitView(image: Size, box: Size): View {
    const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, (box.width * FILL) / image.width, (box.height * FILL) / image.height));
    return { scale, x: (box.width - image.width * scale) / 2, y: (box.height - image.height * scale) / 2 };
}

/** Zoom by `factor` about the point (px, py) of the window, so that the point under the pointer stays still. */
export function zoomAt(v: View, factor: number, px: number, py: number): View {
    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale * factor));
    const k = scale / v.scale;
    return { scale, x: px - (px - v.x) * k, y: py - (py - v.y) * k };
}
