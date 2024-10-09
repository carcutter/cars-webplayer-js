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
      name: "CarCutterWebplayerScriptReactLTS",
      fileName: () => `bundle-react-18@${version}.js`,
      entry: resolve(__dirname, "./index.ts"),
      formats: ["umd"],
    },
    target: browserslistToEsbuild(),

    chunkSizeWarningLimit: 125,

    rollupOptions: {
      external: ["react", "react-dom/client"],
      output: {
        globals: {
          react: "React",
          "react-dom/client": "ReactDOM",
        },
      },
    },
  },
});
