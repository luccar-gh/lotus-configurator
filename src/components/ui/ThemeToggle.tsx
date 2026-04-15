"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-[6px] px-2x py-[6px] border text-[10px] font-mono tracking-technical uppercase transition-colors border-border hover:border-silicon dark:border-[#333] dark:hover:border-orange dark:text-[#999]"
      title={theme === "light" ? "Switch to bench mode" : "Switch to light mode"}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="0.8">
        {theme === "light" ? (
          /* Moon icon for switching to dark */
          <path d="M10 6.5a4.5 4.5 0 11-5-4.5 3.5 3.5 0 005 4.5z" />
        ) : (
          /* Sun icon for switching to light */
          <>
            <circle cx="6" cy="6" r="2" />
            <path d="M6 1v1.5M6 9.5V11M1 6h1.5M9.5 6H11M2.5 2.5l1 1M8.5 8.5l1 1M9.5 2.5l-1 1M3.5 8.5l-1 1" />
          </>
        )}
      </svg>
      {theme === "light" ? "BENCH" : "LIGHT"}
    </button>
  );
}
