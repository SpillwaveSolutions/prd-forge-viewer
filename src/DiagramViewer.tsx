import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type WheelEvent } from "react";
import { fitView, zoomAt, type View } from "./zoom";

const STEP = 1.25;
const PAN = 40;

/** One diagram in a window that fills most of the app: zoom with the wheel or a pinch, drag to pan, and the same from the keyboard. */
export function DiagramViewer({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
    const dialog = useRef<HTMLDialogElement>(null);
    const stage = useRef<HTMLDivElement>(null);
    const img = useRef<HTMLImageElement>(null);
    const drag = useRef<{ x: number; y: number } | null>(null);
    const [view, setView] = useState<View | null>(null);

    useEffect(() => {
        const back = document.activeElement as HTMLElement | null;
        dialog.current?.showModal();
        stage.current?.focus();
        return () => back?.focus();
    }, []);

    const box = () => stage.current!.getBoundingClientRect();
    const fit = () => {
        const i = img.current, b = stage.current;
        // ponytail: an SVG with no size reports 0, so it fits as 1000 by 750.
        if (i && b) setView(fitView({ width: i.naturalWidth || 1000, height: i.naturalHeight || 750 }, b.getBoundingClientRect()));
    };
    const zoom = (factor: number, px?: number, py?: number) => setView((v) => {
        if (!v) return v;
        const b = box();
        return zoomAt(v, factor, px ?? b.width / 2, py ?? b.height / 2);
    });

    const onWheel = (e: WheelEvent) => {
        const b = box();
        // A pinch arrives as a wheel event with ctrlKey. Its deltaY is smaller, so it counts more.
        zoom(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002)), e.clientX - b.left, e.clientY - b.top);
    };
    const onPointerDown = (e: PointerEvent) => {
        drag.current = { x: e.clientX, y: e.clientY };
        (e.target as Element).setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
        const d = drag.current;
        if (!d) return;
        drag.current = { x: e.clientX, y: e.clientY };
        setView((v) => v && { ...v, x: v.x + e.clientX - d.x, y: v.y + e.clientY - d.y });
    };
    const pan = (dx: number, dy: number) => setView((v) => v && { ...v, x: v.x + dx, y: v.y + dy });
    const onKeyDown = (e: KeyboardEvent) => {
        const act: Record<string, () => void> = {
            "+": () => zoom(STEP), "=": () => zoom(STEP), "-": () => zoom(1 / STEP), "0": fit,
            ArrowLeft: () => pan(PAN, 0), ArrowRight: () => pan(-PAN, 0), ArrowUp: () => pan(0, PAN), ArrowDown: () => pan(0, -PAN),
        };
        if (act[e.key]) { e.preventDefault(); act[e.key]!(); }
    };

    return (
        <dialog ref={dialog} className="diagram-viewer" aria-label={`Diagram: ${alt}`} onCancel={(e) => { e.preventDefault(); onClose(); }} onKeyDown={onKeyDown}>
            <header>
                <h2>{alt}</h2>
                <span className="zoom-level" aria-live="polite">{view ? `${Math.round(view.scale * 100)}%` : ""}</span>
                <button type="button" aria-label="Zoom out" onClick={() => zoom(1 / STEP)}>-</button>
                <button type="button" aria-label="Zoom in" onClick={() => zoom(STEP)}>+</button>
                <button type="button" onClick={fit}>Fit</button>
                <button type="button" onClick={onClose}>Close</button>
            </header>
            <div ref={stage} className="stage" tabIndex={0} aria-label="Diagram. Use plus and minus to zoom, the arrow keys to pan, and 0 to fit." onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={() => (drag.current = null)}>
                <img ref={img} src={src} alt={alt} draggable={false} onLoad={fit}
                    style={view ? { transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` } : { visibility: "hidden" }} />
            </div>
        </dialog>
    );
}
