import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "retro" | "vim";

export const THEMES: { id: Theme; label: string }[] = [
  { id: "retro", label: "ARCADE" },
  { id: "vim", label: "VIM" },
];

const ThemeCtx = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}>({ theme: "retro", setTheme: () => {}, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const t = document.documentElement.dataset.theme;
    return t === "vim" || t === "retro" ? t : "retro";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* private mode */
    }
  }, [theme]);

  return (
    <ThemeCtx.Provider
      value={{
        theme,
        setTheme,
        toggle: () => setTheme((t) => (t === "retro" ? "vim" : "retro")),
      }}
    >
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
