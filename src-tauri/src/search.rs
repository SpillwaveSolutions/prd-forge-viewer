use crate::prdset::items::items_of;
use crate::prdset::section::{listed, read};
use rusqlite::{params, Connection};
use serde::Serialize;
use std::fs;
use std::path::{Path, PathBuf};

const SCHEMA: &str = "2";

/// One search result (FR-008): its id, title, section, category, and a score from 0 to 100.
#[derive(Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Hit {
    pub id: String,
    pub title: String,
    pub file: String,
    pub section: String,
    pub category: String,
    pub score: u8,
}

/// A search category: one for each kind of document that has items, plus "all" in the UI.
#[derive(Serialize, Debug, Clone, PartialEq)]
pub struct Category {
    pub kind: String,
    pub title: String,
}

/// The local full-text index of one PRD set (ADR-003). It is derived data: it can be deleted at any time.
pub struct Index {
    conn: Connection,
    set: PathBuf,
}

/// The index file of one set: one file for each set folder, in the app data folder.
pub fn index_path(data_dir: &Path, set: &Path) -> PathBuf {
    data_dir.join("index").join(format!("{:016x}.sqlite", fnv(set.display().to_string().as_bytes())))
}

// FNV-1a: a stable content hash, so a document is indexed again only when its bytes change.
fn fnv(bytes: &[u8]) -> u64 {
    bytes.iter().fold(0xcbf29ce484222325u64, |h, b| (h ^ *b as u64).wrapping_mul(0x100000001b3))
}

fn create(conn: &Connection) -> rusqlite::Result<()> {
    conn.execute_batch(&format!(
        "CREATE TABLE meta(key TEXT PRIMARY KEY, value TEXT);
         INSERT INTO meta VALUES ('schema', '{SCHEMA}');
         CREATE TABLE docs(file TEXT PRIMARY KEY, hash TEXT, kind TEXT, title TEXT);
         CREATE VIRTUAL TABLE items USING fts5(id, title, text, file UNINDEXED, kind UNINDEXED, section UNINDEXED, tokenize = 'porter unicode61');"
    ))
}

/// Delete an index file with its journal files, so a stale journal cannot roll back into a new file.
fn remove_files(db: &Path) {
    for suffix in ["", "-journal", "-wal", "-shm"] {
        let _ = fs::remove_file(format!("{}{suffix}", db.display()));
    }
}

fn usable(conn: &Connection) -> bool {
    conn.query_row("SELECT value FROM meta WHERE key = 'schema'", [], |r| r.get::<_, String>(0)).map(|v| v == SCHEMA).unwrap_or(false)
}

/// Each word of the term as a quoted prefix, so search syntax in the term is only text.
fn fts_query(term: &str) -> Option<String> {
    let words: Vec<String> = term.split_whitespace().map(|w| format!("\"{}\"*", w.replace('"', "\"\""))).collect();
    (!words.is_empty()).then(|| words.join(" "))
}

impl Index {
    /// Open the index file, or rebuild it when it is missing, damaged, or from an older schema.
    pub fn open(db: &Path, set: &Path) -> Result<Index, String> {
        if let Some(dir) = db.parent() {
            fs::create_dir_all(dir).map_err(|e| e.to_string())?;
        }
        let conn = match Connection::open(db) {
            Ok(c) if usable(&c) => c,
            _ => {
                remove_files(db);
                let c = Connection::open(db).map_err(|e| e.to_string())?;
                create(&c).map_err(|e| e.to_string())?;
                c
            }
        };
        Ok(Index { conn, set: set.to_path_buf() })
    }

    /// Index again each document whose bytes changed, and drop documents that are gone. Returns the number indexed.
    pub fn refresh(&mut self) -> Result<usize, String> {
        let tx = self.conn.transaction().map_err(|e| e.to_string())?;
        let files = listed(&self.set);
        let mut changed = 0;
        for file in &files {
            // read() resolves the path inside the set first, so a listed ../ or absolute path is never read.
            let doc = read(&self.set, file);
            let hash = match &doc {
                Ok((_, yaml, body)) => format!("{:016x}", fnv(format!("{yaml}\n{body}").as_bytes())),
                Err(_) => "unreadable".to_string(),
            };
            let old: Option<String> = tx.query_row("SELECT hash FROM docs WHERE file = ?1", [file], |r| r.get(0)).ok();
            if old.as_deref() == Some(hash.as_str()) {
                continue;
            }
            tx.execute("DELETE FROM items WHERE file = ?1", [file]).map_err(|e| e.to_string())?;
            let (kind, title) = match doc {
                Ok((h, yaml, _)) => {
                    for item in items_of(&yaml) {
                        // Values only: field names such as "user" or "outcome" would match every item.
                        let text = item.fields.iter().filter(|f| f.text != item.title).map(|f| f.text.as_str()).collect::<Vec<_>>().join("\n");
                        tx.execute(
                            "INSERT INTO items(id, title, text, file, kind, section) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
                            params![item.id, item.title, text, file, h.kind, h.title],
                        )
                        .map_err(|e| e.to_string())?;
                    }
                    (h.kind, h.title)
                }
                Err(_) => (String::new(), file.clone()),
            };
            tx.execute("INSERT OR REPLACE INTO docs VALUES (?1, ?2, ?3, ?4)", params![file, hash, kind, title]).map_err(|e| e.to_string())?;
            changed += 1;
        }
        let gone: Vec<String> = {
            let mut st = tx.prepare("SELECT file FROM docs").map_err(|e| e.to_string())?;
            let rows = st.query_map([], |r| r.get::<_, String>(0)).map_err(|e| e.to_string())?;
            rows.flatten().filter(|f| !files.contains(f)).collect()
        };
        for f in gone {
            tx.execute("DELETE FROM items WHERE file = ?1", [&f]).map_err(|e| e.to_string())?;
            tx.execute("DELETE FROM docs WHERE file = ?1", [&f]).map_err(|e| e.to_string())?;
        }
        tx.commit().map_err(|e| e.to_string())?;
        Ok(changed)
    }

    /// Items that match every word, best first. An id match weighs most, then the title, then the text (FR-008, criterion 3).
    pub fn search(&self, term: &str, category: &str) -> Result<Vec<Hit>, String> {
        let Some(q) = fts_query(term) else { return Ok(vec![]) };
        let mut st = self
            .conn
            .prepare(
                "SELECT id, title, file, section, kind, bm25(items, 50.0, 10.0, 1.0) AS rank FROM items
                 WHERE items MATCH ?1 AND (?2 = 'all' OR kind = ?2) ORDER BY rank, rowid LIMIT 200",
            )
            .map_err(|e| e.to_string())?;
        let rows: Vec<(Hit, f64)> = st
            .query_map(params![q, category], |r| {
                Ok((
                    Hit { id: r.get(0)?, title: r.get(1)?, file: r.get(2)?, section: r.get(3)?, category: r.get(4)?, score: 0 },
                    r.get::<_, f64>(5)?,
                ))
            })
            .map_err(|e| e.to_string())?
            .collect::<Result<_, _>>()
            .map_err(|e| e.to_string())?;
        // bm25() is lower for a better match; the best result scores 100 (ADR-003).
        let best = rows.first().map(|(_, r)| r.abs()).unwrap_or(1.0).max(f64::MIN_POSITIVE);
        Ok(rows.into_iter().map(|(mut h, r)| { h.score = ((r.abs() / best) * 100.0).round().clamp(0.0, 100.0) as u8; h }).collect())
    }

    /// The kinds of document that hold items, in reading order.
    pub fn categories(&self) -> Vec<Category> {
        let Ok(mut st) = self.conn.prepare("SELECT DISTINCT d.kind, d.title FROM docs d JOIN items i ON i.file = d.file") else { return vec![] };
        let mut cats: Vec<Category> = st.query_map([], |r| Ok(Category { kind: r.get(0)?, title: r.get(1)? })).map(|r| r.flatten().collect()).unwrap_or_default();
        let order = listed(&self.set);
        cats.sort_by_key(|c| {
            order.iter().position(|f| self.conn.query_row("SELECT kind FROM docs WHERE file = ?1", [f], |r| r.get::<_, String>(0)).ok().as_deref() == Some(c.kind.as_str()))
        });
        cats
    }
}

/// The index of the open set, kept between searches. A search on another set opens that set's index.
#[derive(Default)]
pub struct SearchState(std::sync::Mutex<Option<(PathBuf, Index)>>);

impl SearchState {
    fn with<T>(&self, db: &Path, set: &Path, f: impl Fn(&mut Index) -> Result<T, String>) -> Result<T, String> {
        let mut slot = self.0.lock().unwrap_or_else(|e| e.into_inner());
        if slot.as_ref().map(|(s, _)| s.as_path() != set).unwrap_or(true) {
            *slot = Some((set.to_path_buf(), Index::open(db, set)?));
        }
        let (_, ix) = slot.as_mut().unwrap();
        let first = ix.refresh().and_then(|_| f(ix));
        if let Ok(v) = first {
            return Ok(v);
        }
        // The index is derived data: when it fails, delete it, build it again, and try once more.
        *slot = None;
        remove_files(db);
        let mut ix = Index::open(db, set)?;
        ix.refresh()?;
        let v = f(&mut ix);
        *slot = Some((set.to_path_buf(), ix));
        v
    }

    pub fn search(&self, db: &Path, set: &Path, term: &str, category: &str) -> Result<Vec<Hit>, String> {
        self.with(db, set, |ix| ix.search(term, category))
    }

    pub fn categories(&self, db: &Path, set: &Path) -> Result<Vec<Category>, String> {
        self.with(db, set, |ix| Ok(ix.categories()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use std::path::Path;
    use tempfile::TempDir;

    fn real() -> &'static Path {
        Path::new(concat!(env!("CARGO_MANIFEST_DIR"), "/../docs/prd/prd-forge-viewer"))
    }

    fn open_real(d: &TempDir) -> Index {
        let mut ix = Index::open(&d.path().join("ix.sqlite"), real()).unwrap();
        ix.refresh().unwrap();
        ix
    }

    /// A set with one section: item A has "export" in its title, item B has it once in its text.
    fn small_set(dir: &Path, b_text: &str) {
        fs::create_dir_all(dir).unwrap();
        fs::write(dir.join("prd.md"), "---\nid: r\nkind: prd\ntitle: R\nstatus: draft\nlinks:\n  children:\n    - { path: ./08.md, title: FR, order: 80 }\n---\n").unwrap();
        let doc = format!("---\nid: f\nkind: functional-requirements\ntitle: Functional requirements\nstatus: draft\nrequirements:\n  - id: FR-001\n    capability: Plain capability\n    outcome: {b_text}\n  - id: FR-002\n    capability: Export the set\n    outcome: A file\n---\n");
        fs::write(dir.join("08.md"), doc).unwrap();
    }

    #[test]
    fn category_filter_gives_only_that_kind() {
        let d = TempDir::new().unwrap();
        let hits = open_real(&d).search("export", "functional-requirements").unwrap();
        assert!(!hits.is_empty());
        assert!(hits.iter().all(|h| h.category == "functional-requirements" && h.id.starts_with("FR-")));
    }

    #[test]
    fn all_categories_include_scenarios() {
        let d = TempDir::new().unwrap();
        let hits = open_real(&d).search("export", "all").unwrap();
        assert!(hits.iter().any(|h| h.category == "scenarios"));
    }

    #[test]
    fn title_match_ranks_above_text_match() {
        let d = TempDir::new().unwrap();
        small_set(&d.path().join("s"), "Mentions export once");
        let mut ix = Index::open(&d.path().join("ix.sqlite"), &d.path().join("s")).unwrap();
        ix.refresh().unwrap();
        let ids: Vec<_> = ix.search("export", "all").unwrap().into_iter().map(|h| h.id).collect();
        assert_eq!(ids, vec!["FR-002", "FR-001"]);
    }

    #[test]
    fn scores_run_from_100_down() {
        let d = TempDir::new().unwrap();
        let hits = open_real(&d).search("export", "all").unwrap();
        assert_eq!(hits[0].score, 100);
        assert!(hits.windows(2).all(|w| w[0].score >= w[1].score));
        assert!(hits.iter().all(|h| h.score <= 100));
    }

    #[test]
    fn no_match_is_empty() {
        let d = TempDir::new().unwrap();
        assert!(open_real(&d).search("zzqxnomatch", "all").unwrap().is_empty());
    }

    #[test]
    fn search_syntax_in_the_term_is_plain_words() {
        let d = TempDir::new().unwrap();
        let ix = open_real(&d);
        for term in ["\"", "*", "(export", "NEAR export", "export AND", "a\"b", "-x", "export:"] {
            assert!(ix.search(term, "all").is_ok(), "term {term}");
        }
    }

    #[test]
    fn empty_term_is_empty() {
        let d = TempDir::new().unwrap();
        assert!(open_real(&d).search("   ", "all").unwrap().is_empty());
    }

    #[test]
    fn damaged_index_file_is_rebuilt() {
        let d = TempDir::new().unwrap();
        let db = d.path().join("ix.sqlite");
        fs::write(&db, b"not a database at all").unwrap();
        let mut ix = Index::open(&db, real()).unwrap();
        ix.refresh().unwrap();
        assert!(!ix.search("export", "all").unwrap().is_empty());
    }

    #[test]
    fn only_changed_documents_are_indexed_again() {
        let d = TempDir::new().unwrap();
        let s = d.path().join("s");
        small_set(&s, "First text");
        let mut ix = Index::open(&d.path().join("ix.sqlite"), &s).unwrap();
        assert_eq!(ix.refresh().unwrap(), 2);
        assert_eq!(ix.refresh().unwrap(), 0);
        small_set(&s, "Now with zebra");
        assert_eq!(ix.refresh().unwrap(), 1);
        assert_eq!(ix.search("zebra", "all").unwrap()[0].id, "FR-001");
    }

    #[test]
    fn twenty_searches_within_half_a_second() {
        let d = TempDir::new().unwrap();
        let state = SearchState::default();
        let db = d.path().join("ix.sqlite");
        for term in ["export", "grade", "theme", "search", "section", "draft", "sponsor", "PDF", "keyboard", "prdf",
                     "known", "stage", "journey", "score", "blocking", "persona", "release", "network", "script", "folder"] {
            let t0 = std::time::Instant::now();
            state.search(&db, real(), term, "all").unwrap();
            assert!(t0.elapsed().as_millis() < 500, "{term}: {:?}", t0.elapsed());
        }
    }

    #[test]
    fn field_names_are_not_search_text() {
        let d = TempDir::new().unwrap();
        small_set(&d.path().join("s"), "Plain text");
        let mut ix = Index::open(&d.path().join("ix.sqlite"), &d.path().join("s")).unwrap();
        ix.refresh().unwrap();
        // "outcome" is only a field name in this set; "capability" is also a value ("Plain capability").
        assert!(ix.search("outcome", "all").unwrap().is_empty());
        assert_eq!(ix.search("capability", "all").unwrap().len(), 1);
    }

    #[test]
    fn an_id_search_puts_that_item_first() {
        let d = TempDir::new().unwrap();
        assert_eq!(open_real(&d).search("FR-008", "all").unwrap()[0].id, "FR-008");
    }

    #[test]
    fn openable_but_broken_index_is_rebuilt() {
        for breakage in ["DROP TABLE items", "DELETE FROM items_data WHERE id > 10"] {
            let d = TempDir::new().unwrap();
            let db = d.path().join("ix.sqlite");
            let state = SearchState::default();
            state.search(&db, real(), "export", "all").unwrap();
            Connection::open(&db).unwrap().execute_batch(breakage).unwrap();
            let fresh = SearchState::default();
            assert!(!fresh.search(&db, real(), "export", "all").unwrap().is_empty(), "{breakage}");
            assert!(!state.search(&db, real(), "export", "all").unwrap().is_empty(), "{breakage} with an open index");
        }
    }

    #[test]
    fn listed_files_outside_the_set_are_not_read() {
        let d = TempDir::new().unwrap();
        let s = d.path().join("s");
        fs::create_dir_all(&s).unwrap();
        fs::write(d.path().join("outside.md"), "---\nid: o\nkind: scope\ntitle: O\nstatus: final\nin_scope:\n  - id: IN-001\n    summary: zebraoutside\n---\n").unwrap();
        fs::write(s.join("prd.md"), "---\nid: r\nkind: prd\ntitle: R\nstatus: draft\nlinks:\n  children:\n    - { path: ../outside.md, title: O }\n    - { path: /dev/zero, title: Z }\n---\n").unwrap();
        let mut ix = Index::open(&d.path().join("ix.sqlite"), &s).unwrap();
        ix.refresh().unwrap();
        assert!(ix.search("zebraoutside", "all").unwrap().is_empty());
    }

    #[test]
    fn two_sets_have_two_index_files() {
        let data = Path::new("/data");
        assert_ne!(index_path(data, Path::new("/a/set")), index_path(data, Path::new("/b/set")));
        assert_eq!(index_path(data, Path::new("/a/set")), index_path(data, Path::new("/a/set")));
    }
}
