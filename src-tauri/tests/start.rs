use prd_forge_viewer_lib::settings::Settings;
use prd_forge_viewer_lib::start::{start_view, StartView};
use std::fs;
use std::path::Path;
use tempfile::TempDir;

fn make_set(dir: &Path, product: &str) -> String {
    fs::create_dir_all(dir).unwrap();
    let root = format!("---\nid: r\nkind: prd\ntitle: {product} PRD\nstatus: draft\nproduct: {product}\nlinks: {{}}\n---\n");
    fs::write(dir.join("prd.md"), root).unwrap();
    dir.display().to_string()
}

fn with_last(last: &str) -> Settings {
    Settings { known: vec![last.into()], last: Some(last.into()) }
}

#[test]
fn last_set_reopens() {
    let d = TempDir::new().unwrap();
    let set = make_set(&d.path().join("s"), "Alpha");
    assert_eq!(start_view(None, &with_last(&set)), StartView::Open { folder: set });
}

#[test]
fn last_set_gone_is_welcome() {
    let v = start_view(None, &with_last("/no/such/set"));
    assert!(matches!(v, StartView::Welcome { .. }));
}

#[test]
fn path_of_a_set_opens() {
    let d = TempDir::new().unwrap();
    let set = make_set(&d.path().join("s"), "Alpha");
    assert_eq!(start_view(Some(Path::new(&set)), &Settings::default()), StartView::Open { folder: set });
}

#[test]
fn one_set_in_docs_prd_opens() {
    let d = TempDir::new().unwrap();
    let set = make_set(&d.path().join("docs/prd/only"), "Alpha");
    assert_eq!(start_view(Some(d.path()), &Settings::default()), StartView::Open { folder: set });
}

#[test]
fn no_set_is_not_found_with_known() {
    let d = TempDir::new().unwrap();
    let a = make_set(&d.path().join("a"), "Alpha");
    let b = make_set(&d.path().join("b"), "Beta");
    let empty = TempDir::new().unwrap();
    let s = Settings { known: vec![a, b], last: None };
    match start_view(Some(empty.path()), &s) {
        StartView::NotFound { known, .. } => {
            let names: Vec<_> = known.iter().map(|k| k.product.clone().unwrap()).collect();
            assert_eq!(names, vec!["Alpha", "Beta"]);
        }
        v => panic!("expected NotFound, got {v:?}"),
    }
}

#[test]
fn two_sets_and_no_last_is_choose() {
    let d = TempDir::new().unwrap();
    make_set(&d.path().join("docs/prd/a"), "Alpha");
    make_set(&d.path().join("docs/prd/b"), "Beta");
    match start_view(Some(d.path()), &Settings::default()) {
        StartView::Choose { sets, .. } => assert_eq!(sets.len(), 2),
        v => panic!("expected Choose, got {v:?}"),
    }
}

#[test]
fn two_sets_and_last_opens_last() {
    let d = TempDir::new().unwrap();
    make_set(&d.path().join("docs/prd/a"), "Alpha");
    let b = make_set(&d.path().join("docs/prd/b"), "Beta");
    assert_eq!(start_view(Some(d.path()), &with_last(&b)), StartView::Open { folder: b });
}
