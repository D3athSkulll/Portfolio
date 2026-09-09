import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type Theme = "retro" | "vim" | "space";

export const THEMES: { id: Theme; label: string }[] = [
  { id: "vim", label: "VIM" },
  { id: "retro", label: "RETRO" },
  { id: "space", label: "SPACE" },
];

const ORDER: Theme[] = THEMES.map((t) => t.id);
const isTheme = (t: unknown): t is Theme => ORDER.includes(t as Theme);

const ThemeCtx = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
  switching: boolean;
}>({ theme: "vim", setTheme: () => {}, toggle: () => {}, switching: false });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const t = document.documentElement.dataset.theme;
    return isTheme(t) ? t : "vim";
  });
  const [switching, setSwitching] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* private mode */
    }
  }, [theme]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  /** Switch themes behind a brief common loader so the repaint isn't jarring. */
  const setTheme = (next: Theme) => {
    if (next === theme || switching) return;
    setSwitching(true);
    timers.current.push(
      window.setTimeout(() => setThemeState(next), 260),
      window.setTimeout(() => setSwitching(false), 720),
    );
  };

  return (
    <ThemeCtx.Provider
      value={{
        theme,
        setTheme,
        toggle: () => setTheme(ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]),
        switching,
      }}
    >
      {children}
      {switching && (
        <div className="theme-switching" role="status" aria-label="switching theme">
          <div className="theme-switching__bar" aria-hidden />
          <span className="theme-switching__label">SWITCHING&nbsp;THEME…</span>
        </div>
      )}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
