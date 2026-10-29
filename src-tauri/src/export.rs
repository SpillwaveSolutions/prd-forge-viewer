use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::time::{Duration, Instant};

/// The export path, with its folder resolved through links. A path in the set folder is refused,
/// because the viewer never writes to a PRD set (OUT-001).
pub fn outside_set(set: &Path, path: &Path) -> Result<PathBuf, String> {
    let name = path.file_name().ok_or("The export needs a file name.")?;
    let dir = fs::canonicalize(path.parent().filter(|p| !p.as_os_str().is_empty()).unwrap_or(Path::new(".")))
        .map_err(|e| format!("The export folder cannot be used: {e}"))?;
    let root = fs::canonicalize(set).map_err(|e| e.to_string())?;
    if dir.starts_with(&root) {
        return Err("Save the export outside the PRD set folder. The viewer never writes to a PRD set.".into());
    }
    Ok(dir.join(name))
}

/// Write the bytes of a Word export to `path` (FR-011).
pub fn write_export(set: &Path, path: &Path, bytes: &[u8]) -> Result<(), String> {
    fs::write(outside_set(set, path)?, bytes).map_err(|e| format!("The export was not saved: {e}"))
}

/// The first Chrome that exists, from the usual install places (ADR-002).
pub fn find_chrome(candidates: &[PathBuf]) -> Result<PathBuf, String> {
    candidates.iter().find(|p| p.exists()).cloned().ok_or_else(|| "PDF export needs Google Chrome. Install Google Chrome, or export to Word.".into())
}

pub fn chrome_candidates() -> Vec<PathBuf> {
    let app = "Contents/MacOS/Google Chrome";
    let mut v = vec![PathBuf::from("/Applications/Google Chrome.app").join(app)];
    if let Some(home) = std::env::var_os("HOME") {
        v.push(PathBuf::from(home).join("Applications/Google Chrome.app").join(app));
    }
    v
}

/// Print themed HTML to a tagged PDF with headless Chrome (FR-010, NFR-009, ADR-002). The HTML and
/// the Chrome profile go to `work`, a folder in the app cache, never to the set. Chrome gets no
/// network: the HTML has every font and color in it.
pub fn export_pdf(chrome: &Path, work: &Path, set: &Path, path: &Path, html: &str) -> Result<(), String> {
    let out = outside_set(set, path)?;
    fs::create_dir_all(work).map_err(|e| e.to_string())?;
    let page = work.join("export.html");
    fs::write(&page, html).map_err(|e| e.to_string())?;
    let _ = fs::remove_file(&out);
    let mut child = Command::new(chrome)
        .args(["--headless", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--disable-background-networking", "--disable-sync"])
        .args(["--no-pdf-header-footer", "--generate-pdf-document-outline", "--proxy-server=127.0.0.1:9", "--proxy-bypass-list=<-loopback>"])
        .arg(format!("--user-data-dir={}", work.join("chrome").display()))
        .arg(format!("--print-to-pdf={}", out.display()))
        .arg(format!("file://{}", page.display()))
        .stdout(std::process::Stdio::null())
        .stderr(std::process::Stdio::null())
        .spawn()
        .map_err(|e| format!("Chrome did not start: {e}"))?;
    let end = Instant::now() + Duration::from_secs(60);
    loop {
        if let Some(status) = child.try_wait().map_err(|e| e.to_string())? {
            return if status.success() && out.exists() { Ok(()) } else { Err(format!("Chrome did not write the PDF ({status}).")) };
        }
        if Instant::now() > end {
            let _ = child.kill();
            return Err("Chrome did not finish the PDF within 60 seconds.".into());
        }
        std::thread::sleep(Duration::from_millis(50));
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::TempDir;

    fn set() -> (TempDir, PathBuf) {
        let d = TempDir::new().unwrap();
        let s = d.path().join("set");
        fs::create_dir_all(s.join("grades")).unwrap();
        (d, s)
    }

    #[test]
    fn a_path_in_the_set_is_refused() {
        let (_d, s) = set();
        assert!(write_export(&s, &s.join("x.docx"), b"x").unwrap_err().contains("outside the PRD set"));
        assert!(write_export(&s, &s.join("grades/x.docx"), b"x").is_err());
        assert!(!s.join("x.docx").exists());
    }

    #[test]
    fn a_link_into_the_set_is_refused() {
        let (d, s) = set();
        std::os::unix::fs::symlink(&s, d.path().join("link")).unwrap();
        assert!(write_export(&s, &d.path().join("link/x.docx"), b"x").is_err());
        assert!(!s.join("x.docx").exists());
    }

    #[test]
    fn a_path_outside_the_set_is_written() {
        let (d, s) = set();
        write_export(&s, &d.path().join("out.docx"), b"bytes").unwrap();
        assert_eq!(fs::read(d.path().join("out.docx")).unwrap(), b"bytes");
    }

    #[test]
    fn no_chrome_says_what_to_do() {
        assert!(find_chrome(&[PathBuf::from("/no/chrome")]).unwrap_err().contains("export to Word"));
    }

    #[test]
    fn the_pdf_is_tagged_for_screen_readers() {
        let Ok(chrome) = find_chrome(&chrome_candidates()) else { return eprintln!("no Chrome; skipped") };
        let (d, s) = set();
        let out = d.path().join("out.pdf");
        export_pdf(&chrome, &d.path().join("work"), &s, &out, "<!DOCTYPE html><html lang=\"en\"><head><title>T</title></head><body><h1>Heading</h1><p>Text</p></body></html>").unwrap();
        let pdf = fs::read(&out).unwrap();
        let has = |n: &[u8]| pdf.windows(n.len()).any(|w| w == n);
        assert!(pdf.starts_with(b"%PDF"));
        assert!(has(b"/StructTreeRoot"), "no structure tree");
        assert!(!s.join("export.html").exists());
    }

    #[test]
    fn the_pdf_refuses_a_path_in_the_set() {
        let (d, s) = set();
        assert!(export_pdf(Path::new("/no/chrome"), &d.path().join("work"), &s, &s.join("x.pdf"), "").unwrap_err().contains("outside the PRD set"));
    }
}
