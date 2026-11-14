// ============================================================
//  CONTENT — edit only this section for content changes
// ============================================================

#let resume_data = (
  name: "Shivam Deolankar",

  // Two rows. Labels are the full visible links.
  contact: (
    (
      (label: "+91 8390566237", href: "tel:+918390566237"),
      (label: "shivam.deolankar@gmail.com", href: "mailto:shivam.deolankar@gmail.com"),
      (label: "D3athSkulll.vercel.app", href: "https://D3athSkulll.vercel.app"),
    ),
    (
      (label: "linkedin.com/in/shivamdeolankar2211", href: "https://linkedin.com/in/shivamdeolankar2211"),
      (label: "github.com/D3athSkulll", href: "https://github.com/D3athSkulll"),
      (label: "leetcode.com/u/D3athSkulll", href: "https://leetcode.com/u/D3athSkulll/"),
    ),
  ),

  // Short items, rendered joined by " • ". Supports *bold* markup.
  highlights: (
    "Prefinal year IT, ABV-IIITM Gwalior (2028)",
    "12+ Merges at RTEMS Project",
    "Rust / C",
    "Safety Critical Systems",
    "Backend & Cloud",
  ),
  summary: "A *systems programmer* with *3 years* of experience working on *low-level systems* in *C and Rust*, focusing *performance* and *memory safety*. An active *open-source contributor*, proficient in *backend*, *OS internals*, *embedded systems*, and *debugging*.",

    education: (
    (
      institution: "ABV - Indian Institute of Information Technology and Management, Gwalior",
      from:        (8, 2023),
      to:          (4, 2028),
      degree:      "Integrated B.Tech. + M.Tech. in Information Technology",
      score:       "CGPA - 7.95/10 (6th Sem)",
    ),
    (
      institution: "Vidyadham Science Junior College, Aurangabad",
      from:        (6, 2021),
      to:          (6, 2023),
      degree:      "Maharashtra State Board High School Certificate (HSC Class 12th)",
      score:       "86%",
    ),
    (
      institution: "Podar International School (ICSE), Aurangabad",
      from:        (6, 2010),
      to:          (6, 2021),
      degree:      "Indian Certificate of Secondary Education (Class 10th)",
      score:       "98.2%",
    ),
  ),

  // `href` (optional) makes the title a link.
  // `links` are (url, label) pairs shown as underlined text after the title.
  experience: (
        (
      title: "AI Engineer Intern @ Sapienomics AI",
      href: "https://sapienomics.ai/",
      subtitle: "ML, Cloud & Inference Engineering for Governed Decision Intelligence in Life Sciences",
      from: (11, 2026),
      // no `to` → renders as "Present"
      location: "Remote",
      tech: ("LLM Inference", "AWS", "Docker", "Guardrails"),
      bullets: (
        "Engineered *cloud-deployed ML services* on *AWS* for a *governed AI platform*, keeping *client data inside their cloud*.",
        "Optimized *LLM inference* for *latency, throughput and cost* using *continuous batching*, *KV caching* and *quantization*.",
        "Built *deterministic guardrail gates* and *audit trails* around model outputs, making AI decisions *rule-checked* and *replayable*.",
      ),
    ),
    (
      title: "ML Research Intern @ ABV-IIITM Gwalior",
      // href: "https://...",
      subtitle: "Adaptive Wavelet Attention for Improving Energy Forecasting Models",
      from: (5, 2026),
      to: (8, 2026),
      location: "Remote",
      links: (
        ("https://github.com/D3athSkulll/SIMPLETM/tree/main", "Code"),
      ),
      tech: ("PyTorch", "Wavelets", "Transformers", "Time-Series"),
      bullets: (
        "Built an *Adaptive Band-Reweighing module* in *SimpleTM*, inspired by *FEDformer's selective frequency* domain approach.",
        "Improved forecasting *accuracy* on *SHEERM Household* and *ECL* data across *5+ horizons*, *23.5% higher R²*, *1.3% lower MSE*.",
      ),
    ),
  ),

  open_source: (
    (
      title: "Rust Foundation and LLVM",
      href: "https://rust-lang.org/",
      from: (10, 2026),
      location: "Remote",
      links: (
        ("https://github.com/rust-lang/rust/issues/164667", "Rust Issue"),
        ("https://github.com/llvm/llvm-project/issues/234781", "LLVM Issue"),
      ),
      tech: ("Compilers", "LLVM IR", "Codegen", "MIR", "Ninja"),
      bullets: (
        "Isolated a *Rust miscompilation*, ruling out MIR optimizations and narrowing the regression to LLVM's code generation pipeline.",
        "Identified *LLVM Stack Coloring* pass as the cause of unsafe stack-slot merging due to an invalid load in *SelectionDAG*.",
      ),
    ),
    (
      title: "RTEMS - Real Time Operating System",
      href: "https://www.rtems.org/",
      from: (1, 2026),
      location: "Remote",
      links: (
        ("https://github.com/RTEMS/rtems/commits/main/?author=D3athSkulll", "Commits"),
        (
          "https://gitlab.rtems.org/rtems/rtos/rtems/-/merge_requests/?sort=merged_at_desc&state=all&author_username=D3athSkulll&first_page_size=20",
          "Merges",
        ),
      ),
      tech: ("Embedded C", "GDB", "QEMU", "CMake", "Waf"),
      bullets: (
        "Contributed *12+ Merges* which include *Migrating FatFS codebase*, fixing *error.h macro conflicts* and *libdl overflow*.",
        "Implemented *fallback-safe MMU mapping* for *PCIe nodes* in *FDT*, mapping config and memory windows for a boot fault.",
        "Resolved *Stack Checker Reporter defect* by decoupling *SECTION FLAGS* from *OPTIMIZATION FLAGS*, fixing build errors.",
        "Standardized *APIC definitions* across *pc386* and *x86_64* BSPs via a *shared header*, removing *cross-BSP dependencies*.",
        "Resolved *POSIX B0 baud rate* flaw via audit of UART drivers across *4 architectures and 13+ BSPs*, for a *centralised* fix.",
      ),
    ),
  ),

  // Order in which project-type sections appear.
  // Any `type` not listed here is appended after these, in first-appearance order.
  project_order: ("Rust", "Backend & Cloud"),

  // Each project's `type` decides which "<type> Projects" section it lands in.
  // Project titles are plain text (not linked).
  projects: (
    (
      type: "Rust",
      title:    "PikaNote",
      subtitle: "A light weight terminal text editor in Rust featuring efficient rendering and low-level control.",
      from:     (2, 2025),
      to:       (8, 2025),
      links:    (("https://github.com/D3athSkulll/PikaNote", "GitHub"),),
      tech:     ("Rust", "Clippy", "Crossterm", "Unicode-width", "Docker"),
      bullets: (
        "Implemented *insert, delete, line split/merge and save-as* with an *unsaved-changes guard*, achieving safe file I/O.",
        "Built *real-time terminal input* using `Crossterm` *key events* and *Unicode graphemes* to achieve correct emoji/CJK editing.",
        "Implemented *incremental rendering* via queued writes and cursor hiding to minimize redraws, achieving flicker-free updates.",
        "Developed *bidirectional wrap-around search* with *live highlighting* via `AnnotatedString`, achieving quick navigation.",
        "Designed *modular terminal UI* with *view*, *status*, *command bars* and *System/Move/Edit* dispatch, easing extension.",
      ),
    ),
    (
      type: "Backend & Cloud",
      title:    "SMTP Server",
      subtitle: "Self-hosted, receive-only mail server that captures and logs inbound email on a custom domain.",
      links:    (("https://github.com/D3athSkulll/SMTP-Server", "GitHub"),),
      tech:     ("Node.js", "Go", "SMTP", "AWS EC2", "Cloudflare DNS"),
      bullets: (
        "Implemented a custom *AWS EC2 instance* to securely handle incoming emails using self-managed infrastructure.",
        "Integrated a custom domain via *Cloudflare DNS* with isolated MX records, masking personal email and enforcing receive-only.",
        "Used *event-driven SMTP hooks* on port 25 to stream and log inbound mail, achieving end-to-end visibility of mail flow.",
      ),
    ),
    (
      type: "Rust",
      title:    "FerrisLedger",
      subtitle: "Rust-based fintech backend with RBAC, secure APIs and real-time analytics.",
      from:     (3, 2026),
      to:       (3, 2026),
      links:    (
        ("https://github.com/D3athSkulll/FerrisLedger", "GitHub"),
        ("https://fintech-backend-n1n0.onrender.com/", "Live"),
      ),
      tech:     ("Axum", "Tokio", "PostgreSQL", "NeoDB", "Vercel"),
      bullets: (
        "Built `Rust` *fintech backend* using `Axum`, `Tokio`, `PostgreSQL` with *JWT auth*, *RBAC (3 roles)*, `Argon2` hashing for secure access.",
        "Developed *transaction APIs* with *filtering, pagination, ownership* via `SQLx` QueryBuilder to secure CRUD over *100+ records*.",
        "Implemented a *financial analytics dashboard* computing *5+ metrics* via aggregation, achieving real-time data-driven insights.",
      ),
    ),
    (
      type: "Backend & Cloud",
      title:    "KoinX Reconciliation Engine",
      subtitle: "Transaction reconciliation backend that validates, normalizes and matches user and exchange CSV data.",
      from:     (5, 2026),
      to:       (5, 2026),
      links:    (("https://github.com/D3athSkulll/Koinx", "GitHub"),
                ("https://koinx-m5v4.onrender.com/", "Live")),
      tech:     ("Node.js", "Express", "MongoDB", "Mongoose", "Render"),
      bullets: (
        "Built a *CSV ingestion pipeline* with *6 validation checks*, *asset/type normalization* and duplicate flagging for full traceability.",
        "Developed a *tolerance-based matching engine* (timestamp, quantity) to classify transactions into *4 categories* accurately.",
        "Exposed *report APIs* (full, summary, unmatched) with *CSV export* over persisted runs, achieving auditable results.",
      ),
    ),
    (
      type: "Embedded Systems",
      title:    "Hardware Projects",
      subtitle: "Real-time hardware systems with sensors and embedded ML.",
      from:     (1, 2024),
      to:       (4, 2026),
      links:    (
        ("https://github.com/D3athSkulll/avionics_telemetry_tool","Avionics Tool Github"),
        ("https://github.com/D3athSkulll/AI-Based-Rotten-Fruit-Segregator","Fruit Segregator Github"),
        ("https://drive.google.com/file/d/1zE6Aj0hGs_-uRSeE9Eacwmo7N6ySRAQj/view?usp=sharing","Glouse Image")
      ),
      bullets: (
        "Built an *avionics telemetry tool* processing *100+ records* and *15+ anomalies* with validation, filtering, and reporting.",
        "Developed a gesture-controlled *Glove Mouse* using `ESP32` and `MPU6050`, mapping gyroscope data to real-time cursor control.",
        "Built an *Arduino-based rotten fruit segregation system* using *ML classification* with *servo-driven actuation*.",
      ),
    ),
      (
      type: "Database & Backend",
      title:    "IIITM Alumni Directory",
      subtitle: "Public alumni directory backed by structured MongoDB data with optimized search and filtering.",
      from:     (1, 2026),
      to:       (8, 2026),
      links:    (("https://alumni.iiitm.ac.in/directory", "Live"),),
      tech:     ("MongoDB", "Regex Search", "Data Normalization"),
      bullets: (
        "Restructured raw data of *4500+ alumni records* in *MongoDB* into *consistent, searchable schemas* for the public directory.",
        "Built *regex-based search and filtering* across alumni fields, handling *aliases*, *inconsistent entries* and *missing data*.",
        "Optimized *directory queries* via *structured fields* and *targeted filters*, enabling fast discovery across *batches and companies*.",
      ),
    ),
    (
      type: "Backend & Cloud",
      title:    "YatraMitra",
      subtitle: "Full-stack travel booking platform for train, flight and bus ticket reservations.",
      from:     (8, 2024),
      to:       (11, 2024),
      links:    (
        ("https://github.com/D3athSkulll/yatramitra-frontend", "Frontend"),
        ("https://github.com/D3athSkulll/yatramitra-backend", "Backend"),
        ("https://yatramitra.vercel.app/views/homepage.html", "Live"),
      ),
      tech:     ("JavaScript", "Stripe", "REST APIs", "Vercel"),
      bullets: (
        "Collaborated on a *full-stack booking platform* for *train, flight and bus* reservations with *authentication* and responsive flows.",
        "Implemented *Stripe payment processing* and *checkout flows*, connecting the *frontend* to *server-side booking APIs*.",
        "Structured the backend into *routes, models, middleware* and *DB connection layers*, keeping the application *modular*.",
      ),
    ),
    (
      type: "Cryptography",
      title:    "Secure UWCN Authentication Protocol",
      subtitle: "Lightweight mutual authentication protocol for secure underwater wireless communication networks.",
      from:     (2, 2026),
      to:       (4, 2026),
      links:    (("https://github.com/D3athSkulll/Auth-Protocol-for-Secure-UWCN", "GitHub"),),
      tech:     ("Python", "ECDH", "AES-GCM", "Scyther"),
      bullets: (
        "Simulated a *multi-hop authentication protocol* for *sensors, submarines, buoys, satellites* and a *base station* in *Python*.",
        "Combined *ECDH key exchange*, *AES-GCM* and *nonce-timestamp validation* to defend against *replay* and *impersonation* attacks.",
        "Formally verified with *Scyther* under a *Dolev-Yao attacker* model for *secrecy*, *aliveness* and *agreement* properties.",
      ),
    ),
    (
      type: "Research & ML",
      title:    "LunarTriGSM",
      subtitle: "Triangle-based lunar crater matching for precision terrain-relative navigation.",
      from:     (2, 2026),
      to:       (4, 2026),
      links:    (("https://github.com/D3athSkulll/lunar_crater_detection/tree/main", "GitHub"),),
      tech:     ("YOLOv8", "RANSAC", "Monte Carlo", "Python"),
      bullets: (
        "Upgraded crater detection to *YOLOv8s* on *LRO NAC* data, achieving *0.617 precision* and *0.416 mAP\\@50* across *20 lunar images*.",
        "Extended triangle descriptors to *5D* and *25D* with *RANSAC* verification, cutting navigation error *31.2% in X* and *33.1% in Y*.",
        "Achieved *100% navigation success* at *0.157s* matching time, holding *99.5%* under *10% detection noise* via *Monte Carlo*.",
      ),
    ),
    (
      type: "Research & ML",
      title:    "ChurnAware",
      subtitle: "Sentiment-aware customer churn prediction and retention optimization platform.",
      from:     (9, 2025),
      to:       (11, 2025),
      links:    (("https://github.com/D3athSkulll/ChurnAware", "GitHub"),),
      tech:     ("Random Forest", "Double DQN", "FastAPI", "Next.js"),
      bullets: (
        "Built a *churn pipeline* using *RFM features* and *review sentiment*, with *GMM segmentation* into *4 customer groups*.",
        "Trained a *Random Forest* on *90-day churn* and a *Double DQN* retention engine choosing among *4 interventions*.",
        "Served via *FastAPI* and *SQLite* with dashboards, achieving *0.806 F1* on *1,574 unseen customers*.",
      ),
    ),
    
  ),

  achievements: (
    "Solved 200+ DSA and SQL problems on Leetcode and other platforms.",
    "*Overall Winner* of *Webkriti 2024*, organised by *AASF* for developing Yatramitra, a travel ticket booking platform.",
    "Secured *3rd* position in Product Management Track of *AASF Winter Projects, 2025*.",
    "Achieved *4th rank* in *WJPS-4 DSA Contest*, organised by *AASF*, among all the participants at *ABV-IIITM Gwalior*.",
    "Scored *AIR 16989 (98.54 Percentile)* in *JEE Mains 2023*, ranking among *lakhs* of candidates appearing nationwide.",
    "Secured *AIR 20785* in *JEE Advanced 2023*, qualifying among the top candidates of the national engineering entrance exam.",
    "Secured *AIR 884* in *IISER IAT 2023*, the national aptitude test for admission to the *IISER* institutes across India.",
  ),

  positions: (
    (
      text: "*Core Team Lead*, *Alumni Meet 2026*, *ABV-IIITM Gwalior* - Launched a live *Alumni Directory* of *4500+ alumni*.",
      href: "https://alumni.iiitm.ac.in/directory",
      icon: "globe",
      label: "Live",
    ),
    (text: "*Technical and Design Lead,* IEEE Student Branch, *ABV-IIITM Gwalior*."),
    (text: "*Executive*, Student Activity Council 2025 (Technical), at *ABV-IIITM Gwalior*."),
    (text: "Facilitated a *2*-day HIQ workshop on *Web Basics - JS* for *50+* students at *ABV-IIITM Gwalior*, organised by *AASF*."),
    (
      text: "Designed official cover page for *Abhishar V15*, the annual magazine of *ABV-IIITM Gwalior* published by *AASF*.",
      href: "https://drive.google.com/file/d/1fdigo_dEYjXwMMUR1u10AvtMQg6y0C1u/view",
      icon: "globe",
      label: "Link",
    ),
  ),

  skills: (
    (category: "Systems Programming", items: ("Rust","C", "Golang", "JavaScript", "C++",  "Python")),
    (category: "Backend Frameworks",  items: ("Axum", "Tokio", "Reqwest", "Node.js", "Express.js", "Redis", "Kafka", "REST APIs", "Websockets")),
    (category: "Databases and ORM",   items: ("SQL", "PostgreSQL", "MongoDB", "Diesel", "Sqlx", "SurrealDB")),
    (category: "DevOps",              items: ("Docker", "CI/CD", "Amazon Web Services", "AWS EC2", "S3")),
    (category: "AI and ML",           items: ("MCP", "Embeddings", "Transformers", "Predictive Load Forecasting", "Inference Engineering")),
    (category: "Development Tools",   items: ("Git", "GitHub", "Gitlab", "Claude Code", "Arch Linux", "Postman", "HTML", "TailwindCSS", "React")),
    (category: "Other Tools",         items: ("ABI", "RTOS", "GDB", "QEMU", "CMake", "LLVM", "Ninja","NeoVim", "Canva", "Photoshop", "Figma", "Notion")),
    
  ),

  
)

// ============================================================
//  RENDERING LOGIC — do not edit for content changes
// ============================================================

// Still needed: pos_item uses an icon for its links.
#import "@preview/fontawesome:0.6.0": *

#set page(margin: (x: 1cm, y: 0.3cm))
#set text(size: 9.6pt)

#let accent = color.hsl(240deg, 100%, 25%)
#let grey = rgb("#444")
#let big = 10.5pt

#let date(month, year) = datetime(day: 1, month: month, year: year)
#let format(from, to: none) = {
  from.display("[month repr:short] [year]")
  if to == none {
    " – Present"
  } else if to != from {
    " – "
    to.display("[month repr:short] [year]")
  }
}

#let section(content, title: "Title", size: big, color: grey) = {
  v(-5pt)
  text(size: size, fill: color, tracking: 1pt, smallcaps(title))
  linebreak()
  box(height: 1pt, width: 1fr, move(dy: -2pt, line(length: 100%)))
  v(-6pt)
  pad(content, left: 8pt, right: 8pt)
}

#let skillsection(title, skills) = (
  text(title, size: 10pt),
  text(skills.join(", "), weight: "bold", size: 10pt, fill: accent),
)

// Title, linked only when an href is given
#let titletext(title, href) = {
  let t = text(title, size: big, fill: accent, weight: "bold")
  if href != none { link(href, t) } else { t }
}

// "| Commit | Merges" style underlined text links
#let linklabels(links) = {
  if links != none {
    for (url, label) in links {
      text("|")
      h(3pt)
      link(url, underline(offset: 2pt,text(fill: accent,weight:"bold", label)))
      h(3pt)
    }
  }
}

#let techtext(tech) = {
  if tech != none {
    text("|")
    h(4pt)
    let tech-text = if type(tech) == array { tech.join(", ") } else { tech }
    text(tech-text, style: "italic", weight: "regular")
  }
}

#let exp_subsection(title, subtitle, from, to: none, href: none, location: none, links: none, tech: none) = {
  v(0pt)
  titletext(title, href)
  h(3pt)
  linklabels(links)
  techtext(tech)
  h(1fr)
  text(format(from, to: to))
  linebreak()
  text(subtitle, weight: "bold")
}

#let open_src_subsection(title, from, to: none, href: none, location: none, links: none, tech: none) = {
  v(0pt)
  titletext(title, href)
  h(3pt)
  linklabels(links)
  techtext(tech)
  h(1fr)
  text(format(from, to: to))
  linebreak()
}

// `kind` is the project type ("Rust", "Backend & Cloud", ...).
// It is accepted for grouping/metadata; the section heading already shows it.
#let proj_subsection(title, subtitle, kind: none, links: none, tech: none) = {
  v(0pt)
  titletext(title, none)
  h(3pt)
  linklabels(links)
  techtext(tech)
  h(1fr)
  linebreak()
  text(subtitle, weight: "bold")
}

#let aboutsection(rows) = {
  rows.map(row => row.join("  |  ")).join(linebreak())
}

#let titlesection(title, about) = {
  block(width: 100%)[
    #set align(center)
    #v(1pt)
    #text(title, weight: "bold", fill: accent, size: 20pt, tracking: 2pt) \
    #about
  ]
}

#let pos_item(item) = {
  eval(item.text, mode: "markup")
  if item.at("href", default: none) != none {
    h(3pt)
    link(item.href, underline(offset: 2pt,text(fill: accent, weight: "bold", item.at("label", default: "Link"))))
  }
}

// ============================================================
//  RENDER — picks content from the data object below and
//  passes it to the rendering functions above.
//  Only edit this if you are changing layout/structure.
// ============================================================

#let render(data) = {

  // — Header —
  titlesection(data.name, aboutsection(
    data.contact.map(row => row.map(c =>
      link(c.href, text(fill: accent, c.label))
    ))
  ))

  // — Highlights —
  section(title: "Highlights")[
    #data.highlights.map(item => eval(item, mode: "markup")).join([ #h(1.5pt)•#h(1.5pt) ])
  ]

  // — Summary —
  section(title: "Summary")[
    #eval(data.summary, mode: "markup")
  ]

  // — Education —
  let edu = if type(data.education) == dictionary { (data.education,) } else { data.education }

  section(title: "Education")[
    #for (i, e) in edu.enumerate() {
      text(weight: "bold")[#e.institution]
      h(1fr)
      format(date(..e.from), to: date(..e.to))
      linebreak()
      e.degree
      h(1fr)
      text(style: "italic", weight: "bold", e.at("score", default: e.at("gpa", default: "")))
      if i < edu.len() - 1 { v(-3pt) }
    }
  ]

  // — Experience —
  section(title: "Work Experience")[
    #for entry in data.experience {
      exp_subsection(
        entry.title,
        entry.subtitle,
        date(..entry.from),
        to: if "to" in entry { date(..entry.to) } else { none },
        href: entry.at("href", default: none),
        location: entry.at("location", default: none),
        links: entry.at("links", default: none),
        tech: entry.at("tech", default: none),
      )
      for bullet in entry.bullets [
        - #eval(bullet, mode: "markup")
      ]
      v(-4pt)
    }
    #v(3pt)
  ]

  // — Open Source —
  section(title: "Open Source Contributions")[
    #for entry in data.open_source {
      open_src_subsection(
        entry.title,
        date(..entry.from),
        to: if "to" in entry { date(..entry.to) } else { none },
        href: entry.at("href", default: none),
        location: entry.at("location", default: none),
        links: entry.at("links", default: none),
        tech: entry.at("tech", default: none),
      )
      for bullet in entry.bullets [
        - #eval(bullet, mode: "markup")
      ]
      v(-4pt)
    }
    #v(3pt)
  ]

  // — Projects (one section per project type) —
  let present = data.projects.map(p => p.at("type", default: "Other")).dedup()
  let order = data.at("project_order", default: ())
  let kinds = order.filter(k => k in present) + present.filter(k => k not in order)

  for kind in kinds {
    let group = data.projects.filter(p => p.at("type", default: "Other") == kind)

    section(title: kind + " Projects")[
      #for proj in group {
        proj_subsection(
          proj.title,
          proj.subtitle,
          kind: proj.at("type", default: none),
          links: proj.at("links", default: none),
          tech: proj.at("tech", default: none),
        )
        for bullet in proj.bullets [
          - #eval(bullet, mode: "markup")
        ]
        v(-4pt)
      }
      #v(3pt)
    ]
  }

  // — Achievements —
  section(title: "Achievements")[
    #for item in data.achievements [
      - #eval(item, mode: "markup")
    ]
  ]

  // — Positions of Responsibility —
  section(title: "Positions of Responsibility")[
    #for item in data.positions [
      - #pos_item(item)
    ]
  ]

  // — Technical Skills —
  section(title: "Technical Skills")[
    #v(-4pt)
    #table(
      row-gutter: (-2.5pt),
      columns: (auto, auto),
      align: (horizon, left),
      stroke: (x: none, y: none),
      ..data.skills.map(s => skillsection(s.category, s.items)).flatten()
    )
  ]
}

// ============================================================
//  ENTRY POINT — wire data into the renderer
// ============================================================

#render(resume_data)