
// ============================================================
//  CONTENT — edit only this section for content changes
// ============================================================

#let resume_data = (
  name: "Shivam Deolankar",

  contact: (
    (label: "+91 8390566237", href: "tel:+918390566237",   icon: "phone"),
    (label: "shivam.deolankar@gmail.com", href: "mailto:shivam.deolankar@gmail.com", icon: "envelope"),
    (label: "D3athSkulll", href: "https://github.com/D3athSkulll",       icon: "github"),
    (label: "shivamdeolankar2211", href: "https://linkedin.com/in/shivamdeolankar2211", icon: "linkedin"),
    (label: "Portfolio", href:"https://D3athSkulll.vercel.app", icon: "globe"),
    (label: "Leetcode", href:"https://leetcode.com/u/D3athSkulll/", icon: "code"),
  ),

  summary: "A *systems programmer* with *3 years* of experience working on *low-level systems* in *C and Rust*, focusing *performance* and *memory safety*. An active *open-source contributor*, proficient in *backend*, *OS internals*, *embedded systems*, and *debugging*.",

  education: (
    institution: "ABV - Indian Institute of Information Technology and Management, Gwalior",
    from:        (8, 2023),
    to:          (4, 2028),
    degree:      "Integrated B.Tech. + M.Tech. in Information Technology",
    gpa:         "CGPA - 7.95/10 (6th Sem)",
  ),

  experience: (
        (
      title: "ML Research Intern @ ABV-IIITM Gwalior",
      subtitle: "Adaptive Wavelet Attention for Improving Energy Forecasting Models",
      from: (5, 2026),
      to: (8, 2026),
      location: "Remote",
      links: (
        ("https://github.com/D3athSkulll/SIMPLETM/tree/main", "github"),
      ),
      tech: ("PyTorch", "Wavelets", "Transformers", "Time-Series"),
      bullets: (
        "Built an *Adaptive Band-Reweighing module* in *SimpleTM*, inspired by *FEDformer's selective frequency* domain approach.",
        "Improved forecasting *accuracy* on *SHEERM Household Energy* data across *5+ horizons*, *23.5% higher R²*, *1.3% lower MSE*.",
      ),
    ),
  ),

  open_source: (
    (
      title: "Rust Foundation and LLVM",
      from: (10, 2026),
      location: "Remote",
      links: (
        ("https://rust-lang.org/", "globe"),
        ("https://github.com/rust-lang/rust/issues/164667", "github"),
        ("https://github.com/llvm/llvm-project/issues/234781", "github"),
        
        
      ),
      tech:("Rust Compiler","LLVM IR","Codegen","MIR", "CMake", "Ninja"),
      bullets: (
                "Isolated a *Rust miscompilation* due to *LLVM's stack-coloring pass* by *bisecting passes* and ruling out *MIR optimizations*.",
      ),
    ),
    (
      title: "RTEMS - Real Time Operating System",
      from: (1, 2026),
      location: "Remote",
      links: (
        ("https://www.rtems.org/", "globe"),
        ("https://github.com/RTEMS/rtems/commits/main/?author=D3athSkulll", "github"),
        (
          "https://gitlab.rtems.org/rtems/rtos/rtems/-/merge_requests/?sort=merged_at_desc&state=all&author_username=D3athSkulll&first_page_size=20",
          "gitlab",
        ),
      ),
      tech:("Embedded C","GDB","QEMU","CMake", "Waf"),
      bullets: (
        "Contributed *10+ Merges* which include *Migrating FatFS codebase*, fixing *error.h macro conflicts* and *libdl overflow*.",
        "Implemented *fallback-safe MMU mapping* for *PCIe nodes* in *FDT*, mapping config and memory windows for a boot fault.",
        "Resolved *Stack Checker Reporter defect* by decoupling *SECTION FLAGS* from *OPTIMIZATION FLAGS*, fixing build errors.",
        "Standardized *APIC definitions* across *pc386* and *x86_64* BSPs via a *shared header*, removing *cross-BSP dependencies*.",
        "Detected *POSIX B0 baud rate* divide-by-zero flaw via audit of UART drivers across *4 architectures*, driving fixes for *13+ BSPs*.",
      ),
    ),
  ),

  projects: (
    (
      title:    "PikaNote",
      subtitle: "A light weight terminal text editor in Rust featuring efficient rendering and low-level control.",
      from:     (2, 2025),
      to:       (8, 2025),
      links:    (("https://github.com/D3athSkulll/PikaNote", "github"),),
      tech:("Rust","Clippy","Crossterm","Unicode-width","Docker"),
      bullets: (
        "Implemented *insert, delete, line split/merge and save-as* with an *unsaved-changes guard*, achieving safe file I/O.",
        "Built *real-time terminal input* using `Crossterm` *key events* and *Unicode graphemes* to achieve correct emoji/CJK editing.",
        "Implemented *incremental rendering* via queued writes and cursor hiding to minimize redraws, achieving flicker-free updates.",
        "Developed *bidirectional wrap-around search* with *live highlighting* via `AnnotatedString`, achieving quick navigation.",
        "Designed *modular terminal UI* with *view*, *status*, *command bars* and *System/Move/Edit* dispatch, easing extension.",
      ),
    ),
    (
  title:    "SMTP Server",
  subtitle: "Self-hosted, receive-only mail server that captures and logs inbound email on a custom domain.",
  links:    (("https://github.com/D3athSkulll/SMTP-Server", "github"),),
  tech:     ("Node.js", "Go", "SMTP", "AWS EC2", "Cloudflare DNS"),
  bullets: (
    "Implemented a custom *AWS EC2 instance* to securely handle incoming emails using self-managed infrastructure.",
    "Integrated a custom domain via *Cloudflare DNS* with isolated MX records, masking personal email and enforcing receive-only.",
    "Used *event-driven SMTP hooks* on port 25 to stream and log inbound mail, achieving end-to-end visibility of mail flow.",
  ),
),
    // (
    //   title:    "FerrisLedger",
    //   subtitle: "Rust-based fintech backend with RBAC, secure APIs and real-time analytics.",
    //   from:     (3, 2026),
    //   to:       (3, 2026),
    //   links:    (("https://github.com/D3athSkulll/FerrisLedger", "github"),
    //             ("https://fintech-backend-n1n0.onrender.com/", "globe")),
    //   tech:("Axum","Tokio","PostgreSQL","NeoDB","Vercel"),
    //   bullets: (
    //     "Built `Rust` *fintech backend* using `Axum`, `Tokio`, `PostgreSQL` with *JWT auth*, *RBAC (3 roles)*, `Argon2` hashing for secure access.",
    //     "Developed *transaction APIs* with *filtering, pagination, ownership* via `SQLx` QueryBuilder to secure CRUD over *100+ records*.",
    //     "Implemented a *financial analytics dashboard* computing *5+ metrics* via aggregation, achieving real-time data-driven insights.",
    //   ),
    // ),
    (
      title:    "KoinX Reconciliation Engine",
      subtitle: "Transaction reconciliation backend that validates, normalizes and matches user and exchange CSV data.",
      from:     (5, 2026),
      to:       (5, 2026),
      links:    (("https://github.com/D3athSkulll/Koinx", "github"),
                ("https://koinx-m5v4.onrender.com/", "globe")),
      tech:     ("Node.js", "Express", "MongoDB", "Mongoose", "Render"),
      bullets: (
        "Built a *CSV ingestion pipeline* with *6 validation checks*, *asset/type normalization* and duplicate flagging for full traceability.",
        "Developed a *tolerance-based matching engine* (timestamp, quantity) to classify transactions into *4 categories* accurately.",
        "Exposed *report APIs* (full, summary, unmatched) with *CSV export* over persisted runs, achieving auditable results.",
      ),
    ),
  ),

  achievements: (
    "*Winner of Webkriti 2024* | *3rd rank in Product Management Track,   Winter Projects 2025* | *4th rank in WJPS-3* by *AASF*.",
    "*AIR 16989 (98.54 Percentile) in JEE Mains 2023* | *AIR 20785 in JEE Advance 2023* | *AIR 884 in IISER IAT 2023 .*"
  ),

  positions: (
    (text: "*Core Team Lead*, *Alumni Meet 2026*, *ABV-IIITM Gwalior* - Launched a live *Alumni Directory* of *4500+ alumni*.",href: "https://alumni.iiitm.ac.in/directory",
      icon: "globe",),
    (text: "*Technical and Design Lead,* IEEE Student Branch, *ABV-IIITM Gwalior*."),
    (text: "*Executive*, Student Activity Council 2025 (Technical), at *ABV-IIITM Gwalior*."),
    (text: "Facilitated a *2*-day HIQ workshop on *Web Basics - JS* for *50+* students at *ABV-IIITM Gwalior*, organised by *AASF*."),
    (
      text: "Designed official cover page for *Abhishar V15*, the annual magazine of *ABV-IIITM Gwalior* published by *AASF*.",
      href: "https://drive.google.com/file/d/1fdigo_dEYjXwMMUR1u10AvtMQg6y0C1u/view",
      icon: "globe",
    ),
  ),

  skills: (
    (category: "Systems Programming", items: ("Rust", "Golang","JavaScript", "C++", "C", "Python")),
    (category: "Backend Frameworks",  items: ("Axum", "Tokio", "Reqwest", "Node.js", "Express.js", "Redis", "Kafka", "REST APIs", "Websockets")),
    (category: "Databases and ORM",   items: ("SQL", "PostgreSQL", "MongoDB", "Diesel", "Sqlx", "SurrealDB")),
    (category: "DevOps",  items: ("Docker", "CI/CD", "Amazon Web Services", "AWS EC2", "S3")),
    (category: "AI and ML", items:("MCP","Embeddings","Transformers", "Predictive Load Forecasting", "Inference Engineering")),
    (category: "Development Tools",   items: ("Git", "GitHub", "Gitlab","Claude Code", "Arch Linux", "Postman", "HTML", "TailwindCSS", "React")),
    (category: "Other Tools",         items: ("ABI","RTOS", "GDB", "QEMU", "CMake","LLVM","Ninja", "Canva", "Photoshop", "Figma", "Notion")),
  ),
)

// ============================================================
//  RENDERING LOGIC — do not edit for content changes
// ============================================================

#import "@preview/fontawesome:0.6.0": *

#set page(margin: (x:1cm, y:0.3cm))
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
  box(height: 1pt, width: 1fr, line(length: 100%))
  v(-5pt)
  pad(content, left: 8pt, right: 8pt)
}

#let skillsection(title, skills) = (
  text(title, size: 10pt),
  text(skills.join(", "), weight: "bold", size: 10pt, fill: accent)
)

#let iconpill(content, icon) = {
  box[
    #set text(fill: accent)
    #icon
  ]
  h(4pt)
  content
}

#let exp_subsection(title, subtitle, from, to: none, href: none, location: none, links: none, tech: none) = {
  v(0pt)
  text(title, size: big, fill: accent, weight: "bold")
  h(6pt)
  if links != none {
    for (url, icon) in links {
      text("|")
      h(5pt)
      link(url, iconpill("", fa-icon(icon)))
      h(2pt)
    }
  }
  if tech != none {
    text("|")
    h(4pt)
    let tech-text = if type(tech) == array { tech.join(", ") } else { tech }
    text(tech-text, style: "italic", weight: "regular")
  }
  h(1fr)
  text(format(from, to: to))
  linebreak()
  text(subtitle, weight: "bold")
}

#let open_src_subsection(title, from, to: none, href: none, location: none, links: none, tech: none) = {
  v(0pt)
  text(title, size: big, fill: accent, weight: "bold")
  h(6pt)
  if links != none {
    for (url, icon) in links {
      text("|")
      h(5pt)
      link(url, iconpill("", fa-icon(icon)))
      h(2pt)
    }
  }
  if tech != none {
    text("|")
    h(4pt)
    let tech-text = if type(tech) == array { tech.join(", ") } else { tech }
    text(tech-text, style: "italic", weight: "regular")
  }
  h(1fr)
  text(format(from, to: to))
  linebreak()
}

#let proj_subsection(title, subtitle, links: none, tech: none) = {
  v(0pt)
  text(title, size: big, fill: accent, weight: "bold")
  h(6pt)
  if links != none {
    for (url, icon) in links {
      text("|")
      h(5pt)
      link(url, iconpill("", fa-icon(icon)))
      h(2pt)
    }
  }
  if tech != none {
    text("|")
    h(4pt)
    let tech-text = if type(tech) == array { tech.join(", ") } else { tech }
    text(tech-text, style: "italic", weight: "regular")
  }
  h(1fr)
  linebreak()
  text(subtitle, weight: "bold")
}

#let aboutsection(contents) = {
  contents.join("  |  ")
}

#let aboutpill(content, icon) = {
  box[
    #set text(fill: accent)
    #icon
  ]
  h(4pt)
  content
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
    h(4pt)
    box(
      width: 1em,
      height: 0pt,
      place(
        top + left,
        dy: -1.010em,
        link(item.href, text(fill: accent, fa-icon(item.at("icon", default: "globe")))),
      ),
    )
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
    data.contact.map(c =>
      aboutpill(
        if c.at("href", default: none) != none {
          link(c.href, c.label)
        } else {
          c.label
        },
        fa-icon(c.icon, solid: c.at("solid", default: false)),
      )
    )
  ))

  // — Summary —
  section(title: "Summary")[
    #eval(data.summary, mode: "markup")
  ]

  // — Education —
  section(title: "Education")[
    #text(weight: "bold")[#data.education.institution] #h(1fr) #format(date(..data.education.from), to: date(..data.education.to)) \
    #data.education.degree #h(1fr) _*#data.education.gpa*_
  ]

  // — Experience —
  section(title: "Experience")[
    #for entry in data.experience {
      exp_subsection(
        entry.title,
        entry.subtitle,
        date(..entry.from),
        to: if "to" in entry { date(..entry.to) } else { none },
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
  section(title: "Open Source")[
    #for entry in data.open_source {
      open_src_subsection(
        entry.title,
        date(..entry.from),
        to: if "to" in entry { date(..entry.to) } else { none },
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

  // — Projects —
  section(title: "Projects")[
    #for proj in data.projects {
      proj_subsection(
        proj.title,
        proj.subtitle,
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


