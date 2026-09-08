import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Card with an always-visible header and a body that expands on click.
 * `collapsible={false}` renders a plain static card.
 */
export function AccordionCard({
  header,
  right,
  children,
  collapsible = true,
  defaultOpen = false,
}: {
  header: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const canToggle = collapsible && !!children;

  const shell =
    "border-2 retro:border-black retro:bg-panel2 retro:shadow-[3px_3px_0_#000] " +
    "vim:border vim:border-line vim:bg-panel2 vim:rounded";

  return (
    <div className={shell}>
      <button
        type="button"
        aria-expanded={canToggle ? open : undefined}
        disabled={!canToggle}
        onClick={() => canToggle && setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-3 px-3.5 py-3 text-left disabled:cursor-default"
      >
        <span className="flex min-w-0 flex-col gap-1">{header}</span>
        <span className="flex shrink-0 items-center gap-2">
          {right}
          {canToggle && (
            <ChevronDown
              size={16}
              strokeWidth={2}
              className={`opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
              aria-hidden
            />
          )}
        </span>
      </button>
      {canToggle && open && (
        <div className="border-t border-dashed retro:border-black/40 vim:border-line px-4 pb-3 pt-2">
          {children}
        </div>
      )}
    </div>
  );
}

/** Bulleted list used inside card bodies — ⚡ markers in the arcade theme. */
export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((b, i) => (
        <li key={i} className="flex gap-2 text-[0.95rem] leading-snug">
          <span className="shrink-0 select-none text-accent2 retro:text-accent2">
            <span className="hidden retro:inline">⚡</span>
            <span className="retro:hidden">›</span>
          </span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}
