import type { ReactNode } from "react";

/** Replaces the old "P1 …" health-bar label. A terminal-prompt style heading. */
export function SectionHead({ name, right }: { name: string; right?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3 border-b-2 retro:border-black vim:border-b vim:border-line pb-2">
      <h2 className="m-0 flex items-center gap-2 font-mono text-2xl sm:text-[1.7rem] font-bold uppercase tracking-wider text-fg retro:text-black vim:text-accent">
        <span className="text-accent2">
          <span className="vim:hidden">»</span>
          <span className="hidden vim:inline">~/$</span>
        </span>
        {name}
        <span className="blink text-accent">_</span>
      </h2>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

export function Eof() {
  return (
    <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted">
      EOF. waiting for input...
    </p>
  );
}

export function Loading() {
  return <p className="font-mono text-sm text-muted">&gt; loading...</p>;
}

export function Broken({ msg }: { msg: string }) {
  return (
    <p className="font-mono text-sm text-accent">▓ UNDER CONSTRUCTION — {msg}</p>
  );
}
