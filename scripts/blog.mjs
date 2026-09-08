#!/usr/bin/env node
// Dependency-free blog authoring CLI.
// Usage:
//   node scripts/blog.mjs new "Post Title"
//   node scripts/blog.mjs add-image <slug> <path> [--cover]
//   node scripts/blog.mjs rm-image <slug> <image-name>
//   node scripts/blog.mjs rm <slug>
//   node scripts/blog.mjs check
import {
  readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync,
  copyFileSync, rmSync, statSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, basename, extname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BLOG_DIR = join(ROOT, "content", "blog");

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const today = () => new Date().toISOString().slice(0, 10);

function findPostDir(slug) {
  if (!existsSync(BLOG_DIR)) return null;
  for (const name of readdirSync(BLOG_DIR)) {
    const p = join(BLOG_DIR, name);
    if (statSync(p).isDirectory() && (name === slug || name.endsWith("-" + slug)))
      return p;
  }
  return null;
}

function parseFrontMatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: md };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const mm = line.match(/^(\w+):\s*(.*)$/);
    if (!mm) continue;
    let v = mm[2].trim();
    if (v.startsWith("[") && v.endsWith("]"))
      v = v.slice(1, -1).split(",").map((x) => x.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    else v = v.replace(/^["']|["']$/g, "");
    data[mm[1]] = v;
  }
  return { data, body: m[2] };
}

function cmdNew(title) {
  if (!title) throw new Error('usage: blog.mjs new "Post Title"');
  const slug = slugify(title);
  const dir = join(BLOG_DIR, `${today()}-${slug}`);
  if (existsSync(dir)) throw new Error(`already exists: ${dir}`);
  mkdirSync(join(dir, "images"), { recursive: true });
  writeFileSync(join(dir, "images", ".gitkeep"), "");
  writeFileSync(
    join(dir, "index.md"),
    `---\ntitle: ${title}\ndate: ${today()}\nslug: ${slug}\nsummary: One-line summary for the index.\ntags: [rust, systems]\ncover:\ndraft: true\n---\n\nWrite your post here. Add images with \`npm run blog:add-image ${slug} ./pic.png\`,\nthen embed them using Markdown image syntax pointing at \`./images/<file>\`.\n`,
  );
  console.log("created", dir);
}

function cmdAddImage(slug, src, cover) {
  const dir = findPostDir(slug);
  if (!dir) throw new Error(`no post for slug: ${slug}`);
  if (!src || !existsSync(src)) throw new Error(`file not found: ${src}`);
  const name = slugify(basename(src, extname(src))) + extname(src).toLowerCase();
  const dest = join(dir, "images", name);
  copyFileSync(src, dest);
  console.log("added", `images/${name}`);
  if (cover) {
    const md = readFileSync(join(dir, "index.md"), "utf8");
    writeFileSync(
      join(dir, "index.md"),
      md.replace(/^cover:.*$/m, `cover: ./images/${name}`),
    );
    console.log("set as cover");
  }
}

function cmdRmImage(slug, name) {
  const dir = findPostDir(slug);
  if (!dir) throw new Error(`no post for slug: ${slug}`);
  const target = join(dir, "images", name);
  if (!existsSync(target)) throw new Error(`no such image: ${name}`);
  const md = readFileSync(join(dir, "index.md"), "utf8");
  if (md.includes(name))
    console.warn(`warning: ${name} is still referenced in index.md`);
  rmSync(target);
  console.log("removed", `images/${name}`);
}

function cmdRm(slug) {
  const dir = findPostDir(slug);
  if (!dir) throw new Error(`no post for slug: ${slug}`);
  rmSync(dir, { recursive: true, force: true });
  console.log("removed", dir);
}

function cmdCheck() {
  const errors = [];
  const warnings = [];
  if (!existsSync(BLOG_DIR)) {
    console.log("no content/blog yet — ok");
    return;
  }
  for (const name of readdirSync(BLOG_DIR)) {
    const dir = join(BLOG_DIR, name);
    if (!statSync(dir).isDirectory()) continue;
    const idx = join(dir, "index.md");
    if (!existsSync(idx)) { errors.push(`${name}: missing index.md`); continue; }
    const { data, body } = parseFrontMatter(readFileSync(idx, "utf8"));
    for (const f of ["title", "date", "slug", "summary"])
      if (!data[f]) errors.push(`${name}: front-matter '${f}' missing`);
    if (data.date && Number.isNaN(Date.parse(data.date)))
      errors.push(`${name}: date '${data.date}' does not parse`);
    const imgDir = join(dir, "images");
    const files = existsSync(imgDir)
      ? readdirSync(imgDir).filter((f) => f !== ".gitkeep")
      : [];
    if (data.cover) {
      const cn = basename(data.cover);
      if (!files.includes(cn)) errors.push(`${name}: cover '${cn}' not in images/`);
    }
    const refs = [...body.matchAll(/!\[[^\]]*\]\(\.\/images\/([^)]+)\)/g)].map((m) => m[1]);
    for (const r of refs)
      if (!files.includes(r)) errors.push(`${name}: image ref '${r}' missing`);
    for (const f of files)
      if (!refs.includes(f) && basename(data.cover || "") !== f)
        warnings.push(`${name}: orphan image '${f}' (not referenced)`);
  }
  for (const w of warnings) console.warn("warn:", w);
  if (errors.length) {
    for (const e of errors) console.error("error:", e);
    process.exit(1);
  }
  console.log("blog content OK");
}

const [cmd, ...args] = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const pos = args.filter((a) => !a.startsWith("--"));
try {
  switch (cmd) {
    case "new": cmdNew(pos.join(" ")); break;
    case "add-image": cmdAddImage(pos[0], pos[1], flags.has("--cover")); break;
    case "rm-image": cmdRmImage(pos[0], pos[1]); break;
    case "rm": cmdRm(pos[0]); break;
    case "check": cmdCheck(); break;
    default:
      console.error("commands: new | add-image | rm-image | rm | check");
      process.exit(1);
  }
} catch (e) {
  console.error("error:", e.message);
  process.exit(1);
}
