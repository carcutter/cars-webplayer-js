import { resolve } from "path";

import react from "@vitejs/plugin-react";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// The player's CSS, inlined by this build
import { CSS_TARGET } from "../core-ui/css-target";

export default defineConfig({
  plugins: [
    react(),
    dts({
      // Resolves the private workspace packages it uses (not dependencies of
      // the published package) to their built declarations, which are rolled
      // up into its own .d.ts
      tsconfigPath: resolve(import.meta.dirname, "./tsconfig.dts.json"),
      bundleTypes: {
        bundledPackages: ["@car-cutter/core", "@car-cutter/analytics"],
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
      name: "CarCutterWebplayerReact",
      entry: {
        index: resolve(import.meta.dirname, "index.ts"),
        legacy: resolve(import.meta.dirname, "src/legacy.ts"),
      },
    },
    target: browserslistToEsbuild(),
    cssTarget: CSS_TARGET,

    chunkSizeWarningLimit: 125,

    rolldownOptions: {
      external: ["react", "react-dom", "react-dom/client", "react/jsx-runtime"],
      output: {
        // "use strict" in the CommonJS / UMD files too, as Rollup did
        strict: true,
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-dom/client": "ReactDOM",
          "react/jsx-runtime": "jsx",
        },
      },
    },
  },
});
