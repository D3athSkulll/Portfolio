/**
 * Tag / pill used across the app.
 *
 * - default: one neutral look (skill items, blog tags, POR/exam/like badges)
 * - `colored`: a per-category colour (work / project / collab category tags) —
 *   readable on both the retro cream panel and the vim dark panel.
 */

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// Full literal class strings so Tailwind's JIT keeps them.
const VARIANTS: Record<string, string> = {
  blue: "retro:!bg-[#1e3a8a] retro:!text-[#dbeafe] retro:!border-[#0b0810] vim:!text-[#93c5fd] vim:!border-[#3b82f6]/50",
  cyan: "retro:!bg-[#155e75] retro:!text-[#cffafe] retro:!border-[#0b0810] vim:!text-[#67e8f9] vim:!border-[#06b6d4]/50",
  green: "retro:!bg-[#14532d] retro:!text-[#dcfce7] retro:!border-[#0b0810] vim:!text-[#86efac] vim:!border-[#22c55e]/50",
  amber: "retro:!bg-[#78350f] retro:!text-[#fef3c7] retro:!border-[#0b0810] vim:!text-[#fcd34d] vim:!border-[#f59e0b]/50",
  orange: "retro:!bg-[#7c2d12] retro:!text-[#ffedd5] retro:!border-[#0b0810] vim:!text-[#fdba74] vim:!border-[#f97316]/50",
  red: "retro:!bg-[#7f1d1d] retro:!text-[#fee2e2] retro:!border-[#0b0810] vim:!text-[#fca5a5] vim:!border-[#ef4444]/50",
  pink: "retro:!bg-[#831843] retro:!text-[#fce7f3] retro:!border-[#0b0810] vim:!text-[#f9a8d4] vim:!border-[#ec4899]/50",
  purple: "retro:!bg-[#4c1d95] retro:!text-[#ede9fe] retro:!border-[#0b0810] vim:!text-[#c4b5fd] vim:!border-[#8b5cf6]/50",
};
const PALETTE = Object.keys(VARIANTS);

const CATEGORY_VARIANT: Record<string, string> = {
  // project / collab categories
  backend: "blue",
  "full-stack": "blue",
  sde: "blue",
  cloud: "cyan",
  communications: "cyan",
  systems: "amber",
  "low-level": "amber",
  intern: "amber",
  ml: "purple",
  collaboration: "pink",
  hci: "orange",
  "ui-ux": "orange",
  cybersecurity: "red",
  "open-source": "green",
  "embedded-systems": "green",
  embedded: "green",
};

const hashPick = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
};

const BASE =
  "inline-flex items-center whitespace-nowrap rounded-sm border-2 px-2 py-0.5 " +
  "font-mono retro:font-body text-[11px] font-bold uppercase tracking-widest " +
  "retro:border-[#0b0810] retro:bg-[#1b1712] retro:text-[#ffd23f] " +
  "vim:border-line vim:bg-transparent vim:text-accent " +
  "space:rounded-none space:border space:border-accent2/45 space:bg-transparent space:text-accent2 " +
  "space:before:content-['['] space:before:mr-1 space:before:opacity-50 " +
  "space:after:content-[']'] space:after:ml-1 space:after:opacity-50";

export function Chip({ label, colored = false }: { label: string; colored?: boolean; tone?: boolean }) {
  const variant = colored ? VARIANTS[CATEGORY_VARIANT[slugify(label)] ?? hashPick(label)] : "";
  return <span className={`${BASE} ${variant}`}>{label}</span>;
}

/** A horizontal wrap of chips. */
export function Chips({
  items,
  colored = false,
}: {
  items: string[];
  colored?: boolean;
  tone?: boolean;
}) {
  if (!items.length) return null;
  return (
    <span className="flex flex-wrap gap-1.5">
      {items.map((c) => (
        <Chip key={c} label={c} colored={colored} />
      ))}
    </span>
  );
}
