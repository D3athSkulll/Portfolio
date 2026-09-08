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

See [`plan.md`](plan.md) for the commit-by-commit build plan and [`prompt.md`](prompt.md) for the full spec.
