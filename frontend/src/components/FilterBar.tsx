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
    "font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 border-2 retro:border-black " +
    "vim:border vim:border-line vim:rounded cursor-pointer transition-colors";
  const on = "bg-accent text-black retro:text-black vim:text-[#0d0f16] font-bold";
  const off = "bg-transparent text-fg retro:text-black/80 hover:bg-panel2";
  return (
    <div className="mb-3 flex flex-wrap items-center gap-1.5">
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
