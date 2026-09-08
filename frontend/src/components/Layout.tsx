import { useEffect, useMemo, useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { routes } from "../routes.config";
import { useTheme } from "../theme";
import { useProfile } from "../api";

const ERAS = ["1986", "1996", "2006", "2016", "2026", "2036", "2046"];
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
      const k = "visits";
      const v = Number(localStorage.getItem(k) ?? "0") + 1;
      localStorage.setItem(k, String(v));
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

export default function Layout({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme();
  const { data } = useProfile();
  const loc = useLocation();
  const meta = data?.meta;
  const countdown = useCountdown(meta?.y2kCountdownTarget ?? "2028-04-30");

  const idx = routes.findIndex(
    (r) => r.path === loc.pathname || (r.path !== "/" && loc.pathname.startsWith(r.path)),
  );
  const fileLabel =
    idx >= 0 ? routes[idx].file : loc.pathname === "/" ? "ABOUT_ME.TXT" : "404.ERR";
  const prev = routes[(idx - 1 + routes.length) % routes.length];
  const next = routes[(idx + 1) % routes.length];

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px" }}>
      {/* era tab row = arcade STAGE SELECT (decorative, non-breaking) */}
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: 2,
            opacity: 0.7,
          }}
        >
          — STAGE SELECT —
        </span>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginTop: 4 }}>
          {ERAS.map((e) => (
            <span key={e} className="chip" style={{ opacity: e === "1996" ? 1 : 0.4 }}>
              {e}
            </span>
          ))}
        </div>
      </div>

      <header className="banner" style={{ marginTop: 10 }}>
        <h1>{meta?.siteTitle ?? "LOADING..."}</h1>
        <p>{meta?.tagline ?? "\u00a0"}</p>
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
        <button className="theme-toggle" onClick={toggle}>
          THEME: {theme === "retro" ? "RETRO ▓" : "DOCS ░"}
        </button>
        <NavLink className="cta next" to={next.path}>
          {next.label.toUpperCase()} ▶
        </NavLink>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <aside style={{ width: 210, flexShrink: 0 }} className="menu">
          <div className="menu-title">★ MENU ★</div>
          {routes.map((r) => (
            <NavLink
              key={r.path}
              to={r.path}
              end={r.path === "/"}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {theme === "docs" ? r.file : `> ${r.label}`}
            </NavLink>
          ))}

          {meta && (
            <>
              <div className="menu-title" style={{ marginTop: 12 }}>
                [SYSTEM INFO]
              </div>
              <div className="badge" style={{ textAlign: "left" }}>
                user: {data?.profile.name.split(" ")[0].toLowerCase()}
                <br />
                role: {data?.profile.role}
                <br />
                status: ONLINE
                <br />
                uptime: 99.9%
              </div>
              <div className="retro-only">
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
            </>
          )}
        </aside>

        <main style={{ flex: 1, minWidth: 280 }}>
          <div className="win">
            <div className="win-titlebar">
              <span>
                C:\USERS\SHIVAM\{fileLabel}
              </span>
              <span className="win-dots">
                <i />
                <i />
                <i />
              </span>
            </div>
            <div style={{ padding: "16px 18px" }}>{children}</div>
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

      <footer
        style={{
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          marginTop: 18,
          opacity: 0.8,
        }}
      >
        © {new Date().getFullYear()} {data?.profile.name ?? ""} · {meta?.footerCredit ?? ""} · No
        frames. No problem.
      </footer>
    </div>
  );
}
