import type { Config } from "tailwindcss";
import type { PluginCreator } from "tailwindcss/types/config";

const noScrollbarPlugin: PluginCreator = ({ addUtilities }) =>
  addUtilities({
    ".no-scrollbar": {
      scrollbarWidth: "none", // Firefox
      "-ms-overflow-style": "none", // IE and Edge
      // Webkit (Chrome, Safari and Opera)
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
  });

const BREAKPOINT_SMALL_PORTRAIT = 768;
const BREAKPOINT_SMALL_LANDSCAPE = 1024;
const BREAKPOINT_LARGE = 1280;

const joinMediaQueries = (...queries: string[]) =>
  queries.map(query => `(${query})`).join(" or ");

const config: Config = {
  content: ["./src/*/**/*.{ts,tsx}"],
  theme: {
    fontSize: {
      xs: ["12px", { lineHeight: "16px" }],
      sm: ["14px", { lineHeight: "20px" }],
      base: ["16px", { lineHeight: "24px" }],
      lg: ["18px", { lineHeight: "28px" }],
      xl: ["20px", { lineHeight: "28px" }],
      "2xl": ["24px", { lineHeight: "32px" }],
      "3xl": ["30px", { lineHeight: "36px" }],
    },
    spacing: {
      px: "1px",
      0: "0",
      0.5: "2px",
      1: "4px",
      1.5: "6px",
      2: "8px",
      2.5: "10px",
      3: "12px",
      3.5: "14px",
      4: "16px",
      5: "20px",
      6: "24px",
      7: "28px",
      8: "32px",
      9: "36px",
      10: "40px",
      11: "44px",
      12: "48px",
      14: "56px",
      16: "64px",
      20: "80px",
      24: "96px",
      28: "112px",
      32: "128px",
      36: "144px",
      40: "160px",
      44: "176px",
      48: "192px",
      52: "208px",
      56: "224px",
      60: "240px",
      64: "256px",
      72: "288px",
      80: "320px",
      96: "384px",
    },
    screens: {
      "max-small": {
        raw: joinMediaQueries(
          `(orientation: portrait) and (max-width: ${BREAKPOINT_SMALL_PORTRAIT - 1}px)`,
          `(orientation: landscape) and (max-width: ${BREAKPOINT_SMALL_LANDSCAPE - 1}px)`
        ),
      },
      small: {
        raw: joinMediaQueries(
          `(orientation: portrait) and (min-width: ${BREAKPOINT_SMALL_PORTRAIT}px)`,
          `(orientation: landscape) and (min-width: ${BREAKPOINT_SMALL_LANDSCAPE}px)`
        ),
      },
      "max-large": {
        max: `${BREAKPOINT_LARGE - 1}px`,
      },
      large: `${BREAKPOINT_LARGE}px`,
    },
    colors: {
      transparent: "transparent",

      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
        light: "hsl(var(--primary-light))",
      },
      neutral: {
        DEFAULT: "hsl(var(--neutral))",
        foreground: "hsl(var(--neutral-foreground))",
      },
    },
    borderRadius: {
      none: "0",
      full: "9999px",

      "ui-sm": "calc(var(--radius-ui) - 2px)",
      ui: "var(--radius-ui)",
      "ui-md": "calc(var(--radius-ui) + 2px)",
      "ui-lg": "calc(var(--radius-ui) + 4px)",
      carrousel: "var(--radius-carrousel)",
      gallery: "var(--radius-gallery)",
    },

    extend: {
      transitionProperty: {
        radius: "border-radius",
      },
      transitionDuration: {
        details: "350ms",
      },
      zIndex: {
        1: "1",
        hotspot: "10",
        "hotspot-hover": "11",
        "zoomed-image": "20",
        overlay: "30",
      },
      // Animation
      keyframes: {
        pulse: {
          "from, to": { opacity: "0" },
          "50%": { opacity: "1" },
        },
        "hotspot-ping": {
          from: { transform: "scale(0)" },
          "25%": { opacity: "1" },
          "75%, to": { transform: "scale(1.5)", opacity: "0" },
        },
        rotation: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "hotspot-ping": "hotspot-ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;",
        rotation: "rotation 1s linear infinite;",
      },
    },
  },
  plugins: [noScrollbarPlugin],
} satisfies Config;

export default config;
