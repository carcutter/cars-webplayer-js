import { resolve } from "path";

import { defineConfig } from "vite";

import { version } from "./package.json";

export default defineConfig({
  define: {
    "process.env": {
      NODE_ENV: "production",
    },
  },
  build: {
    lib: {
      name: "script-webplayer",
      fileName: () => `bundle-${version}.js`,
      entry: resolve(__dirname, "./index.ts"),
      formats: ["umd"],
    },

    chunkSizeWarningLimit: 300,
  },
});
