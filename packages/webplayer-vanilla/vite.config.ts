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
      name: "vanilla-webplayer",
      fileName: "index",
      entry: resolve(__dirname, "./index.ts"),
    },
  },
});
