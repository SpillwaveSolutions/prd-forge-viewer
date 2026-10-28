use serde::Serialize;
use serde_yaml::{Mapping, Value};

/// One item of a section: any front matter entry with an id such as FR-008 or ST-002, a glossary
/// term, or a change log version (FR-023). `parent` is the id of the item that holds it.
#[derive(Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Item {
    pub id: String,
    pub title: String,
    pub parent: Option<String>,
    pub fields: Vec<Field>,
}

#[derive(Serialize, Debug, Clone, PartialEq)]
pub struct Field {
    pub name: String,
    pub text: String,
}

const TITLE_KEYS: &[&str] = &[
    "name", "title", "capability", "statement", "question", "term", "objective", "decision",
    "assumption", "risk", "need", "summary", "goal", "subject",
];

fn is_item_id(s: &str) -> bool {
    let Some((pre, num)) = s.split_once('-') else { return false };
    (1..=4).contains(&pre.len())
        && pre.chars().all(|c| c.is_ascii_uppercase())
        && num.len() == 3
        && num.chars().all(|c| c.is_ascii_digit())
}

fn get<'a>(m: &'a Mapping, k: &str) -> Option<&'a Value> {
    m.get(Value::String(k.into()))
}

fn item_id(m: &Mapping) -> Option<String> {
    if let Some(Value::String(id)) = get(m, "id") {
        if is_item_id(id) {
            return Some(id.clone());
        }
    }
    match (get(m, "term"), get(m, "meaning"), get(m, "version"), get(m, "summary")) {
        (Some(Value::String(t)), Some(_), _, _) => Some(t.clone()),
        (_, _, Some(v), Some(_)) => Some(scalar_text(v)),
        _ => None,
    }
}

fn scalar_text(v: &Value) -> String {
    match v {
        Value::String(s) => s.clone(),
        Value::Null => String::new(),
        other => serde_yaml::to_string(other).unwrap_or_default().trim().to_string(),
    }
}

/// A field as text. A list of items reads as their ids, so a parent does not repeat its children.
fn text_of(v: &Value) -> String {
    match v {
        Value::Sequence(seq) if seq.iter().all(|e| !matches!(e, Value::Mapping(_) | Value::Sequence(_))) => {
            let parts: Vec<_> = seq.iter().map(scalar_text).collect();
            // Ids read as one comma-separated line; sentences read one per line.
            parts.join(if parts.iter().any(|p| p.contains(' ')) { "\n" } else { ", " })
        }
        Value::Sequence(seq) if seq.iter().all(|e| matches!(e, Value::Mapping(m) if item_id(m).is_some())) => {
            seq.iter().filter_map(|e| e.as_mapping().and_then(item_id)).collect::<Vec<_>>().join(", ")
        }
        Value::Sequence(_) | Value::Mapping(_) => serde_yaml::to_string(v).unwrap_or_default().trim().to_string(),
        other => scalar_text(other),
    }
}

fn walk(v: &Value, parent: Option<&str>, out: &mut Vec<Item>) {
    match v {
        Value::Mapping(m) => {
            let id = item_id(m);
            if let Some(id) = &id {
                let title = TITLE_KEYS.iter().find_map(|k| get(m, k).map(scalar_text)).unwrap_or_else(|| id.clone());
                let fields = m
                    .iter()
                    .filter_map(|(k, v)| Some((k.as_str()?, v)))
                    .filter(|(k, _)| *k != "id")
                    .map(|(k, v)| Field { name: k.to_string(), text: text_of(v) })
                    .collect();
                out.push(Item { id: id.clone(), title, parent: parent.map(String::from), fields });
            }
            let here = id.as_deref().or(parent);
            for (_, child) in m {
                walk(child, here, out);
            }
        }
        Value::Sequence(seq) => seq.iter().for_each(|c| walk(c, parent, out)),
        _ => {}
    }
}

/// Every item in one document's front matter, in document order.
pub fn items_of(yaml: &str) -> Vec<Item> {
    let mut out = vec![];
    if let Ok(v) = serde_yaml::from_str::<Value>(yaml) {
        if let Value::Mapping(m) = &v {
            // The document's own links name other documents, not items.
            for (k, child) in m {
                if k.as_str() != Some("links") {
                    walk(child, None, &mut out);
                }
            }
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::prdset::header::split_front_matter;

    fn items_of_file(name: &str) -> Vec<Item> {
        let path = concat!(env!("CARGO_MANIFEST_DIR"), "/../docs/prd/prd-forge-viewer/");
        let text = std::fs::read_to_string(format!("{path}{name}")).unwrap();
        items_of(&split_front_matter(&text).unwrap().0)
    }

    #[test]
    fn personas_section_has_five_personas() {
        let ids: Vec<_> = items_of_file("04-personas.md").into_iter().map(|i| i.id).collect();
        assert_eq!(ids, vec!["PER-001", "PER-002", "PER-003", "PER-004", "PER-005"]);
    }

    #[test]
    fn nested_stage_has_parent_journey() {
        let items = items_of_file("05-user-journeys.md");
        let st = items.iter().find(|i| i.id == "ST-002").unwrap();
        assert_eq!(st.parent.as_deref(), Some("J-001"));
        assert_eq!(st.title, "Check the grades");
    }

    #[test]
    fn requirement_title_is_its_capability() {
        let items = items_of_file("08-functional-requirements.md");
        let fr = items.iter().find(|i| i.id == "FR-008").unwrap();
        assert!(fr.title.starts_with("Search the PRD set by term"), "{}", fr.title);
        assert!(fr.fields.iter().any(|f| f.name == "journey_stage" && f.text == "ST-003"));
    }

    #[test]
    fn list_of_sentences_is_one_per_line() {
        let items = items_of_file("05-user-journeys.md");
        let st = items.iter().find(|i| i.id == "ST-002").unwrap();
        let steps = &st.fields.iter().find(|f| f.name == "steps").unwrap().text;
        assert!(steps.contains("section.\nThe author"), "{steps}");
        let fr = items_of_file("08-functional-requirements.md");
        assert!(fr.iter().any(|i| i.fields.iter().any(|f| f.text.contains(", "))));
    }

    #[test]
    fn glossary_term_is_an_item() {
        let items = items_of_file("15-glossary.md");
        assert!(items.iter().any(|i| i.id == "PRD set" && i.title == "PRD set"));
    }
}
