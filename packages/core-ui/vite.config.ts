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

export default defineConfig(({ mode }) => {
  const isPreactDev = mode === "development-preact";

  return {
    plugins: [isPreactDev ? preact() : react(), cssOnly()],

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
