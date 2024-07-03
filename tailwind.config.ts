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
        neutral: "hsl(var(--neutral))",
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "16/9": "16 / 9",
      },
      borderRadius: {
        sm: "calc(var(--radius) - 2px)",
        DEFAULT: "var(--radius)",
        md: "calc(var(--radius) + 2px)",
        lg: "calc(var(--radius) + 4px)",
      },
      // Animation
      keyframes: {
        "hotspot-ping": {
          from: { opacity: "0.6" },
          "75%, to": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        "hotspot-ping": "hotspot-ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;",
      },
    },
  },
  plugins: [noScrollbarPlugin],
} satisfies Config;

export default config;
