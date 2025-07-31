import { create } from "zustand";
import { THEMES } from "../constants";

const VALID_THEMES = THEMES.map((t) => t.name);
const DEFAULT_THEME = "forest";

export const useThemeStore = create((set) => {
  // initialize from localStorage or fallback
  const initial = (() => {
    const saved = localStorage.getItem("preferred-theme");
    if (saved && VALID_THEMES.includes(saved)) {
      document.documentElement.setAttribute("data-theme", saved);
      return saved;
    }
    document.documentElement.setAttribute("data-theme", DEFAULT_THEME);
    return DEFAULT_THEME;
  })();

  return {
    theme: initial,
    available: VALID_THEMES,

    setTheme: (theme) => {
      if (!VALID_THEMES.includes(theme)) return;
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("preferred-theme", theme);
      set({ theme });
    },
  };
});
