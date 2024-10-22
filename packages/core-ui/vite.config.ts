import preact from "@preact/preset-vite";
import react from "@vitejs/plugin-react";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const isPreactDev = mode === "development-preact";

  return {
    plugins: [isPreactDev ? preact() : react()],

    define: {
      "process.env": {
        NODE_ENV: mode,
      },
    },
    // FUTURE: Find a way to build in watch mode. The simple script "watch": "vite build --watch" does not work because it does not rebuild the TS.
    build: {
      cssCodeSplit: true,
      lib: {
        entry: "src/index.css",
        formats: ["es"],
        fileName: "style",
      },
      target: browserslistToEsbuild(),

      copyPublicDir: false, // The only public file is mock data

      rollupOptions: {
        output: {
          assetFileNames: "style.[ext]",
        },
      },
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
