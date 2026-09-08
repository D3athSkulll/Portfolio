import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { routes } from "../routes.config";
import { THEMES, useTheme } from "../theme";
import { useProfile } from "../api";
import { SideMenu, MobileMenu } from "./Menu";

const TICKER = [
  "SYSTEMS PROGRAMMER",
  "RUSTACEAN",
  "ZIG",
  "SAFETY CRITICAL SYSTEMS",
  "BACKEND",
  "CLOUD",
];

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="inline-flex items-stretch overflow-hidden border-2 retro:border-[#0b0810] retro:shadow-[4px_4px_0_#ff3b1f] vim:border-line font-mono text-[11px]">
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

  const idx = routes.findIndex(
    (r) => r.path === loc.pathname || (r.path !== "/" && loc.pathname.startsWith(r.path)),
  );
  const fileLabel =
    idx >= 0 ? routes[idx].file : loc.pathname === "/" ? "ABOUT_ME.TXT" : "404.ERR";
  const activeColor = idx >= 0 ? routes[idx].color : "#ff8a1e";

  useEffect(() => {
    const name = data?.profile.name ?? "Portfolio";
    const section = idx >= 0 && idx !== 0 ? routes[idx].label : null;
    document.title = section ? `${section} · ${name}` : name;
  }, [data?.profile.name, idx, loc.pathname]);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1180px] flex-col overflow-x-hidden px-3 py-4 sm:px-4">
      <div className="flex justify-center">
        <ThemeSwitch />
      </div>

      <header className="mt-3 overflow-hidden border-4 retro:border-accent retro:bg-[var(--banner-bg)] retro:p-5 vim:border-0 vim:bg-transparent vim:p-2 text-center">
        <p className="m-0 font-mono font-semibold tracking-[0.12em] text-[clamp(1rem,3.2vw,1.6rem)] retro:text-[#ffd23f] vim:text-fg">
          Hi, I am{" "}
          <span className="banner-sub font-bold text-accent2 retro:text-white vim:text-accent">
            {data?.profile.name ?? "Shivam Deolankar"}
          </span>
          , aka
        </p>
        <h1 className="wordmark m-0 mt-2 uppercase leading-[0.9] text-[clamp(2.3rem,9vw,5.25rem)] vim:text-[clamp(2rem,7vw,3.6rem)] tracking-[0.02em]">
          D3ATHSKULLL
        </h1>
      </header>

      <div className="my-2.5 overflow-hidden border-2 retro:border-accent2 vim:border-dashed vim:border-line bg-black py-1 font-mono text-s uppercase text-hud vim:hidden font-bold">
        <span className="marquee-track">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            TICKER.map((s, i) => (
              <span key={`${k}-${i}`} className="mx-6">
                {"⚡  " + s}
              </span>
            )),
          )}
        </span>
      </div>

      <div className="mt-3">
        <MobileMenu />
      </div>

      <div className="mt-3 flex items-start gap-4">
        <SideMenu />

        <main className="min-w-0 flex-1">
          <div
            style={{ ["--frame" as string]: activeColor }}
            className="scanlines overflow-hidden border-2 transition-[box-shadow] duration-300 retro:border-[3px] retro:border-[#0b0810] retro:shadow-[10px_10px_0_var(--frame)] vim:border vim:border-line vim:rounded"
          >
            <div className="flex items-center justify-between gap-2 border-b-2 retro:border-black bg-[var(--banner-bg)] px-2.5 py-1.5 font-mono text-[13px] uppercase tracking-wider text-[var(--banner-fg)] vim:border-line vim:bg-[#050707] vim:text-accent2">
              <span>
                {theme === "vim" ? "~/shivam/" : "C:\\USERS\\D3ATHSKULLL\\"}
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
        </main>
      </div>

      <div className="mt-auto pt-6">
        <div className="flex justify-between gap-3 border retro:border-2 retro:border-accent2 retro:bg-black retro:text-hud vim:border-line bg-panel2 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-muted">
          <span>
            UPTIME: <span className="text-accent retro:text-[#ffd23f]">99.9%</span> &nbsp;|&nbsp; USER:{" "}
            <span className="text-accent retro:text-[#ffd23f]">D3athSkulll.dev</span>{" "}
            &nbsp;|&nbsp; NET: <span className="text-accent retro:text-[#ffd23f]">CONNECTED</span>
          </span>
          <span>V1.0.4-STABLE</span>
        </div>

        <footer className="mt-2.5 text-center font-mono text-[13px] text-muted">
          © {new Date().getFullYear()} {data?.profile.name ?? ""} · {data?.meta.footerCredit ?? ""} ·
          No frames. No problem.
        </footer>
      </div>
    </div>
  );
}
