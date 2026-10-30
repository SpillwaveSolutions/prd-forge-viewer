import { useEffect, useRef, type ReactNode } from "react";

/**
 * The search panel in a drawer that slides out from the right. Pinned, it stays open beside the
 * document while you read results. Unpinned, it closes with Escape, Close, or after you open a
 * result. It stays mounted when closed, so the last results are still there when it opens again.
 */
export function SearchDrawer({ open, pinned, onClose, onPin, children }: {
    open: boolean;
    pinned: boolean;
    onClose: () => void;
    onPin: (pinned: boolean) => void;
    children: ReactNode;
}) {
    const ref = useRef<HTMLElement>(null);

    // Opening the drawer puts the focus in the search box.
    useEffect(() => {
        if (open) ref.current?.querySelector<HTMLInputElement>("input[type=search]")?.focus();
    }, [open]);

    // Escape closes an unpinned drawer. A modal dialog handles its own Escape first.
    useEffect(() => {
        if (!open || pinned) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !document.querySelector("dialog[open]")) onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, pinned, onClose]);

    return (
        <aside ref={ref} id="search-drawer" aria-label="Search drawer" className={`search-drawer${open ? " open" : ""}${pinned ? " pinned" : ""}`} inert={!open}>
            <div className="drawer-head">
                <h2>Search</h2>
                <button type="button" aria-pressed={pinned} title={pinned ? "Unpin: close after you open a result" : "Pin: keep open while you read results"} onClick={() => onPin(!pinned)}>
                    {pinned ? "Pinned" : "Pin"}
                </button>
                <button type="button" aria-label="Close search" onClick={onClose}>Close</button>
            </div>
            {children}
        </aside>
    );
}
