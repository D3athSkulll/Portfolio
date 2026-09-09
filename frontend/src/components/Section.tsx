import type { ReactNode } from "react";
import { useTheme } from "../theme";

// SPACE theme renames each section to mission-control phrasing.
const SPACE_NAMES: Record<string, string> = {
  whoami: "crew.identity",
  "work.log": "flight.log",
  "projects/": "payload.manifest/",
  "collabs/": "joint-ops/",
  "skills.dat": "sys.diagnostics",
  "designs/": "optics.array/",
  "school.sys": "training.record",
  "scores.dat": "exam.telemetry",
  "por.log": "command.roster",
  "wins.bak": "mission.awards",
  "likes.cfg": "off-duty.log",
  "resume.doc": "crew.dossier",
  "comm_link.proto": "comms.uplink",
  "blog/": "transmission.log/",
  "404": "signal.lost",
};

/** Section heading — a terminal prompt (retro/vim) or a telemetry tag (space). */
export function SectionHead({ name, right }: { name: string; right?: ReactNode }) {
  const { theme } = useTheme();
  const label = theme === "space" ? (SPACE_NAMES[name] ?? name) : name;
  return (
    <div className="mb-4 flex items-end justify-between gap-3 border-b-2 retro:border-black vim:border-b vim:border-line space:border-b-2 space:border-accent2/40 pb-2">
      <h2 className="m-0 flex items-center gap-2 font-mono text-2xl sm:text-[1.7rem] font-bold uppercase tracking-wider text-fg retro:text-black vim:text-accent space:font-body space:font-semibold space:tracking-[0.22em] space:text-accent2">
        <span className="text-accent2 space:text-accent">
          <span className="vim:hidden space:hidden">»</span>
          <span className="hidden vim:inline space:hidden">~/$</span>
          <span className="hidden space:inline">◈</span>
        </span>
        {label}
        <span className="blink text-accent space:hidden">_</span>
      </h2>
      {theme === "space" ? (
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-hud">
          [ STREAM&nbsp;OK ]
        </span>
      ) : (
        right && <div className="shrink-0">{right}</div>
      )}
    </div>
  );
}

export function Eof() {
  const { theme } = useTheme();
  return (
    <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted">
      {theme === "space" ? "// end of stream — awaiting uplink" : "EOF. waiting for input..."}
    </p>
  );
}

export function Loading() {
  const { theme } = useTheme();
  return (
    <p className="font-mono text-sm text-muted">
      {theme === "space" ? "▚ acquiring signal…" : "> loading..."}
    </p>
  );
}

export function Broken({ msg }: { msg: string }) {
  const { theme } = useTheme();
  return (
    <p className="font-mono text-sm text-accent">
      {theme === "space" ? `⚠ TELEMETRY FAULT — ${msg}` : `▓ UNDER CONSTRUCTION — ${msg}`}
    </p>
  );
}
