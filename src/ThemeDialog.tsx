import { useEffect, useState } from "react";
import { DEFAULT_EXPORT_THEME_ID, listThemes, parseHex, sanitizeCustomThemes, slugThemeId, type ExportTheme, type ThemeFont } from "./themes";

// Adapted from Motion's ThemeSettingsDialog (MIT): only the four colors and two fonts of WF-008.

const FONTS: ThemeFont[] = ["serif", "sans", "mono"];

/** A new custom theme that starts as a copy of `source`, with an id no other theme uses. */
export function copyTheme(source: ExportTheme, all: readonly ExportTheme[]): ExportTheme {
    const name = `Copy of ${source.name}`;
    return { ...source, id: slugThemeId(name, all.map((t) => t.id)), name, builtin: false };
}

/** The custom themes without `id`. A built-in id is never in the list, so it is never removed (FR-018). */
export function withoutTheme(custom: readonly ExportTheme[], id: string): ExportTheme[] {
    return custom.filter((t) => t.id !== id);
}

/** The themes dialog (WF-008). Nothing is saved until the author selects Save themes. */
export function ThemeDialog({ themes, themeId, onClose, onSave }: {
    themes: readonly ExportTheme[];
    themeId: string;
    onClose: () => void;
    onSave: (next: { themes: ExportTheme[]; selected: string }) => void;
}) {
    const [custom, setCustom] = useState<ExportTheme[]>(() => themes.filter((t) => !t.builtin));
    const [selected, setSelected] = useState(themeId);
    const [exportId, setExportId] = useState(themeId);
    const all = listThemes(custom);
    const current = all.find((t) => t.id === selected) ?? all[0]!;

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const update = (patch: Partial<ExportTheme>) => {
        if (current.builtin) return;
        setCustom((prev) => prev.map((t) => (t.id === current.id ? { ...t, ...patch } : t)));
    };
    const add = () => {
        const next = copyTheme(current, all);
        setCustom((prev) => [...prev, next]);
        setSelected(next.id);
    };
    const remove = () => {
        if (current.builtin) return;
        setCustom((prev) => withoutTheme(prev, current.id));
        if (exportId === current.id) setExportId(DEFAULT_EXPORT_THEME_ID);
        setSelected(DEFAULT_EXPORT_THEME_ID);
    };
    // A hex value that is not a color is saved as the Clay value, the same rule as on load.
    const save = () => onSave({ themes: sanitizeCustomThemes(custom), selected: exportId });

    return (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Themes">
            <h2>Themes</h2>
            <div className="theme-layout">
                <ul className="theme-list" aria-label="Theme list">
                    {all.map((t) => (
                        <li key={t.id}>
                            <button type="button" aria-pressed={t.id === current.id} onClick={() => setSelected(t.id)}>
                                <span className="theme-swatch" style={{ background: t.page, borderColor: t.accent }} />
                                {t.name}
                                {t.builtin ? " (built-in)" : ""}
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="theme-form">
                    <label>
                        Name
                        <input aria-label="Theme name" value={current.name} disabled={current.builtin} onChange={(e) => update({ name: e.target.value.slice(0, 40) })} />
                    </label>
                    <ColorField label="Page" value={current.page} disabled={current.builtin} onChange={(page) => update({ page })} />
                    <ColorField label="Text" value={current.text} disabled={current.builtin} onChange={(text) => update({ text })} />
                    <ColorField label="Headings" value={current.heading} disabled={current.builtin} onChange={(heading) => update({ heading })} />
                    <ColorField label="Accent" value={current.accent} disabled={current.builtin} onChange={(accent) => update({ accent })} />
                    <FontField label="Text font" value={current.font} disabled={current.builtin} onChange={(font) => update({ font })} />
                    <FontField label="Heading font" value={current.headingFont} disabled={current.builtin} onChange={(headingFont) => update({ headingFont })} />
                    <label>
                        <input type="radio" name="export-theme" checked={exportId === current.id} onChange={() => setExportId(current.id)} />
                        Use for export
                    </label>
                </div>
            </div>
            <div className="actions">
                <button type="button" onClick={add}>New theme</button>
                <button type="button" disabled={current.builtin} onClick={remove}>Delete</button>
                <button type="button" onClick={onClose}>Cancel</button>
                <button type="button" onClick={save}>Save themes</button>
            </div>
        </div>
    );
}

function ColorField({ label, value, disabled, onChange }: { label: string; value: string; disabled: boolean; onChange: (v: string) => void }) {
    return (
        <label>
            {label}
            <input type="color" aria-label={`${label} color`} value={(parseHex(value) ?? "#000000").toLowerCase()} disabled={disabled} onChange={(e) => onChange(e.target.value.toUpperCase())} />
            <input aria-label={`${label} hex`} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
        </label>
    );
}

function FontField({ label, value, disabled, onChange }: { label: string; value: ThemeFont; disabled: boolean; onChange: (v: ThemeFont) => void }) {
    return (
        <label>
            {label}
            <select aria-label={label} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value as ThemeFont)}>
                {FONTS.map((f) => <option key={f} value={f}>{f === "sans" ? "sans-serif" : f === "mono" ? "monospace" : f}</option>)}
            </select>
        </label>
    );
}
