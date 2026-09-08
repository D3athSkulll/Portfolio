//! Build-time static blog generator.
//!
//! Scans `content/blog/*/index.md`, renders each post, copies its images into
//! `frontend/public/blog-assets/<slug>/`, and writes:
//!   .gen/blog-index.json         — array of IndexEntry (newest first)
//!   .gen/blog/<slug>.json        — full Post
//!
//! Pass `--dev` to include drafts.

use portfolio_backend::blog::{render_post, IndexEntry};
use portfolio_backend::{blog_assets_dir, content_root, gen_dir};

fn main() {
    let include_drafts = std::env::args().any(|a| a == "--dev");
    if let Err(e) = run(include_drafts) {
        eprintln!("bloggen: {e}");
        std::process::exit(1);
    }
}

fn run(include_drafts: bool) -> portfolio_backend::blog::Result<()> {
    let root = content_root();
    let blog_dir = root.join("content").join("blog");
    let gen = gen_dir(&root);
    let assets = blog_assets_dir(&root);

    std::fs::create_dir_all(gen.join("blog"))?;
    std::fs::create_dir_all(&assets)?;

    let mut dirs: Vec<_> = std::fs::read_dir(&blog_dir)
        .map(|rd| {
            rd.filter_map(|e| e.ok())
                .map(|e| e.path())
                .filter(|p| p.join("index.md").is_file())
                .collect::<Vec<_>>()
        })
        .unwrap_or_default();
    dirs.sort();

    let mut index: Vec<IndexEntry> = Vec::new();
    for dir in &dirs {
        let post = render_post(dir, &assets)?;
        if post.front_matter.draft && !include_drafts {
            println!("skip (draft): {}", post.front_matter.slug);
            continue;
        }
        let fm = &post.front_matter;
        index.push(IndexEntry {
            title: fm.title.clone(),
            date: fm.date.clone(),
            slug: fm.slug.clone(),
            summary: fm.summary.clone(),
            tags: fm.tags.clone(),
            cover: fm.cover.clone(),
        });
        std::fs::write(
            gen.join("blog").join(format!("{}.json", fm.slug)),
            serde_json::to_vec_pretty(&post)?,
        )?;
        println!("rendered: {}", fm.slug);
    }

    index.sort_by(|a, b| b.date.cmp(&a.date));
    std::fs::write(
        gen.join("blog-index.json"),
        serde_json::to_vec_pretty(&index)?,
    )?;
    println!("wrote {} post(s) to {}", index.len(), gen.display());
    Ok(())
}
