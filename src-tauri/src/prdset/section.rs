use super::header::{parse_header, split_front_matter, Header};
use super::items::{items_of, Item};
use base64::Engine;
use serde::Serialize;
use std::fs;
use std::path::Path;

/// One document of the set, to read in the section page (FR-005, FR-023).
#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Section {
    pub file: String,
    pub title: String,
    pub status: String,
    pub section: Option<u8>,
    pub score: Option<u8>,
    pub blocking: Option<u32>,
    pub graded: Option<String>,
    pub body: String,
    pub items: Vec<Item>,
}

/// Where an item lives, for following a reference (FR-007).
#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ItemRef {
    pub id: String,
    pub title: String,
    pub file: String,
    pub parent: Option<String>,
}

/// The real path of `rel` inside the set folder. A path that resolves outside it, through `..`,
/// an absolute path, or a symlink, is refused (NFR-010).
pub(crate) fn inside(dir: &Path, rel: &str) -> Result<std::path::PathBuf, String> {
    let root = fs::canonicalize(dir).map_err(|e| e.to_string())?;
    let path = fs::canonicalize(root.join(rel)).map_err(|_| format!("{rel} was not found"))?;
    if path.starts_with(&root) { Ok(path) } else { Err(format!("{rel} is outside the PRD set")) }
}

pub(crate) fn read(dir: &Path, file: &str) -> Result<(Header, String, String), String> {
    let text = fs::read_to_string(inside(dir, file)?).map_err(|e| format!("{file} cannot be read: {e}"))?;
    let (yaml, body) = split_front_matter(&text).ok_or(format!("{file} has no front matter"))?;
    Ok((parse_header(&yaml)?, yaml, body))
}

/// The root and the children it lists: the only documents the viewer opens. The root of a PRD set
/// is prd.md. The root of a backlog, which has no prd.md, is backlog.md (FR-028).
pub(crate) fn listed(dir: &Path) -> Vec<String> {
    let root_file = if dir.join("prd.md").exists() || !dir.join("backlog.md").exists() { "prd.md" } else { "backlog.md" };
    let mut files = vec![root_file.to_string()];
    if let Ok((root, _, _)) = read(dir, root_file) {
        files.extend(root.links.unwrap_or_default().children.into_iter().map(|c| c.path.trim_start_matches("./").to_string()));
    }
    files
}

/// Read one listed document. Any other path, such as `../x.md`, is refused.
pub fn read_section(dir: &Path, file: &str) -> Result<Section, String> {
    if !listed(dir).iter().any(|f| f == file) {
        return Err(format!("{file} is not a document of this PRD set"));
    }
    let (h, yaml, body) = read(dir, file)?;
    Ok(Section {
        file: file.into(),
        title: h.title,
        status: h.status,
        section: h.section,
        score: h.score,
        blocking: h.blocking,
        graded: h.graded,
        body,
        items: items_of(&yaml),
    })
}

/// The backlog next to a PRD set: the folder `<set>-backlog` with a backlog.md (FR-028).
#[derive(Serialize, Debug, Clone, PartialEq)]
pub struct Backlog {
    pub folder: String,
    pub documents: Vec<BacklogDoc>,
}

#[derive(Serialize, Debug, Clone, PartialEq)]
pub struct BacklogDoc {
    pub file: String,
    pub title: String,
}

/// The backlog next to the set, or None when there is none.
pub fn backlog_of(set: &Path) -> Option<Backlog> {
    let name = set.file_name()?.to_str()?;
    let dir = set.parent()?.join(format!("{name}-backlog"));
    if !dir.join("backlog.md").is_file() {
        return None;
    }
    let documents = listed(&dir)
        .into_iter()
        .filter_map(|file| read(&dir, &file).ok().map(|(h, _, _)| BacklogDoc { file, title: h.title }))
        .collect();
    Some(Backlog { folder: dir.to_string_lossy().into_owned(), documents })
}

/// Each backlog item that names requirements, with the ids it names: US-008 builds FR-005.
#[derive(Serialize, Debug, Clone, PartialEq)]
pub struct StoryLink {
    pub id: String,
    pub requirements: Vec<String>,
}

pub fn story_links(backlog: &Path) -> Vec<StoryLink> {
    // An id is 1 to 4 capitals, a hyphen, and 3 digits, such as FR-005.
    let is_id = |w: &&str| matches!(w.split_once('-'), Some((a, n)) if (1..=4).contains(&a.len()) && a.bytes().all(|b| b.is_ascii_uppercase()) && n.len() == 3 && n.bytes().all(|b| b.is_ascii_digit()));
    listed(backlog)
        .into_iter()
        .filter_map(|file| read(backlog, &file).ok())
        .flat_map(|(_, yaml, _)| items_of(&yaml))
        .filter_map(|i| {
            let reqs: Vec<String> = i.fields.iter().filter(|f| f.name == "requirements").flat_map(|f| f.text.split(|c: char| !(c.is_ascii_alphanumeric() || c == '-')).filter(is_id).map(String::from).collect::<Vec<_>>()).collect();
            (!reqs.is_empty()).then_some(StoryLink { id: i.id, requirements: reqs })
        })
        .collect()
}

/// Every item of every readable document, with the file that holds it.
pub fn item_index(dir: &Path) -> Vec<ItemRef> {
    listed(dir)
        .into_iter()
        .filter_map(|file| read(dir, &file).ok().map(|(_, yaml, _)| (file, yaml)))
        .flat_map(|(file, yaml)| {
            items_of(&yaml).into_iter().map(move |i| ItemRef { id: i.id, title: i.title, file: file.clone(), parent: i.parent })
        })
        .collect()
}

/// An image inside the set folder as a data URL. Anything outside the folder, or not an image, is refused.
pub fn read_asset(dir: &Path, rel: &str) -> Result<String, String> {
    let path = inside(dir, rel)?;
    let mime = match path.extension().and_then(|e| e.to_str()).map(|e| e.to_ascii_lowercase()).as_deref() {
        Some("svg") => "image/svg+xml",
        Some("png") => "image/png",
        Some("jpg" | "jpeg") => "image/jpeg",
        Some("gif") => "image/gif",
        _ => return Err(format!("{rel} is not an image")),
    };
    let bytes = fs::read(&path).map_err(|e| e.to_string())?;
    Ok(format!("data:{mime};base64,{}", base64::engine::general_purpose::STANDARD.encode(bytes)))
}

/// The findings behind the grade of a section: the body of its note in `grades/` (FR-025).
/// None when the section has no note. A path outside the set is refused.
pub fn read_grade(dir: &Path, file: &str) -> Result<Option<String>, String> {
    if file.contains('/') || !file.ends_with(".md") {
        return Err(format!("{file} is not a section file"));
    }
    let path = match inside(dir, &format!("grades/{file}")) {
        Ok(p) => p,
        Err(_) if !dir.join("grades").join(file).exists() => return Ok(None),
        Err(e) => return Err(e),
    };
    let text = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    Ok(Some(split_front_matter(&text).map(|(_, body)| body).unwrap_or(text).trim().to_string()))
}

/// The picture of a diagram for an export: the PNG next to the SVG, as the PRD Forge exporter uses,
/// unless the PNG is missing or older than the SVG. Then the SVG itself, so an export never shows an
/// older drawing than the viewer.
pub fn export_image(dir: &Path, rel: &str) -> Result<String, String> {
    let png = rel.strip_suffix(".svg").map(|base| format!("{base}.png"));
    let modified = |r: &str| inside(dir, r).ok().and_then(|p| fs::metadata(p).ok()).and_then(|m| m.modified().ok());
    // ponytail: 2 s of slack, because a git checkout writes the pair in any order.
    let fresh = |png: &str| match (modified(png), modified(rel)) {
        (Some(p), Some(s)) => p + std::time::Duration::from_secs(2) >= s,
        (Some(_), None) => true,
        _ => false,
    };
    match png {
        Some(png) if fresh(&png) => read_asset(dir, &png),
        _ => read_asset(dir, rel),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::Path;

    fn real() -> &'static Path {
        Path::new(concat!(env!("CARGO_MANIFEST_DIR"), "/../docs/prd/prd-forge-viewer"))
    }

    #[test]
    fn reads_functional_requirements() {
        let s = read_section(real(), "08-functional-requirements.md").unwrap();
        assert_eq!(s.items.iter().filter(|i| i.id.starts_with("FR-")).count(), 28);
        assert!(s.body.contains("# Functional requirements"));
        assert_eq!(s.section, Some(7));
    }

    #[test]
    fn refuses_parent_path() {
        assert!(read_section(real(), "../prd-forge-viewer/prd.md").is_err());
    }

    #[test]
    fn refuses_unlisted_file() {
        assert!(read_section(real(), "grades/04-personas.md").is_err());
    }

    #[test]
    fn index_finds_requirement_and_nested_stage() {
        let idx = item_index(real());
        assert_eq!(idx.iter().find(|r| r.id == "FR-004").unwrap().file, "08-functional-requirements.md");
        let st = idx.iter().find(|r| r.id == "ST-002").unwrap();
        assert_eq!((st.file.as_str(), st.parent.as_deref()), ("05-user-journeys.md", Some("J-001")));
    }

    #[test]
    fn asset_inside_the_set_is_a_data_url() {
        assert!(read_asset(real(), "diagrams/SC-001.svg").unwrap().starts_with("data:image/svg+xml;base64,"));
    }

    fn set_with_outside_files() -> tempfile::TempDir {
        let d = tempfile::TempDir::new().unwrap();
        let set = d.path().join("set");
        std::fs::create_dir_all(&set).unwrap();
        let png = std::fs::read(real().join("diagrams/SC-001.png")).unwrap();
        std::fs::write(d.path().join("outside.png"), &png).unwrap();
        std::fs::write(d.path().join("outside.md"), "---\nid: o\nkind: scope\ntitle: Outside\nstatus: final\n---\nsecret\n").unwrap();
        std::os::unix::fs::symlink(d.path().join("outside.md"), set.join("linked.md")).unwrap();
        std::os::unix::fs::symlink(d.path().join("outside.png"), set.join("linked.png")).unwrap();
        let root = "---\nid: r\nkind: prd\ntitle: R\nstatus: draft\nlinks:\n  children:\n    - { path: ../outside.md, title: Outside }\n    - { path: ./linked.md, title: Linked }\n---\n";
        std::fs::write(set.join("prd.md"), root).unwrap();
        d
    }

    #[test]
    fn listed_paths_outside_the_set_are_refused() {
        let d = set_with_outside_files();
        let set = d.path().join("set");
        assert!(read_section(&set, "../outside.md").is_err());
        assert!(read_section(&set, "linked.md").is_err());
        assert!(!item_index(&set).iter().any(|r| r.file.contains("outside") || r.file.contains("linked")));
    }

    #[test]
    fn the_backlog_next_to_the_set_is_found_and_read() {
        let b = backlog_of(real()).unwrap();
        assert!(b.folder.ends_with("prd-forge-viewer-backlog"));
        assert_eq!(b.documents[0].file, "backlog.md");
        assert!(b.documents.iter().any(|d| d.file == "03-stories.md" && d.title == "Stories"));
        let stories = read_section(Path::new(&b.folder), "03-stories.md").unwrap();
        assert!(stories.items.iter().any(|i| i.id == "US-008"));
        assert!(item_index(Path::new(&b.folder)).iter().any(|r| r.id == "US-008" && r.file == "03-stories.md"));
    }

    #[test]
    fn a_story_links_to_the_requirements_it_builds() {
        let b = backlog_of(real()).unwrap();
        let links = story_links(Path::new(&b.folder));
        assert!(links.iter().any(|l| l.id == "US-008" && l.requirements == vec!["FR-005".to_string()]));
    }

    #[test]
    fn a_set_with_no_backlog_next_to_it_has_none() {
        let d = tempfile::TempDir::new().unwrap();
        assert_eq!(backlog_of(d.path()), None);
    }

    #[test]
    fn read_grade_gives_the_findings_without_the_front_matter() {
        let body = read_grade(real(), "06-scenarios.md").unwrap().unwrap();
        assert!(body.starts_with("# "));
        assert!(body.contains("## Blocking defects"));
        assert!(!body.contains("grader:"));
    }

    #[test]
    fn read_grade_is_none_with_no_note_and_refuses_other_paths() {
        assert_eq!(read_grade(real(), "prd.md").unwrap(), None);
        assert!(read_grade(real(), "../x.md").is_err());
        assert!(read_grade(real(), "grades.txt").is_err());
    }

    #[test]
    fn export_image_uses_the_png_unless_it_is_older_than_the_svg() {
        use std::time::{Duration, SystemTime};
        let d = tempfile::tempdir().unwrap();
        let at = |f: &str, secs: u64| {
            let p = d.path().join(f);
            fs::write(&p, if f.ends_with(".png") { &b"png"[..] } else { &b"<svg/>"[..] }).unwrap();
            fs::File::options().write(true).open(&p).unwrap().set_modified(SystemTime::UNIX_EPOCH + Duration::from_secs(secs)).unwrap();
        };
        at("new.svg", 100);
        at("new.png", 200);
        assert!(export_image(d.path(), "new.svg").unwrap().starts_with("data:image/png"));
        at("old.svg", 200);
        at("old.png", 100);
        at("same.svg", 101);
        at("same.png", 100);
        assert!(export_image(d.path(), "same.svg").unwrap().starts_with("data:image/png"));
        assert!(export_image(d.path(), "old.svg").unwrap().starts_with("data:image/svg+xml"));
        at("only.svg", 100);
        assert!(export_image(d.path(), "only.svg").unwrap().starts_with("data:image/svg+xml"));
        assert!(export_image(d.path(), "../x.svg").is_err());
    }

    #[test]
    fn real_image_outside_the_set_is_refused() {
        let d = set_with_outside_files();
        let set = d.path().join("set");
        assert!(read_asset(&set, "../outside.png").unwrap_err().contains("outside"));
        assert!(read_asset(&set, "linked.png").unwrap_err().contains("outside"));
    }

    #[test]
    fn asset_outside_the_set_is_refused() {
        assert!(read_asset(real(), "../../CLAUDE.md").is_err());
        assert!(read_asset(real(), "/etc/hosts").is_err());
        assert!(read_asset(real(), "prd.md").is_err());
    }
}
