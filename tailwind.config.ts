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
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: "hsl(var(--primary))",
      neutral: "hsl(var(--neutral))",
    },
    extend: {
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
    },
  },
  plugins: [noScrollbarPlugin],
} satisfies Config;

export default config;
