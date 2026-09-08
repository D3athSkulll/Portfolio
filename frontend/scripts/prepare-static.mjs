#!/usr/bin/env node
// Vercel build step: stage the files the SPA fetches at runtime into `public/`
// so they ship as plain static assets (no Rust/Axum server needed).
//
//   ../profile.json            -> public/profile.json        (rewrite: /api/profile)
//   ../.gen/blog-index.json     -> public/blog-index.json      (rewrite: /api/blog)
//   ../.gen/blog/<slug>.json    -> public/blog/<slug>.json     (rewrite: /api/blog/:slug)
//   content/resumes/*           -> public/resume-*.{pdf,typ}   (via syncResumes)
//
// Blog JSON + public/blog-assets/ are produced by `npm run bloggen` (Rust) and
// committed to the repo, so this script only copies — it never needs cargo.
import { existsSync, mkdirSync, readdirSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { syncResumes } from "../../scripts/lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..");
const PUBLIC = join(HERE, "..", "public");

const copy = (from, to) => {
  if (!existsSync(from)) {
    console.warn(`prepare-static: missing ${from} — skipped`);
    return false;
  }
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
  return true;
};

let n = 0;
n += copy(join(REPO, "profile.json"), join(PUBLIC, "profile.json")) ? 1 : 0;
n += copy(join(REPO, ".gen", "blog-index.json"), join(PUBLIC, "blog-index.json")) ? 1 : 0;

const blogGen = join(REPO, ".gen", "blog");
if (existsSync(blogGen)) {
  for (const f of readdirSync(blogGen)) {
    if (f.endsWith(".json")) n += copy(join(blogGen, f), join(PUBLIC, "blog", f)) ? 1 : 0;
  }
}

const resumes = syncResumes();
console.log(`prepare-static: staged ${n} data file(s), ${resumes} résumé file(s) into public/`);
