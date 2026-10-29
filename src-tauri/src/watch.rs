use notify_debouncer_mini::notify::{PollWatcher, RecommendedWatcher, RecursiveMode, Watcher};
use notify_debouncer_mini::{new_debouncer_opt, Config, DebounceEventResult, Debouncer};
use std::collections::{BTreeSet, HashMap};
use std::hash::{DefaultHasher, Hash, Hasher};
use std::sync::{Arc, Mutex};
use std::path::{Path, PathBuf};
use std::time::Duration;

const DEBOUNCE: Duration = Duration::from_millis(200);

/// Watches the top-level documents of one PRD set (ADR-005). Dropping it stops the watch, so a new
/// set replaces the old watcher and no event from the old set reaches the window.
pub struct SetWatcher {
    _inner: Box<dyn Send>,
}

/// The changed top-level `.md` documents in one batch of events. Files in subfolders, hidden files,
/// and temporary files do not count, so a save by rename counts once, for the document.
fn changed_docs(root: &Path, res: DebounceEventResult) -> Vec<String> {
    let Ok(events) = res else { return vec![] };
    let names: BTreeSet<String> = events
        .iter()
        .filter(|e| e.path.parent() == Some(root))
        .filter_map(|e| e.path.file_name()?.to_str().map(String::from))
        .filter(|n| n.ends_with(".md") && !n.starts_with('.'))
        .collect();
    names.into_iter().collect()
}

fn start_with<W: Watcher + Send + 'static>(folder: &Path, notify: notify_debouncer_mini::notify::Config, on_change: impl Fn(Vec<String>) + Send + 'static) -> Result<SetWatcher, String> {
    let root: PathBuf = std::fs::canonicalize(folder).map_err(|e| e.to_string())?;
    let r = root.clone();
    let handler = move |res: DebounceEventResult| {
        let files = changed_docs(&r, res);
        if !files.is_empty() {
            on_change(files);
        }
    };
    let mut d: Debouncer<W> = new_debouncer_opt(Config::default().with_timeout(DEBOUNCE).with_notify_config(notify), handler).map_err(|e| e.to_string())?;
    d.watcher().watch(&root, RecursiveMode::NonRecursive).map_err(|e| e.to_string())?;
    Ok(SetWatcher { _inner: Box::new(d) })
}

/// Pass a file on only when its content differs from the last content passed on. Both watchers
/// see each save, and the second sees the same content, so a save reloads once. A later save
/// always has new content, so the last save of a burst is never dropped.
fn only_new_content(root: PathBuf, on_change: impl Fn(Vec<String>) + Send + Sync + 'static) -> impl Fn(Vec<String>) + Send + Sync + Clone + 'static {
    // A deleted file hashes to None, which is a change too.
    let hash = |p: &Path| {
        std::fs::read(p).ok().map(|b| {
            let mut h = DefaultHasher::new();
            b.hash(&mut h);
            h.finish()
        })
    };
    // Start from the content on disk, so a late event for a file that did not change is not a change.
    let start: HashMap<String, Option<u64>> = std::fs::read_dir(&root)
        .into_iter()
        .flatten()
        .flatten()
        .filter_map(|e| e.file_name().to_str().filter(|n| n.ends_with(".md")).map(|n| (n.to_string(), hash(&e.path()))))
        .collect();
    let last = Arc::new(Mutex::new(start));
    let on_change = Arc::new(on_change);
    move |files: Vec<String>| {
        let fresh: Vec<String> = {
            let mut last = last.lock().unwrap_or_else(|e| e.into_inner());
            files.into_iter().filter(|f| {
                let now = hash(&root.join(f));
                last.insert(f.clone(), now) != Some(now)
            }).collect()
        };
        if !fresh.is_empty() {
            on_change(fresh);
        }
    }
}

impl SetWatcher {
    /// Watch with operating system file events, plus a 1-second poll as a safety net (ADR-005).
    /// File events can stop with no error, for example in a sandbox, and the poll keeps NFR-002.
    pub fn start(folder: &Path, on_change: impl Fn(Vec<String>) + Send + Sync + 'static) -> Result<SetWatcher, String> {
        let root = std::fs::canonicalize(folder).map_err(|e| e.to_string())?;
        let on = only_new_content(root, on_change);
        let events = start_with::<RecommendedWatcher>(folder, Default::default(), on.clone()).ok();
        let poll = Self::poll_every(folder, Duration::from_secs(1), on)?;
        Ok(SetWatcher { _inner: Box::new((events, poll)) })
    }

    /// The polling watcher alone: compare the folder every 500 ms.
    pub fn start_polling(folder: &Path, on_change: impl Fn(Vec<String>) + Send + 'static) -> Result<SetWatcher, String> {
        Self::poll_every(folder, Duration::from_millis(500), on_change)
    }

    fn poll_every(folder: &Path, every: Duration, on_change: impl Fn(Vec<String>) + Send + 'static) -> Result<SetWatcher, String> {
        let cfg = notify_debouncer_mini::notify::Config::default().with_poll_interval(every).with_compare_contents(true);
        start_with::<PollWatcher>(folder, cfg, on_change)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use std::sync::mpsc::{channel, Receiver};
    use std::time::Duration;
    use tempfile::TempDir;

    fn set() -> TempDir {
        let d = TempDir::new().unwrap();
        fs::write(d.path().join("04.md"), "one").unwrap();
        fs::create_dir_all(d.path().join("grades")).unwrap();
        d
    }

    fn watch(d: &TempDir, polling: bool) -> (SetWatcher, Receiver<Vec<String>>) {
        let (tx, rx) = channel();
        let on = move |files| { let _ = tx.send(files); };
        let w = if polling { SetWatcher::start_polling(d.path(), on) } else { SetWatcher::start(d.path(), on) }.unwrap();
        std::thread::sleep(Duration::from_millis(300));
        (w, rx)
    }

    #[test]
    fn a_second_save_soon_after_the_first_is_passed_on() {
        let d = set();
        let (tx, rx) = channel();
        let on = only_new_content(d.path().to_path_buf(), move |files| { let _ = tx.send(files); });
        fs::write(d.path().join("04.md"), "first").unwrap();
        on(vec!["04.md".into()]);
        fs::write(d.path().join("04.md"), "second").unwrap();
        on(vec!["04.md".into()]);
        on(vec!["04.md".into()]); // the other watcher sees the same save
        assert_eq!(rx.try_iter().count(), 2);
    }

    #[test]
    fn a_change_arrives_within_two_seconds() {
        let d = set();
        let (_w, rx) = watch(&d, false);
        fs::write(d.path().join("04.md"), "two").unwrap();
        assert_eq!(rx.recv_timeout(Duration::from_secs(2)).unwrap(), vec!["04.md"]);
    }

    #[test]
    fn a_burst_of_saves_is_one_call() {
        let d = set();
        let (_w, rx) = watch(&d, false);
        for i in 0..5 {
            fs::write(d.path().join("04.md"), format!("v{i}")).unwrap();
            std::thread::sleep(Duration::from_millis(20));
        }
        assert_eq!(rx.recv_timeout(Duration::from_secs(2)).unwrap(), vec!["04.md"]);
        assert!(rx.recv_timeout(Duration::from_millis(1500)).is_err(), "the last content is passed on once");
    }

    #[test]
    fn a_save_by_rename_counts_once_for_the_document() {
        let d = set();
        let (_w, rx) = watch(&d, false);
        fs::write(d.path().join("04.md.tmp"), "renamed").unwrap();
        fs::rename(d.path().join("04.md.tmp"), d.path().join("04.md")).unwrap();
        assert_eq!(rx.recv_timeout(Duration::from_secs(2)).unwrap(), vec!["04.md"]);
    }

    #[test]
    fn files_in_subfolders_do_not_count() {
        let d = set();
        let (_w, rx) = watch(&d, false);
        fs::write(d.path().join("grades/04-personas.md"), "grade").unwrap();
        assert!(rx.recv_timeout(Duration::from_millis(1200)).is_err());
    }

    #[test]
    fn a_dropped_watcher_stops() {
        let d = set();
        let (w, rx) = watch(&d, false);
        drop(w);
        fs::write(d.path().join("04.md"), "after").unwrap();
        assert!(rx.recv_timeout(Duration::from_millis(1200)).is_err());
    }

    #[test]
    fn the_polling_fallback_sees_a_change() {
        let d = set();
        let (_w, rx) = watch(&d, true);
        std::thread::sleep(Duration::from_millis(600));
        fs::write(d.path().join("04.md"), "polled change").unwrap();
        assert_eq!(rx.recv_timeout(Duration::from_secs(2)).unwrap(), vec!["04.md"]);
    }
}
