import fs from "fs";
import { resolve } from "path";

import preact from "@preact/preset-vite";
import react from "@vitejs/plugin-react";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vite";

const cssExtractPlugin = () => {
  return {
    name: "css-extract",
    closeBundle: {
      sequential: true,
      handler() {
        const dir = "dist";
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (!file.endsWith(".css")) {
            fs.unlinkSync(resolve(dir, file));
          }
        }
      },
    },
  };
};

export default defineConfig(({ mode }) => {
  const isPreactDev = mode === "development-preact";

  return {
    plugins: [isPreactDev ? preact() : react(), cssExtractPlugin()],

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
