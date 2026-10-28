use crate::prdset::load::{load_set, PrdSet};
use std::path::Path;

/// Open the PRD set in `path` (FR-001). The UI calls `invoke("open_set", { path })`.
// async: runs off the main thread, so a slow folder does not freeze the window.
#[tauri::command(async)]
pub fn open_set(path: String) -> Result<PrdSet, String> {
    load_set(Path::new(&path)).map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn open_set_returns_the_set() {
        let path = concat!(env!("CARGO_MANIFEST_DIR"), "/../docs/prd/prd-forge-viewer");
        assert_eq!(open_set(path.into()).unwrap().documents.len(), 18);
    }

    #[test]
    fn open_set_reports_no_root() {
        let dir = tempfile::TempDir::new().unwrap();
        let err = open_set(dir.path().display().to_string()).unwrap_err();
        assert!(err.starts_with("No PRD set in"));
    }
}
