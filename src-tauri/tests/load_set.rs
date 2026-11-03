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

const OBJECTIVE: &str = "A test matter moves through the core lifecycle, filing to an approved determination, with each of the three roles acting in its own signed-in session.";

fn write_objective_set(objective: &str) -> TempDir {
    let dir = TempDir::new().unwrap();
    let root = "---
id: demo
kind: prd
title: Demo
status: draft
product: Demo
version: 0.1.0
summary:
  problem: A problem in prose.
  objective: OBJECTIVE_VALUE
links:
  children:
    - { path: ./03-objectives-metrics.md, title: Objectives, section: 3, order: 30, status: draft }
    - { path: ./14-release-plan.md, title: Release plan, section: 13, order: 140, status: draft }
---
"
    .replace("OBJECTIVE_VALUE", objective);
    fs::write(dir.path().join("prd.md"), root).unwrap();
    fs::write(
        dir.path().join("03-objectives-metrics.md"),
        "---
id: demo-objectives
kind: objectives-metrics
title: Objectives and success metrics
status: draft
section: 3
order: 30
objectives:
  - id: O-001
    objective: >-
      A test matter moves through the core lifecycle, filing to an approved
      determination, with each of the three roles acting in its own signed-in
      session.
  - id: O-002
    objective: Authors fix blocking defects before stakeholders see a version.
---
",
    )
    .unwrap();
    // A release names objective ids. Those are not the objective's sentence.
    fs::write(
        dir.path().join("14-release-plan.md"),
        "---
id: demo-release
kind: release-plan
title: Release plan
status: draft
releases:
  - id: REL-001
    name: Release 1
    objectives:
      - O-001
---
",
    )
    .unwrap();
    dir
}

fn summary_text(dir: &Path, label: &str) -> String {
    load_set(dir).unwrap().summary.into_iter().find(|s| s.label == label).unwrap().text
}

#[test]
fn summary_objective_id_shows_the_objective_sentence() {
    let dir = write_objective_set("O-001");
    assert_eq!(summary_text(dir.path(), "Objective"), format!("{OBJECTIVE} (O-001)"));
    assert_eq!(summary_text(dir.path(), "Problem"), "A problem in prose.");
    // The id selects its own sentence, not the first objective in the document.
    let dir = write_objective_set("O-002");
    assert_eq!(summary_text(dir.path(), "Objective"), "Authors fix blocking defects before stakeholders see a version. (O-002)");
}

#[test]
fn summary_unknown_objective_id_stays_as_written() {
    let dir = write_objective_set("O-999");
    assert_eq!(summary_text(dir.path(), "Objective"), "O-999");
}

#[test]
fn summary_objective_prose_stays_as_written() {
    let dir = write_objective_set("The whole set can be read in one place.");
    assert_eq!(summary_text(dir.path(), "Objective"), "The whole set can be read in one place.");
}
