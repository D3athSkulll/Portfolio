//! Types mirroring `profile.json`. The backend does not reshape this data; it
//! validates that it parses and serves it straight to the frontend.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(ts_rs::TS))]
#[cfg_attr(test, ts(export, export_to = "profile.gen.ts"))]
pub struct Profile {
    pub meta: Meta,
    pub profile: Person,
    pub education: Vec<Education>,
    pub experience: Vec<Entry>,
    pub projects: Vec<Entry>,
    pub achievements: Vec<String>,
    pub positions: Vec<String>,
    pub skills: Vec<SkillGroup>,
    pub resume: ResumeLink,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(ts_rs::TS))]
#[cfg_attr(test, ts(export, export_to = "profile.gen.ts"))]
pub struct Meta {
    #[serde(rename = "siteTitle")]
    pub site_title: String,
    pub tagline: String,
    #[serde(rename = "footerCredit")]
    pub footer_credit: String,
    #[serde(rename = "visitorCountSeed")]
    pub visitor_count_seed: i32,
    #[serde(rename = "y2kCountdownTarget")]
    pub y2k_countdown_target: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(ts_rs::TS))]
#[cfg_attr(test, ts(export, export_to = "profile.gen.ts"))]
pub struct Person {
    pub name: String,
    pub role: String,
    pub location: String,
    pub summary: String,
    pub contact: Vec<Link>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(ts_rs::TS))]
#[cfg_attr(test, ts(export, export_to = "profile.gen.ts"))]
pub struct Link {
    #[serde(default)]
    pub label: Option<String>,
    pub href: String,
    pub icon: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(ts_rs::TS))]
#[cfg_attr(test, ts(export, export_to = "profile.gen.ts"))]
pub struct Education {
    pub institution: String,
    pub degree: String,
    pub from: String,
    pub to: String,
    #[serde(default)]
    pub detail: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(ts_rs::TS))]
#[cfg_attr(test, ts(export, export_to = "profile.gen.ts"))]
pub struct Entry {
    pub title: String,
    #[serde(default)]
    pub subtitle: Option<String>,
    pub from: String,
    pub to: String,
    #[serde(default)]
    pub location: Option<String>,
    #[serde(default)]
    pub links: Vec<Link>,
    pub bullets: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(ts_rs::TS))]
#[cfg_attr(test, ts(export, export_to = "profile.gen.ts"))]
pub struct SkillGroup {
    pub category: String,
    pub items: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(ts_rs::TS))]
#[cfg_attr(test, ts(export, export_to = "profile.gen.ts"))]
pub struct ResumeLink {
    pub href: String,
    pub label: String,
}

impl Profile {
    pub fn load(root: &std::path::Path) -> anyhow_lite::Result<Self> {
        let raw = std::fs::read_to_string(root.join("profile.json"))
            .map_err(|e| format!("read profile.json: {e}"))?;
        serde_json::from_str(&raw).map_err(|e| format!("parse profile.json: {e}").into())
    }
}

/// Tiny error alias so we avoid pulling in `anyhow` for one call site.
pub mod anyhow_lite {
    pub type Result<T> = std::result::Result<T, Box<dyn std::error::Error + Send + Sync>>;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn seed_profile_json_parses() {
        // repo root is the parent of `backend/` when tests run
        let root = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
            .parent()
            .unwrap()
            .to_path_buf();
        let p = Profile::load(&root).expect("profile.json must parse into the model");
        assert!(!p.profile.name.is_empty());
        assert!(!p.experience.is_empty());
        assert!(!p.skills.is_empty());
    }
}
