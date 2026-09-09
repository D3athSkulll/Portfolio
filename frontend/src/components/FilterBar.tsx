/** A row of toggle-filter buttons. Pass `null` for the active value to mean "all". */
export function FilterBar({
  options,
  value,
  onChange,
  allLabel = "all",
}: {
  options: string[];
  value: string | null;
  onChange: (v: string | null) => void;
  allLabel?: string;
}) {
  const btn =
    "inline-flex items-center font-mono text-[13px] sm:text-sm uppercase tracking-wider px-3 py-1.5 border-2 retro:border-[#0b0810] " +
    "vim:border vim:border-line vim:rounded space-chamfer space:border space:border-accent2/40 cursor-pointer transition-colors";
  const on = "bg-accent text-black retro:text-black vim:text-[#0d0f16] font-bold";
  const off =
    "bg-transparent text-fg retro:text-black hover:bg-accent hover:text-black vim:hover:text-accent vim:hover:border-accent";
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <button className={`${btn} ${value === null ? on : off}`} onClick={() => onChange(null)}>
        {allLabel}
      </button>
      {options.map((o) => (
        <button
          key={o}
          className={`${btn} ${value === o ? on : off}`}
          onClick={() => onChange(o === value ? null : o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
