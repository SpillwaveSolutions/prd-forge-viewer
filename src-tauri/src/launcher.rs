use std::fs;
use std::os::unix::fs::PermissionsExt;
use std::path::{Path, PathBuf};

/// Every launcher the app writes has this line, so the app replaces only its own (ADR-004).
pub const MARKER: &str = "# prdf launcher for PRD Forge Viewer";

/// The `prdf` script: it passes the current folder, or the given path made absolute, to the app.
pub fn launcher_script() -> String {
    format!(
        r#"#!/bin/sh
{MARKER}
target="${{1:-$PWD}}"
case "$target" in /*) ;; *) target="$PWD/$target" ;; esac
exec open -n -a "PRD Forge Viewer" --args "$target"
"#
    )
}

/// Write `dir/prdf` with mode 0755. A `prdf` that the app did not write is never replaced.
pub fn install_launcher(dir: &Path) -> Result<PathBuf, String> {
    let path = dir.join("prdf");
    // Decide by existence first: a binary, unreadable, or symlinked prdf is never ours.
    if let Ok(meta) = fs::symlink_metadata(&path) {
        let ours = !meta.file_type().is_symlink()
            && fs::read(&path).map(|b| b.windows(MARKER.len()).any(|w| w == MARKER.as_bytes())).unwrap_or(false);
        if !ours {
            return Err(format!("{} already exists and is not the PRD Forge Viewer launcher. It was not changed.", path.display()));
        }
    }
    fs::create_dir_all(dir).map_err(|e| e.to_string())?;
    fs::write(&path, launcher_script()).map_err(|e| e.to_string())?;
    fs::set_permissions(&path, fs::Permissions::from_mode(0o755)).map_err(|e| e.to_string())?;
    Ok(path)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use std::os::unix::fs::PermissionsExt;
    use std::process::Command;
    use tempfile::TempDir;

    #[test]
    fn script_has_marker_and_open() {
        let s = launcher_script();
        assert!(s.contains(MARKER));
        assert!(s.contains(r#"open -n -a "PRD Forge Viewer" --args"#));
    }

    #[test]
    fn relative_path_made_absolute() {
        let bin = TempDir::new().unwrap();
        let stub = bin.path().join("open");
        fs::write(&stub, "#!/bin/sh\nfor a in \"$@\"; do echo \"$a\"; done\n").unwrap();
        fs::set_permissions(&stub, fs::Permissions::from_mode(0o755)).unwrap();
        let work = TempDir::new().unwrap();
        let out = Command::new("sh")
            .arg("-c")
            .arg(launcher_script())
            .arg("prdf")
            .arg("docs/prd/x")
            .current_dir(work.path())
            .env("PATH", format!("{}:/usr/bin:/bin", bin.path().display()))
            .output()
            .unwrap();
        let last = String::from_utf8(out.stdout).unwrap().lines().last().unwrap().to_string();
        let cwd = fs::canonicalize(work.path()).unwrap();
        assert!(last.ends_with("/docs/prd/x"), "{last}");
        assert!(fs::canonicalize(last.trim_end_matches("/docs/prd/x")).unwrap() == cwd, "{last}");
    }

    #[test]
    fn installs_executable() {
        let d = TempDir::new().unwrap();
        let p = install_launcher(d.path()).unwrap();
        assert_eq!(fs::metadata(p).unwrap().permissions().mode() & 0o777, 0o755);
    }

    #[test]
    fn keeps_foreign_prdf() {
        let d = TempDir::new().unwrap();
        fs::write(d.path().join("prdf"), "#!/bin/sh\necho other tool\n").unwrap();
        assert!(install_launcher(d.path()).is_err());
        assert_eq!(fs::read_to_string(d.path().join("prdf")).unwrap(), "#!/bin/sh\necho other tool\n");
    }

    #[test]
    fn keeps_foreign_binary_prdf() {
        let d = TempDir::new().unwrap();
        fs::write(d.path().join("prdf"), b"\xff\xfe\0binary").unwrap();
        assert!(install_launcher(d.path()).is_err());
        assert_eq!(fs::read(d.path().join("prdf")).unwrap(), b"\xff\xfe\0binary");
    }

    #[test]
    fn keeps_symlinked_prdf() {
        let d = TempDir::new().unwrap();
        let target = d.path().join("elsewhere");
        std::os::unix::fs::symlink(&target, d.path().join("prdf")).unwrap();
        assert!(install_launcher(d.path()).is_err());
        assert!(!target.exists());
    }

    #[test]
    fn replaces_own_prdf() {
        let d = TempDir::new().unwrap();
        fs::write(d.path().join("prdf"), format!("#!/bin/sh\n{MARKER}\nold\n")).unwrap();
        install_launcher(d.path()).unwrap();
        assert_eq!(fs::read_to_string(d.path().join("prdf")).unwrap(), launcher_script());
    }
}
