use crate::prdset::load::{load_set, PrdSet};
use crate::settings::{load_settings, remember, update_settings};
use crate::start::{start_view, StartView};
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};

/// The path from the first launch (`prdf` passes it). `startup` takes it once.
pub struct StartArg(pub Mutex<Option<PathBuf>>);

pub fn settings_path(app: &AppHandle) -> PathBuf {
    app.path().app_config_dir().unwrap_or_else(|_| PathBuf::from(".")).join("settings.json")
}

/// Load the set, and only on success make it the last set and a known location.
pub fn open_and_remember(settings_path: &Path, folder: &str) -> Result<PrdSet, String> {
    let folder = std::fs::canonicalize(folder).map(|p| p.display().to_string()).unwrap_or_else(|_| folder.to_string());
    let set = load_set(Path::new(&folder)).map_err(|e| e.to_string())?;
    // ponytail: a failed save only loses the reopen; it must not stop the set from opening.
    if let Err(e) = update_settings(settings_path, |s| remember(s, &folder)) {
        eprintln!("settings not saved to {}: {e}", settings_path.display());
    }
    Ok(set)
}

/// Open the PRD set in `path` (FR-001). Async, so a slow folder does not freeze the window.
#[tauri::command(async)]
pub fn open_set(app: AppHandle, path: String) -> Result<PrdSet, String> {
    open_and_remember(&settings_path(&app), &path)
}

/// What the window shows at start (FR-002, FR-021, FR-024).
#[tauri::command(async)]
pub fn startup(app: AppHandle, arg: State<StartArg>) -> StartView {
    let arg = arg.0.lock().unwrap().take();
    start_view(arg.as_deref(), &load_settings(&settings_path(&app)))
}

/// The start view for a folder that the author picked (FR-021, FR-022, FR-024).
#[tauri::command(async)]
pub fn start_for(app: AppHandle, path: String) -> StartView {
    start_view(Some(Path::new(&path)), &load_settings(&settings_path(&app)))
}

/// One document of the set, with its body and items (FR-005, FR-023).
#[tauri::command(async)]
pub fn read_section(folder: String, file: String) -> Result<crate::prdset::section::Section, String> {
    crate::prdset::section::read_section(Path::new(&folder), &file)
}

/// Every item id of the set with the file that holds it (FR-007).
#[tauri::command(async)]
pub fn item_index(folder: String) -> Vec<crate::prdset::section::ItemRef> {
    crate::prdset::section::item_index(Path::new(&folder))
}

/// The backlog next to the PRD set, or null when there is none (FR-028).
#[tauri::command(async)]
pub fn backlog(folder: String) -> Option<crate::prdset::section::Backlog> {
    crate::prdset::section::backlog_of(Path::new(&folder))
}

/// Each backlog story with the requirement ids it builds (FR-028).
#[tauri::command(async)]
pub fn story_links(folder: String) -> Vec<crate::prdset::section::StoryLink> {
    crate::prdset::section::story_links(Path::new(&folder))
}

/// The findings behind the grade of a section, as markdown, or null with no note (FR-025).
#[tauri::command(async)]
pub fn read_grade(folder: String, file: String) -> Result<Option<String>, String> {
    crate::prdset::section::read_grade(Path::new(&folder), &file)
}

/// The picture of a diagram for an export, as a data URL: its PNG, or its SVG when the PNG is older.
#[tauri::command(async)]
pub fn export_image(folder: String, rel: String) -> Result<String, String> {
    crate::prdset::section::export_image(Path::new(&folder), &rel)
}

/// A local image of the set as a data URL. Paths outside the set are refused (NFR-010).
#[tauri::command(async)]
pub fn read_asset(folder: String, rel: String) -> Result<String, String> {
    crate::prdset::section::read_asset(Path::new(&folder), &rel)
}

fn index_file(app: &AppHandle, folder: &str) -> PathBuf {
    let data = app.path().app_data_dir().unwrap_or_else(|_| PathBuf::from("."));
    crate::search::index_path(&data, Path::new(folder))
}

/// Search the set by term, in the given categories, or in all when the list is empty (FR-008).
#[tauri::command(async)]
pub fn search(app: AppHandle, state: State<crate::search::SearchState>, folder: String, term: String, categories: Vec<String>) -> Result<Vec<crate::search::Hit>, String> {
    state.search(&index_file(&app, &folder), Path::new(&folder), &term, &categories)
}

/// The search categories of the set, in reading order.
#[tauri::command(async)]
pub fn categories(app: AppHandle, state: State<crate::search::SearchState>, folder: String) -> Result<Vec<crate::search::Category>, String> {
    state.categories(&index_file(&app, &folder), Path::new(&folder))
}

/// Install `prdf` in ~/.local/bin, after the author confirms in the UI (FR-021, ADR-004).
#[tauri::command(async)]
pub fn install_prdf() -> Result<String, String> {
    let home = std::env::var("HOME").map_err(|_| "HOME is not set".to_string())?;
    let dir = Path::new(&home).join(".local/bin");
    let path = crate::launcher::install_launcher(&dir)?;
    let on_path = std::env::var("PATH").unwrap_or_default().split(':').any(|p| Path::new(p) == dir);
    Ok(if on_path {
        format!("Installed {}. Run prdf in a project folder.", path.display())
    } else {
        format!("Installed {}. Add {} to your PATH to run prdf.", path.display(), dir.display())
    })
}

/// The custom export themes and the selected theme id, from the settings file (FR-020).
#[tauri::command]
pub fn themes(app: AppHandle) -> serde_json::Value {
    let s = load_settings(&settings_path(&app));
    serde_json::json!({ "themes": s.themes, "selected": s.export_theme })
}

/// Save the custom export themes and the selected theme id, with the atomic save (NFR-008).
#[tauri::command]
pub fn save_themes(app: AppHandle, themes: Vec<serde_json::Value>, selected: Option<String>) -> Result<(), String> {
    store_themes(&settings_path(&app), themes, selected)
}

pub fn store_themes(path: &Path, themes: Vec<serde_json::Value>, selected: Option<String>) -> Result<(), String> {
    update_settings(path, |s| crate::settings::set_themes(s, themes, selected)).map_err(|e| e.to_string())
}

/// The text size and the search pin, from the settings file (FR-026, FR-027, ADR-004).
#[tauri::command]
pub fn view_prefs(app: AppHandle) -> serde_json::Value {
    let s = load_settings(&settings_path(&app));
    serde_json::json!({ "textZoom": s.text_zoom.unwrap_or(1.0), "searchPinned": s.search_pinned })
}

/// Save the text size and the search pin, with the atomic save (NFR-008).
#[tauri::command]
pub fn save_view_prefs(app: AppHandle, text_zoom: f64, search_pinned: bool) -> Result<(), String> {
    update_settings(&settings_path(&app), |s| crate::settings::set_view(s, text_zoom, search_pinned)).map_err(|e| e.to_string())
}

/// Save a Word export, sent as base64, outside the set folder (FR-011, OUT-001).
#[tauri::command(async)]
pub fn write_export(app: AppHandle, folder: String, path: String, data: String) -> Result<(), String> {
    use base64::Engine;
    let bytes = base64::engine::general_purpose::STANDARD.decode(data).map_err(|e| e.to_string())?;
    crate::export::write_export(&known_sets(&app, &folder), Path::new(&path), &bytes)
}

/// The open set and every set in the settings file. An export may write into none of them.
fn known_sets(app: &AppHandle, folder: &str) -> Vec<PathBuf> {
    let s = load_settings(&settings_path(app));
    std::iter::once(folder.to_string()).chain(s.known).chain(s.last).map(PathBuf::from).collect()
}

/// Print themed HTML to a PDF outside the set folder, with headless Chrome (FR-010, ADR-002).
#[tauri::command(async)]
pub fn export_pdf(app: AppHandle, folder: String, path: String, html: String) -> Result<(), String> {
    let chrome = crate::export::find_chrome(&crate::export::chrome_candidates())?;
    let work = app.path().app_cache_dir().map_err(|e| e.to_string())?.join("export");
    crate::export::export_pdf(&chrome, &work, &known_sets(&app, &folder), Path::new(&path), &html)
}

/// Open the macOS print dialog for the window. The window shows only the export on paper (FR-013).
#[tauri::command]
pub fn print_page(window: tauri::WebviewWindow) -> Result<(), String> {
    window.print().map_err(|e| e.to_string())
}

/// The watcher of the open set. A new watch replaces it, so the old set's events stop.
#[derive(Default)]
pub struct WatchState(Mutex<Option<crate::watch::SetWatcher>>);

/// Watch the open set, and emit `set-changed` with the changed file names (FR-009, ADR-005).
/// With no folder, stop watching. A sync command runs on the main thread in the order of the calls,
/// so the last set opened is always the one watched.
#[tauri::command]
pub fn watch_set(app: AppHandle, state: State<WatchState>, folder: Option<String>) -> Result<(), String> {
    use tauri::Emitter;
    let mut slot = state.0.lock().unwrap_or_else(|e| e.into_inner());
    *slot = None;
    let Some(folder) = folder else { return Ok(()) };
    let f = folder.clone();
    let watcher = crate::watch::SetWatcher::start(Path::new(&folder), move |files| {
        let _ = app.emit("set-changed", serde_json::json!({ "folder": f, "files": files }));
    })?;
    *slot = Some(watcher);
    Ok(())
}

/// Load the open set again after a change. Unlike open_set, it does not change the settings.
#[tauri::command(async)]
pub fn reload_set(folder: String) -> Result<PrdSet, String> {
    load_set(Path::new(&folder)).map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::settings::load_settings;
    use tempfile::TempDir;

    const REAL: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/../docs/prd/prd-forge-viewer");

    #[test]
    fn open_set_returns_the_set() {
        let d = TempDir::new().unwrap();
        assert_eq!(open_and_remember(&d.path().join("settings.json"), REAL).unwrap().documents.len(), 18);
    }

    #[test]
    fn open_remembers_on_success() {
        let d = TempDir::new().unwrap();
        let p = d.path().join("settings.json");
        open_and_remember(&p, REAL).unwrap();
        let real = std::fs::canonicalize(REAL).unwrap().display().to_string();
        assert_eq!(load_settings(&p).last, Some(real));
    }

    #[test]
    fn dot_path_is_one_location() {
        let d = TempDir::new().unwrap();
        let p = d.path().join("settings.json");
        open_and_remember(&p, REAL).unwrap();
        open_and_remember(&p, &format!("{REAL}/.")).unwrap();
        assert_eq!(load_settings(&p).known.len(), 1);
    }

    #[test]
    fn parallel_opens_keep_valid_settings() {
        let d = TempDir::new().unwrap();
        let p = d.path().join("settings.json");
        let handles: Vec<_> = (0..8)
            .map(|_| {
                let p = p.clone();
                std::thread::spawn(move || open_and_remember(&p, REAL).unwrap())
            })
            .collect();
        for h in handles {
            h.join().unwrap();
        }
        let text = std::fs::read_to_string(&p).unwrap();
        assert!(serde_json::from_str::<crate::settings::Settings>(&text).is_ok(), "{text}");
    }

    #[test]
    fn theme_saves_and_opens_in_parallel_lose_nothing() {
        let d = TempDir::new().unwrap();
        let p = d.path().join("settings.json");
        let acme = serde_json::json!({"id": "acme", "name": "Acme"});
        let handles: Vec<_> = (0..8)
            .map(|i| {
                let (p, acme) = (p.clone(), acme.clone());
                std::thread::spawn(move || {
                    if i % 2 == 0 {
                        open_and_remember(&p, REAL).map(|_| ())
                    } else {
                        store_themes(&p, vec![acme], Some("acme".into()))
                    }
                })
            })
            .collect();
        for h in handles {
            h.join().unwrap().unwrap();
        }
        let s = load_settings(&p);
        assert_eq!(s.known.len(), 1);
        assert_eq!(s.themes, vec![acme]);
    }

    #[test]
    fn reload_reads_the_set_again() {
        let d = TempDir::new().unwrap();
        let set = d.path().join("set");
        std::fs::create_dir_all(&set).unwrap();
        for e in std::fs::read_dir(REAL).unwrap().flatten() {
            if e.path().extension().is_some_and(|x| x == "md") {
                std::fs::copy(e.path(), set.join(e.file_name())).unwrap();
            }
        }
        let folder = set.display().to_string();
        assert_eq!(reload_set(folder.clone()).unwrap().documents.len(), 18);
        std::fs::write(set.join("04-personas.md"), "no front matter").unwrap();
        let again = reload_set(folder).unwrap();
        assert_eq!(again.documents.iter().find(|d| d.file == "04-personas.md").unwrap().status, "unreadable");
    }

    #[test]
    fn open_failure_remembers_nothing() {
        let d = TempDir::new().unwrap();
        let p = d.path().join("settings.json");
        let err = open_and_remember(&p, &d.path().display().to_string()).unwrap_err();
        assert!(err.starts_with("No PRD set in"));
        assert!(!p.exists());
    }
}
