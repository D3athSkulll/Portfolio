
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
    (label: "D3athSkulll", href:"https://leetcode.com/u/D3athSkulll/", icon: "code"),
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
      subtitle: "Adaptive Wavelet Attention for improving Energy Forecasting Models",
      from: (5, 2026),
      to: (8, 2026),
      location: "Remote",
      links: (
        ("https://github.com/D3athSkulll/SIMPLETM/tree/main", "github"),
        ("https://github.com/D3athSkulll/SIMPLETM/blob/main/BTP%20Combined%20Report.pdf", "google-drive")
      ),
      bullets: (
        "Developed a *Band Attention module for SimpleTM*, inspired by *FEDformer's frequency domain approach*.",
"Enabled *adaptive frequency weighting* through *wavelet bands* to capture multi-scale patterns in electricity load dataset.",
"Improved *forecasting accuracy* across *5+ horizons*, achieving *23.5% higher R²*, *17.4% higher EVS*, and *1.3% lower MSE*."
      ),
    ),
    (
      title: "RTEMS - Real Time Operating System",
      subtitle: "Open Source Contributor",
      from: (1, 2026),
      to: (6,2026),
      location: "Remote",
      links: (
        ("https://www.rtems.org/", "globe"),
        ("https://github.com/RTEMS/rtems/commits/main/?author=D3athSkulll", "github"),
        (
          "https://gitlab.rtems.org/rtems/rtos/rtems/-/merge_requests/?sort=merged_at_desc&state=all&author_username=D3athSkulll&first_page_size=20",
          "gitlab",
        ),
      ),
      bullets: (
        "Resolved a *Stack Checker Reporter defect* by restructuring flag handling and decoupling *SECTION FLAGS* from *COMPILER FLAGS*, eliminating flag conflicts and ensuring consistent configuration, improving overall *build reliability*.",
        "Resolved *POSIX B0 baud rate edge case* issue across UART drivers for *13 BSPs and drivers*, implementing runtime safeguard mechanisms to prevent *divide-by-zero*, and standardizing *termios handling* for robust serial communication.",
        "Implemented *fallback-safe MMU mapping* for missing *PCIe nodes* in *device trees*, ensuring reliable handling of incomplete hardware descriptions and enabling stable *boot* with correct memory initialization across BSP environments.",
        "*Migrated FatFS codebase*, fixed *error.h macro conflicts* and *libdl overflow*, improving build stability and safety.",
      ),
    ),
  ),

  projects: (
    (
  title:    "SMTP Server",
  subtitle: "Custom SMTP Server using Golang (smtpd), Node.js (smtp-server), AWS EC2, Cloudflare DNS",
  from:     (8, 2026),
  to:       (8, 2026),
  links:    (("https://github.com/D3athSkulll/SMTP-Server", "github"),),
  bullets: (
    "Implemented a custom *AWS EC2 instance* to securely handle incoming emails using a self-managed infrastructure.",
    "Integrated the instance with a custom domain via *Cloudflare DNS* by setting up isolated MX records, effectively masking the personal email address and enforcing strict receive-only protocols for enhanced security and privacy.",
  ),
),
    (
      title:    "FerrisLedger",
      subtitle: "Rust-based fintech backend with RBAC, secure APIs and real-time analytics.",
      from:     (3, 2026),
      to:       (3, 2026),
      links:    (("https://github.com/D3athSkulll/FerrisLedger", "github"),
                ("https://fintech-backend-n1n0.onrender.com/", "globe")),
      bullets: (
        "`Rust` based *fintech backend* using `Axum`, `Tokio`, and `PostgreSQL` with *JWT auth*, *RBAC (3 roles)*, and `Argon2` *hashing*.",
        "Developed *transaction APIs* with *filtering, pagination, and ownership* to secure CRUD operations over *100+ records*.",
        "Implemented a *financial analytics dashboard* computing *5+ metrics*, for real-time insights and data-driven decisions.",
      ),
    ),
    (
      title:    "PikaNote",
      subtitle: "A light weight terminal text editor in Rust featuring efficient rendering and low-level control.",
      from:     (2, 2025),
      to:       (8, 2025),
      links:    (("https://github.com/D3athSkulll/PikaNote", "github"),),
      bullets: (
        "Implemented *rich text editing features* including *insertion, deletion, line breaks, cursor navigation, and file I/O*.",
        "Built *real-time terminal interaction* using `Crossterm`, handling *key events* and *dynamic cursor control* responsively.",
        "Implemented *incremental screen rendering* using queued terminal updates to minimize redraw overhead efficiently.",
        "Developed *bidirectional incremental search* with *live highlighting* using an `annotated string` system for large buffers.",
        "Designed a *modular terminal UI* with *3 components* including *editor view*, *message/command bar* and a *status bar*.",
      ),
    ),
  ),

  achievements: (
    "*Overall Winner* of *Webkriti 2024*, organised by *AASF* for developing Yatramitra, a travel ticket booking platform.",
    "Secured *3rd* position in Product Management Track of *AASF Winter Projects, 2025*.",
  ),

  positions: (
    "*Core Team Lead*, Alumni Meet 2026, *ABV-IIITM Gwalior*.",
    "*Technical and Design Lead,* IEEE Student Branch, *ABV-IIITM Gwalior*.",
    "*Executive*, Student Activity Council 2025 (Technical), at *ABV-IIITM Gwalior*.",
    "Facilitated a *2*-day workshop on *Web Basics - JS* for *50+* students at *ABV-IIITM Gwalior*.",
    "Designed official cover page for *Abhishar V15*, the annual magazine of *ABV-IIITM Gwalior* published by *AASF*.",
  ),

  skills: (
    (category: "Systems Programming", items: ("Rust", "Golang","JavaScript", "C++", "C", "Python")),
    (category: "Backend Frameworks",  items: ("Axum", "Tokio", "Reqwest", "Node.js", "Express.js", "Redis", "Kafka", "REST APIs", "Websockets")),
    (category: "Databases and ORM",   items: ("SQL", "PostgreSQL", "MongoDB", "Diesel", "Sqlx", "SurrealDB")),
    (category: "DevOps",  items: ("Docker", "CI/CD", "Amazon Web Services", "AWS Lambda", "EC2", "S3")),
    (category: "AI and ML", items:("MCP","Vector Embeddings","Transformers", "LLMS", "Predictive Load Forecasting")),
    (category: "Development Tools",   items: ("Git", "GitHub", "Gitlab","Claude Code", "Arch Linux", "Postman", "HTML", "TailwindCSS", "React")),
    (category: "Other Tools",         items: ("ABI","RTOS", "GDB", "QEMU", "CMake", "Canva", "Photoshop", "Figma", "Notion")),
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
  " – "
  if to != none {
    to.display("[month repr:short] [year]")
  } else {
    "Present"
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

#let exp_subsection(title, subtitle, from, to: none, href: none, location: none, links: none) = {
  v(0pt)
  text(title, size: big, fill: accent, weight: "bold")
  h(6pt)
  for (url, icon) in links {
    text("|")
    h(6pt)
    link(url, iconpill("", fa-icon(icon)))
    h(6pt)
  }
  h(1fr)
  text(format(from, to: to))
  linebreak()
  text(subtitle, weight: "bold")
}

#let proj_subsection(title, subtitle, from, to: none, links: none) = {
  v(0pt)
  text(title, size: big, fill: accent, weight: "bold")
  h(6pt)
  for (url, icon) in links {
    text("|")
    h(6pt)
    link(url, iconpill("", fa-icon(icon)))
    h(6pt)
  }
  h(1fr)
  text(format(from, to: to))
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
        links: entry.links,
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
        date(..proj.from),
        to: if "to" in proj { date(..proj.to) } else { none },
        links: proj.links,
      )
      for bullet in proj.bullets [
        - #eval(bullet, mode: "markup")
      ]
      v(-4pt)
    }

    #v(3pt);
    
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
      - #eval(item, mode: "markup")
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


