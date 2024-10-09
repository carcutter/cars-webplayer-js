import { resolve } from "path";

import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: resolve(__dirname, "./tsconfig.app.json"),
      rollupTypes: true,
      bundledPackages: ["@car-cutter/core", "@car-cutter/core-ui"],
    }),
  ],

  define: {
    "process.env": {
      NODE_ENV: "production",
    },
  },
  build: {
    lib: {
      name: "CarCutterCoreWC",
      fileName: "index",
      entry: resolve(__dirname, "./index.ts"),
    },
    target: browserslistToEsbuild(),

    rollupOptions: {
      external: ["@car-cutter/core", "@car-cutter/core-ui"],
      output: {
        globals: {
          "@car-cutter/core": "CarCutterCore",
          "@car-cutter/core-ui": "CarCutterCoreUI",
        },
      },
    },
  },
});
