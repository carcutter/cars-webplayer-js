import { resolve } from "path";

import react from "@vitejs/plugin-react";
import browserslistToEsbuild from "browserslist-to-esbuild";
import preserveDirectives from "rollup-preserve-directives";
import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";

/**
 * Fails the build if an entry doesn't start with "use client": the components
 * are imported by server components, and rollup-preserve-directives isn't
 * made for Rolldown (which drops the directive without it)
 */
const requireUseClient = (): Plugin => ({
  name: "require-use-client",
  generateBundle(_, bundle) {
    for (const output of Object.values(bundle)) {
      if (
        output.type === "chunk" &&
        output.isEntry &&
        !/^["']use client["']/.test(output.code)
      ) {
        this.error(`${output.fileName} doesn't start with "use client"`);
      }
    }
  },
});

export default defineConfig({
  plugins: [
    react(),
    preserveDirectives(), // Preverve "use client" directive
    requireUseClient(),
    dts({
      // Resolves the private workspace packages it uses (not dependencies of
      // the published package) to their built declarations, which are rolled
      // up into its own .d.ts
      tsconfigPath: resolve(import.meta.dirname, "./tsconfig.dts.json"),
      bundleTypes: { bundledPackages: ["@car-cutter/core"] },
      // Keeps the package names in the declarations, for bundledPackages
      pathsToAliases: false,
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
        index: resolve(import.meta.dirname, "src/index.ts"),
        legacy: resolve(import.meta.dirname, "src/legacy/index.ts"),
      },
    },
    target: browserslistToEsbuild(),

    chunkSizeWarningLimit: 5,

    rolldownOptions: {
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
        // "use strict" in the CommonJS / UMD files too, as Rollup did
        strict: true,
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
