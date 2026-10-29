use crate::prdset::load::{load_set, PrdSet};
use crate::settings::{load_settings, remember, save_settings};
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
    // One load-change-save at a time, so parallel opens never lose an update.
    static LOCK: Mutex<()> = Mutex::new(());
    let _guard = LOCK.lock().unwrap_or_else(|e| e.into_inner());
    let mut s = load_settings(settings_path);
    remember(&mut s, &folder);
    // ponytail: a failed save only loses the reopen; it must not stop the set from opening.
    if let Err(e) = save_settings(settings_path, &s) {
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

/// A local image of the set as a data URL. Paths outside the set are refused (NFR-010).
#[tauri::command(async)]
pub fn read_asset(folder: String, rel: String) -> Result<String, String> {
    crate::prdset::section::read_asset(Path::new(&folder), &rel)
}

fn index_file(app: &AppHandle, folder: &str) -> PathBuf {
    let data = app.path().app_data_dir().unwrap_or_else(|_| PathBuf::from("."));
    crate::search::index_path(&data, Path::new(folder))
}

/// Search the set by term, in one category or in "all" (FR-008).
#[tauri::command(async)]
pub fn search(app: AppHandle, state: State<crate::search::SearchState>, folder: String, term: String, category: String) -> Result<Vec<crate::search::Hit>, String> {
    state.search(&index_file(&app, &folder), Path::new(&folder), &term, &category)
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
    fn open_failure_remembers_nothing() {
        let d = TempDir::new().unwrap();
        let p = d.path().join("settings.json");
        let err = open_and_remember(&p, &d.path().display().to_string()).unwrap_err();
        assert!(err.starts_with("No PRD set in"));
        assert!(!p.exists());
    }
}
