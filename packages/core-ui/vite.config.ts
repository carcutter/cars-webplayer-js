import { resolve } from "path";

import preact from "@preact/preset-vite";
import react from "@vitejs/plugin-react";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig, type Plugin } from "vite";

// The build of core-ui is only for its CSS (the wrappers bundle its sources):
// drops everything else from the output
const cssOnly = (): Plugin => ({
  name: "css-only",
  generateBundle(_, bundle) {
    for (const [fileName, output] of Object.entries(bundle)) {
      if (!output.fileName.endsWith(".css")) {
        delete bundle[fileName];
      }
    }
  },
});

export default defineConfig(({ command, mode }) => {
  const isPreactDev = mode === "development-preact";

  return {
    // The framework plugin is only for the dev app (index.html)
    plugins:
      command === "serve" ? [isPreactDev ? preact() : react()] : [cssOnly()],

    define: {
      "process.env": {
        NODE_ENV: mode,
      },
    },
    build: {
      outDir: "dist",
      rollupOptions: {
        input: resolve(__dirname, "src/style.css"),
        output: {
          assetFileNames: "style.[ext]",
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
