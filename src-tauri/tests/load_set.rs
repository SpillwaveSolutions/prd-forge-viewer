use prd_forge_viewer_lib::prdset::load::{load_set, LoadError};
use std::fs;
use std::path::{Path, PathBuf};
use tempfile::TempDir;

fn real_set() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("../docs/prd/prd-forge-viewer")
}

fn copy_set() -> TempDir {
    let dir = TempDir::new().unwrap();
    for entry in fs::read_dir(real_set()).unwrap() {
        let p = entry.unwrap().path();
        if p.extension().is_some_and(|e| e == "md") {
            fs::copy(&p, dir.path().join(p.file_name().unwrap())).unwrap();
        }
    }
    dir
}

fn root_version() -> String {
    let root = fs::read_to_string(real_set().join("prd.md")).unwrap();
    root.lines().find_map(|l| l.strip_prefix("version: ")).unwrap().trim().to_string()
}

#[test]
fn loads_the_real_set() {
    let set = load_set(&real_set()).unwrap();
    assert_eq!(set.product, "PRD Forge Viewer");
    assert_eq!(set.version, root_version());
    assert_eq!(set.documents.len(), 18);
    assert_eq!(set.documents[0].file, "prd.md");
    assert_eq!(set.documents[1].file, "01-problem-opportunity.md");
    assert_eq!(set.summary.len(), 5);
    assert_eq!(set.summary[0].label, "Problem");
}

#[test]
fn pending_sections_listed() {
    let dir = copy_set();
    let sections: Vec<_> = load_set(dir.path()).unwrap().documents[1..14].iter().map(|d| d.file.clone()).collect();
    for (i, file) in sections.iter().enumerate() {
        let header = format!("---\nid: s{i}\nkind: scope\ntitle: Section {i}\nstatus: pending\nlinks: {{}}\n---\n");
        fs::write(dir.path().join(file), header).unwrap();
    }
    let set = load_set(dir.path()).unwrap();
    assert_eq!(set.documents.len(), 18);
    let pending = set.documents.iter().filter(|d| sections.contains(&d.file)).filter(|d| d.status == "pending").count();
    assert_eq!(pending, 13);
}

#[test]
fn unreadable_section_marked() {
    let dir = copy_set();
    fs::write(dir.path().join("04-personas.md"), "no front matter").unwrap();
    let set = load_set(dir.path()).unwrap();
    let bad = set.documents.iter().find(|d| d.file == "04-personas.md").unwrap();
    assert_eq!(bad.status, "unreadable");
    assert!(bad.unreadable.is_some());
    assert_eq!(bad.section, Some(4));
    assert_eq!(set.documents.iter().filter(|d| d.unreadable.is_none()).count(), 17);
}

#[test]
fn missing_section_marked() {
    let dir = copy_set();
    fs::remove_file(dir.path().join("06-scenarios.md")).unwrap();
    let set = load_set(dir.path()).unwrap();
    let gone = set.documents.iter().find(|d| d.file == "06-scenarios.md").unwrap();
    assert_eq!(gone.status, "unreadable");
    assert!(gone.unreadable.is_some());
    assert_eq!(set.documents.iter().filter(|d| d.unreadable.is_none()).count(), 17);
}

#[test]
fn folder_without_root() {
    let dir = TempDir::new().unwrap();
    let err = load_set(dir.path()).unwrap_err();
    assert!(matches!(err, LoadError::NoRoot(_)));
    assert!(err.to_string().contains("No PRD set in"));
}
