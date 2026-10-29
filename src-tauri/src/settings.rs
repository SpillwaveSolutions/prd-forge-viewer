use serde::{Deserialize, Serialize};
use std::fs;
use std::io;
use std::path::Path;
use std::sync::atomic::{AtomicU32, Ordering};

/// Known PRD set locations, the last open set, and the custom export themes, kept in the app
/// config folder (ADR-004).
#[derive(Serialize, Deserialize, Default, Debug, PartialEq, Clone)]
pub struct Settings {
    #[serde(default)]
    pub known: Vec<String>,
    #[serde(default)]
    pub last: Option<String>,
    /// Custom export themes, as the UI writes them. The UI checks each field when it reads them.
    #[serde(default)]
    pub themes: Vec<serde_json::Value>,
    #[serde(default)]
    pub export_theme: Option<String>,
}

const BUILTIN_THEMES: [&str; 2] = ["clay", "ice-snowstorm"];

/// Store the custom themes and the selected theme. A theme with a built-in id is dropped, so a
/// built-in theme can never change (FR-017, FR-018).
pub fn set_themes(s: &mut Settings, themes: Vec<serde_json::Value>, selected: Option<String>) {
    s.themes = themes.into_iter().filter(|t| !t["id"].as_str().is_some_and(|id| BUILTIN_THEMES.contains(&id))).collect();
    s.export_theme = selected;
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
    static N: AtomicU32 = AtomicU32::new(0);
    let tmp = path.with_extension(format!("json.{}.{}.tmp", std::process::id(), N.fetch_add(1, Ordering::Relaxed)));
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

    #[test]
    fn a_plan_2_file_loads_with_no_themes() {
        let d = TempDir::new().unwrap();
        let p = d.path().join("settings.json");
        std::fs::write(&p, r#"{"known":["/a"],"last":"/a"}"#).unwrap();
        let s = load_settings(&p);
        assert_eq!(s.known, vec!["/a"]);
        assert!(s.themes.is_empty());
        assert_eq!(s.export_theme, None);
    }

    #[test]
    fn themes_survive_a_restart_and_keep_the_locations() {
        let d = TempDir::new().unwrap();
        let p = d.path().join("settings.json");
        let mut s = Settings::default();
        remember(&mut s, "/a");
        let acme = serde_json::json!({"id": "acme", "name": "Acme", "accent": "#123456"});
        set_themes(&mut s, vec![acme.clone()], Some("acme".into()));
        save_settings(&p, &s).unwrap();
        let back = load_settings(&p);
        assert_eq!(back.known, vec!["/a"]);
        assert_eq!(back.themes, vec![acme]);
        assert_eq!(back.export_theme.as_deref(), Some("acme"));
    }

    #[test]
    fn a_builtin_id_is_never_stored() {
        let mut s = Settings::default();
        let themes = vec![serde_json::json!({"id": "clay", "name": "Fake"}), serde_json::json!({"id": "ice-snowstorm"}), serde_json::json!({"id": "acme"})];
        set_themes(&mut s, themes, None);
        assert_eq!(s.themes, vec![serde_json::json!({"id": "acme"})]);
    }
}
