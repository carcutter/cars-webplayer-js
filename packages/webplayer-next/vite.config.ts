import { resolve } from "path";

import react from "@vitejs/plugin-react";
import browserslistToEsbuild from "browserslist-to-esbuild";
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
      bundledPackages: ["@car-cutter/core"],
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
    target: browserslistToEsbuild(),

    chunkSizeWarningLimit: 15,

    rollupOptions: {
      external: [
        "react",
        "react-dom/client",
        "next",
        "@car-cutter/react-webplayer",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom/client": "ReactDOMClient",
          next: "Next",
          "@car-cutter/react-webplayer": "ReactWebPlayer",
        },
      },
    },
  },
});
