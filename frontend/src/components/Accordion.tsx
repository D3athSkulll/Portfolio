import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * A card whose header is always visible and whose body expands on click.
 * Used for experience and project entries.
 */
export function AccordionCard({
  header,
  tag,
  children,
  defaultOpen = false,
}: {
  header: ReactNode;
  tag?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`card${open ? " open" : ""}`}>
      <button
        className="card-head"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="card-head-main">{header}</span>
        <span className="card-head-right">
          {tag}
          <ChevronDown className="chev" size={16} strokeWidth={2} aria-hidden />
        </span>
      </button>
      {open && <div className="card-body">{children}</div>}
    </div>
  );
}
