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
      name: "CarCutterWebplayerNext",
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        legacy: resolve(__dirname, "src/legacy/index.ts"),
      },
    },
    target: browserslistToEsbuild(),

    chunkSizeWarningLimit: 15,

    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",

        "next",
        "next/dynamic",

        "@car-cutter/react-webplayer",
        "@car-cutter/react-webplayer/legacy",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-dom/client": "ReactDOM",
          "react/jsx-runtime": "jsx",

          next: "Next",
          "next/dynamic": "NextDynamic",

          "@car-cutter/react-webplayer": "CarCutterWebplayerReact",
          "@car-cutter/react-webplayer/legacy": "CarCutterWebplayerReact",
        },
      },
    },
  },
});
