import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: resolve(__dirname, "./tsconfig.app.json"),
      rollupTypes: true,
    }),
  ],

  define: {
    "process.env": {
      NODE_ENV: "production",
    },
  },
  build: {
    lib: {
      name: "next-webplayer",
      fileName: "index",
      entry: resolve(__dirname, "./index.ts"),
    },

    chunkSizeWarningLimit: 120,

    rollupOptions: {
      external: ["react", "react-dom", "next"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          next: "Next",
        },
      },
    },
  },
});
