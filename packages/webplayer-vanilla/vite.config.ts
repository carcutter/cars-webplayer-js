import { resolve } from "path";

import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
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
      name: "CarCutterWebplayerVanilla",
      fileName: "index",
      entry: resolve(import.meta.dirname, "./index.ts"),
    },
    target: browserslistToEsbuild(),

    chunkSizeWarningLimit: 5,

    rolldownOptions: {
      external: ["@car-cutter/wc-webplayer"],
      output: {
        // "use strict" in the CommonJS / UMD files too, as Rollup did
        strict: true,
        globals: {
          "@car-cutter/wc-webplayer": "CarCutterWebplayerWC",
        },
      },
    },
  },
});
