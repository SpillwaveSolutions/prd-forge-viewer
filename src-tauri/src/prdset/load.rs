use super::header::{parse_header, split_front_matter, Header};
use serde::Serialize;
use std::fmt;
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct PrdSet {
    pub folder: String,
    pub product: String,
    pub version: String,
    pub summary: Vec<SummaryItem>,
    pub documents: Vec<DocEntry>,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SummaryItem {
    pub label: String,
    pub text: String,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct DocEntry {
    pub file: String,
    pub title: String,
    pub section: Option<u8>,
    pub order: u32,
    pub status: String,
    pub grade: Option<Grade>,
    pub unreadable: Option<String>,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Grade {
    pub score: u8,
    pub blocking: u32,
    pub graded: Option<String>,
}

#[derive(Debug)]
pub enum LoadError {
    NoRoot(PathBuf),
    UnreadableRoot(String),
}

impl fmt::Display for LoadError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            LoadError::NoRoot(dir) => write!(f, "No PRD set in {}: prd.md was not found.", dir.display()),
            LoadError::UnreadableRoot(why) => write!(f, "The root document prd.md cannot be read: {why}"),
        }
    }
}

fn read_header(path: &Path) -> Result<Header, String> {
    let text = fs::read_to_string(path).map_err(|e| format!("cannot open the file: {e}"))?;
    let (yaml, _) = split_front_matter(&text).ok_or("the file has no front matter")?;
    parse_header(&yaml)
}

fn entry(file: String, h: &Header, order: u32) -> DocEntry {
    DocEntry {
        file,
        title: h.title.clone(),
        section: h.section,
        order,
        status: h.status.clone(),
        grade: h.score.map(|score| Grade { score, blocking: h.blocking.unwrap_or(0), graded: h.graded.clone() }),
        unreadable: None,
    }
}

fn label(key: &str) -> String {
    let words = key.replace('_', " ");
    let mut c = words.chars();
    c.next().map(|f| f.to_uppercase().chain(c).collect()).unwrap_or_default()
}

fn text_of(v: &serde_yaml::Value) -> String {
    match v {
        serde_yaml::Value::String(s) => s.clone(),
        other => serde_yaml::to_string(other).unwrap_or_default().trim().to_string(),
    }
}

/// Read a PRD set: the root prd.md first, then each child of its links in `order` (C-003, FR-001, FR-003).
pub fn load_set(dir: &Path) -> Result<PrdSet, LoadError> {
    let root_path = dir.join("prd.md");
    if !root_path.is_file() {
        return Err(LoadError::NoRoot(dir.to_path_buf()));
    }
    let root = read_header(&root_path).map_err(LoadError::UnreadableRoot)?;
    let summary = root
        .summary
        .iter()
        .flatten()
        .filter_map(|(k, v)| Some(SummaryItem { label: label(k.as_str()?), text: text_of(v) }))
        .collect();
    let mut children = root.links.clone().unwrap_or_default().children;
    children.sort_by_key(|c| c.order.unwrap_or(u32::MAX));
    let mut documents = vec![entry("prd.md".into(), &root, 0)];
    for child in children {
        let file = child.path.trim_start_matches("./").to_string();
        let order = child.order.unwrap_or(0);
        documents.push(match read_header(&dir.join(&file)) {
            Ok(h) => entry(file, &h, order),
            Err(why) => DocEntry {
                file,
                title: child.title,
                section: None,
                order,
                status: "unreadable".into(),
                grade: None,
                unreadable: Some(why),
            },
        });
    }
    Ok(PrdSet {
        folder: dir.display().to_string(),
        product: root.product.clone().unwrap_or_else(|| root.title.clone()),
        version: root.version.clone().unwrap_or_default(),
        summary,
        documents,
    })
}
