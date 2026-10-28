use crate::prdset::header::{parse_header, split_front_matter};
use serde::Serialize;
use std::fs;
use std::path::Path;

/// One PRD set location, with its product name when the root can be read (FR-022, FR-024).
#[derive(Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct SetRef {
    pub folder: String,
    pub product: Option<String>,
    pub found: bool,
}

pub fn set_ref(folder: &Path) -> SetRef {
    let root = folder.join("prd.md");
    let product = fs::read_to_string(&root)
        .ok()
        .and_then(|t| split_front_matter(&t))
        .and_then(|(yaml, _)| parse_header(&yaml).ok())
        .map(|h| h.product.unwrap_or(h.title));
    SetRef { folder: folder.display().to_string(), product, found: root.is_file() }
}

/// Every direct subfolder of `dir/docs/prd` that holds a prd.md, sorted by folder.
pub fn find_sets(dir: &Path) -> Vec<SetRef> {
    let Ok(entries) = fs::read_dir(dir.join("docs/prd")) else { return vec![] };
    let mut sets: Vec<SetRef> = entries
        .flatten()
        .map(|e| e.path())
        .filter(|p| p.join("prd.md").is_file())
        .map(|p| set_ref(&p))
        .collect();
    sets.sort_by(|a, b| a.folder.cmp(&b.folder));
    sets
}

#[cfg(test)]
pub(crate) mod tests {
    use super::*;
    use std::fs;
    use tempfile::TempDir;

    pub fn make_set(dir: &Path, product: &str) {
        fs::create_dir_all(dir).unwrap();
        let root = format!("---\nid: r\nkind: prd\ntitle: {product} PRD\nstatus: draft\nproduct: {product}\nlinks: {{}}\n---\n");
        fs::write(dir.join("prd.md"), root).unwrap();
    }

    #[test]
    fn set_ref_reads_product() {
        let d = TempDir::new().unwrap();
        make_set(d.path(), "Alpha");
        let r = set_ref(d.path());
        assert_eq!((r.product.as_deref(), r.found), (Some("Alpha"), true));
    }

    #[test]
    fn set_ref_missing_is_not_found() {
        let r = set_ref(Path::new("/no/such/prd/set"));
        assert_eq!((r.product, r.found), (None, false));
    }

    #[test]
    fn finds_two_sets() {
        let d = TempDir::new().unwrap();
        make_set(&d.path().join("docs/prd/b"), "Beta");
        make_set(&d.path().join("docs/prd/a"), "Alpha");
        let sets = find_sets(d.path());
        assert_eq!(sets.len(), 2);
        assert!(sets[0].folder.ends_with("/docs/prd/a"));
    }

    #[test]
    fn ignores_clutter() {
        let d = TempDir::new().unwrap();
        fs::create_dir_all(d.path().join("docs/prd/empty")).unwrap();
        fs::write(d.path().join("docs/prd/notes.txt"), "x").unwrap();
        assert!(find_sets(d.path()).is_empty());
    }
}
