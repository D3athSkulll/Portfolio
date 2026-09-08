import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Search, FileText, FileCode } from "lucide-react";
import { useProfile, useBlogIndex, useBlogPost } from "./api";
import type { Entry, Position } from "./types";
import { AccordionCard, Bullets } from "./components/Accordion";
import { SectionHead, Eof, Loading, Broken } from "./components/Section";
import { FilterBar } from "./components/FilterBar";
import { Icon, IconLink } from "./components/Icon";

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ym = (s: string) => {
  const [y, m] = s.split("-");
  return `${MONTHS[Number(m)] ?? m} ${y}`;
};
const range = (a: string, b: string) => (a === b ? ym(a) : `${ym(a)} – ${ym(b)}`);
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const LINK_LABELS: Record<string, string> = {
  github: "GitHub",
  gitlab: "GitLab",
  globe: "Website",
  "google-drive": "Report",
  envelope: "Email",
  code: "LeetCode",
  linkedin: "LinkedIn",
};

const TYPE_COLORS: Record<string, string> = {
  systems: "text-[#c2410c] border-[#c2410c] retro:bg-[#ffe4c4]",
  "low-level": "text-[#c2410c] border-[#c2410c] retro:bg-[#ffe4c4]",
  ml: "text-[#7c3aed] border-[#7c3aed] retro:bg-[#ece0ff]",
  backend: "text-[#0369a1] border-[#0369a1] retro:bg-[#d6ecff]",
  cloud: "text-[#15803d] border-[#15803d] retro:bg-[#d6f5df]",
  embedded: "text-[#be123c] border-[#be123c] retro:bg-[#ffe0e6]",
  brand: "text-[#b45309] border-[#b45309] retro:bg-[#ffedcf]",
  print: "text-[#7c3aed] border-[#7c3aed] retro:bg-[#ece0ff]",
  ui: "text-[#0369a1] border-[#0369a1] retro:bg-[#d6ecff]",
};

function Tag({ label }: { label: string }) {
  const c = TYPE_COLORS[slug(label)] ?? "text-accent2 border-accent2";
  return (
    <span
      className={`whitespace-nowrap rounded-sm border px-2 py-0.5 font-mono text-[12px] retro:text-[13px] font-bold uppercase tracking-widest vim:!border-line vim:!text-accent vim:!bg-transparent ${c}`}
    >
      {label}
    </span>
  );
}

function EntryHeader({ e }: { e: Entry }) {
  return (
    <>
      <span className="text-[1.15rem] font-bold leading-snug text-fg retro:text-black">{e.title}</span>
      {e.subtitle && <span className="text-[0.98rem] italic opacity-90">{e.subtitle}</span>}
      <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono retro:font-body text-[13px] sm:text-sm tracking-wide opacity-95">
        <span className="rounded-sm px-1.5 font-bold retro:bg-black retro:text-[#ffd23f] vim:text-accent">
          {range(e.from, e.to)}
        </span>
        {e.location && <span>· {e.location}</span>}
        {e.links?.map((l) => (
          <IconLink key={l.href} href={l.href} icon={l.icon} label={LINK_LABELS[l.icon] ?? l.icon} />
        ))}
      </span>
    </>
  );
}

/* ------------------------------------------------------------------ sections */

export function Home() {
  const { data, isLoading, error } = useProfile();
  if (isLoading) return <Loading />;
  if (error || !data) return <Broken msg="profile.json unreachable" />;
  return (
    <>
      <SectionHead name="whoami" />
      <div className="flex flex-col gap-3.5 text-[1.02rem] leading-relaxed">
        {data.profile.summary
          .split(/\n{2,}/)
          .map((para, i) => (
            <p key={i}>{para.trim()}</p>
          ))}
      </div>
      <Eof />
    </>
  );
}

const WORK_FILTERS = ["Open Source", "ML", "SDE", "Intern"];

export function Experience() {
  const { data, isLoading } = useProfile();
  const [f, setF] = useState<string | null>(null);
  if (isLoading || !data) return <Loading />;
  const shown = f ? data.experience.filter((e) => e.tags.includes(f)) : data.experience;
  return (
    <>
      <SectionHead name="work.log" />
      <FilterBar options={WORK_FILTERS} value={f} onChange={setF} />
      <div className="flex flex-col gap-2.5">
        {shown.map((e) => (
          <AccordionCard key={e.title} header={<EntryHeader e={e} />}>
            <Bullets items={e.bullets} />
          </AccordionCard>
        ))}
        {shown.length === 0 && <p className="font-mono text-sm text-muted">no entries tagged “{f}”.</p>}
      </div>
      <Eof />
    </>
  );
}

export function Projects() {
  const { data, isLoading } = useProfile();
  const [f, setF] = useState<string | null>(null);
  if (isLoading || !data) return <Loading />;
  const types = [...new Set(data.projects.map((p) => p.type).filter(Boolean) as string[])];
  const shown = f ? data.projects.filter((p) => p.type === f) : data.projects;
  return (
    <>
      <SectionHead name="projects/" />
      {types.length > 1 && <FilterBar options={types} value={f} onChange={setF} />}
      <div className="flex flex-col gap-2.5">
        {shown.map((e) => (
          <AccordionCard
            key={e.title}
            header={<EntryHeader e={e} />}
            right={e.type ? <Tag label={e.type} /> : null}
          >
            <Bullets items={e.bullets} />
          </AccordionCard>
        ))}
      </div>
      <Eof />
    </>
  );
}

const SKILL_ROLES = ["ML", "Systems", "Backend", "Cloud", "SDE"];

export function Skills() {
  const { data, isLoading } = useProfile();
  const [f, setF] = useState<string | null>(null);
  if (isLoading || !data) return <Loading />;
  const shown = f ? data.skills.filter((g) => g.roles.includes(f)) : data.skills;
  return (
    <>
      <SectionHead name="skills.dat" />
      <FilterBar options={SKILL_ROLES} value={f} onChange={setF} allLabel="all roles" />
      <div className="flex flex-wrap gap-3">
        {shown.map((g) => (
          <div
            key={g.category}
            className="flex-1 basis-[260px] border-2 retro:border-black retro:bg-panel2 vim:border vim:border-line vim:rounded p-3"
          >
            <h3 className="m-0 mb-2 font-mono text-sm font-bold uppercase tracking-wider text-accent retro:text-accent2 vim:text-accent2">
              {g.category}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((it) => (
                <span
                  key={it}
                  className="border retro:border-black retro:bg-[#1b1712] retro:text-[#ffd23f] vim:border-line vim:text-accent rounded-sm px-2 py-0.5 font-mono retro:font-body text-[12px] font-bold uppercase"
                >
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

export function Designs() {
  const { data, isLoading } = useProfile();
  if (isLoading || !data) return <Loading />;
  return (
    <>
      <SectionHead name="designs/" />
      <div className="flex flex-col gap-2.5">
        {data.designs.map((d) => (
          <AccordionCard
            key={d.title}
            collapsible={false}
            header={
              <>
                <span className="text-[1.15rem] font-bold retro:text-black">{d.title}</span>
                <span className="mt-1 text-[1rem] leading-relaxed opacity-90">{d.description}</span>
                {d.links.length > 0 && (
                  <span className="mt-2 flex flex-wrap gap-2">
                    {d.links.map((l) => (
                      <IconLink key={l.href} href={l.href} icon={l.icon} label={LINK_LABELS[l.icon] ?? l.icon} />
                    ))}
                  </span>
                )}
              </>
            }
            right={d.kind ? <Tag label={d.kind} /> : null}
          />
        ))}
        {data.designs.length === 0 && (
          <p className="font-mono text-sm text-muted">no designs yet.</p>
        )}
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
      <SectionHead name="school.sys" />
      <div className="flex flex-col gap-2.5">
        {data.education.map((e) => (
          <AccordionCard
            key={e.institution}
            defaultOpen
            header={
              <>
                <span className="text-[1.1rem] font-bold retro:text-black">{e.institution}</span>
                <span className="text-[0.95rem] italic opacity-90">{e.degree}</span>
                <span className="mt-1 font-mono retro:font-body text-[13px] opacity-90">
                  <span className="rounded-sm px-1.5 font-bold retro:bg-black retro:text-[#ffd23f] vim:text-accent">
                    {range(e.from, e.to)}
                  </span>
                  {e.detail ? ` · ${e.detail}` : ""}
                </span>
              </>
            }
          >
            {e.bullets.length > 0 ? (
              <Bullets items={e.bullets} />
            ) : (
              <p className="mt-2 text-sm text-muted">No notes yet.</p>
            )}
          </AccordionCard>
        ))}
      </div>
      <Eof />
    </>
  );
}

/** A list of collapsible entries (string, or { title, bullets } with a dropdown). */
function DropList({ items, badge }: { items: Position[]; badge: string }) {
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((p, i) => {
        const title = typeof p === "string" ? p : p.title;
        const bullets = typeof p === "string" ? [] : p.bullets ?? [];
        return (
          <AccordionCard
            key={i}
            collapsible={bullets.length > 0}
            header={
              <span className="flex items-baseline gap-2.5">
                <span className="shrink-0 border border-current px-1.5 font-mono retro:font-body text-[11px] font-bold uppercase tracking-widest text-accent2">
                  {badge}
                </span>
                <span className="text-[1.02rem]">{title}</span>
              </span>
            }
          >
            {bullets.length > 0 && <Bullets items={bullets} />}
          </AccordionCard>
        );
      })}
      {items.length === 0 && <p className="font-mono text-sm text-muted">nothing here yet.</p>}
    </div>
  );
}

export function Extracurricular() {
  const { data, isLoading } = useProfile();
  if (isLoading || !data) return <Loading />;
  return (
    <>
      <SectionHead name="por.log" />
      <DropList items={data.positions} badge="POR" />
      <Eof />
    </>
  );
}

export function TestScores() {
  const { data, isLoading } = useProfile();
  if (isLoading || !data) return <Loading />;
  return (
    <>
      <SectionHead name="scores.dat" />
      <DropList items={data.testScores} badge="EXAM" />
      <Eof />
    </>
  );
}

export function Likes() {
  const { data, isLoading } = useProfile();
  if (isLoading || !data) return <Loading />;
  return (
    <>
      <SectionHead name="likes.cfg" />
      <DropList items={data.likes} badge="LIKE" />
      <Eof />
    </>
  );
}

export function Wins() {
  const { data, isLoading } = useProfile();
  if (isLoading || !data) return <Loading />;
  return (
    <>
      <SectionHead name="wins.bak" />
      <div className="flex flex-col gap-2">
        {data.achievements.map((a, i) => (
          <div
            key={i}
            className="flex items-baseline gap-2.5 border-l-4 border-hud bg-panel2 px-3 py-2"
          >
            <span className="shrink-0 border border-current px-1.5 font-mono text-[10px] uppercase tracking-widest text-hud">
              WIN
            </span>
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
      <SectionHead name="resume.doc" />
      <p className="mb-3 max-w-[60ch]">
        Grab the version tuned for the role — or the Typst source to build your own.
      </p>
      <div className="flex flex-col flex-wrap gap-4 sm:flex-row">
        {data.resume.downloads.map((r) => (
          <a
            key={r.role}
            href={r.href}
            download
            className="flex min-w-[230px] items-center gap-3 border-2 !text-black no-underline retro:border-[#0b0810] retro:bg-accent2 retro:shadow-[6px_6px_0_#0b0810] vim:rounded vim:border-line vim:!bg-accent px-4 py-3"
          >
            <FileText size={20} className="shrink-0" />
            <span className="flex flex-col items-start leading-tight">
              <span className="font-mono text-base font-bold uppercase tracking-wide">{r.role}</span>
              <span className="mt-0.5 font-body text-[13px] opacity-85">{r.label}</span>
            </span>
          </a>
        ))}
        {data.resume.source && (
          <a
            href={data.resume.source.href}
            download
            className="flex min-w-[230px] items-center gap-3 border-2 no-underline retro:border-[#0b0810] retro:bg-panel2 retro:!text-black retro:shadow-[6px_6px_0_#0b0810] vim:rounded vim:border-line vim:!text-accent px-4 py-3"
          >
            <FileCode size={20} className="shrink-0" />
            <span className="flex flex-col items-start leading-tight">
              <span className="font-mono text-base font-bold uppercase tracking-wide">Typst source</span>
              <span className="mt-0.5 font-body text-[13px] opacity-85">
                {data.resume.source.label}
              </span>
            </span>
          </a>
        )}
      </div>
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
  const panel =
    "relative border retro:border-2 retro:border-black vim:border-line bg-panel2 p-4 pt-5";
  const lbl =
    "absolute -top-2.5 left-2.5 bg-panel2 px-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent2";
  return (
    <>
      <SectionHead name="comm_link.proto" />
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className={panel}>
          <span className={lbl}>TERMINAL_MAILER.EXE</span>
          <ContactForm mailto={direct.find((x) => x.icon === "envelope")?.href} />
        </div>
        <div className="flex flex-col gap-5">
          <div className={panel}>
            <span className={lbl}>Direct_Communication</span>
            {direct.map((x) => (
              <Row key={x.href} icon={x.icon} k={x.icon === "phone" ? "phone" : "email"} href={x.href} label={x.label ?? x.href} />
            ))}
          </div>
          <div className={panel}>
            <span className={lbl}>Professional_Networks</span>
            {networks.map((x) => (
              <Row key={x.href} icon={x.icon} k={x.icon} href={x.href} label={x.label ?? x.href} external />
            ))}
          </div>
        </div>
      </div>
      <Eof />
    </>
  );
}

function Row({
  icon,
  k,
  href,
  label,
  external,
}: {
  icon: string;
  k: string;
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <div className="flex gap-2 py-1 text-[13px]">
      <span className="inline-flex min-w-[92px] items-center gap-1.5 font-mono text-[11px] uppercase text-accent2">
        <Icon name={icon} /> {k}
      </span>
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
        {label}
      </a>
    </div>
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
  const field =
    "mt-1 mb-3 block w-full border-2 retro:border-black vim:border vim:border-line bg-white retro:bg-[#fffdf5] vim:bg-[#0b0d13] px-2.5 py-2 font-[family-name:var(--font-code)] text-[13px] text-fg outline-none focus:outline focus:outline-2 focus:outline-accent2";
  return (
    <form onSubmit={submit}>
      {(["name:ENTER_NAME:[Type name here...]", "email:YOUR_EMAIL:[user@remote_host.net]", "message:MESSAGE_STRING:[Initiating text buffer...]"] as const).map(
        (spec) => {
          const [key, lbl, ph] = spec.split(":");
          const common = {
            required: true,
            placeholder: ph,
            value: (f as Record<string, string>)[key],
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              setF({ ...f, [key]: e.target.value }),
          };
          return (
            <label key={key} className="block font-mono text-xs uppercase tracking-wide text-accent2">
              &gt; {lbl}
              {key === "message" ? (
                <textarea className={`${field} min-h-[110px]`} {...common} />
              ) : (
                <input className={field} type={key === "email" ? "email" : "text"} {...common} />
              )}
            </label>
          );
        },
      )}
      <div className="flex items-center justify-between gap-2.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-accent before:content-['●_']">
          Buffer_Ready
        </span>
        <button
          className="border-2 retro:border-black vim:border-line vim:rounded bg-accent2 retro:text-black vim:bg-accent vim:text-[#0d0f16] px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider disabled:opacity-60"
          disabled={state === "sending"}
        >
          {state === "sending" ? "TRANSMITTING..." : "TRANSMIT_DATA ▶"}
        </button>
      </div>
      {state === "ok" && <p className="mt-2 font-mono text-xs text-muted">» MESSAGE QUEUED. THANKS.</p>}
      {state === "err" && (
        <p className="mt-2 font-mono text-xs text-muted">
          » TRANSMISSION FAILED.{" "}
          {mailto && <a href={`${mailto}?body=${encodeURIComponent(f.message)}`}>use email instead</a>}
        </p>
      )}
    </form>
  );
}

/* --------------------------------------------------------------------- blog */

/** Prev / numbered / next pager. Renders nothing for a single page. */
function Pager({
  page,
  count,
  onPage,
  className = "",
}: {
  page: number;
  count: number;
  onPage: (p: number) => void;
  className?: string;
}) {
  if (count <= 1) return null;
  const btn =
    "inline-flex h-9 min-w-9 items-center justify-center border-2 px-2.5 font-mono text-sm font-bold uppercase transition-colors " +
    "retro:border-[#0b0810] vim:border-line vim:rounded disabled:opacity-40 disabled:cursor-not-allowed";
  const on = "bg-accent text-black retro:text-black vim:text-[#0d0f16]";
  const off =
    "bg-transparent text-fg retro:text-black hover:bg-accent hover:text-black vim:hover:text-accent vim:hover:border-accent";
  return (
    <nav className={`mt-8 flex flex-wrap items-center gap-2 ${className}`} aria-label="pagination">
      <button className={`${btn} ${off}`} disabled={page <= 1} onClick={() => onPage(page - 1)}>
        ◀ prev
      </button>
      {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          aria-current={n === page ? "page" : undefined}
          className={`${btn} ${n === page ? on : off}`}
          onClick={() => onPage(n)}
        >
          {n}
        </button>
      ))}
      <button className={`${btn} ${off}`} disabled={page >= count} onClick={() => onPage(page + 1)}>
        next ▶
      </button>
    </nav>
  );
}

const POSTS_PER_PAGE = 8;

export function BlogIndex() {
  const { data, isLoading, error } = useBlogIndex();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [params, setParams] = useSearchParams();
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

  const pageCount = Math.max(1, Math.ceil(shown.length / POSTS_PER_PAGE));
  const page = Math.min(Math.max(1, Number(params.get("page")) || 1), pageCount);
  const pageItems = shown.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const goPage = (p: number) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (p <= 1) next.delete("page");
        else next.set("page", String(p));
        return next;
      },
      { replace: false },
    );
    window.scrollTo({ top: 0 });
  };

  // reset to page 1 whenever the search or tag filter changes
  useEffect(() => {
    if (params.get("page")) {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, tag]);

  if (isLoading) return <Loading />;
  if (error || !data) return <Broken msg="blog not generated — run bloggen" />;

  return (
    <>
      <SectionHead name="blog/" />
      <div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-start">
        <div className="flex h-10 items-center gap-2 border-2 retro:border-[#0b0810] vim:border vim:border-line bg-white retro:bg-[#fffdf5] vim:bg-[#0b0d13] px-2.5">
          <Search size={15} strokeWidth={1.75} aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="grep posts..."
            aria-label="search posts"
            className="h-full w-full bg-transparent font-body text-sm text-fg outline-none sm:w-52"
          />
        </div>
        <div className="[&>div]:mb-0 [&_button]:h-10">
          <FilterBar options={allTags} value={tag} onChange={setTag} allLabel="all" />
        </div>
      </div>
      <p className="mb-3 font-mono retro:font-body text-[12px] text-muted">
        {shown.length} / {data.length} post{data.length === 1 ? "" : "s"}
        {pageCount > 1 && ` · page ${page}/${pageCount}`}
      </p>
      <div className="flex flex-col">
        {pageItems.map((p) => (
          <Link
            key={p.slug}
            to={`/blog/${p.slug}`}
            className="flex flex-col gap-2 border-t retro:border-black/60 vim:border-line py-4 no-underline last:border-b hover:bg-panel2 sm:flex-row sm:gap-5"
          >
            <span className="shrink-0 pt-0.5 sm:w-28">
              <span className="rounded-sm px-1.5 py-0.5 font-mono retro:font-body text-[12px] font-bold retro:bg-black retro:text-[#ffd23f] vim:text-accent">
                {p.date}
              </span>
            </span>
            <span className="flex min-w-0 flex-col gap-1.5">
              <span className="text-[1.1rem] font-bold text-fg retro:text-black">{p.title}</span>
              <span className="text-[0.98rem] opacity-90">{p.summary}</span>
              <span className="mt-0.5 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-sm border px-2 py-0.5 font-mono retro:font-body text-[11px] font-bold uppercase retro:border-black retro:bg-[#1b1712] retro:text-[#ffd23f] vim:border-line vim:text-accent"
                  >
                    {t}
                  </span>
                ))}
              </span>
            </span>
          </Link>
        ))}
        {shown.length === 0 && <p className="py-6 font-mono text-sm text-muted">no posts match.</p>}
      </div>
      <Pager page={page} count={pageCount} onPage={goPage} />
      <Eof />
    </>
  );
}

export function BlogPost() {
  const { slug: s = "" } = useParams();
  const { data, isLoading, error } = useBlogPost(s);
  const [pg, setPg] = useState(1);
  useEffect(() => setPg(1), [s]);
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
  if (error || !data) return <Broken msg={`no post: ${s}`} />;

  const pages = data.pages?.length ? data.pages : [data.html];
  const cur = Math.min(Math.max(1, pg), pages.length);
  const pageOfId = (id: string) => {
    const i = pages.findIndex((h) => h.includes(`id="${id}"`));
    return i < 0 ? cur : i + 1;
  };
  const toPage = (p: number) => {
    setPg(p);
    window.scrollTo({ top: 0 });
  };
  return (
    <article className="w-full">
      <p className="mb-4 font-mono retro:font-body text-sm font-bold">
        <Link to="/blog">◀ BLOG/</Link>
      </p>
      <h1 className="m-0 mb-3 font-body text-[clamp(1.8rem,4.5vw,2.5rem)] font-bold leading-tight text-fg retro:text-black vim:text-accent">
        {data.title}
      </h1>
      <div className="mb-6 flex flex-wrap items-center gap-2.5 border-b retro:border-black/50 vim:border-line pb-3 font-mono retro:font-body text-[13px] text-muted">
        <span className="rounded-sm px-1.5 py-0.5 font-bold retro:bg-black retro:text-[#ffd23f] vim:text-accent">
          {data.date}
        </span>
        <span>· {data.readingMinutes} min read</span>
        {data.tags.map((t) => (
          <span
            key={t}
            className="rounded-sm border px-2 py-0.5 text-[11px] font-bold uppercase retro:border-black retro:bg-[#1b1712] retro:text-[#ffd23f] vim:border-line vim:text-accent"
          >
            {t}
          </span>
        ))}
      </div>
      {data.toc.length > 1 && (
        <nav className="mb-6 border-l-2 retro:border-accent2 vim:border-line pl-3">
          <span className="font-mono retro:font-body text-[11px] font-bold uppercase tracking-[0.16em] text-accent2">
            On this page
          </span>
          <ul className="mt-1.5 list-none space-y-1 p-0 font-body text-[13px]">
            {data.toc.map((t) => (
              <li key={t.id} style={{ marginLeft: (t.level - 2) * 14 }}>
                <a
                  href={`#${t.id}`}
                  onClick={() => {
                    const p = pageOfId(t.id);
                    if (p !== cur) {
                      setPg(p);
                      requestAnimationFrame(() =>
                        document.getElementById(t.id)?.scrollIntoView(),
                      );
                    }
                  }}
                >
                  {t.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div className="prose" dangerouslySetInnerHTML={{ __html: pages[cur - 1] }} />
      {pages.length > 1 && (
        <p className="mt-8 font-mono retro:font-body text-[12px] font-bold uppercase tracking-widest text-muted">
          Page {cur} / {pages.length}
        </p>
      )}
      <Pager page={cur} count={pages.length} onPage={toPage} className="!mt-3" />
      <Eof />
    </article>
  );
}

export function NotFound() {
  return (
    <>
      <SectionHead name="404" />
      <p>PAGE NOT FOUND — this corner of the information superhighway is ▓ UNDER CONSTRUCTION ▓.</p>
      <p className="mt-2">
        <Link to="/">◀ back to ABOUT_ME.TXT</Link>
      </p>
    </>
  );
}
