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
      bundledPackages: ["@car-cutter/core"],
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
      entry: {
        index: resolve(__dirname, "index.ts"),
        legacy: resolve(__dirname, "src/legacy.ts"),
      },
    },
    target: browserslistToEsbuild(),

    chunkSizeWarningLimit: 125,

    rollupOptions: {
      external: ["react", "react-dom", "react-dom/client", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-dom/client": "ReactDOM",
          "react/jsx-runtime": "jsx",
        },
        manualChunks: {
          shared: [
            "src/components/WebPlayerIcon.tsx",
            "src/components/WebPlayer.tsx",
            "src/components/WebPlayerCustomMedia.tsx",
          ],
        },
      },
    },
  },
});
