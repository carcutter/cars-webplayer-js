import { resolve } from "path";

import react from "@vitejs/plugin-react";
import preserveDirectives from "rollup-preserve-directives";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    preserveDirectives(), // Preverve "use client" directive
    dts({
      tsconfigPath: resolve(__dirname, "./tsconfig.app.json"),
      rollupTypes: true,
      bundledPackages: [
        "@car-cutter/core",
        "@car-cutter/core-ui",
        "@car-cutter/core-wc",
      ],
    }),
  ],

  define: {
    "process.env": {
      NODE_ENV: "production",
    },
  },

  build: {
    lib: {
      name: "next-webplayer",
      fileName: "index",
      entry: resolve(__dirname, "./index.ts"),
    },

    chunkSizeWarningLimit: 125,

    rollupOptions: {
      external: ["react", "react-dom", "next"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          next: "Next",
        },
      },
    },
  },
});
