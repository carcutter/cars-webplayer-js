import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: resolve(__dirname, "./tsconfig.app.json"),
      rollupTypes: true,
      bundledPackages: ["@car-cutter/core-wc"],
    }),
  ],

  define: {
    "process.env": {
      NODE_ENV: "production",
    },
  },
  // FUTURE: Find a way to build in watch mode. The simple script "watch": "vite build --watch" does not work because it does not rebuild the TS.
  build: {
    lib: {
      name: "react-webplayer",
      fileName: "index",
      entry: resolve(__dirname, "./index.ts"),
    },

    chunkSizeWarningLimit: 120,

    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
