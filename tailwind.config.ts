import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    /* ── LUCERO STANDARD DESIGN TOKENS ── */
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "var(--bg-white)",
      linen: "var(--ui-linen)",
      silicon: "var(--silicon-grey)",
      orange: "var(--signal-orange)",
      green: "var(--data-green)",
      border: "var(--border-thin)",
      black: "#000000",
      /* Static colors for elements that should NOT change with theme */
      "static-white": "#FFFFFF",
      "static-dark": "#2D2D2D",
    },
    fontFamily: {
      sans: [
        "Helvetica Neue",
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "sans-serif",
      ],
      mono: ["JetBrains Mono", "ui-monospace", "monospace"],
    },
    borderRadius: {
      none: "0",
      DEFAULT: "0",
    },
    boxShadow: {
      none: "none",
      DEFAULT: "none",
    },
    borderWidth: {
      DEFAULT: "0.5px",
      0: "0",
      "0.5": "0.5px",
      1: "1px",
      2: "2px",
    },
    letterSpacing: {
      normal: "0",
      technical: "0.15em",
    },
    extend: {
      /* 8px baseline grid */
      spacing: {
        "1x": "8px",
        "2x": "16px",
        "3x": "24px",
        "4x": "32px",
        "5x": "40px",
        "6x": "48px",
        "8x": "64px",
        "10x": "80px",
        "12x": "96px",
        "16x": "128px",
      },
      gridTemplateColumns: {
        swiss: "repeat(12, minmax(0, 1fr))",
      },
      fontSize: {
        label: ["10px", { lineHeight: "16px", letterSpacing: "0.15em" }],
        data: ["24px", { lineHeight: "32px" }],
        "data-lg": ["32px", { lineHeight: "40px" }],
      },
    },
  },
  plugins: [],
};
export default config;
