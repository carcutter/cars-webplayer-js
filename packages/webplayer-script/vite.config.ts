import { resolve } from "path";

import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vite";

import { version } from "./package.json";

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
      entry: resolve(__dirname, "./index.ts"),
      formats: ["umd"],
    },
    target: browserslistToEsbuild(),

    chunkSizeWarningLimit: 250,
  },
});
