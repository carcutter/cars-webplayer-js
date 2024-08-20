import { resolve } from "path";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  define: {
    "process.env": {
      NODE_ENV: "production",
    },
  },
  build: {
    lib: {
      name: "vue-webplayer",
      fileName: "index",
      entry: resolve(__dirname, "./index.ts"),
    },
  },
});
