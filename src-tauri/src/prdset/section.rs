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
fn inside(dir: &Path, rel: &str) -> Result<std::path::PathBuf, String> {
    let root = fs::canonicalize(dir).map_err(|e| e.to_string())?;
    let path = fs::canonicalize(root.join(rel)).map_err(|_| format!("{rel} was not found"))?;
    if path.starts_with(&root) { Ok(path) } else { Err(format!("{rel} is outside the PRD set")) }
}

pub(crate) fn read(dir: &Path, file: &str) -> Result<(Header, String, String), String> {
    let text = fs::read_to_string(inside(dir, file)?).map_err(|e| format!("{file} cannot be read: {e}"))?;
    let (yaml, body) = split_front_matter(&text).ok_or(format!("{file} has no front matter"))?;
    Ok((parse_header(&yaml)?, yaml, body))
}

/// The root and the children it lists: the only documents the viewer opens.
pub(crate) fn listed(dir: &Path) -> Vec<String> {
    let mut files = vec!["prd.md".to_string()];
    if let Ok((root, _, _)) = read(dir, "prd.md") {
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
        assert_eq!(s.items.iter().filter(|i| i.id.starts_with("FR-")).count(), 25);
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
