import { resolve } from "path";

import preact from "@preact/preset-vite";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    preact(),
    dts({
      tsconfigPath: resolve(__dirname, "./tsconfig.app.json"),
      // rollupTypes: true,
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
      name: "CarCutterWebplayerWC",
      fileName: "index",
      entry: resolve(__dirname, "./index.ts"),
    },
    target: browserslistToEsbuild(),

    chunkSizeWarningLimit: 350,
  },
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
    },
  },
});
