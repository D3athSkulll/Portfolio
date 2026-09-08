import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu as MenuIcon, X } from "lucide-react";
import { routes } from "../routes.config";
import { useTheme } from "../theme";

function Links({ onNavigate }: { onNavigate?: () => void }) {
  const { theme } = useTheme();
  const item =
    "block px-3 py-1.5 no-underline font-mono text-[13px] tracking-wide transition-colors " +
    "retro:border-2 retro:border-black retro:bg-panel2 retro:text-black retro:mt-1 retro:text-center retro:uppercase retro:font-bold " +
    "retro:[clip-path:polygon(0_0,82%_0,100%_14%,100%_100%,0_100%)] " +
    "vim:mt-1.5 vim:border vim:border-line vim:rounded vim:text-fg";
  const active =
    "retro:!bg-accent2 retro:!text-black vim:!bg-accent vim:!text-[#0d0f16] vim:!border-accent vim:font-bold";
  return (
    <nav>
      {routes.map((r) => (
        <NavLink
          key={r.path}
          to={r.path}
          end={r.path === "/"}
          onClick={onNavigate}
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
      <div className="mb-1.5 border-2 retro:border-black retro:bg-[var(--banner-bg)] retro:text-[var(--banner-fg)] retro:text-center vim:border-0 vim:text-accent2 px-1.5 py-1 font-mono text-sm tracking-widest">
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
        className="flex items-center gap-2 border-2 retro:border-black vim:border-line vim:rounded px-3 py-1.5 font-mono text-xs uppercase tracking-wider"
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
