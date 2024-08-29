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

const config = {
  content: ["./src/*/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        neutral: "hsl(var(--neutral))",
        "neutral-foreground": "hsl(var(--neutral-foreground))",
      },
      borderRadius: {
        "ui-sm": "calc(var(--radius-ui) - 2px)",
        ui: "var(--radius-ui)",
        "ui-md": "calc(var(--radius-ui) + 2px)",
        "ui-lg": "calc(var(--radius-ui) + 4px)",
        carrousel: "var(--radius-carrousel)",
        gallery: "var(--radius-gallery)",
      },
      transitionDuration: {
        details: "350ms",
      },
      zIndex: {
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
