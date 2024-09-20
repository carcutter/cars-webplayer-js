import { resolve } from "path";

import react from "@vitejs/plugin-react";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    dts({
      tsconfigPath: resolve(__dirname, "./tsconfig.app.json"),
      rollupTypes: true,
      bundledPackages: ["@car-cutter/core"],
    }),
  ],

  // BUILD
  define: {
    "process.env": {
      NODE_ENV: mode,
    },
  },
  // FUTURE: Find a way to build in watch mode. The simple script "watch": "vite build --watch" does not work because it does not rebuild the TS.
  build: {
    lib: {
      name: "core-ui",
      fileName: "index",
      entry: resolve(__dirname, "./index.ts"),
    },
    target: browserslistToEsbuild(),

    copyPublicDir: false, // The only public file is mock data

    rollupOptions: {
      external: ["@car-cutter/core", "react"],
      output: {
        globals: {
          "@car-cutter/core": "CarCutterCore",
          react: "React",
        },
      },
    },
  },
}));
