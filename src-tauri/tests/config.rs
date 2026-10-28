// NFR-010: no script in a PRD set runs, and nothing remote loads.
fn csp() -> String {
    let path = concat!(env!("CARGO_MANIFEST_DIR"), "/tauri.conf.json");
    let conf: serde_json::Value = serde_json::from_str(&std::fs::read_to_string(path).unwrap()).unwrap();
    conf["app"]["security"]["csp"].as_str().unwrap().to_string()
}

fn directive<'a>(csp: &'a str, name: &str) -> &'a str {
    csp.split(';').find(|d| d.trim().starts_with(name)).unwrap()
}

#[test]
fn csp_blocks_scripts_and_network() {
    let csp = csp();
    assert!(csp.contains("script-src 'self'"));
    let script = directive(&csp, "script-src");
    assert!(!script.contains("unsafe-inline") && !script.contains("unsafe-eval"));
    let connect = directive(&csp, "connect-src");
    assert!(!connect.contains("https://") || connect.contains("https://ipc.localhost"));
    assert!(csp.contains("object-src 'none'") && csp.contains("frame-src 'none'"));
}
