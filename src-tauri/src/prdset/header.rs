use serde::{Deserialize, Deserializer, Serialize};

/// The front matter of one PRD Forge document (C-003). Only the fields the viewer shows.
#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct Header {
    pub id: String,
    pub kind: String,
    pub title: String,
    pub status: String,
    pub section: Option<u8>,
    pub order: Option<u32>,
    pub score: Option<u8>,
    pub blocking: Option<u32>,
    #[serde(default, deserialize_with = "date_as_string")]
    pub graded: Option<String>,
    #[serde(default)]
    pub product: Option<String>,
    #[serde(default)]
    pub version: Option<String>,
    #[serde(default)]
    pub summary: Option<serde_yaml::Mapping>,
    #[serde(default)]
    pub links: Option<Links>,
}

#[derive(Deserialize, Serialize, Clone, Debug, Default)]
pub struct Links {
    #[serde(default)]
    pub children: Vec<ChildLink>,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct ChildLink {
    pub path: String,
    pub title: String,
    pub section: Option<u8>,
    pub order: Option<u32>,
    pub status: Option<String>,
}

// YAML reads 2026-10-28 as a string or a number-like scalar; keep it as text.
fn date_as_string<'de, D: Deserializer<'de>>(d: D) -> Result<Option<String>, D::Error> {
    let v: Option<serde_yaml::Value> = Option::deserialize(d)?;
    Ok(v.and_then(|v| match v {
        serde_yaml::Value::String(s) => Some(s),
        serde_yaml::Value::Null => None,
        other => serde_yaml::to_string(&other).ok().map(|s| s.trim().to_string()),
    }))
}

/// Split a document into its front matter and its body. None when the document has no front matter.
pub fn split_front_matter(text: &str) -> Option<(String, String)> {
    let text = text.strip_prefix('\u{FEFF}').unwrap_or(text).replace("\r\n", "\n");
    let rest = text.strip_prefix("---\n")?;
    let end = rest.find("\n---")?;
    let yaml = rest[..end].to_string();
    let after = &rest[end + 4..];
    let body = after.strip_prefix('\n').unwrap_or(after).to_string();
    Some((yaml, body))
}

pub fn parse_header(yaml: &str) -> Result<Header, String> {
    serde_yaml::from_str(yaml).map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    const GRADED: &str = "id: a\nkind: scope\ntitle: Scope\nstatus: final\nsection: 6\norder: 70\nscore: 83\nblocking: 0\ngraded: 2026-10-28";

    #[test]
    fn splits_front_matter() {
        assert_eq!(split_front_matter("---\nid: a\n---\n# Body\n"), Some(("id: a".to_string(), "# Body\n".to_string())));
    }

    #[test]
    fn no_front_matter_is_none() {
        assert_eq!(split_front_matter("# Body"), None);
    }

    #[test]
    fn crlf_front_matter() {
        let text = format!("---\r\n{}\r\n---\r\nBody", GRADED.replace('\n', "\r\n"));
        let (yaml, body) = split_front_matter(&text).unwrap();
        assert_eq!(body, "Body");
        assert_eq!(parse_header(&yaml).unwrap().score, Some(83));
    }

    #[test]
    fn parses_graded_section() {
        let h = parse_header(GRADED).unwrap();
        assert_eq!(h.status, "final");
        assert_eq!(h.score, Some(83));
        assert_eq!(h.blocking, Some(0));
        assert_eq!(h.graded.as_deref(), Some("2026-10-28"));
    }

    #[test]
    fn bom_front_matter() {
        let (yaml, _) = split_front_matter(&format!("\u{FEFF}---\n{GRADED}\n---\nBody")).unwrap();
        assert_eq!(parse_header(&yaml).unwrap().score, Some(83));
    }

    #[test]
    fn score_without_graded_date() {
        let h = parse_header(&GRADED.replace("\ngraded: 2026-10-28", "")).unwrap();
        assert_eq!((h.score, h.graded), (Some(83), None));
    }

    #[test]
    fn bad_yaml_is_err() {
        assert!(parse_header("id: [").is_err());
    }
}
