# Portfolio Build Prompt

## Goal

Build a personal developer portfolio website that fuses two aesthetics:

1. **Retro "personal homepage" structure & playfulness** — from the *Pedro Belleza's World 96* mockups (images 7–11): a decade/era switcher across the top, a boxed left-hand navigation menu, a visitor counter, "under construction" / "don't click here" novelty badges, a marquee status ribbon, a Y2K-style countdown block, and a footer credit line ("Made with Notepad"). Take the **layout skeleton and named UI elements from the image 11 cover page** specifically: centered blue title banner with flame accents, green-on-blue heading text, the `<< —=(( o ))=— >>` marquee separator, the era-navigation tab row, and the twin orange/green "GO TO <year>" call-to-action bars above and below content.
2. **Dark, minimal, systems-doc restraint** — from the first five images (Jaxon Archer "terminal OS" portfolio) and the Rust Book (image 6): monospace type, terminal-window chrome (`C:\USERS\...\ABOUT_ME.TXT` title bars, `[ SECTION ]` bracket labels, `> item` list markers), a single restrained accent color (lime/chartreuse), generous whitespace, `EOF. WAITING FOR INPUT...` style flourishes, and a left sidebar table-of-contents exactly like the Rust Book's persistent chapter nav.

### The synthesis

- **Light theme = retro mode.** Loud, boxed, tiled-background, novelty-badge, visitor-counter energy from the Belleza mockups — but tasteful, readable, and actually navigable. This is the default.
- **Dark theme = "docs mode."** Collapses the retro chrome into the calm Rust-Book / terminal-OS treatment: sidebar TOC, monospace body, one accent, terminal window frames, minimal ornament.
- A single visible **theme toggle** flips between them. Both themes render the *same content from the same data* — only the skin changes.
- Content is always rendered **minimally**: short blocks, clear hierarchy, no walls of text, no decorative filler that isn't driven by data.

## Data: single JSON source of truth

- A file named **`profile.json`** lives at the **root of the git repository**.
- The site renders **every section** from this file. Nothing user-facing is hardcoded — no names, roles, bullet lists, links, or section copy in components. Components read `profile.json` (or an API that serves it) and map over it.
- Ship the file pre-filled with the sample profile below so the repo renders a complete site on first clone.
- Keep the schema flat and obvious so it is trivial to hand-edit and commit.

### `profile.json` seed content (derived from the résumé object)

```json
{
  "meta": {
    "siteTitle": "SHIVAM DEOLANKAR",
    "tagline": "This is not a portfolio. It's a system.",
    "footerCredit": "Made with Vim",
    "visitorCountSeed": 0,
    "y2kCountdownTarget": "2028-04-30"
  },
  "profile": {
    "name": "Shivam Deolankar",
    "role": "Systems Programmer",
    "location": "Gwalior, India",
    "summary": "A systems programmer with 3 years of experience working on low-level systems in C and Rust, focusing on performance and memory safety. An active open-source contributor, proficient in backend, OS internals, embedded systems, and debugging.",
    "contact": [
      { "label": "+91 8390566237", "href": "tel:+918390566237", "icon": "phone" },
      { "label": "shivam.deolankar@gmail.com", "href": "mailto:shivam.deolankar@gmail.com", "icon": "envelope" },
      { "label": "D3athSkulll", "href": "https://github.com/D3athSkulll", "icon": "github" },
      { "label": "shivamdeolankar2211", "href": "https://linkedin.com/in/shivamdeolankar2211", "icon": "linkedin" },
      { "label": "D3athSkulll", "href": "https://leetcode.com/u/D3athSkulll/", "icon": "code" }
    ]
  },
  "education": [
    {
      "institution": "ABV - Indian Institute of Information Technology and Management, Gwalior",
      "degree": "Integrated B.Tech. + M.Tech. in Information Technology",
      "from": "2023-08",
      "to": "2028-04",
      "detail": "CGPA - 7.95/10 (6th Sem)"
    }
  ],
  "experience": [
    {
      "title": "ML Research Intern @ ABV-IIITM Gwalior",
      "subtitle": "Adaptive Wavelet Attention for improving Energy Forecasting Models",
      "from": "2026-05",
      "to": "2026-08",
      "location": "Remote",
      "links": [
        { "href": "https://github.com/D3athSkulll/SIMPLETM/tree/main", "icon": "github" },
        { "href": "https://github.com/D3athSkulll/SIMPLETM/blob/main/BTP%20Combined%20Report.pdf", "icon": "google-drive" }
      ],
      "bullets": [
        "Developed a Band Attention module for SimpleTM, inspired by FEDformer's frequency domain approach.",
        "Enabled adaptive frequency weighting through wavelet bands to capture multi-scale patterns in electricity load dataset.",
        "Improved forecasting accuracy across 5+ horizons, achieving 23.5% higher R2, 17.4% higher EVS, and 1.3% lower MSE."
      ]
    },
    {
      "title": "RTEMS - Real Time Operating System",
      "subtitle": "Open Source Contributor",
      "from": "2026-01",
      "to": "2026-06",
      "location": "Remote",
      "links": [
        { "href": "https://www.rtems.org/", "icon": "globe" },
        { "href": "https://github.com/RTEMS/rtems/commits/main/?author=D3athSkulll", "icon": "github" },
        { "href": "https://gitlab.rtems.org/rtems/rtos/rtems/-/merge_requests/?sort=merged_at_desc&state=all&author_username=D3athSkulll&first_page_size=20", "icon": "gitlab" }
      ],
      "bullets": [
        "Resolved a Stack Checker Reporter defect by restructuring flag handling and decoupling SECTION FLAGS from COMPILER FLAGS, eliminating flag conflicts and ensuring consistent configuration, improving overall build reliability.",
        "Resolved POSIX B0 baud rate edge case issue across UART drivers for 13 BSPs and drivers, implementing runtime safeguard mechanisms to prevent divide-by-zero, and standardizing termios handling for robust serial communication.",
        "Implemented fallback-safe MMU mapping for missing PCIe nodes in device trees, ensuring reliable handling of incomplete hardware descriptions and enabling stable boot with correct memory initialization across BSP environments.",
        "Migrated FatFS codebase, fixed error.h macro conflicts and libdl overflow, improving build stability and safety."
      ]
    }
  ],
  "projects": [
    {
      "title": "SMTP Server",
      "subtitle": "Custom SMTP Server using Golang (smtpd), Node.js (smtp-server), AWS EC2, Cloudflare DNS",
      "from": "2026-08",
      "to": "2026-08",
      "links": [{ "href": "https://github.com/D3athSkulll/SMTP-Server", "icon": "github" }],
      "bullets": [
        "Implemented a custom AWS EC2 instance to securely handle incoming emails using a self-managed infrastructure.",
        "Integrated the instance with a custom domain via Cloudflare DNS by setting up isolated MX records, effectively masking the personal email address and enforcing strict receive-only protocols for enhanced security and privacy."
      ]
    },
    {
      "title": "FerrisLedger",
      "subtitle": "Rust-based fintech backend with RBAC, secure APIs and real-time analytics.",
      "from": "2026-03",
      "to": "2026-03",
      "links": [
        { "href": "https://github.com/D3athSkulll/FerrisLedger", "icon": "github" },
        { "href": "https://fintech-backend-n1n0.onrender.com/", "icon": "globe" }
      ],
      "bullets": [
        "Rust-based fintech backend using Axum, Tokio, and PostgreSQL with JWT auth, RBAC (3 roles), and Argon2 hashing.",
        "Developed transaction APIs with filtering, pagination, and ownership to secure CRUD operations over 100+ records.",
        "Implemented a financial analytics dashboard computing 5+ metrics, for real-time insights and data-driven decisions."
      ]
    },
    {
      "title": "PikaNote",
      "subtitle": "A lightweight terminal text editor in Rust featuring efficient rendering and low-level control.",
      "from": "2025-02",
      "to": "2025-08",
      "links": [{ "href": "https://github.com/D3athSkulll/PikaNote", "icon": "github" }],
      "bullets": [
        "Implemented rich text editing features including insertion, deletion, line breaks, cursor navigation, and file I/O.",
        "Built real-time terminal interaction using Crossterm, handling key events and dynamic cursor control responsively.",
        "Implemented incremental screen rendering using queued terminal updates to minimize redraw overhead efficiently.",
        "Developed bidirectional incremental search with live highlighting using an annotated string system for large buffers.",
        "Designed a modular terminal UI with 3 components including editor view, message/command bar and a status bar."
      ]
    }
  ],
  "achievements": [
    "Overall Winner of Webkriti 2024, organised by AASF for developing Yatramitra, a travel ticket booking platform.",
    "Secured 3rd position in Product Management Track of AASF Winter Projects, 2025."
  ],
  "positions": [
    "Core Team Lead, Alumni Meet 2026, ABV-IIITM Gwalior.",
    "Technical and Design Lead, IEEE Student Branch, ABV-IIITM Gwalior.",
    "Executive, Student Activity Council 2025 (Technical), at ABV-IIITM Gwalior.",
    "Facilitated a 2-day workshop on Web Basics - JS for 50+ students at ABV-IIITM Gwalior.",
    "Designed official cover page for Abhishar V15, the annual magazine of ABV-IIITM Gwalior published by AASF."
  ],
  "skills": [
    { "category": "Systems Programming", "items": ["Rust", "Golang", "JavaScript", "C++", "C", "Python"] },
    { "category": "Backend Frameworks", "items": ["Axum", "Tokio", "Reqwest", "Node.js", "Express.js", "Redis", "Kafka", "REST APIs", "Websockets"] },
    { "category": "Databases and ORM", "items": ["SQL", "PostgreSQL", "MongoDB", "Diesel", "Sqlx", "SurrealDB"] },
    { "category": "DevOps", "items": ["Docker", "CI/CD", "Amazon Web Services", "AWS Lambda", "EC2", "S3"] },
    { "category": "AI and ML", "items": ["MCP", "Vector Embeddings", "Transformers", "LLMS", "Predictive Load Forecasting"] },
    { "category": "Development Tools", "items": ["Git", "GitHub", "Gitlab", "Claude Code", "Arch Linux", "Postman", "HTML", "TailwindCSS", "React"] },
    { "category": "Other Tools", "items": ["ABI", "RTOS", "GDB", "QEMU", "CMake", "Canva", "Photoshop", "Figma", "Notion"] }
  ],
  "resume": { "href": "/resume.pdf", "label": "DOWNLOAD_RESUME.PDF" }
}
```

### Blog data

Blog posts are **not** in `profile.json`. Each post is a **folder** under a top-level `content/blog/` directory so its images live next to its text:

```
content/blog/
  2026-02-11-why-b0-baud-is-cursed/
    index.md                # front-matter + Markdown body
    images/
      scope-capture.png
      flag-diff.png
```

Front-matter fields: `title`, `date` (ISO), `slug` (defaults to folder name minus date prefix), `summary`, `tags[]`, `cover` (optional path into `images/`), `draft` (bool). Body is Markdown; images are referenced relatively as `![alt](./images/scope-capture.png)`.

**Rendering — fully static (SSG).** The blog is generated at build time, never from a live database:

- A content layer scans `content/blog/*/index.md`, parses front-matter, renders Markdown → HTML (syntax-highlighted code blocks), and copies each post's `images/` into the public asset output, rewriting relative image URLs to their final hashed paths.
- `/blog` and every `/blog/[slug]` are pre-rendered to static HTML/JSON at build (`generateStaticParams` in Next.js / a prebuild step that emits `blog-index.json` + per-post JSON for the Rust/React option).
- `draft: true` posts are excluded from the production build but visible in `dev`.
- The "blog API" (`/api/blog`, `/api/blog/:slug`) is served from these pre-generated static files — adding a post = add a folder, rebuild, deploy. No admin UI, no runtime writes.

**Authoring workflow (add / remove posts and images).** Ship a small Node CLI at `scripts/blog.mjs` with npm-script aliases:

- `npm run blog:new "Why B0 baud is cursed"` — scaffolds `content/blog/<date>-<slug>/index.md` with front-matter stub and an empty `images/` folder.
- `npm run blog:add-image <slug> <path-to-file> [--cover]` — copies an image into that post's `images/`, normalizes the filename, and (with `--cover`) sets the `cover:` front-matter field.
- `npm run blog:rm-image <slug> <image-name>` — deletes the image and warns if it is still referenced in `index.md` or is the current `cover`.
- `npm run blog:rm <slug>` — removes the whole post folder.
- `npm run blog:check` — validates every post: required front-matter present, `date` parses, `cover` (if set) exists, no Markdown image reference points to a missing file, no orphan files in `images/` (report only).

`blog:check` also runs in CI and as a `prebuild` step so a broken post fails the build.

## Routes

Derived from the mockups' left-menu (`ABOUT_ME.TXT`, `SKILLS.DAT`, `PROJECTS/`, `RESUME.TYP`, `CONTACT.MSG`), the Belleza menu (About / Work / School / Skills / My Books / UXConf / Contact), and the résumé object's sections:

| Route | Source section | Notes |
|---|---|---|
| `/` | `meta` + `profile` | `ABOUT_ME.TXT` — title banner, summary, `[SYSTEM_INFO]` block (name, role, location, status ONLINE), contact links, era/theme switcher. |
| `/experience` | `experience` | `WORK_EXPERIENCE` — timeline of roles with date ranges, location, link icons, bullet lists. |
| `/projects` | `projects` | `PROJECTS/` — "file explorer" listing in retro mode; card grid; each card links out (github/globe). |
| `/skills` | `skills` | `SKILLS.DAT` / "TECHNICAL MATRIX" — category groups rendered as tag chips (retro) or labeled rows (docs). Optional proficiency bars if a `level` field is later added. |
| `/education` | `education` | "School Daze" — institution, degree, dates, detail line. |
| `/resume` | `resume` | `RESUME.DOC` — prominent `DOWNLOAD_RESUME.PDF` button plus a rendered condensed view built from experience/education/skills. |
| `/achievements` | `achievements` + `positions` | Combined "Achievements & Positions of Responsibility" list. |
| `/contact` | `profile.contact` + `meta` | `COMM_LINK.PROTO` — contact list, direct-communication panel, availability status block. Form optional; if present, it posts to a backend endpoint or a mailto fallback. |
| `/blog` | `content/blog/*/index.md` | **New.** Statically generated post index: title, date, summary, tags, optional cover. Reverse-chronological, drafts hidden. |
| `/blog/[slug]` | one post folder | Statically generated post: front-matter header + Markdown body with syntax-highlighted code blocks and co-located images (relative paths rewritten to hashed asset URLs at build), styled for both themes. |
| `404` | — | Retro "PAGE NOT FOUND — this corner of the information superhighway is UNDER CONSTRUCTION". |

Navigation component renders this route list from a small config array, with the retro boxed-menu presentation in light mode and the Rust-Book sidebar TOC in dark mode. Keep URLs clean and shareable; no hash routing.

## Retro elements to include (light/arcade theme), all data-driven

The retro skin is an **arcade-cabinet / 90s–2000s console** treatment, drawn from
the *Abhishar v15* magazine cover (cinematic dark room, warm amber/red glow, a CRT
running a fighting game, hand-labelled Game Boy cartridges, poster collage, flame
graffiti title) fused with the *Belleza '96* homepage furniture. Chrome is dark and
cinematic; the content panel is a **bright CRT-screen / cartridge-label surface**
(dark text on cream) so body copy stays WCAG AA.

- **Flame graffiti title** — `meta.siteTitle` in a heavy skewed display face with a
  yellow→orange→red gradient fill, dark stroke and hard drop shadow (the "ABHISHAR"
  wordmark). `meta.tagline` beneath in uppercase mono, plus a blinking **`▶ PUSH START`**.
- **Warm room glow**: fixed radial amber (top) + red (bottom) vignette over a faint
  diagonal poster-tile texture.
- **CRT content window**: scanline overlay, thick bezel, `C:\USERS\SHIVAM\<FILE>` titlebar.
- **`— STAGE SELECT —` era row** (`1986 · 1996 · 2006 · …`) — decorative, non-breaking.
- **Attract-mode marquee**: cycles `INSERT COIN`, `PLAYER 1 READY`, `HI-SCORE …`,
  `FINISH HIM`, `CONTINUE? 9 8 7…` between `<< —=(( o ))=— >>` separators.
- **Section labels = health/energy bars**: green→yellow→red fill, prefixed `▶ P1`.
- **Left nav menu = Game Boy cartridges**: chunky beveled items with a corner notch,
  active item lit amber; `★ MENU ★` header.
- **`[SYSTEM INFO]` + `HI-SCORE` panel**: user, role, status `ONLINE`, uptime `99.9%`,
  and the **visitor counter** rendered as `HI-SCORE` seeded from `meta.visitorCountSeed`
  (client-side `localStorage`, cosmetic).
- **Novelty badges** as pause-menu items: `UNDER CONSTRUCTION`, `DON'T CLICK HERE`
  (harmless easter egg), `YOU'VE GOT MAIL`.
- **Countdown block** to `meta.y2kCountdownTarget`, styled as a glowing arcade HUD.
- Twin **green / amber arcade-button CTA bars** above and below content
  ("◀ PREV" / "NEXT ▶").
- Footer: `© <year> <name> · <meta.footerCredit> · No frames. No problem.`
- Kept legible and not seizure-inducing: no full-page animation, `prefers-reduced-motion`
  disables the blink and marquee scroll.

## Docs elements to include (dark theme)

- Persistent left **sidebar TOC** (Rust-Book style) listing routes and, on long pages, in-page anchors.
- **Terminal window chrome** around content panels: a title bar showing a fake path (`C:\USERS\SHIVAM\PROJECTS.TXT`) and min/max/close dots.
- Monospace body type, one accent color (lime), muted foreground on near-black.
- `[ SECTION ]` bracket headings, `>` list markers, `EOF. WAITING FOR INPUT...` end-of-page line.
- Minimal motion; content-first; comfortable line length (~72ch).

## Theme system

- Default to **light/retro**. Toggle persists in `localStorage`; also respects `prefers-color-scheme` on first visit.
- Implement as CSS custom properties + a `data-theme` attribute on `<html>`. No layout shift on toggle beyond the intended skin change.
- Both themes must pass WCAG AA contrast for body text and controls.

## Tech stack

### Rust backend + React frontend (best as a portfolio artifact in its own right)

- **Backend:** Rust with **Axum + Tokio**. Endpoints:
  - `GET /api/profile` → serves `profile.json` (read from repo root / mounted path; hot-reload in dev via `notify`).
  - `GET /api/blog` → post index (`blog-index.json`); `GET /api/blog/:slug` → pre-rendered post JSON (`{ frontMatter, html, toc }`). These files are **generated at build time**, not per request: a Rust build step (`cargo run --bin bloggen`, run in `build.rs`/CI) scans `content/blog/*/index.md`, renders Markdown with `pulldown-cmark`, highlights code with `syntect`, copies each post's `images/` into the served static dir with content-hashed names, rewrites relative `./images/...` URLs, and emits the JSON. The Axum handlers just read and serve those static artifacts (in-memory `arc-swap` cache, reloaded on file change in `dev`). No DB, no runtime Markdown parsing in production.
  - `POST /api/contact` (optional) → validates and forwards a message (lettre / provider API), rate-limited (`tower_governor`).
  - Static file serving for the built frontend (`tower-http` `ServeDir`) so it ships as one binary + assets.
- **Frontend:** **React + TypeScript + Vite + Tailwind**, React Router for the routes above, TanStack Query for data fetching. Same two-theme system.
- **Shared types:** generate TS types from Rust structs with `ts-rs` so the `profile.json` schema stays in sync.
- Deploy: single container (multi-stage Dockerfile — build frontend, build Rust, copy `dist/` into the image); host on Fly.io / Render / a VPS.
- **Pros:** demonstrates Rust/Axum/Tokio skills that match the résumé; clean API boundary; one deployable binary. **Cons:** two build toolchains, more moving parts, SEO needs SSR or prerendering (add a prerender step or accept CSR for a personal site).

## Acceptance criteria

- `git clone` → install → dev server renders every route with the seeded `profile.json`, no hardcoded profile copy anywhere.
- Editing `profile.json` and reloading changes the site; no code edits needed to update résumé content.
- Adding a post folder under `content/blog/` (or running `npm run blog:new`) publishes a new post on rebuild; `draft: true` hides it in production.
- `npm run blog:add-image` / `blog:rm-image` manage a post's co-located images; relative `./images/...` references resolve correctly in the built site; `npm run blog:check` fails the build on a broken/missing image or bad front-matter.
- The blog is fully static — no runtime database or admin UI; `/api/blog*` responses are served from build-time-generated files.
- Theme toggle switches between the retro light skin and the minimal dark docs skin; choice persists; same content in both.
- Retro elements from the image 11 cover page are present in light mode (title banner, marquee separator, era tab row, twin CTA bars, boxed menu, visitor counter, countdown, novelty badges, footer credit).
- Dark mode shows sidebar TOC + terminal-window chrome + monospace/single-accent restraint.
- Responsive down to 360px; `prefers-reduced-motion` respected; body text passes WCAG AA in both themes.
- Lighthouse: Performance and Accessibility ≥ 90 on the home and blog routes.
