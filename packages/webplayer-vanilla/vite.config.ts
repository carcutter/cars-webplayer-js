import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],

  define: {
    "process.env": {
      NODE_ENV: "production",
    },
  },
  build: {
    lib: {
      name: "vanilla-webplayer",
      fileName: "index",
      entry: resolve(__dirname, "./index.ts"),
    },
  },
});
