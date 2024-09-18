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

      "ui-sm": "calc(var(--radius-ui) - 0.125rem)",
      ui: "var(--radius-ui)",
      "ui-md": "calc(var(--radius-ui) + 0.125rem)",
      "ui-lg": "calc(var(--radius-ui) + 0.25rem)",
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
