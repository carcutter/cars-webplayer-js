import { fileURLToPath } from "node:url";

// Paths from this folder, whatever the working directory of the build: the
// player's styles all come from this build
export default {
  plugins: {
    tailwindcss: {
      config: fileURLToPath(new URL("tailwind.config.ts", import.meta.url)),
    },
    autoprefixer: {},
  },
};
