import type { Config } from "tailwindcss";

const config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    colors: {
      current: "currentColor",
      transparent: "transparent",

      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground, var(--background)))",
        contrast: "hsl(var(--primary-foreground, var(--primary)))",
      },

      border: "hsl(var(--border))",
    },

    extend: {
      borderRadius: {
        ui: "var(--ui-radius)",
        "ui-sm": "calc(var(--ui-radius) - 2px)",
        "ui-md": "calc(var(--ui-radius) + 2px)",
        "ui-lg": "calc(var(--ui-radius) + 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
