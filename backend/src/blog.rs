//! Static blog pipeline. `bloggen` runs this at build time; the server only
//! reads the JSON it produces.

use serde::{Deserialize, Serialize};
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};
use std::path::Path;

pub type Result<T> = std::result::Result<T, Box<dyn std::error::Error + Send + Sync>>;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FrontMatter {
    pub title: String,
    pub date: String,
    pub slug: String,
    pub summary: String,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub cover: Option<String>,
    #[serde(default)]
    pub draft: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TocItem {
    pub level: u8,
    pub text: String,
    pub id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Post {
    #[serde(flatten)]
    pub front_matter: FrontMatter,
    pub html: String,
    pub toc: Vec<TocItem>,
    #[serde(rename = "readingMinutes")]
    pub reading_minutes: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IndexEntry {
    pub title: String,
    pub date: String,
    pub slug: String,
    pub summary: String,
    pub tags: Vec<String>,
    pub cover: Option<String>,
}

fn slugify(s: &str) -> String {
    let mut out = String::new();
    let mut prev_dash = false;
    for c in s.chars() {
        if c.is_ascii_alphanumeric() {
            out.push(c.to_ascii_lowercase());
            prev_dash = false;
        } else if !prev_dash {
            out.push('-');
            prev_dash = true;
        }
    }
    out.trim_matches('-').to_string()
}

fn split_front_matter(raw: &str) -> (String, String) {
    let raw = raw.replace("\r\n", "\n");
    if let Some(rest) = raw.strip_prefix("---\n") {
        if let Some(end) = rest.find("\n---\n") {
            return (rest[..end].to_string(), rest[end + 5..].to_string());
        }
        if let Some(end) = rest.find("\n---") {
            return (rest[..end].to_string(), String::new());
        }
    }
    (String::new(), raw)
}

fn parse_front_matter(fm: &str) -> Result<FrontMatter> {
    let mut title = None;
    let mut date = None;
    let mut slug = None;
    let mut summary = None;
    let mut tags = Vec::new();
    let mut cover = None;
    let mut draft = false;
    for line in fm.lines() {
        let Some((k, v)) = line.split_once(':') else { continue };
        let v = v.trim().trim_matches(|c| c == '"' || c == '\'');
        match k.trim() {
            "title" => title = Some(v.to_string()),
            "date" => date = Some(v.to_string()),
            "slug" => slug = Some(v.to_string()),
            "summary" => summary = Some(v.to_string()),
            "cover" if !v.is_empty() => cover = Some(v.to_string()),
            "draft" => draft = v == "true",
            "tags" => {
                let inner = v.trim_start_matches('[').trim_end_matches(']');
                tags = inner
                    .split(',')
                    .map(|t| t.trim().trim_matches(|c| c == '"' || c == '\'').to_string())
                    .filter(|t| !t.is_empty())
                    .collect();
            }
            _ => {}
        }
    }
    Ok(FrontMatter {
        title: title.ok_or("front-matter: title missing")?,
        date: date.ok_or("front-matter: date missing")?,
        slug: slug.ok_or("front-matter: slug missing")?,
        summary: summary.ok_or("front-matter: summary missing")?,
        tags,
        cover,
        draft,
    })
}

fn hashed_name(bytes: &[u8], name: &str) -> String {
    let mut h = DefaultHasher::new();
    bytes.hash(&mut h);
    let stem = Path::new(name).file_stem().and_then(|s| s.to_str()).unwrap_or("img");
    let ext = Path::new(name).extension().and_then(|s| s.to_str()).unwrap_or("bin");
    format!("{}-{:08x}.{}", slugify(stem), (h.finish() as u32), ext)
}

/// Render one post directory. Copies its images into `assets_out/<slug>/` and
/// rewrites relative `./images/...` links to `/blog-assets/<slug>/<hashed>`.
pub fn render_post(dir: &Path, assets_out: &Path) -> Result<Post> {
    let raw = std::fs::read_to_string(dir.join("index.md"))?;
    let (fm_raw, body) = split_front_matter(&raw);
    let fm = parse_front_matter(&fm_raw)?;

    // Copy images and build a rewrite map.
    let mut rewrites: Vec<(String, String)> = Vec::new();
    let img_dir = dir.join("images");
    let out_dir = assets_out.join(&fm.slug);
    if img_dir.is_dir() {
        std::fs::create_dir_all(&out_dir)?;
        let mut entries: Vec<_> = std::fs::read_dir(&img_dir)?
            .filter_map(|e| e.ok())
            .map(|e| e.path())
            .filter(|p| p.is_file())
            .collect();
        entries.sort();
        for path in entries {
            let name = path.file_name().unwrap().to_string_lossy().to_string();
            if name == ".gitkeep" {
                continue;
            }
            let bytes = std::fs::read(&path)?;
            let hashed = hashed_name(&bytes, &name);
            std::fs::write(out_dir.join(&hashed), &bytes)?;
            let public = format!("/blog-assets/{}/{}", fm.slug, hashed);
            rewrites.push((format!("./images/{name}"), public.clone()));
            rewrites.push((format!("images/{name}"), public));
        }
    }

    let mut body = body;
    for (from, to) in &rewrites {
        body = body.replace(from, to);
    }
    let cover = fm.cover.as_ref().map(|c| {
        let mut v = c.clone();
        for (from, to) in &rewrites {
            v = v.replace(from, to);
        }
        v
    });

    let (html, toc) = markdown_to_html(&body);
    let words = body.split_whitespace().count() as u32;
    let reading_minutes = (words / 200).max(1);

    Ok(Post {
        front_matter: FrontMatter { cover, ..fm },
        html,
        toc,
        reading_minutes,
    })
}

fn markdown_to_html(md: &str) -> (String, Vec<TocItem>) {
    use pulldown_cmark::{CodeBlockKind, Event, HeadingLevel, Options, Parser, Tag, TagEnd};

    let mut opts = Options::empty();
    opts.insert(Options::ENABLE_TABLES);
    opts.insert(Options::ENABLE_STRIKETHROUGH);
    opts.insert(Options::ENABLE_FOOTNOTES);

    let mut toc = Vec::new();
    let mut heading_buf: Option<(u8, String)> = None;

    let parser = Parser::new_ext(md, opts).map(|event| match event {
        Event::Start(Tag::Heading { level, .. }) => {
            let lvl = match level {
                HeadingLevel::H1 => 1,
                HeadingLevel::H2 => 2,
                HeadingLevel::H3 => 3,
                HeadingLevel::H4 => 4,
                HeadingLevel::H5 => 5,
                HeadingLevel::H6 => 6,
            };
            heading_buf = Some((lvl, String::new()));
            event
        }
        Event::Text(ref t) => {
            if let Some((_, ref mut s)) = heading_buf {
                s.push_str(t);
            }
            event.clone()
        }
        Event::End(TagEnd::Heading(_)) => {
            if let Some((level, text)) = heading_buf.take() {
                toc.push(TocItem {
                    level,
                    id: slugify(&text),
                    text,
                });
            }
            event
        }
        Event::Start(Tag::CodeBlock(CodeBlockKind::Fenced(lang))) => {
            Event::Html(format!("<pre><code class=\"language-{}\">", lang.trim()).into())
        }
        Event::End(TagEnd::CodeBlock) => Event::Html("</code></pre>".into()),
        other => other,
    });

    let mut html = String::new();
    pulldown_cmark::html::push_html(&mut html, parser);
    (html, toc)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn front_matter_and_toc() {
        let (fm_raw, body) = split_front_matter(
            "---\ntitle: T\ndate: 2026-01-01\nslug: t\nsummary: s\ntags: [a, b]\n---\n## Hi\ntext",
        );
        let fm = parse_front_matter(&fm_raw).unwrap();
        assert_eq!(fm.slug, "t");
        assert_eq!(fm.tags, vec!["a", "b"]);
        let (html, toc) = markdown_to_html(&body);
        assert!(html.contains("<h2"));
        assert_eq!(toc[0].id, "hi");
    }
}
