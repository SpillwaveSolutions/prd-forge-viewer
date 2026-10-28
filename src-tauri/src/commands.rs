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
    let set = load_set(Path::new(folder)).map_err(|e| e.to_string())?;
    let mut s = load_settings(settings_path);
    remember(&mut s, folder);
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
        assert_eq!(load_settings(&p).last.as_deref(), Some(REAL));
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
