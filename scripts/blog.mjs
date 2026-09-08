#!/usr/bin/env node
// Dependency-free blog authoring CLI.
//
// Run with no arguments for an interactive menu:
//   npm run blog
//
// Or use it as a plain command:
//   node scripts/blog.mjs new "Post Title"
//   node scripts/blog.mjs list
//   node scripts/blog.mjs edit <slug>
//   node scripts/blog.mjs publish <slug>        # clears draft:
//   node scripts/blog.mjs unpublish <slug>      # sets draft: true
//   node scripts/blog.mjs add-image <slug> <path> [--cover]
//   node scripts/blog.mjs rm-image <slug> <image-name>
//   node scripts/blog.mjs rm <slug>
//   node scripts/blog.mjs check
//
// Every mutating command regenerates the static blog JSON (.gen/) so a running
// `npm run dev` shows the change on the next browser refresh. Pass --no-gen to skip.
import {
  readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync,
  copyFileSync, rmSync, statSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import * as readline from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, basename, extname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BLOG_DIR = join(ROOT, "content", "blog");
const NO_GEN = process.argv.includes("--no-gen");

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

/** All posts, newest first: [{ slug, dir, name, data }]. */
function listPosts() {
  if (!existsSync(BLOG_DIR)) return [];
  const posts = [];
  for (const name of readdirSync(BLOG_DIR)) {
    const dir = join(BLOG_DIR, name);
    if (!statSync(dir).isDirectory()) continue;
    const idx = join(dir, "index.md");
    if (!existsSync(idx)) continue;
    const { data } = parseFrontMatter(readFileSync(idx, "utf8"));
    posts.push({ slug: data.slug || name, dir, name, data });
  }
  return posts.sort((a, b) => String(b.data.date).localeCompare(String(a.data.date)));
}

/** Rebuild .gen/ so a running dev server serves fresh JSON. Best-effort. */
function regen() {
  if (NO_GEN) return;
  if (!existsSync(join(ROOT, "backend", "Cargo.toml"))) return;
  process.stdout.write("regenerating blog JSON… ");
  const r = spawnSync(
    "cargo",
    ["run", "--quiet", "--manifest-path", "backend/Cargo.toml", "--bin", "bloggen", "--", "--dev"],
    { cwd: ROOT, env: { ...process.env, CONTENT_ROOT: ROOT }, stdio: ["ignore", "ignore", "inherit"] },
  );
  console.log(r.status === 0 ? "ok" : "(skipped — run `npm run bloggen` manually)");
}

function openEditor(file) {
  const ed = process.env.EDITOR || process.env.VISUAL || (process.platform === "win32" ? "notepad" : "nano");
  const r = spawnSync(ed, [file], { stdio: "inherit" });
  if (r.error) console.log(`open it yourself: ${file}`);
}

function setDraft(slug, draft) {
  const dir = findPostDir(slug);
  if (!dir) throw new Error(`no post for slug: ${slug}`);
  const idx = join(dir, "index.md");
  let md = readFileSync(idx, "utf8");
  md = /^draft:.*$/m.test(md)
    ? md.replace(/^draft:.*$/m, `draft: ${draft}`)
    : md.replace(/^---\r?\n/, `---\ndraft: ${draft}\n`);
  writeFileSync(idx, md);
  console.log(`${slug}: draft = ${draft}`);
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
    `---\ntitle: ${title}\ndate: ${today()}\nslug: ${slug}\nsummary: One-line summary for the index.\ntags: [rust, systems]\ncover:\ndraft: true\n---\n\nWrite your post here. Add images with \`npm run blog:add-image ${slug} ./pic.png\`,\nthen embed them using Markdown image syntax pointing at \`./images/<file>\`.\n\nPut a line with only \`<!-- pagebreak -->\` (or \`+++\`) where you want the post to\nsplit into a new page — the reader gets Prev / Next pagination.\n`,
  );
  console.log("created", dir);
  return join(dir, "index.md");
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

function cmdList() {
  const posts = listPosts();
  if (!posts.length) return console.log("no posts yet — `npm run blog` then [n]ew");
  for (const [i, p] of posts.entries()) {
    const flag = String(p.data.draft) === "true" ? "  \x1b[33m[draft]\x1b[0m" : "";
    console.log(`  ${String(i + 1).padStart(2)}) ${p.slug.padEnd(34)} ${p.data.date}${flag}`);
  }
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

/* ------------------------------------------------------------ interactive menu */

async function menu() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log("\n\x1b[36mBLOG\x1b[0m — content/blog\n");
  for (;;) {
    const posts = listPosts();
    console.log();
    cmdList();
    console.log(
      "\n  \x1b[2m[n]ew   [e]dit <#>   [d]elete <#>   [p]ublish <#>   [u]npublish <#>   [c]heck   [q]uit\x1b[0m",
    );
    const raw = (await rl.question("\n> ")).trim();
    if (!raw) continue;
    const [op, arg] = raw.split(/\s+/);
    const pick = () => {
      const n = Number(arg);
      if (!n || n < 1 || n > posts.length) { console.log("  ? give a row number"); return null; }
      return posts[n - 1];
    };
    try {
      if (op === "q" || op === "quit") break;
      else if (op === "n" || op === "new") {
        const title = (await rl.question("  title: ")).trim();
        if (!title) { console.log("  (cancelled)"); continue; }
        const file = cmdNew(title);
        if ((await rl.question("  open in editor? [Y/n] ")).trim().toLowerCase() !== "n") openEditor(file);
        regen();
      } else if (op === "e" || op === "edit") {
        const p = pick(); if (!p) continue;
        openEditor(join(p.dir, "index.md"));
        regen();
      } else if (op === "d" || op === "delete" || op === "rm") {
        const p = pick(); if (!p) continue;
        if ((await rl.question(`  delete "${p.slug}" and its images? [y/N] `)).trim().toLowerCase() === "y") {
          cmdRm(p.slug);
          regen();
        }
      } else if (op === "p" || op === "publish") {
        const p = pick(); if (!p) continue;
        setDraft(p.slug, false); regen();
      } else if (op === "u" || op === "unpublish") {
        const p = pick(); if (!p) continue;
        setDraft(p.slug, true); regen();
      } else if (op === "c" || op === "check") {
        cmdCheck();
      } else {
        console.log("  ? unknown command");
      }
    } catch (e) {
      console.error("  error:", e.message);
    }
  }
  rl.close();
}

/* ------------------------------------------------------------------ dispatch */

const argv = process.argv.slice(2).filter((a) => a !== "--no-gen");
const [cmd, ...args] = argv;
const flags = new Set(args.filter((a) => a.startsWith("--")));
const pos = args.filter((a) => !a.startsWith("--"));

try {
  switch (cmd) {
    case undefined:
    case "menu":
      await menu();
      break;
    case "list": case "ls":
      cmdList();
      break;
    case "new":
      cmdNew(pos.join(" "));
      regen();
      break;
    case "edit":
      if (!pos[0]) throw new Error("usage: blog.mjs edit <slug>");
      { const d = findPostDir(pos[0]); if (!d) throw new Error(`no post for slug: ${pos[0]}`); openEditor(join(d, "index.md")); }
      regen();
      break;
    case "publish":
      setDraft(pos[0], false);
      regen();
      break;
    case "unpublish": case "draft":
      setDraft(pos[0], true);
      regen();
      break;
    case "add-image":
      cmdAddImage(pos[0], pos[1], flags.has("--cover"));
      regen();
      break;
    case "rm-image":
      cmdRmImage(pos[0], pos[1]);
      regen();
      break;
    case "rm": case "delete":
      cmdRm(pos[0]);
      regen();
      break;
    case "check":
      cmdCheck();
      break;
    default:
      console.error("commands: (no args = menu) | list | new | edit | publish | unpublish | add-image | rm-image | rm | check");
      process.exit(1);
  }
} catch (e) {
  console.error("error:", e.message);
  process.exit(1);
}
