import path from "path";

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
      name: "wc-webplayer",
      fileName: "index",
      entry: path.resolve(__dirname, "./index.ts"),
    },
  },
});
