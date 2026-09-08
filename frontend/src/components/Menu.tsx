import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu as MenuIcon, X } from "lucide-react";
import { routes } from "../routes.config";
import { useTheme } from "../theme";

function Links({ onNavigate }: { onNavigate?: () => void }) {
  const { theme } = useTheme();
  const item =
    "block px-3 py-2 no-underline font-mono text-[15px] sm:text-base tracking-wide transition-colors " +
    "retro:border-2 retro:border-[#0b0810] retro:bg-panel2 retro:text-black retro:mt-1.5 retro:text-center retro:uppercase retro:font-bold " +
    "retro:[clip-path:polygon(0_0,82%_0,100%_14%,100%_100%,0_100%)] retro:hover:!bg-[var(--mc)] retro:hover:!text-white " +
    "vim:mt-1.5 vim:border vim:border-line vim:rounded vim:text-fg vim:hover:!border-accent vim:hover:!text-accent";
  const active =
    "retro:!bg-[var(--mc)] retro:!text-white vim:!bg-accent vim:!text-[#0d0f16] vim:!border-accent vim:font-bold";
  return (
    <nav>
      {routes.map((r) => (
        <NavLink
          key={r.path}
          to={r.path}
          end={r.path === "/"}
          onClick={onNavigate}
          style={{ ["--mc" as string]: r.color }}
          className={({ isActive }) => `${item} ${isActive ? active : ""}`}
        >
          {theme === "vim" ? r.file : `> ${r.label}`}
        </NavLink>
      ))}
    </nav>
  );
}

export function SideMenu({ children }: { children?: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <aside className="hidden w-52 shrink-0 lg:block">
      <div className="mb-2 border-2 retro:border-accent2 retro:bg-[var(--banner-bg)] retro:text-[var(--banner-fg)] retro:text-center retro:shadow-[4px_4px_0_#ff3b1f] vim:border-0 vim:text-accent2 px-1.5 py-1.5 font-mono text-base tracking-widest">
        {theme === "vim" ? "~/NAVIGATION" : "★ MENU ★"}
      </div>
      <Links />
      {children}
    </aside>
  );
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="menu"
        className="flex items-center gap-2 border-2 retro:border-accent2 retro:text-[#ffd23f] retro:shadow-[4px_4px_0_#ff3b1f] vim:border-line vim:rounded px-3 py-2 font-mono text-sm uppercase tracking-wider"
      >
        {open ? <X size={15} /> : <MenuIcon size={15} />}
        MENU
      </button>
      {open && (
        <div className="mt-2 border-2 retro:border-black vim:border vim:border-line vim:rounded bg-panel2 p-2">
          <Links onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
