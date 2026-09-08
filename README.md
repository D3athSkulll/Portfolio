# Portfolio

Retro-meets-systems-docs personal portfolio. Dual theme: a loud "personal homepage '96" light skin and a calm Rust-Book / terminal-OS dark skin, both rendering the **same data**.

- **Data:** [`profile.json`](profile.json) at the repo root is the single source of truth for every résumé section.
- **Blog:** folders under [`content/blog/`](content/blog/), rendered **fully statically** at build time.
- **Backend:** Rust + Axum + Tokio (`backend/`).
- **Frontend:** React + TypeScript + Vite + Tailwind (`frontend/`).

## Develop

```bash
npm install
(cd frontend && npm install)
npm run dev          # Axum on :8080, Vite on :5173 (proxying /api)
```

## Build

```bash
npm run build        # validate → blog:check → bloggen → vite build → cargo build --release
```

## Authoring

| Task | Command |
|---|---|
| Edit résumé content | edit `profile.json` |
| New blog post | `npm run blog:new "My Post Title"` |
| Add an image to a post | `npm run blog:add-image <slug> ./path/to/img.png [--cover]` |
| Remove an image | `npm run blog:rm-image <slug> <image-name>` |
| Delete a post | `npm run blog:rm <slug>` |
| Validate all content | `npm run blog:check` |
| Regenerate TS types from the Rust model | `npm run gen:types` |

### How the blog is built (fully static)

There is **no database and no admin UI**. `cargo run --bin bloggen` scans
`content/blog/*/index.md`, renders Markdown → HTML (code highlighted, headings get
`id` anchors), copies each post's `images/` into `frontend/public/blog-assets/<slug>/`
with content-hashed names, rewrites the relative `./images/...` links, and writes
`.gen/blog-index.json` + `.gen/blog/<slug>.json`. The Axum handlers just serve those
files. Adding a post = add a folder, rebuild, deploy. `draft: true` hides a post from
the production build (`bloggen --dev` includes it).

## Test

```bash
cargo test --manifest-path backend/Cargo.toml   # unit + ts-rs binding export
(cd frontend && npm run e2e)                     # Playwright smoke: every route × both themes, blog, 404
```

## Deploy

Everything ships as **one container**: the multi-stage [`Dockerfile`](Dockerfile)
builds the SPA + the release binary + the generated blog JSON, and the final image is
just `portfolio-backend` serving `/`, `/api/*`, and the hashed assets (year-long
immutable caching).

```bash
docker build -t portfolio .
docker run -p 8080:8080 portfolio      # http://localhost:8080
```

Host on Fly.io / Render / any container host. Optional: set `SMTP_URL` to switch
`POST /api/contact` from mock mode to real delivery.

See [`plan.md`](plan.md) for the commit-by-commit build plan and [`prompt.md`](prompt.md) for the full spec.
