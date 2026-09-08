//! Shared logic for the portfolio backend and the `bloggen` static generator.

pub mod blog;
pub mod model;

use std::path::{Path, PathBuf};

/// Resolve the repository root that holds `profile.json` and `content/`.
///
/// Honours `CONTENT_ROOT`; otherwise walks up from the current dir looking for
/// `profile.json` (so it works whether run from repo root or `backend/`).
pub fn content_root() -> PathBuf {
    if let Ok(p) = std::env::var("CONTENT_ROOT") {
        return PathBuf::from(p);
    }
    let mut dir = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
    loop {
        if dir.join("profile.json").is_file() {
            return dir;
        }
        if !dir.pop() {
            return PathBuf::from(".");
        }
    }
}

/// Directory where generated blog JSON is written / read.
pub fn gen_dir(root: &Path) -> PathBuf {
    root.join(".gen")
}

/// Directory where post images are copied for static serving.
pub fn blog_assets_dir(root: &Path) -> PathBuf {
    root.join("frontend").join("public").join("blog-assets")
}
