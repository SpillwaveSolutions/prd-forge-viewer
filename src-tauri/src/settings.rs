use serde::{Deserialize, Serialize};
use std::fs;
use std::io;
use std::path::Path;

/// Known PRD set locations and the last open set, kept in the app config folder (ADR-004).
#[derive(Serialize, Deserialize, Default, Debug, PartialEq, Clone)]
pub struct Settings {
    #[serde(default)]
    pub known: Vec<String>,
    #[serde(default)]
    pub last: Option<String>,
}

/// A missing or broken file gives empty settings, so the viewer still starts.
pub fn load_settings(path: &Path) -> Settings {
    fs::read_to_string(path).ok().and_then(|t| serde_json::from_str(&t).ok()).unwrap_or_default()
}

/// Write a temporary file and rename it, so a crash never leaves half a file (NFR-008).
pub fn save_settings(path: &Path, s: &Settings) -> io::Result<()> {
    if let Some(dir) = path.parent() {
        fs::create_dir_all(dir)?;
    }
    let tmp = path.with_extension("json.tmp");
    fs::write(&tmp, serde_json::to_string_pretty(s)?)?;
    fs::rename(tmp, path)
}

/// Put `folder` first in the known locations, with no duplicate, and make it the last set.
pub fn remember(s: &mut Settings, folder: &str) {
    let folder = match folder.trim_end_matches('/') {
        "" => "/",
        f => f,
    }
    .to_string();
    s.known.retain(|k| *k != folder);
    s.known.insert(0, folder.clone());
    s.last = Some(folder);
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::TempDir;

    #[test]
    fn missing_file_is_default() {
        let d = TempDir::new().unwrap();
        assert_eq!(load_settings(&d.path().join("settings.json")), Settings::default());
    }

    #[test]
    fn bad_json_is_default() {
        let d = TempDir::new().unwrap();
        let p = d.path().join("settings.json");
        std::fs::write(&p, "{not json").unwrap();
        assert_eq!(load_settings(&p), Settings::default());
    }

    #[test]
    fn survives_restart() {
        let d = TempDir::new().unwrap();
        let p = d.path().join("cfg/settings.json");
        let mut s = Settings::default();
        for f in ["/a", "/b", "/c"] {
            remember(&mut s, f);
        }
        save_settings(&p, &s).unwrap();
        let back = load_settings(&p);
        assert_eq!(back, s);
        assert_eq!(back.last.as_deref(), Some("/c"));
    }

    #[test]
    fn remember_moves_to_front() {
        let mut s = Settings::default();
        remember(&mut s, "/a");
        remember(&mut s, "/b");
        remember(&mut s, "/a");
        assert_eq!(s.known, vec!["/a", "/b"]);
    }

    #[test]
    fn trailing_slash_is_one_location() {
        let mut s = Settings::default();
        remember(&mut s, "/x/set");
        remember(&mut s, "/x/set/");
        assert_eq!(s.known, vec!["/x/set"]);
    }
}
