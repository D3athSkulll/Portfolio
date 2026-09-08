import { Link, useParams } from "react-router-dom";
import { useProfile, useBlogIndex, useBlogPost } from "./api";
import type { Entry } from "./types";

const MONTHS = ["", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const ym = (s: string) => {
  const [y, m] = s.split("-");
  return `${MONTHS[Number(m)] ?? m} ${y}`;
};
const range = (a: string, b: string) => (a === b ? ym(a) : `${ym(a)} — ${ym(b)}`);

function Label({ children }: { children: React.ReactNode }) {
  return <h2 className="section-label">{children}</h2>;
}

function Loading() {
  return <p className="eof">&gt; loading...</p>;
}
function Broken({ msg }: { msg: string }) {
  return <p className="eof">▓ UNDER CONSTRUCTION — {msg}</p>;
}
function Eof() {
  return <p className="eof">EOF. WAITING FOR INPUT...</p>;
}

function EntryBlock({ e }: { e: Entry }) {
  return (
    <div className="entry">
      <h3>{e.title}</h3>
      {e.subtitle && <div style={{ fontStyle: "italic" }}>{e.subtitle}</div>}
      <div className="meta">
        {range(e.from, e.to)}
        {e.location ? ` · ${e.location}` : ""}
        {e.links?.map((l) => (
          <span key={l.href}>
            {" · "}
            <a href={l.href} target="_blank" rel="noreferrer">
              [{l.icon}]
            </a>
          </span>
        ))}
      </div>
      <ul>
        {e.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

export function Home() {
  const { data, isLoading, error } = useProfile();
  if (isLoading) return <Loading />;
  if (error || !data) return <Broken msg="profile.json unreachable" />;
  const p = data.profile;
  return (
    <>
      <Label>[SYSTEM_INFO]</Label>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
        NAME: {p.name}
        <br />
        ROLE: {p.role}
        <br />
        LOC: {p.location}
        <br />
        STATUS: ONLINE
      </p>
      <hr />
      <p>{p.summary}</p>
      <Label>&gt; CONTACT</Label>
      <ul>
        {p.contact.map((c) => (
          <li key={c.href}>
            <a href={c.href} target="_blank" rel="noreferrer">
              {c.icon}: {c.label}
            </a>
          </li>
        ))}
      </ul>
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
      {data.experience.map((e) => (
        <EntryBlock key={e.title} e={e} />
      ))}
      <Eof />
    </>
  );
}

export function Projects() {
  const { data, isLoading } = useProfile();
  if (isLoading || !data) return <Loading />;
  return (
    <>
      <Label>PROJECTS/ — ls -la --human-readable</Label>
      {data.projects.map((e) => (
        <EntryBlock key={e.title} e={e} />
      ))}
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
      {data.skills.map((g) => (
        <div key={g.category} className="entry">
          <h3>{g.category}</h3>
          <div>
            {g.items.map((it) => (
              <span key={it} className="chip">
                {it}
              </span>
            ))}
          </div>
        </div>
      ))}
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
      {data.education.map((e) => (
        <div key={e.institution} className="entry">
          <h3>{e.institution}</h3>
          <div className="meta">
            {range(e.from, e.to)}
            {e.detail ? ` · ${e.detail}` : ""}
          </div>
          <p>{e.degree}</p>
        </div>
      ))}
      <Eof />
    </>
  );
}

export function Achievements() {
  const { data, isLoading } = useProfile();
  if (isLoading || !data) return <Loading />;
  return (
    <>
      <Label>ACHIEVEMENTS</Label>
      <ul>
        {data.achievements.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
      <Label>POSITIONS_OF_RESPONSIBILITY</Label>
      <ul>
        {data.positions.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
      <Eof />
    </>
  );
}

export function Resume() {
  const { data, isLoading } = useProfile();
  if (isLoading || !data) return <Loading />;
  return (
    <>
      <p>
        <a
          className="cta next"
          style={{ display: "inline-block", padding: "10px 16px", textDecoration: "none" }}
          href={data.resume.href}
        >
          ⬇ {data.resume.label}
        </a>
      </p>
      <Label>WORK_EXPERIENCE</Label>
      {data.experience.map((e) => (
        <EntryBlock key={e.title} e={e} />
      ))}
      <Label>EDUCATION</Label>
      {data.education.map((e) => (
        <p key={e.institution}>
          <strong>{e.institution}</strong> — {e.degree} ({range(e.from, e.to)})
        </p>
      ))}
      <Label>SKILLS</Label>
      {data.skills.map((g) => (
        <p key={g.category}>
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
  return (
    <>
      <Label>COMM_LINK.PROTO</Label>
      <p>Establish secure connection with system administrator.</p>
      <ul>
        {data.profile.contact.map((c) => (
          <li key={c.href}>
            <a href={c.href} target="_blank" rel="noreferrer">
              {c.icon.toUpperCase()}: {c.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="badge" style={{ textAlign: "left", marginTop: 12 }}>
        AVAILABILITY_STATUS
        <br />
        current status: ● ONLINE
        <br />
        freelance: AVAILABLE
        <br />
        full-time: OPEN TO DISCUSS
        <br />
        preferred contact: email or linkedin
      </div>
      <Eof />
    </>
  );
}

export function BlogIndex() {
  const { data, isLoading, error } = useBlogIndex();
  if (isLoading) return <Loading />;
  if (error || !data) return <Broken msg="blog not generated — run bloggen" />;
  return (
    <>
      <Label>BLOG/ — {data.length} entr{data.length === 1 ? "y" : "ies"}</Label>
      {data.map((p) => (
        <div key={p.slug} className="entry">
          <h3>
            <Link to={`/blog/${p.slug}`}>{p.title}</Link>
          </h3>
          <div className="meta">
            {p.date}
            {p.tags.map((t) => (
              <span key={t}>
                {" "}
                <span className="chip">{t}</span>
              </span>
            ))}
          </div>
          <p>{p.summary}</p>
        </div>
      ))}
      <Eof />
    </>
  );
}

export function BlogPost() {
  const { slug = "" } = useParams();
  const { data, isLoading, error } = useBlogPost(slug);
  if (isLoading) return <Loading />;
  if (error || !data) return <Broken msg={`no post: ${slug}`} />;
  return (
    <>
      <Label>{data.title}</Label>
      <div className="meta">
        {data.date} · {data.readingMinutes} min read ·{" "}
        {data.tags.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>
      <hr />
      <div className="prose" dangerouslySetInnerHTML={{ __html: data.html }} />
      <p style={{ marginTop: 16 }}>
        <Link to="/blog">◀ back to BLOG/</Link>
      </p>
      <Eof />
    </>
  );
}

export function NotFound() {
  return (
    <>
      <Label>404</Label>
      <p>
        PAGE NOT FOUND — this corner of the information superhighway is ▓ UNDER CONSTRUCTION ▓.
      </p>
      <p>
        <Link to="/">◀ back to ABOUT_ME.TXT</Link>
      </p>
    </>
  );
}
