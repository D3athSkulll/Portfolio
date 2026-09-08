import { useEffect, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { routes } from "../routes.config";
import { THEMES, useTheme } from "../theme";
import { useProfile } from "../api";
import { SideMenu, MobileMenu } from "./Menu";

const TICKER = [
  "GET READY PLAYER ONE",
  "1 CREDIT = 1 PLAY",
  "INSERT COIN TO CONTINUE",
  "SELECT YOUR FIGHTER",
  "NEW HIGH SCORE",
  "BONUS STAGE",
  "SHIVAM.EXE RUNNING",
  "NO FRAMES  NO PROBLEM",
];

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="inline-flex items-stretch overflow-hidden border-2 retro:border-black retro:shadow-[0_5px_0_#000] vim:border-line font-mono text-[11px]">
      <span className="flex items-center bg-[var(--banner-bg)] px-2.5 tracking-widest text-[var(--banner-fg)] vim:bg-transparent vim:text-accent2">
        THEME
      </span>
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          aria-pressed={theme === t.id}
          className={`border-l-2 retro:border-black vim:border-line px-3.5 py-1.5 tracking-wider transition-colors ${
            theme === t.id
              ? "bg-accent font-bold text-black retro:text-white vim:text-[#0d0f16]"
              : "bg-panel2 text-fg retro:text-black/80 vim:bg-transparent vim:text-muted"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const { data } = useProfile();
  const loc = useLocation();
  const first = data?.profile.name.split(" ")[0] ?? "Shivam";

  const idx = routes.findIndex(
    (r) => r.path === loc.pathname || (r.path !== "/" && loc.pathname.startsWith(r.path)),
  );
  const fileLabel =
    idx >= 0 ? routes[idx].file : loc.pathname === "/" ? "ABOUT_ME.TXT" : "404.ERR";
  const prev = routes[(idx - 1 + routes.length) % routes.length];
  const next = routes[(idx + 1) % routes.length];

  useEffect(() => {
    const name = data?.profile.name ?? "Portfolio";
    const section = idx >= 0 && idx !== 0 ? routes[idx].label : null;
    document.title = section ? `${section} · ${name}` : name;
  }, [data?.profile.name, idx, loc.pathname]);

  const cta =
    "min-w-0 flex-1 border-2 retro:border-black retro:rounded-md retro:!text-black text-center font-mono font-bold uppercase tracking-wide text-[13px] sm:text-sm px-2 py-2.5 no-underline " +
    "retro:shadow-[0_6px_0_#000] vim:border-line vim:rounded vim:!text-accent";

  return (
    <div className="mx-auto max-w-[1180px] overflow-x-hidden px-3 py-4 sm:px-4">
      <div className="flex justify-center">
        <ThemeSwitch />
      </div>

      <header className="mt-3 overflow-hidden border-4 retro:border-accent retro:bg-[var(--banner-bg)] retro:p-4 vim:border-0 vim:bg-transparent vim:p-0 text-center vim:text-left">
        <p className="m-0 font-mono uppercase tracking-[0.14em] text-[clamp(0.95rem,3vw,1.5rem)] retro:text-[#ffd23f] vim:text-muted">
          Hi, I am{" "}
          <span className="banner-sub retro:text-white text-accent2">
            {data?.profile.name ?? "Shivam Deolankar"}
          </span>
          , aka
        </p>
        <h1 className="wordmark m-0 mt-1 leading-[0.9] text-[clamp(1.6rem,9vw,5.25rem)] vim:text-[clamp(1.5rem,6vw,3.2rem)] tracking-[0.02em]">
          D3athSkulll
        </h1>
        <p className="blink mt-1 font-mono text-hud vim:hidden">▶ PUSH START</p>
      </header>

      <div className="my-2.5 overflow-hidden border-2 retro:border-accent2 vim:border-dashed vim:border-line bg-black py-1 font-mono text-xs uppercase text-hud vim:hidden">
        <span className="marquee-track">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            TICKER.map((s, i) => (
              <span key={`${k}-${i}`} className="mx-6">
                {"<<  —=(( o ))=—  >>  " + s}
              </span>
            )),
          )}
        </span>
      </div>

      <div className="mt-3">
        <MobileMenu />
      </div>

      <div className="mt-3 flex items-start gap-4">
        <SideMenu>
          {data && (
            <div className="retro:block hidden">
              <div className="mt-3 border-2 border-black bg-[var(--banner-bg)] px-1.5 py-1 text-center font-mono text-sm tracking-widest text-[var(--banner-fg)]">
                [SYSTEM INFO]
              </div>
              <div className="mt-1 border-2 border-black bg-black p-1.5 text-left font-mono text-[11px] uppercase text-hud">
                user: {first.toLowerCase()}
                <br />
                role: {data.profile.role}
                <br />
                status: online · uptime 99.9%
              </div>
            </div>
          )}
        </SideMenu>

        <main className="min-w-0 flex-1">
          <div className="scanlines overflow-hidden border-2 retro:border-black retro:shadow-[3px_3px_0_#000,0_0_0_4px_#2b2620] vim:border vim:border-line vim:rounded">
            <div className="flex items-center justify-between gap-2 border-b-2 retro:border-black bg-[var(--banner-bg)] px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-[var(--banner-fg)] vim:border-line vim:bg-[#050707] vim:text-accent2">
              <span>
                {theme === "vim" ? "~/shivam/" : "C:\\USERS\\SHIVAM\\"}
                {fileLabel}
              </span>
              <span className="flex gap-1.5">
                <i className="inline-block size-2.5 border retro:border-black vim:rounded-full vim:border-muted" />
                <i className="inline-block size-2.5 border retro:border-black vim:rounded-full vim:border-muted" />
                <i className="inline-block size-2.5 border retro:border-black vim:rounded-full vim:border-muted" />
              </span>
            </div>
            <div className="max-w-full overflow-x-hidden break-words bg-panel px-4 py-5 text-fg sm:px-6">
              {children}
            </div>
          </div>

          <div className="mt-3 flex gap-2.5">
            <NavLink to={prev.path} className={`${cta} retro:bg-hud`}>
              ◀ {prev.label.toUpperCase()}
            </NavLink>
            <NavLink to={next.path} className={`${cta} retro:bg-accent2`}>
              {next.label.toUpperCase()} ▶
            </NavLink>
          </div>
        </main>
      </div>

      <footer className="mt-5 text-center font-mono text-xs text-muted">
        © {new Date().getFullYear()} {data?.profile.name ?? ""} · {data?.meta.footerCredit ?? ""} ·
        No frames. No problem.
      </footer>

      <div className="mx-auto mt-2.5 flex max-w-[1180px] justify-between gap-3 border retro:border-2 retro:border-black retro:bg-black retro:text-hud vim:border-line bg-panel2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted">
        <span>
          UPTIME: <span className="text-accent retro:text-[#ffd23f]">99.9%</span> &nbsp;|&nbsp; USER:{" "}
          <span className="text-accent retro:text-[#ffd23f]">{first.toLowerCase()}_dev</span>{" "}
          &nbsp;|&nbsp; NET: <span className="text-accent retro:text-[#ffd23f]">CONNECTED</span>
        </span>
        <span>V1.0.4-STABLE</span>
      </div>
    </div>
  );
}
