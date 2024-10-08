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
      name: "CarCutterWebplayerReact",
      fileName: "index",
      entry: resolve(__dirname, "./index.ts"),
    },
    target: browserslistToEsbuild(),

    chunkSizeWarningLimit: 125,

    rollupOptions: {
      external: ["react", "react-dom/client", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom/client": "ReactDOM",
          "react/jsx-runtime": "jsx",
        },
      },
    },
  },
});
