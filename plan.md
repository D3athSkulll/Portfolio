# Implementation Plan — Commit-by-Commit

> **Status (updated):** Phases 0–8 landed in 11 commits. Delivered: monorepo +
> toolchains + CI, `profile.json` + validator, blog authoring CLI + first post,
> Axum backend (`/api/profile`, static blog endpoints, `bloggen`, `/api/contact`,
> immutable asset caching, SPA fallback), React frontend with all routes and the
> dual **arcade/CRT retro** ↔ **docs** theme, `ts-rs` type generation, blog heading
> anchors + on-this-page nav, multi-stage Dockerfile, and a Playwright smoke suite
> (every route × both themes, blog image, 404, theme persistence). Not yet done:
> CI Lighthouse budget assertion, and per-section altitude polish beyond the
> data-driven baseline.

Stack (per `prompt.md`): **Rust + Axum + Tokio** backend, **React + TypeScript + Vite + Tailwind** frontend, `profile.json` at repo root as the single data source, blog authored as folders under `content/blog/` and **rendered fully statically** (build-time generation, no runtime DB).

Each commit below is self-contained, builds green, and ends with a working checkpoint. Conventional-commit prefixes. `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` on every commit.

---

## Phase 0 — Repo skeleton

### `chore: scaffold monorepo layout`
- Top level: `backend/` (Cargo), `frontend/` (Vite), `content/blog/`, `scripts/`, `profile.json`, `prompt.md`, `plan.md`.
- Root `README.md` with dev/build commands, `.gitignore` (`target/`, `node_modules/`, `dist/`, `frontend/public/blog-assets/`, generated `*.gen.json`).
- Root `package.json` with workspace scripts that shell into `frontend/` and `backend/` (`dev`, `build`, `blog:*`, `check`).
- **Checkpoint:** `npm run check` runs (no-op) and exits 0.

### `chore: pin toolchains + CI`
- `rust-toolchain.toml`, `.nvmrc`.
- `.github/workflows/ci.yml`: `cargo fmt --check`, `cargo clippy -D warnings`, `cargo test`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run blog:check`.
- **Checkpoint:** CI green on an empty build.

---

## Phase 1 — Data contract

### `feat: add profile.json schema + seed data`
- Commit `profile.json` fully populated with the seed from `prompt.md` (Shivam Deolankar résumé data).
- `schema/profile.schema.json` (JSON Schema) + a `scripts/validate-profile.mjs` wired into `blog:check`/CI.
- **Checkpoint:** `node scripts/validate-profile.mjs` passes.

### `feat: rust profile types + ts-rs export`
- `backend/src/model/profile.rs`: structs mirroring `profile.json` (`Meta`, `Profile`, `Contact`, `Education`, `Experience`, `Project`, `SkillGroup`, `ResumeLink`), `#[derive(Serialize, Deserialize, TS)]`.
- `cargo test` target that deserializes the real `profile.json` (fails loudly on drift).
- `ts-rs` export to `frontend/src/types/profile.gen.ts` via `cargo test export_bindings`.
- **Checkpoint:** `cargo test` green; generated TS file committed.

---

## Phase 2 — Backend (Axum)

### `feat: axum server skeleton + config`
- `backend/src/main.rs`: Tokio runtime, Axum router, `tower-http` `TraceLayer` + `CorsLayer` (dev), `--port`/env config, graceful shutdown.
- `GET /api/health` → `{ status: "ok" }`.
- `backend/src/content.rs`: resolves repo-root paths (`profile.json`, `content/blog/`) relative to a configurable `CONTENT_ROOT`.
- **Checkpoint:** `cargo run` serves `/api/health`.

### `feat: GET /api/profile`
- Load + parse `profile.json` into `Profile` model; return as JSON.
- `arc-swap` cache; in `dev`, `notify` watcher hot-reloads on file change.
- Tests: 200 + shape assertion, malformed file → 500 with clear log.
- **Checkpoint:** `curl /api/profile` returns seed data.

### `feat: bloggen static generator (bin)`
- `backend/src/bin/bloggen.rs`: scan `content/blog/*/index.md` →
  - parse front-matter (`title`, `date`, `slug`, `summary`, `tags`, `cover`, `draft`),
  - render Markdown with `pulldown-cmark`, code highlight with `syntect` (theme tokens for light + dark),
  - build a heading `toc`,
  - copy each post's `images/` → `frontend/public/blog-assets/<slug>/<hash>-<name>`, rewrite `./images/...` refs,
  - emit `.gen/blog-index.json` and `.gen/blog/<slug>.json` (`{ frontMatter, html, toc }`),
  - exclude `draft: true` unless `--dev`.
- Deterministic output (stable hashing, sorted order).
- Tests with a fixture post (text + one image).
- **Checkpoint:** `cargo run --bin bloggen -- --dev` produces `.gen/` artifacts.

### `feat: GET /api/blog + /api/blog/:slug from generated artifacts`
- Handlers read `.gen/blog-index.json` / `.gen/blog/<slug>.json` (arc-swap cache; dev watcher re-runs `bloggen`).
- `:slug` unknown → 404 JSON.
- Reverse-chronological index; drafts absent in release builds.
- Tests: index ordering, single post fetch, 404, draft exclusion.
- **Checkpoint:** blog endpoints serve the fixture post.

### `feat: static file serving for built frontend`
- `tower-http` `ServeDir` on `frontend/dist` with SPA fallback to `index.html`; `/blog-assets/*` served with long cache headers.
- **Checkpoint:** single `cargo run` serves API + a placeholder `dist/`.

### `feat: POST /api/contact (optional, gated)`
- Validate name/email/message, `tower_governor` rate limit, forward via `lettre` or provider; disabled unless SMTP env vars set (then frontend uses `mailto:` fallback).
- Tests: validation failures, rate-limit path.
- **Checkpoint:** returns 202 in mock mode.

---

## Phase 3 — Blog authoring CLI

### `feat: scripts/blog.mjs authoring CLI`
- `blog:new "<title>"` → scaffold `content/blog/<date>-<slug>/index.md` + empty `images/`.
- `blog:add-image <slug> <path> [--cover]` → copy + normalize filename into `images/`, set `cover:` when `--cover`.
- `blog:rm-image <slug> <name>` → delete; warn if still referenced in `index.md` or is current `cover`.
- `blog:rm <slug>` → remove post folder.
- `blog:check` → front-matter completeness, `date` parses, `cover` exists, no Markdown image ref missing, report orphan files; non-zero exit on error.
- Wire `blog:check` into `prebuild` + CI.
- **Checkpoint:** create a post, add/remove an image, `blog:check` passes; commit one real seed post (`content/blog/<date>-hello-world/`).

---

## Phase 4 — Frontend foundation

### `feat: vite + react + tailwind + router setup`
- Vite React-TS app, Tailwind configured, ESLint/Prettier, `npm run typecheck`.
- React Router with the route list from `prompt.md` (`/`, `/experience`, `/projects`, `/skills`, `/education`, `/resume`, `/achievements`, `/contact`, `/blog`, `/blog/:slug`, `*` 404).
- `routes.config.ts` — single array driving nav + router.
- Dev proxy `/api` → Axum.
- **Checkpoint:** all routes render a stub; `npm run build` green.

### `feat: theme system (retro light / docs dark)`
- CSS custom properties + `data-theme` on `<html>`; default light/retro, respect `prefers-color-scheme` first visit, persist choice in `localStorage`.
- `ThemeProvider` + visible toggle; no layout shift beyond skin.
- Token sets: retro (tiled bg, beveled borders, Times/Courier, blue/green/orange) and docs (near-black, one lime accent, monospace).
- AA contrast check notes in PR.
- **Checkpoint:** toggle flips skin on the stub pages.

### `feat: data layer — useProfile / useBlog hooks`
- TanStack Query; `api.ts` typed against `profile.gen.ts`.
- `useProfile()`, `useBlogIndex()`, `useBlogPost(slug)`.
- Loading = terminal-style `> loading...`; error = retro "UNDER CONSTRUCTION".
- **Checkpoint:** `/` shows real name/role from `profile.json`.

---

## Phase 5 — Shared chrome

### `feat: retro layout shell (light theme)`
From the image-11 cover page: title banner (`meta.siteTitle` green-on-blue + flame accents + `meta.tagline`), marquee ribbon with `<< —=(( o ))=— >>`, boxed `★ MENU ★` nav (from `routes.config`), era tab row (decorative, non-breaking), twin orange/green CTA bars above+below content, footer `© <year> <name> · <meta.footerCredit> · No frames. No problem.`.
- **Checkpoint:** shell wraps every route in light mode.

### `feat: docs layout shell (dark theme)`
Rust-Book sidebar TOC (routes + in-page anchors), terminal-window chrome (fake `C:\USERS\SHIVAM\<PAGE>.TXT` title bar + traffic-light dots), `[ SECTION ]` headings, `>` list markers, `EOF. WAITING FOR INPUT...` footer line.
- **Checkpoint:** same content, docs skin, in dark mode.

### `feat: retro widgets`
- Visitor counter (seed `meta.visitorCountSeed`, increment in `localStorage`).
- `[SYSTEM INFO]` box (user/role/status ONLINE/uptime 99.9%).
- Novelty badges: UNDER CONSTRUCTION, DON'T CLICK HERE (harmless easter egg), YOU'VE GOT MAIL.
- Y2K countdown to `meta.y2kCountdownTarget`; `prefers-reduced-motion` respected.
- **Checkpoint:** widgets render in light mode, hidden/collapsed in docs mode.

---

## Phase 6 — Content sections (one commit each, all data-driven)

### `feat: home / about route`
- `feat: experience route` — timeline, date ranges, location, link icons, bullets.
- `feat: projects route` — retro "file explorer" listing + card grid; outbound links.
- `feat: skills route` — category chips (retro) / labeled rows (docs) from `skills`.
- `feat: education route` — institution/degree/dates/detail.
- `feat: achievements route` — `achievements` + `positions` combined list.
- `feat: resume route` — `DOWNLOAD_RESUME.PDF` button (`resume.href`) + condensed rendered view from experience/education/skills; commit `frontend/public/resume.pdf` placeholder.
- `feat: contact route` — contact list + direct-comm panel + availability block; form posts to `/api/contact` or `mailto:` fallback.
- Each: renders in both themes, no hardcoded copy, mobile down to 360px.
- **Checkpoint per commit:** route complete in both skins.

---

## Phase 7 — Blog UI

### `feat: /blog index`
- Reverse-chronological cards (title, date, summary, tags, optional cover); tag filter; drafts absent in prod build.
- **Checkpoint:** lists the seed post.

### `feat: /blog/:slug post view`
- Render generated `html`, front-matter header, TOC (docs mode), prev/next nav on the CTA bars (retro mode).
- Code blocks + images styled for both themes; images resolve from `/blog-assets/...`.
- `<title>`/OG meta per post.
- 404 for unknown slug.
- **Checkpoint:** seed post reads correctly with an image, both themes.

---

## Phase 8 — Integration, polish, ship

### `feat: unified build pipeline`
- Root `npm run build`: `validate-profile` → `blog:check` → `bloggen` → `vite build` → `cargo build --release`.
- Multi-stage `Dockerfile` (node build stage → rust build stage → runtime with binary + `dist/` + `content/` + `.gen/`).
- **Checkpoint:** `docker build` yields one image serving the full site.

### `test: e2e smoke (Playwright)`
- Every route 200s in both themes; theme persists across reload; blog post renders image; 404 path.
- **Checkpoint:** e2e green in CI.

### `perf: lighthouse budget`
- Preload fonts, hashed asset caching, defer non-critical JS.
- CI Lighthouse assertion: Performance + Accessibility ≥ 90 on `/` and `/blog`.
- **Checkpoint:** budgets met.

### `docs: authoring + deploy guide`
- README: how to edit `profile.json`, `npm run blog:new` / `blog:add-image` / `blog:rm-image` workflow, how the static blog build works, deploy steps.
- **Checkpoint:** a new contributor can add a blog post with an image and deploy following only the README.

---

## Dependency order (critical path)

```
0 → 1 → 2(profile,bloggen,blog API) → 3(CLI) → 4 → 5 → 6 → 7 → 8
                     └───────── frontend phases can start after 1 ─────────┘
```

Phases 2 and 4 can proceed in parallel once Phase 1 (the data contract) lands.
