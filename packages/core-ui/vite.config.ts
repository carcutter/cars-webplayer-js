import preact from "@preact/preset-vite";
import react from "@vitejs/plugin-react";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vite";

import extractcss from "@car-cutter/export-css-plugin";

export default defineConfig(({ mode }) => {
  const isPreactDev = mode === "development-preact";

  return {
    plugins: [isPreactDev ? preact() : react(), extractcss()],

    define: {
      "process.env": {
        NODE_ENV: mode,
      },
    },
    // FUTURE: Find a way to build in watch mode. The simple script "watch": "vite build --watch" does not work because it does not rebuild the TS.
    build: {
      cssCodeSplit: true,
      outDir: "dist",
      rollupOptions: {
        input: "index.ts",
        output: {
          assetFileNames: "style.[ext]",
          entryFileNames: "[name].js",
        },
      },
      target: browserslistToEsbuild(),
      copyPublicDir: false,
    },

    resolve: {
      alias: isPreactDev
        ? {
            react: "preact/compat",
            "react-dom": "preact/compat",
          }
        : undefined,
    },
  };
});
