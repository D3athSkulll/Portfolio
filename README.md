# Portfolio

A personal portfolio with **two skins over one dataset**:

- **Retro / arcade** (default, light-ish) — an arcade-cabinet treatment drawn from the
  *Abhishar v15* cover: flame-gradient wordmark, poster-wall background, CRT scanlines,
  health-bar section labels, Game Boy cartridge nav, `HI-SCORE` / `PUSH START` HUD.
- **Docs** (dark) — a calm Rust-Book / terminal-OS look: letter-spaced lime headings,
  bordered panels with floating labels, terminal-window chrome, a bottom status bar.

One visible toggle flips between them; both render the **same content**.

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

### Docker

```bash
docker build -t portfolio .
docker run -p 8080:8080 portfolio
```

Multi-stage: builds the SPA + the release binary + the blog JSON, ships a slim runtime
image. Host on Fly.io / Render / any container host. Set `SMTP_URL` to switch
`POST /api/contact` from mock mode to real delivery.

---

## Authoring

| Task | Command |
|---|---|
| Edit résumé content | edit [`profile.json`](profile.json) |
| New blog post | `npm run blog:new "My Post Title"` |
| Add an image to a post | `npm run blog:add-image <slug> ./path/to/img.png [--cover]` |
| Remove an image | `npm run blog:rm-image <slug> <image-name>` |
| Delete a post | `npm run blog:rm <slug>` |
| Validate all content | `npm run blog:check` |
| Regenerate TS types from the Rust model | `npm run gen:types` |

### How the blog is built (fully static)

`cargo run --bin bloggen` scans `content/blog/*/index.md`, renders Markdown → HTML
(code highlighted, headings get `id` anchors), copies each post's `images/` into
`frontend/public/blog-assets/<slug>/` with content-hashed names, rewrites the relative
`./images/...` links, and writes `.gen/blog-index.json` + `.gen/blog/<slug>.json`. The
Axum handlers just serve those files. `draft: true` hides a post from the production
build (`bloggen --dev` includes it).

---

## Routes

`/` · `/experience` · `/projects` · `/skills` · `/education` · `/achievements` ·
`/resume` · `/contact` · `/blog` · `/blog/:slug` — plus a retro 404. The nav menu is
generated from [`frontend/src/routes.config.ts`](frontend/src/routes.config.ts).

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
