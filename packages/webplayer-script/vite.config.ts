import { resolve } from "path";

import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "process.env": {
      NODE_ENV: "production",
    },
  },
  build: {
    lib: {
      name: "script-webplayer",
      fileName: () => "bundle.js",
      entry: resolve(__dirname, "./index.ts"),
      formats: ["umd"],
    },

    chunkSizeWarningLimit: 300,
  },
});
