use crate::locate::{find_sets, set_ref, SetRef};
use crate::settings::Settings;
use serde::Serialize;
use std::path::Path;

/// What the window shows at start (FR-002, FR-021, FR-022, FR-024).
#[derive(Serialize, Debug, PartialEq, Clone)]
#[serde(tag = "kind", rename_all = "camelCase", rename_all_fields = "camelCase")]
pub enum StartView {
    Open { folder: String },
    Choose { folder: String, sets: Vec<SetRef>, known: Vec<SetRef> },
    NotFound { folder: String, known: Vec<SetRef> },
    Welcome { known: Vec<SetRef> },
}

fn known(settings: &Settings) -> Vec<SetRef> {
    settings.known.iter().map(|k| set_ref(Path::new(k))).collect()
}

/// The viewer proposes a set, and the author can open any other (TR-001, TR-012).
pub fn start_view(arg: Option<&Path>, settings: &Settings) -> StartView {
    let last = settings.last.as_deref();
    let Some(arg) = arg else {
        return match last {
            Some(l) if Path::new(l).join("prd.md").is_file() => StartView::Open { folder: l.into() },
            _ => StartView::Welcome { known: known(settings) },
        };
    };
    let folder = arg.display().to_string();
    if arg.join("prd.md").is_file() {
        return StartView::Open { folder };
    }
    let sets = find_sets(arg);
    match sets.len() {
        0 => StartView::NotFound { folder, known: known(settings) },
        1 => StartView::Open { folder: sets[0].folder.clone() },
        _ => match sets.iter().find(|s| Some(s.folder.as_str()) == last) {
            Some(s) => StartView::Open { folder: s.folder.clone() },
            None => StartView::Choose { folder, sets, known: known(settings) },
        },
    }
}
