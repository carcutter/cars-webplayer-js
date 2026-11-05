import { resolve } from "path";

import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vite";

import { version } from "./package.json";

// The <script> bundle published on the CDN. It bundles its own React (preact)
// through @car-cutter/wc-webplayer.
export default defineConfig({
  define: {
    "process.env": {
      NODE_ENV: "production",
    },
  },
  build: {
    lib: {
      name: "CarCutterWebplayerScript",
      fileName: () => `bundle-${version}.js`,
      entry: resolve(import.meta.dirname, "index.ts"),
      formats: ["umd"],
    },
    target: browserslistToEsbuild(),
    rolldownOptions: {
      // "use strict" in the bundle, as Rollup did
      output: { strict: true },
    },
    // Only the bundle of the current version stays in dist
    emptyOutDir: true,

    chunkSizeWarningLimit: 250,
  },
});
