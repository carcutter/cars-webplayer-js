import { resolve } from "path";

import react from "@vitejs/plugin-react";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
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
      name: "core-wc",
      fileName: "index",
      entry: resolve(__dirname, "./index.ts"),
    },
    target: browserslistToEsbuild(),

    rollupOptions: {
      external: [
        "@car-cutter/core",
        "@car-cutter/core-ui",
        "@car-cutter/core-ui/dist/style.css?inline",
        "react",
        "react-dom/client",
      ],
      output: {
        globals: {
          "@car-cutter/core": "CarCutterCore",
          "@car-cutter/core-ui": "CarCutterCoreUI",
          "@car-cutter/core-ui/dist/style.css?inline": "CarCutterCoreUIStyle",
          react: "React",
          "react-dom/client": "ReactDOMClient",
        },
      },
    },
  },
});
