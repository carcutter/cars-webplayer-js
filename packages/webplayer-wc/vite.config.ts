import { resolve } from "path";

import preact from "@preact/preset-vite";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// The player's CSS, inlined by this build
import { CSS_TARGET } from "../core-ui/css-target";

export default defineConfig({
  plugins: [
    preact(),
    dts({
      // Resolves the private workspace packages it uses (not dependencies of
      // the published package) to their built declarations, which are rolled
      // up into its own .d.ts
      tsconfigPath: resolve(import.meta.dirname, "./tsconfig.dts.json"),
      bundleTypes: {
        bundledPackages: [
          "@car-cutter/core",
          "@car-cutter/core-wc",
          "@car-cutter/core-wc-react-18",
          "@car-cutter/analytics",
        ],
      },
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
      name: "CarCutterWebplayerWC",
      fileName: "index",
      entry: resolve(import.meta.dirname, "./index.ts"),
    },
    target: browserslistToEsbuild(),
    cssTarget: CSS_TARGET,
    rolldownOptions: {
      // "use strict" in the UMD file too, as Rollup did
      output: { strict: true },
    },

    chunkSizeWarningLimit: 350,
  },
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
    },
    // The workspace packages it bundles don't depend on preact:
    // resolves it (and the aliases above) from this package
    dedupe: ["preact"],
  },
});
