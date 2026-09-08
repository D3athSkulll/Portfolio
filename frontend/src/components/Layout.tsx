import { useEffect, useMemo, useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { routes } from "../routes.config";
import { THEMES, useTheme } from "../theme";
import { useProfile } from "../api";

const STATUS = [
  "INSERT COIN",
  "PLAYER 1 READY",
  "HI-SCORE 013377",
  "NO FRAMES. NO PROBLEM.",
  "FINISH HIM",
  "CONTINUE? 9 8 7...",
];

function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${d} DAYS ${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function VisitorCounter({ seed }: { seed: number }) {
  const count = useMemo(() => {
    try {
      const v = Number(localStorage.getItem("visits") ?? "0") + 1;
      localStorage.setItem("visits", String(v));
      return seed + v;
    } catch {
      return seed;
    }
  }, [seed]);
  return (
    <div className="counter" aria-label="visitor count">
      {String(count).padStart(7, "0")}
    </div>
  );
}

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="theme-switch" role="group" aria-label="theme">
      <span className="theme-switch-label">THEME</span>
      {THEMES.map((t) => (
        <button
          key={t.id}
          className={theme === t.id ? "on" : ""}
          aria-pressed={theme === t.id}
          onClick={() => setTheme(t.id)}
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
  const meta = data?.meta;
  const countdown = useCountdown(meta?.y2kCountdownTarget ?? "2028-04-30");
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

  return (
    <div className="shell">
      <div className="topbar">
        <ThemeSwitch />
      </div>

      <header className="banner">
        <p className="banner-hi">
          Hi, I am <span className="banner-sub">{data?.profile.name ?? "Shivam Deolankar"}</span>, aka
        </p>
        <h1>D3athSkulll</h1>
        <p className="blink" style={{ marginTop: 4, color: "var(--hud)" }}>
          {"\u25b6"} PUSH START
        </p>
      </header>

      <div className="marquee" style={{ margin: "10px 0" }}>
        <span className="marquee-track">
          {Array.from({ length: 3 })
            .flatMap(() => STATUS)
            .map((s, i) => (
              <span key={i}>{"  <<  —=(( o ))=—  >>  " + s + "  "}</span>
            ))}
        </span>
      </div>

      <div className="cta-bar" style={{ marginBottom: 12 }}>
        <NavLink className="cta prev" to={prev.path}>
          ◀ {prev.label.toUpperCase()}
        </NavLink>
        <NavLink className="cta next" to={next.path}>
          {next.label.toUpperCase()} ▶
        </NavLink>
      </div>

      <div className="layout">
        <aside className="menu">
          <div className="menu-title">{theme === "vim" ? "~/NAVIGATION" : "★ MENU ★"}</div>
          {routes.map((r) => (
            <NavLink
              key={r.path}
              to={r.path}
              end={r.path === "/"}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {theme === "vim" ? r.file : `> ${r.label}`}
            </NavLink>
          ))}

          {meta && (
            <div className="retro-only">
              <div className="menu-title" style={{ marginTop: 12 }}>
                [SYSTEM INFO]
              </div>
              <div className="badge" style={{ textAlign: "left" }}>
                user: {first.toLowerCase()}
                <br />
                role: {data?.profile.role}
                <br />
                status: ONLINE &nbsp; uptime: 99.9%
              </div>
              <VisitorCounter seed={meta.visitorCountSeed} />
              <div className="badge">▓ UNDER CONSTRUCTION ▓</div>
              <button
                className="badge"
                style={{ width: "100%", cursor: "pointer" }}
                onClick={() => alert("i told you not to click here.")}
              >
                !! DON'T CLICK HERE !!
              </button>
              <div className="badge">✉ YOU'VE GOT MAIL</div>
              <div className="countdown" style={{ marginTop: 8 }}>
                *** COUNTDOWN ***
                <br />
                {countdown}
                <br />
                <small>until convocation</small>
              </div>
            </div>
          )}
        </aside>

        <main className="content">
          <div className="win">
            <div className="win-titlebar">
              <span>
                {theme === "vim" ? "~/shivam/" : "C:\\USERS\\SHIVAM\\"}
                {fileLabel}
              </span>
              <span className="win-dots">
                <i />
                <i />
                <i />
              </span>
            </div>
            <div className="win-body">{children}</div>
          </div>

          <div className="cta-bar" style={{ marginTop: 12 }}>
            <NavLink className="cta prev" to={prev.path}>
              ◀ {prev.label.toUpperCase()}
            </NavLink>
            <NavLink className="cta next" to={next.path}>
              {next.label.toUpperCase()} ▶
            </NavLink>
          </div>
        </main>
      </div>

      <footer className="site-footer">
        © {new Date().getFullYear()} {data?.profile.name ?? ""} · {meta?.footerCredit ?? ""} · No
        frames. No problem.
      </footer>

      <div className="statusbar">
        <span>
          UPTIME: <span className="lit">99.9%</span> &nbsp;|&nbsp; USER:{" "}
          <span className="lit">{first.toLowerCase()}_dev</span> &nbsp;|&nbsp; NET:{" "}
          <span className="lit">CONNECTED</span>
        </span>
        <span>V1.0.4-STABLE</span>
      </div>
    </div>
  );
}
