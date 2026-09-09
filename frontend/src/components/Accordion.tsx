import { createContext, useContext, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Groups a set of <AccordionCard itemKey=…> so that opening one closes the
 * others. Cards without an `itemKey`, or rendered outside a group, keep their
 * own independent open/close state.
 */
const GroupCtx = createContext<{
  openKey: string | null;
  setOpenKey: (k: string | null) => void;
} | null>(null);

export function AccordionGroup({ children }: { children: ReactNode }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  return <GroupCtx.Provider value={{ openKey, setOpenKey }}>{children}</GroupCtx.Provider>;
}

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
  itemKey,
}: {
  header: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  /** Stable id within an <AccordionGroup>; enables "only one open at a time". */
  itemKey?: string | number;
}) {
  const group = useContext(GroupCtx);
  const key = itemKey != null ? String(itemKey) : null;
  const grouped = group != null && key != null;

  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const open = grouped ? group!.openKey === key : localOpen;
  const canToggle = collapsible && !!children;

  const toggle = () => {
    if (!canToggle) return;
    if (grouped) group!.setOpenKey(open ? null : key);
    else setLocalOpen((o) => !o);
  };

  const shell =
    "border-2 retro:border-black retro:bg-panel2 retro:shadow-[3px_3px_0_#000] " +
    "vim:border vim:border-line vim:bg-panel2 vim:rounded " +
    "space-chamfer space-panel space:bg-panel2";

  return (
    <div className={shell}>
      <button
        type="button"
        aria-expanded={canToggle ? open : undefined}
        disabled={!canToggle}
        onClick={toggle}
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

/** Bulleted list used inside card bodies — ⚡ markers in the retro theme. */
export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((b, i) => (
        <li key={i} className="flex gap-2 text-[1rem] leading-relaxed">
          <span className="shrink-0 select-none text-accent2 retro:text-accent2 space:text-hud">
            <span className="hidden retro:inline">⚡</span>
            <span className="retro:hidden space:hidden">›</span>
            <span className="hidden space:inline">▹</span>
          </span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}
