import { useCallback, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { ask, open, save } from "@tauri-apps/plugin-dialog";
import { GradesTable } from "./GradesTable";
import { SearchPanel } from "./SearchPanel";
import { SearchDrawer } from "./SearchDrawer";
import { SectionPage } from "./SectionPage";
import { SetOverview } from "./SetOverview";
import { StartScreen } from "./StartScreen";
import { applyResult, applyStart, openSet } from "./openSet";
import { applyChange, reloadedPage } from "./live";
import { ExportDialog } from "./ExportDialog";
import { runExport, runPrint, type Deps } from "./exportRun";
import { ThemeDialog } from "./ThemeDialog";
import { nextZoom, readZoom } from "./textZoom";
import { DEFAULT_EXPORT_THEME_ID, sanitizeCustomThemes, type ExportTheme } from "./themes";
import type { Category, Hit, ItemRef, PrdSet, Section, StartView } from "./types";

const pickFolder = async () => {
    const picked = await open({ directory: true, title: "Open PRD set" });
    return typeof picked === "string" ? picked : null;
};
declare const __PFV_E2E__: boolean;
const loadSet = (path: string) => invoke<PrdSet>("open_set", { path });

export function App() {
    const [set, setSet] = useState<PrdSet>();
    const [error, setError] = useState<string>();
    const [start, setStart] = useState<Exclude<StartView, { kind: "open" }>>();
    const [notice, setNotice] = useState<string>();
    // The text size (FR-026). The page sizes everything in rem, so one root size scales the text.
    const [zoom, setZoom] = useState(1);
    useEffect(() => { document.documentElement.style.fontSize = `${15 * zoom}px`; }, [zoom]);
    // The search drawer (FR-027).
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchPinned, setSearchPinned] = useState(false);
    const pinSearch = (pinned: boolean) => setSearchPinned(pinned);
    // The text size and the pin live in the settings file (ADR-004). Nothing is saved until the
    // stored values are read, so a start never overwrites them with the defaults.
    const prefsRead = useRef(false);
    useEffect(() => {
        void invoke<{ textZoom: number; searchPinned: boolean }>("view_prefs").then((p) => {
            setZoom(readZoom(String(p.textZoom)));
            setSearchPinned(p.searchPinned);
            prefsRead.current = true;
        }).catch(() => { prefsRead.current = true; });
    }, []);
    useEffect(() => {
        if (prefsRead.current) void invoke("save_view_prefs", { textZoom: zoom, searchPinned }).catch(() => { /* the values still apply for this session */ });
    }, [zoom, searchPinned]);
    const closeSearch = useCallback(() => setSearchOpen(false), []);
    const hasSet = useRef(false);
    hasSet.current = !!set;
    // The drawer starts below the header. The header height changes with the text size and the window width.
    const header = useRef<HTMLElement>(null);
    useEffect(() => {
        const el = header.current;
        if (!el) return;
        const ro = new ResizeObserver(() => document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);
    useEffect(() => {
        // Command-plus, Command-minus, and Command-0, as in a browser.
        const onKey = (e: KeyboardEvent) => {
            if (!e.metaKey || e.altKey || e.ctrlKey) return;
            if (e.key === "f") {
                // Search needs an open set. With none, Command-F does nothing.
                if (hasSet.current) { e.preventDefault(); setSearchOpen(true); }
                return;
            }
            const dir = e.key === "=" || e.key === "+" ? 1 : e.key === "-" ? -1 : e.key === "0" ? 0 : null;
            if (dir === null) return;
            e.preventDefault();
            setZoom((z) => nextZoom(z, dir));
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);
    // Custom export themes and the selected theme, from the settings file (FR-020).
    const [themes, setThemes] = useState<{ custom: ExportTheme[]; selected: string }>({ custom: [], selected: DEFAULT_EXPORT_THEME_ID });
    const [editThemes, setEditThemes] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [page, setPage] = useState<{ section: Section; selected: string | null }>();
    const [index, setIndex] = useState<ItemRef[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [changed, setChanged] = useState<Set<string>>(new Set());
    // The listener for set-changed lives for the whole window, so it reads the current set and page from refs.
    const current = useRef<{ set?: PrdSet; page?: { section: Section; selected: string | null } }>({});
    current.current = { set, page };

    // Each new set gets a fresh item index and starts on its overview.
    useEffect(() => {
        setPage(undefined);
        setIndex([]);
        setCategories([]);
        setChanged(new Set());
        if (!set) void invoke("watch_set", { folder: null }).catch(() => {});
        if (set) {
            void invoke("watch_set", { folder: set.folder }).catch((e) => setError(`Live updates are off: ${e}`));
            void invoke<ItemRef[]>("item_index", { folder: set.folder }).then(setIndex).catch(() => setIndex([]));
            void invoke<Category[]>("categories", { folder: set.folder }).then(setCategories).catch(() => setCategories([]));
        }
    }, [set?.folder]);

    const openDoc = useCallback(async (file: string, selected: string | null = null) => {
        if (!set) return;
        try {
            setPage({ section: await invoke<Section>("read_section", { folder: set.folder, file }), selected });
            setError(undefined);
        } catch (e) {
            setError(String(e));
        }
    }, [set]);
    const openItem = useCallback((id: string) => {
        const ref = index.find((r) => r.id === id);
        if (ref) void openDoc(ref.file, id);
    }, [index, openDoc]);
    const loadAsset = useCallback((rel: string) => invoke<string>("read_asset", { folder: set!.folder, rel }), [set]);
    const known = new Set(index.map((r) => r.id));

    const show = useCallback(async (pick: () => Promise<string | null>) => {
        const next = applyResult(set, await openSet(pick, loadSet));
        setSet(next.set);
        setError(next.error);
        if (next.set) setStart(undefined);
    }, [set]);

    const showStart = useCallback((view: StartView) => {
        if (view.kind === "open") void show(async () => view.folder);
        else {
            const next = applyStart(view);
            setSet(next.set);
            setError(next.error);
            setStart(next.start);
        }
    }, [show]);

    // FR-009: a change from the authoring tools shows with no action from the author.
    useEffect(() => {
        let seq = 0;
        const off = listen<{ folder: string; files: string[] }>("set-changed", async (e) => {
            const { set: open, page: shown } = current.current;
            if (!open || e.payload.folder !== open.folder) return;
            const mine = ++seq;
            // A later change, or another set, wins over this one.
            const stale = () => mine !== seq || current.current.set?.folder !== open.folder;
            setChanged((c) => applyChange(c, e.payload.files));
            const fresh = await invoke<PrdSet>("reload_set", { folder: open.folder }).catch(() => undefined);
            if (stale()) return;
            if (fresh) setSet(fresh);
            void invoke<ItemRef[]>("item_index", { folder: open.folder }).then((i) => stale() || setIndex(i)).catch(() => {});
            if (shown && e.payload.files.includes(shown.section.file)) {
                const section = await invoke<Section>("read_section", { folder: open.folder, file: shown.section.file }).catch(() => undefined);
                if (stale() || current.current.page?.section.file !== shown.section.file) return;
                const next = reloadedPage(shown, section);
                setPage(next.page);
                if (next.error) setError(next.error);
            }
        });
        return () => void off.then((f) => f());
    }, []);

    useEffect(() => {
        void invoke<{ themes: unknown; selected: string | null }>("themes").then((t) => setThemes({ custom: sanitizeCustomThemes(t.themes), selected: t.selected ?? DEFAULT_EXPORT_THEME_ID }));
        void invoke<StartView>("startup").then(showStart);
        const unlisten = listen<StartView>("start", (e) => showStart(e.payload));
        return () => void unlisten.then((f) => f());
        // Run once at start; later launches arrive as "start" events.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // A picked folder goes through the same start rules as prdf: one set opens, several are listed,
    // and a folder with no set shows the known locations (FR-022, FR-024).
    const pickAndStart = async () => {
        const folder = await pickFolder().catch(() => null);
        if (folder) showStart(await invoke<StartView>("start_for", { path: folder }));
    };

    // The e2e checks set window.__pfvSavePath and window.__pfvPrint, because they cannot drive the macOS dialogs.
    // Only the MCP test build (scripts/build.ts --e2e) reads them; a release build has no hooks.
    const testHooks: { __pfvSavePath?: string; __pfvPrint?: () => void } = typeof __PFV_E2E__ !== "undefined" && __PFV_E2E__ ? (window as never) : {};
    const exportDeps = (folder: string): Deps => ({
        read: (file) => invoke<Section>("read_section", { folder, file }),
        asset: (rel) => invoke<string>("export_image", { folder, rel }),
        save: async (format, name) => testHooks.__pfvSavePath ?? (await save({ defaultPath: name, filters: [{ name: format === "pdf" ? "PDF" : "Word", extensions: [format] }] })),
        writeDocx: (path, data) => invoke("write_export", { folder, path, data }),
        writePdf: (path, html) => invoke("export_pdf", { folder, path, html }),
        print: async () => { if (testHooks.__pfvPrint) testHooks.__pfvPrint(); else await invoke("print_page"); },
    });

    const installPrdf = async () => {
        if (!(await ask("Install the prdf command in ~/.local/bin?", { title: "Install prdf command" }))) return;
        setNotice(await invoke<string>("install_prdf").catch(String));
    };

    return (
        <main className={set && searchOpen && searchPinned ? "with-drawer" : undefined}>
            <header ref={header} className="toolbar">
                <button type="button" onClick={pickAndStart} autoFocus>
                    Open PRD set
                </button>{" "}
                <button type="button" onClick={installPrdf}>
                    Install prdf command
                </button>{" "}
                <button type="button" onClick={() => setEditThemes(true)}>
                    Themes
                </button>
                {set && (
                    <>
                        {" "}
                        <button type="button" onClick={() => setExporting(true)}>
                            Export
                        </button>{" "}
                        <button type="button" aria-expanded={searchOpen} aria-controls="search-drawer" title="Search (Command-F)" onClick={() => setSearchOpen((o) => !o)}>
                            Search
                        </button>
                    </>
                )}
                <span role="group" aria-label="Text size" className="text-size">
                    <button type="button" aria-label="Smaller text" title="Smaller text (Command-minus)" disabled={nextZoom(zoom, -1) === zoom} onClick={() => setZoom((z) => nextZoom(z, -1))}>A−</button>
                    <button type="button" aria-label="Normal text size" title="Normal text size (Command-0)" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
                    <button type="button" aria-label="Larger text" title="Larger text (Command-plus)" disabled={nextZoom(zoom, 1) === zoom} onClick={() => setZoom((z) => nextZoom(z, 1))}>A+</button>
                </span>
            </header>
            {exporting && set && (
                <ExportDialog
                    set={set}
                    themes={themes.custom}
                    themeId={themes.selected}
                    onEditThemes={() => setEditThemes(true)}
                    onClose={() => setExporting(false)}
                    onExport={(format, theme, selected, options) => runExport(format, set, theme, selected, exportDeps(set.folder), options)}
                    onPrint={(theme, selected, options) => runPrint(set, theme, selected, exportDeps(set.folder), options)}
                />
            )}
            {editThemes && (
                <ThemeDialog
                    themes={themes.custom}
                    themeId={themes.selected}
                    onClose={() => setEditThemes(false)}
                    onSave={async (next) => {
                        try {
                            await invoke("save_themes", { themes: next.themes, selected: next.selected });
                            setThemes({ custom: next.themes, selected: next.selected });
                            setEditThemes(false);
                        } catch (e) {
                            setError(`Themes not saved: ${e}`);
                        }
                    }}
                />
            )}
            {notice && <p role="status">{notice}</p>}
            {error && <p role="alert" className="error">{error}</p>}
            {set && (
                <SearchDrawer open={searchOpen} pinned={searchPinned} onClose={closeSearch} onPin={pinSearch}>
                    <SearchPanel
                        key={set.folder}
                        categories={categories}
                        onSearch={(term, categories) => invoke<Hit[]>("search", { folder: set.folder, term, categories })}
                        onOpenHit={(hit) => { if (!searchPinned) setSearchOpen(false); openDoc(hit.file, hit.id); }}
                    />
                </SearchDrawer>
            )}
            {set && page ? (
                <SectionPage
                    section={page.section}
                    known={known}
                    selected={page.selected}
                    onSelect={(selected) => setPage({ ...page, selected })}
                    onOpenItem={openItem}
                    onOpenDoc={openDoc}
                    onBack={() => { setPage(undefined); setError(undefined); }}
                    loadAsset={loadAsset}
                    loadFindings={() => invoke<string | null>("read_grade", { folder: set.folder, file: page.section.file })}
                    changed={changed.has(page.section.file)}
                    nav={set.documents.filter((d) => !d.unreadable).map((d) => (
                        <button key={d.file} type="button" className="doc-link" data-status={d.status} aria-current={d.file === page.section.file ? "page" : undefined} onClick={() => openDoc(d.file)}>
                            {d.title}
                        </button>
                    ))}
                />
            ) : set ? (
                <>
                    <SetOverview set={set} onOpen={(file) => openDoc(file)} changed={changed} />
                    <GradesTable documents={set.documents} />
                </>
            ) : start ? (
                <StartScreen view={start} onOpen={(folder) => show(async () => folder)} />
            ) : (
                !error && <h1>PRD Forge Viewer</h1>
            )}
        </main>
    );
}
