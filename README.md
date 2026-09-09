# Portfolio

A personal portfolio with **two skins over one dataset**:

- **VIM** (default) — a calm terminal-OS / editor look: letter-spaced lime headings,
  bordered nav endpoints, panels with floating labels, terminal-window chrome, a
  bottom status bar.
- **RETRO** (secondary) — a retro treatment: Street-Fighter-style *Brutal Pro*
  wordmark ("D3ATHSKULLL") with a yellow→red gradient face, a neobrutalist
  geometric background, subtle CRT scanlines and terminal-window chrome.

A switch in the top bar flips between them; both render the **same content**. A
theme-aware boot loader (in [`frontend/index.html`](frontend/index.html)) shows
until the profile data loads.

| | |
|---|---|
| **Data** | [`profile.json`](profile.json) at the repo root — the single source of truth for every résumé section. Edit it and reload; no code changes. |
| **Blog** | folders under [`content/blog/`](content/blog/), rendered **fully statically** at build time (no DB, no admin UI). |
| **Backend** | Rust · Axum · Tokio ([`backend/`](backend/)) — serves the API, the generated blog JSON, and (in prod) the built SPA as one binary. |
| **Frontend** | React · TypeScript · Vite · Tailwind ([`frontend/`](frontend/)). |

---

## Quick start

```bash
npm run setup     # installs root + frontend deps (one time)
npm run dev       # starts API :8080 and web :5173 — open http://localhost:5173
```

`npm run dev` handles everything: it checks that Rust can link on your machine,
generates the blog JSON, then runs the API and Vite together with prefixed logs.
Stop with Ctrl-C.

### If the backend won't start

Run the diagnostic:

```bash
npm run doctor
```

The usual cause on Windows is **Rust has no linker**. Fix one of:

1. **MSVC** — install *"Desktop development with C++"* from the Visual Studio Build
   Tools installer, **or**
2. **GNU** — `rustup toolchain install stable-x86_64-pc-windows-gnu` and install
   MinGW-w64 gcc (`winget install BrechtSanders.WinLibs.POSIX.UCRT.Base`).
   This repo already pins the GNU toolchain in [`rust-toolchain.toml`](rust-toolchain.toml),
   and `npm run dev` will switch to it automatically once it's installed.

macOS / Linux need only a working C toolchain (`xcode-select --install` / `build-essential`).

---

## Production build

```bash
npm run build     # validate → blog:check → bloggen → vite build → cargo --release
npm start         # runs the release binary — everything on http://localhost:8080
```

`npm start` serves the SPA, the API, the blog, and the hashed assets (with year-long
immutable caching) from the single `portfolio-backend` binary.

### Deploy to Vercel (no server)

The Axum binary only *serves* static/generated files plus one email endpoint, so the
whole site runs on Vercel with a single function:

| runtime need | Vercel |
|---|---|
| SPA, `/assets/*`, deep-link refresh | static `frontend/dist` + a single SPA-fallback rewrite (excludes `/api/` and any dotted path) |
| profile + blog data | the `vercel-build` sets `VITE_STATIC_DATA=true`, so the app fetches `/profile.json`, `/blog-index.json`, `/blog/<slug>.json` **directly** (no `/api/*` rewrites — see [`frontend/src/api.ts`](frontend/src/api.ts)) |
| `/blog-assets/*`, `/resume-*.pdf`, `/resume.typ` | plain static files in `public/` |
| `POST /api/contact` | `frontend/api/contact.ts` — Node function, `nodemailer` + SMTP |

Wiring: [`frontend/vercel.json`](frontend/vercel.json) (build env + SPA fallback + cache
headers), [`frontend/scripts/prepare-static.mjs`](frontend/scripts/prepare-static.mjs)
(copies `profile.json` + `.gen/blog*.json` + résumés into `public/`), run by the
`vercel-build` npm script. Local dev and the single-binary/Docker build leave
`VITE_STATIC_DATA` unset and keep using the Axum `/api/*` routes.

**Blog generation still uses `bloggen` (Rust) — but only locally.** `.gen/` and
`frontend/public/blog-assets/` are committed to the repo, so Vercel never needs cargo.
After editing a post: `npm run bloggen` (or the `npm run blog` menu) then commit the
regenerated files.

Setup:

1. Vercel → **New Project** → import the repo.
2. **Root Directory:** `frontend` · **Framework:** Vite · **Build Command:** `npm run vercel-build` · **Output:** `dist`.
3. **Environment Variables:** `SMTP_URL`, `CONTACT_TO`, `CONTACT_FROM` (see below). Optional `PUBLIC_SITE_URL`.
4. Deploy. Smoke-test: hard-refresh `/projects`, open a blog post, download `/resume-sde.pdf`, submit the contact form (check the function log).

Local dev is unchanged (`npm run dev` still runs Vite + the Rust API together), or use
`cd frontend && vercel dev` to exercise the exact Vercel routing + the contact function.

### Docker (single-binary alternative)

```bash
docker build -t portfolio .
docker run -p 8080:8080 portfolio
```

Multi-stage: builds the SPA + the release binary + the blog JSON, ships a slim runtime
image. Host on Fly.io / Render / Railway / any container host — set `PORT` and the mail
env vars. Use this if you'd rather run the one Axum binary than split static + function.

### Configuration (`.env`)

Copy [`.env.example`](.env.example) to `.env` (git-ignored, auto-loaded by
`npm run dev` and `npm start`) and set:

| var | purpose |
|---|---|
| `PUBLIC_SITE_URL` | the public URL where the site is hosted |
| `PORT` | backend port (default `8080`) |
| `SMTP_URL` | `smtps://user:pass@smtp.host:465` — switches `POST /api/contact` from mock mode to real delivery |
| `CONTACT_TO` | recipient address for contact-form submissions |
| `CONTACT_FROM` | from address on delivered mail (defaults to `CONTACT_TO`) |

---

## Authoring

### Blog — one command

```bash
npm run blog
```

Opens an interactive menu that lists every post and lets you **[n]ew · [e]dit ·
[d]elete · [p]ublish · [u]npublish · [c]heck** by row number. New/edit open the
post's `index.md` in `$EDITOR`. Each change regenerates the static JSON, so with
`npm run dev` running you just refresh the browser — `npm run dev` also watches
`content/blog/` and rebuilds on any file save.

Same actions as plain commands (each regenerates `.gen/`; add `--no-gen` to skip):

| Task | Command |
|---|---|
| List posts | `npm run blog:list` |
| New post | `npm run blog:new "My Post Title"` |
| Edit a post | `npm run blog:edit <slug>` |
| Publish / unpublish (toggle `draft:`) | `npm run blog:publish <slug>` · `npm run blog:unpublish <slug>` |
| Add an image | `npm run blog:add-image <slug> ./path/to/img.png [--cover]` |
| Remove an image | `npm run blog:rm-image <slug> <image-name>` |
| Delete a post | `npm run blog:rm <slug>` |
| Validate all content | `npm run blog:check` |

| Other | Command |
|---|---|
| Edit résumé links / labels | edit [`profile.json`](profile.json) → `resume` |
| Replace a résumé PDF/source | drop it in `content/resumes/` as `Shivam_Resume_SDE.pdf` / `Shivam_Resume_Embedded.pdf` / `Shivam_Resume.typ`; `npm run dev` / `build` copies it to `frontend/public/` |
| Regenerate TS types from the Rust model | `npm run gen:types` |

### How the blog is built (fully static)

`cargo run --bin bloggen` scans `content/blog/*/index.md`, renders Markdown → HTML
(code highlighted, headings get `id` anchors), copies each post's `images/` into
`frontend/public/blog-assets/<slug>/` with content-hashed names, rewrites the relative
`./images/...` links, and writes `.gen/blog-index.json` + `.gen/blog/<slug>.json`. The
Axum handlers just serve those files. `draft: true` hides a post from the production
build (`bloggen --dev` includes it).

**Pagination.** A line containing only `<!-- pagebreak -->` (or `+++`) splits a post
into pages: `bloggen` emits `pages: string[]` + `pageCount` alongside the full `html`,
and the post view shows Prev / Next controls. The `/blog` index list is paginated too
(`?page=N`, `POSTS_PER_PAGE` in `frontend/src/pages.tsx`).

---

## Routes

`/` · `/experience` · `/projects` · `/collaborations` · `/skills` · `/designs` ·
`/education` · `/test-scores` · `/extracurricular` · `/wins` · `/likes` ·
`/resume` · `/blog` · `/blog/:slug` · `/contact` — plus a retro 404. The nav menu
is generated from [`frontend/src/routes.config.ts`](frontend/src/routes.config.ts).

**Projects & categories.** A project's `type` in `profile.json` is a string **or an
array** of category names (`"type": ["HCI", "Collaboration"]`). Any project whose
categories include `"Collaboration"` is shown on `/collaborations` instead of
`/projects`. Experience, projects, collaborations and education auto-sort
newest-first by their `to`/`from` dates. Within a section only one accordion card
is open at a time.

## Test

```bash
cargo test --manifest-path backend/Cargo.toml   # unit tests + ts-rs binding export
(cd frontend && npm run e2e)                     # Playwright smoke: every route × both themes, blog, 404
npm run lighthouse                               # Perf & A11y budget (>= 0.9 on / and /blog)
```

## npm scripts

| script | what |
|---|---|
| `setup` | install all dependencies |
| `dev` | run API + web together (dev) |
| `doctor` | diagnose toolchain / linker problems |
| `build` | full production build |
| `start` | run the release binary |
| `bloggen` | (re)generate the static blog JSON |
| `blog:*` | blog authoring CLI |
| `gen:types` | regenerate `frontend/src/types/profile.gen.ts` from Rust |
| `check` | validate `profile.json` + blog content |
| `lighthouse` | Lighthouse CI budget |

See [`plan.md`](plan.md) for the commit-by-commit build log and [`prompt.md`](prompt.md)
for the full spec.
