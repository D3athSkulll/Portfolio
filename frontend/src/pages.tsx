import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useProfile, useBlogIndex, useBlogPost } from "./api";
import type { Entry } from "./types";
import { AccordionCard } from "./components/Accordion";
import { Icon, IconLink } from "./components/Icon";

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ym = (s: string) => {
  const [y, m] = s.split("-");
  return `${MONTHS[Number(m)] ?? m} ${y}`;
};
const range = (a: string, b: string) => (a === b ? ym(a) : `${ym(a)} – ${ym(b)}`);

function Label({ children }: { children: React.ReactNode }) {
  return <h2 className="section-label">{children}</h2>;
}
const Loading = () => <p className="eof">&gt; loading...</p>;
const Broken = ({ msg }: { msg: string }) => <p className="eof">▓ UNDER CONSTRUCTION — {msg}</p>;
const Eof = () => <p className="eof">EOF. WAITING FOR INPUT...</p>;

/* ---------------------------------------------------------------- entry card */

function EntryCard({ e, showTag = false }: { e: Entry; showTag?: boolean }) {
  return (
    <AccordionCard
      tag={showTag && e.type ? <span className={`ptag ${e.type.toLowerCase().replace(/\W+/g, "-")}`}>{e.type}</span> : null}
      header={
        <>
          <span className="card-title">{e.title}</span>
          {e.subtitle && <span className="card-sub">{e.subtitle}</span>}
          <span className="card-meta">
            <span>{range(e.from, e.to)}</span>
            {e.location && <span>· {e.location}</span>}
            {e.links?.map((l) => (
              <IconLink key={l.href} href={l.href} icon={l.icon} />
            ))}
          </span>
        </>
      }
    >
      <ul>
        {e.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </AccordionCard>
  );
}

/* --------------------------------------------------------------------- pages */

export function Home() {
  const { data, isLoading, error } = useProfile();
  if (isLoading) return <Loading />;
  if (error || !data) return <Broken msg="profile.json unreachable" />;
  const p = data.profile;
  return (
    <>
      <Label>WHOAMI</Label>
      <p className="lead">{p.role}.</p>
      <p>{p.summary}</p>
      <Eof />
    </>
  );
}

export function Experience() {
  const { data, isLoading } = useProfile();
  if (isLoading || !data) return <Loading />;
  return (
    <>
      <Label>WORK_EXPERIENCE</Label>
      <div className="card-list">
        {data.experience.map((e) => (
          <EntryCard key={e.title} e={e} />
        ))}
      </div>
      <Eof />
    </>
  );
}

export function Projects() {
  const { data, isLoading } = useProfile();
  if (isLoading || !data) return <Loading />;
  return (
    <>
      <Label>PROJECTS/</Label>
      <div className="card-list">
        {data.projects.map((e) => (
          <EntryCard key={e.title} e={e} showTag />
        ))}
      </div>
      <Eof />
    </>
  );
}

export function Skills() {
  const { data, isLoading } = useProfile();
  if (isLoading || !data) return <Loading />;
  return (
    <>
      <Label>TECHNICAL_MATRIX</Label>
      <div className="skill-grid">
        {data.skills.map((g) => (
          <div key={g.category} className="skill-card">
            <h3>{g.category}</h3>
            <div className="chips">
              {g.items.map((it) => (
                <span key={it} className="chip">
                  {it}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Eof />
    </>
  );
}

export function EducationPage() {
  const { data, isLoading } = useProfile();
  if (isLoading || !data) return <Loading />;
  return (
    <>
      <Label>SCHOOL_DAZE</Label>
      <div className="card-list">
        {data.education.map((e) => (
          <div key={e.institution} className="card static">
            <div className="card-head">
              <span className="card-head-main">
                <span className="card-title">{e.institution}</span>
                <span className="card-sub">{e.degree}</span>
                <span className="card-meta">
                  <span>{range(e.from, e.to)}</span>
                  {e.detail && <span>· {e.detail}</span>}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <Eof />
    </>
  );
}

export function Achievements() {
  const { data, isLoading } = useProfile();
  if (isLoading || !data) return <Loading />;
  return (
    <>
      <Label>EXTRA_CURRICULAR / POR</Label>
      <div className="por-list">
        {data.positions.map((a, i) => (
          <div className="por-item" key={`p${i}`}>
            <span className="por-k">POR</span>
            <span>{a}</span>
          </div>
        ))}
        {data.achievements.map((a, i) => (
          <div className="por-item" key={`a${i}`}>
            <span className="por-k win">WIN</span>
            <span>{a}</span>
          </div>
        ))}
      </div>
      <Eof />
    </>
  );
}

export function Resume() {
  const { data, isLoading } = useProfile();
  if (isLoading || !data) return <Loading />;
  return (
    <>
      <Label>RESUME.DOC</Label>
      <p className="lead">Pick the version tuned for the role you're hiring for.</p>
      <div className="resume-btns">
        {data.resume.map((r) => (
          <a key={r.role} className="resume-btn" href={r.href} download>
            <Icon name="google-drive" size={16} />
            <span>
              <strong>{r.role}</strong>
              <em>{r.label}</em>
            </span>
            <span className="dl">DOWNLOAD ▾</span>
          </a>
        ))}
      </div>

      <Label>EXPERIENCE</Label>
      {data.experience.map((e) => (
        <p key={e.title} className="resume-line">
          <strong>{e.title}</strong> <span className="card-meta">{range(e.from, e.to)}</span>
          <br />
          {e.subtitle}
        </p>
      ))}
      <Label>EDUCATION</Label>
      {data.education.map((e) => (
        <p key={e.institution} className="resume-line">
          <strong>{e.institution}</strong> — {e.degree} <span className="card-meta">({range(e.from, e.to)})</span>
        </p>
      ))}
      <Label>SKILLS</Label>
      {data.skills.map((g) => (
        <p key={g.category} className="resume-line">
          <strong>{g.category}:</strong> {g.items.join(", ")}
        </p>
      ))}
      <Eof />
    </>
  );
}

export function Contact() {
  const { data, isLoading } = useProfile();
  if (isLoading || !data) return <Loading />;
  const c = data.profile.contact;
  const direct = c.filter((x) => x.icon === "phone" || x.icon === "envelope");
  const networks = c.filter((x) => !["phone", "envelope"].includes(x.icon));
  return (
    <>
      <Label>COMM_LINK.PROTO</Label>
      <p style={{ marginTop: -4 }}>Establish a connection.</p>

      <div className="comm-grid" style={{ marginTop: 14 }}>
        <div className="comm-panel">
          <span className="lbl">TERMINAL_MAILER.EXE</span>
          <ContactForm mailto={direct.find((x) => x.icon === "envelope")?.href} />
        </div>

        <div>
          <div className="comm-panel">
            <span className="lbl">Direct_Communication</span>
            {direct.map((x) => (
              <div className="row" key={x.href}>
                <span className="k">
                  <Icon name={x.icon} /> {x.icon === "phone" ? "phone" : "email"}
                </span>
                <a href={x.href}>{x.label}</a>
              </div>
            ))}
          </div>

          <div className="comm-panel" style={{ marginTop: 18 }}>
            <span className="lbl">Professional_Networks</span>
            {networks.map((x) => (
              <div className="row" key={x.href}>
                <span className="k">
                  <Icon name={x.icon} /> {x.icon}
                </span>
                <a href={x.href} target="_blank" rel="noreferrer">
                  {x.label}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Eof />
    </>
  );
}

function ContactForm({ mailto }: { mailto?: string }) {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(f),
      });
      setState(res.ok ? "ok" : "err");
    } catch {
      setState("err");
    }
  };
  const field = { display: "block", width: "100%", marginTop: 4, marginBottom: 12 } as const;
  return (
    <form onSubmit={submit}>
      <label>
        &gt; ENTER_NAME
        <input style={field} placeholder="[Type name here...]" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      </label>
      <label>
        &gt; YOUR_EMAIL
        <input style={field} type="email" placeholder="[user@remote_host.net]" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      </label>
      <label>
        &gt; MESSAGE_STRING
        <textarea style={{ ...field, minHeight: 110 }} placeholder="[Initiating text buffer...]" required value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
      </label>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <span className="buffer-ready">Buffer_Ready</span>
        <button className="cta next" style={{ padding: "9px 16px", flex: "0 0 auto" }} disabled={state === "sending"}>
          {state === "sending" ? "TRANSMITTING..." : "TRANSMIT_DATA ▶"}
        </button>
      </div>
      {state === "ok" && <p className="eof">» MESSAGE QUEUED. THANKS.</p>}
      {state === "err" && (
        <p className="eof">
          » TRANSMISSION FAILED.{" "}
          {mailto && <a href={`${mailto}?body=${encodeURIComponent(f.message)}`}>use email instead</a>}
        </p>
      )}
    </form>
  );
}

/* ---------------------------------------------------------------------- blog */

export function BlogIndex() {
  const { data, isLoading, error } = useBlogIndex();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const allTags = useMemo(
    () => [...new Set((data ?? []).flatMap((p) => p.tags))].sort(),
    [data],
  );
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (data ?? []).filter((p) => {
      if (tag && !p.tags.includes(tag)) return false;
      if (!needle) return true;
      return (p.title + " " + p.summary + " " + p.tags.join(" ")).toLowerCase().includes(needle);
    });
  }, [data, q, tag]);

  if (isLoading) return <Loading />;
  if (error || !data) return <Broken msg="blog not generated — run bloggen" />;

  return (
    <>
      <Label>BLOG/</Label>

      <div className="blog-controls">
        <div className="blog-search">
          <Search size={14} strokeWidth={1.75} aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="grep posts..."
            aria-label="search posts"
          />
        </div>
        <div className="blog-tags">
          <button className={`tagf${tag === null ? " on" : ""}`} onClick={() => setTag(null)}>
            all
          </button>
          {allTags.map((t) => (
            <button key={t} className={`tagf${tag === t ? " on" : ""}`} onClick={() => setTag(t === tag ? null : t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <p className="blog-count">
        {shown.length} / {data.length} post{data.length === 1 ? "" : "s"}
      </p>

      <div className="post-list">
        {shown.map((p) => (
          <Link key={p.slug} to={`/blog/${p.slug}`} className="post-row">
            <span className="post-date">{p.date}</span>
            <span className="post-main">
              <span className="post-title">{p.title}</span>
              <span className="post-sum">{p.summary}</span>
              <span className="chips">
                {p.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </span>
            </span>
          </Link>
        ))}
        {shown.length === 0 && <p className="eof">no posts match.</p>}
      </div>
      <Eof />
    </>
  );
}

export function BlogPost() {
  const { slug = "" } = useParams();
  const { data, isLoading, error } = useBlogPost(slug);
  useEffect(() => {
    if (!data) return;
    document.title = `${data.title} · Blog`;
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", data.summary);
  }, [data]);
  if (isLoading) return <Loading />;
  if (error || !data) return <Broken msg={`no post: ${slug}`} />;
  return (
    <article className="post">
      <p className="post-back">
        <Link to="/blog">◀ BLOG/</Link>
      </p>
      <h1 className="post-h1">{data.title}</h1>
      <div className="post-byline">
        {data.date} · {data.readingMinutes} min ·{" "}
        {data.tags.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>
      {data.toc.length > 1 && (
        <nav className="post-toc">
          <span className="lbl">ON THIS PAGE</span>
          <ul>
            {data.toc.map((t) => (
              <li key={t.id} style={{ marginLeft: (t.level - 2) * 14 }}>
                <a href={`#${t.id}`}>{t.text}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div className="prose" dangerouslySetInnerHTML={{ __html: data.html }} />
      <Eof />
    </article>
  );
}

export function NotFound() {
  return (
    <>
      <Label>404</Label>
      <p>PAGE NOT FOUND — this corner of the information superhighway is ▓ UNDER CONSTRUCTION ▓.</p>
      <p>
        <Link to="/">◀ back to ABOUT_ME.TXT</Link>
      </p>
    </>
  );
}
