use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::atomic::{AtomicU32, Ordering};
use std::time::{Duration, Instant};

/// The export path, with its folder resolved through links. The path must name a .pdf or .docx
/// file, and a path in any known set folder is refused, because the viewer never writes to a PRD
/// set (OUT-001). The sets come from the Rust side, not only from the window.
pub fn outside_set(sets: &[PathBuf], path: &Path) -> Result<PathBuf, String> {
    let name = path.file_name().ok_or("The export needs a file name.")?;
    if !matches!(path.extension().and_then(|e| e.to_str()), Some("pdf" | "docx")) {
        return Err("The export must be a .pdf or .docx file.".into());
    }
    let dir = fs::canonicalize(path.parent().filter(|p| !p.as_os_str().is_empty()).unwrap_or(Path::new(".")))
        .map_err(|e| format!("The export folder cannot be used: {e}"))?;
    if sets.iter().filter_map(|s| fs::canonicalize(s).ok()).any(|root| dir.starts_with(root)) {
        return Err("Save the export outside the PRD set folder. The viewer never writes to a PRD set.".into());
    }
    Ok(dir.join(name))
}

static N: AtomicU32 = AtomicU32::new(0);
fn unique(base: &Path, what: &str) -> PathBuf {
    // Keep the extension last: Chrome writes a PDF only to a name that ends in .pdf.
    let ext = base.extension().map(|e| format!(".{}", e.to_string_lossy())).unwrap_or_default();
    base.with_file_name(format!(".{}.{what}.{}.{}{ext}", base.file_stem().unwrap_or_default().to_string_lossy(), std::process::id(), N.fetch_add(1, Ordering::Relaxed)))
}

/// Write `bytes` to a temporary file next to `out`, then rename it over `out`. A rename replaces a
/// link at `out`; it never writes through the link into the set.
fn replace(out: &Path, write: impl FnOnce(&Path) -> Result<(), String>) -> Result<(), String> {
    let tmp = unique(out, "tmp");
    let done = write(&tmp).and_then(|_| fs::rename(&tmp, out).map_err(|e| format!("The export was not saved: {e}")));
    if done.is_err() {
        let _ = fs::remove_file(&tmp);
    }
    done
}

/// Write the bytes of a Word export to `path` (FR-011).
pub fn write_export(sets: &[PathBuf], path: &Path, bytes: &[u8]) -> Result<(), String> {
    let out = outside_set(sets, path)?;
    replace(&out, |tmp| fs::write(tmp, bytes).map_err(|e| format!("The export was not saved: {e}")))
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
/// network: the HTML has every font and color in it. The HTML has no script, because the export
/// writer escapes every text (`--blink-settings=scriptEnabled=false` stops Chrome from printing).
pub fn export_pdf(chrome: &Path, work: &Path, sets: &[PathBuf], path: &Path, html: &str) -> Result<(), String> {
    let out = outside_set(sets, path)?;
    // Each call gets its own page and Chrome profile, so two exports never share files.
    let job = unique(&work.join("job"), "pdf");
    fs::create_dir_all(&job).map_err(|e| e.to_string())?;
    let page = job.join("export.html");
    let result = fs::write(&page, html).map_err(|e| e.to_string()).and_then(|_| {
        replace(&out, |tmp| {
            let mut child = Command::new(chrome)
                .args(["--headless", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--disable-background-networking", "--disable-sync"])
                .args(["--no-pdf-header-footer", "--generate-pdf-document-outline", "--proxy-server=127.0.0.1:9", "--proxy-bypass-list=<-loopback>"])
                .arg(format!("--user-data-dir={}", job.join("chrome").display()))
                .arg(format!("--print-to-pdf={}", tmp.display()))
                .arg(file_url(&page))
                .stdout(std::process::Stdio::null())
                .stderr(std::process::Stdio::null())
                .spawn()
                .map_err(|e| format!("Chrome did not start: {e}"))?;
            let end = Instant::now() + Duration::from_secs(60);
            loop {
                if let Some(status) = child.try_wait().map_err(|e| e.to_string())? {
                    return if status.success() && tmp.exists() { Ok(()) } else { Err(format!("Chrome did not write the PDF ({status}).")) };
                }
                if Instant::now() > end {
                    let _ = child.kill();
                    return Err("Chrome did not finish the PDF within 60 seconds.".into());
                }
                std::thread::sleep(Duration::from_millis(50));
            }
        })
    });
    let _ = fs::remove_dir_all(&job);
    result
}

/// A file URL with each byte that is not a plain path character percent-encoded, so a `#`, `?`,
/// or `%` in the path does not change what Chrome opens.
fn file_url(p: &Path) -> String {
    let mut u = String::from("file://");
    for b in p.as_os_str().as_encoded_bytes() {
        if b.is_ascii_alphanumeric() || b"/-._~".contains(b) { u.push(*b as char) } else { u.push_str(&format!("%{b:02X}")) }
    }
    u
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
        assert!(write_export(&[s.clone()], &s.join("x.docx"), b"x").unwrap_err().contains("outside the PRD set"));
        assert!(write_export(&[s.clone()], &s.join("grades/x.docx"), b"x").is_err());
        assert!(!s.join("x.docx").exists());
    }

    #[test]
    fn a_link_into_the_set_is_refused() {
        let (d, s) = set();
        std::os::unix::fs::symlink(&s, d.path().join("link")).unwrap();
        assert!(write_export(&[s.clone()], &d.path().join("link/x.docx"), b"x").is_err());
        assert!(!s.join("x.docx").exists());
    }

    #[test]
    fn a_path_outside_the_set_is_written() {
        let (d, s) = set();
        write_export(&[s.clone()], &d.path().join("out.docx"), b"bytes").unwrap();
        assert_eq!(fs::read(d.path().join("out.docx")).unwrap(), b"bytes");
    }

    #[test]
    fn a_link_at_the_target_is_replaced_not_written_through() {
        let (d, s) = set();
        fs::write(s.join("08.md"), "set file").unwrap();
        std::os::unix::fs::symlink(s.join("08.md"), d.path().join("out.docx")).unwrap();
        fs::hard_link(s.join("08.md"), d.path().join("hard.docx")).unwrap();
        write_export(&[s.clone()], &d.path().join("out.docx"), b"export").unwrap();
        write_export(&[s.clone()], &d.path().join("hard.docx"), b"export").unwrap();
        assert_eq!(fs::read_to_string(s.join("08.md")).unwrap(), "set file");
        assert_eq!(fs::read(d.path().join("out.docx")).unwrap(), b"export");
    }

    #[test]
    fn only_pdf_and_docx_files_are_written() {
        let (d, s) = set();
        assert!(write_export(&[s.clone()], &d.path().join(".zshrc"), b"x").unwrap_err().contains(".pdf or .docx"));
        assert!(write_export(&[s], &d.path().join("x.md"), b"x").is_err());
    }

    #[test]
    fn every_known_set_is_refused_not_only_the_open_one() {
        let (d, s) = set();
        let other = d.path().join("other");
        fs::create_dir_all(&other).unwrap();
        assert!(write_export(&[other, s.clone()], &s.join("x.docx"), b"x").is_err());
    }

    #[test]
    fn a_failed_pdf_keeps_the_earlier_export() {
        let (d, s) = set();
        let out = d.path().join("old.pdf");
        fs::write(&out, "earlier").unwrap();
        assert!(export_pdf(Path::new("/usr/bin/false"), &d.path().join("work"), &[s], &out, "<html></html>").is_err());
        assert_eq!(fs::read_to_string(&out).unwrap(), "earlier");
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
        export_pdf(&chrome, &d.path().join("work"), &[s.clone()], &out, "<!DOCTYPE html><html lang=\"en\"><head><title>T</title></head><body><h1>Heading</h1><p>Text</p></body></html>").unwrap();
        let pdf = fs::read(&out).unwrap();
        let has = |n: &[u8]| pdf.windows(n.len()).any(|w| w == n);
        assert!(pdf.starts_with(b"%PDF"));
        assert!(has(b"/StructTreeRoot"), "no structure tree");
        assert!(!s.join("export.html").exists());
    }

    #[test]
    fn a_file_url_escapes_hash_and_percent() {
        assert_eq!(file_url(Path::new("/a b/#1%/x.html")), "file:///a%20b/%231%25/x.html");
    }

    #[test]
    fn the_pdf_refuses_a_path_in_the_set() {
        let (d, s) = set();
        assert!(export_pdf(Path::new("/no/chrome"), &d.path().join("work"), &[s.clone()], &s.join("x.pdf"), "").unwrap_err().contains("outside the PRD set"));
    }
}
