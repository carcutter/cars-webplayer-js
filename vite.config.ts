import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  resolve: {
    alias: {
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/const": path.resolve(__dirname, "./src/const"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/providers": path.resolve(__dirname, "./src/providers"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  plugins: [react()],

  // BUILD
  define: {
    "process.env": {
      NODE_ENV: command === "build" ? "production" : "development",
    },
  },
  // TODO: Find a way to build in watch mode. The simple script "watch": "vite build --watch" does not work because it does not rebuild the TS.
  build: {
    lib: {
      entry: "./src/index.tsx",
      name: "cc-web-player",
      fileName: format => `cc-web-player.${format}.js`,
    },
    target: "esnext",
    chunkSizeWarningLimit: 150,
    copyPublicDir: false, // The only public file is mock data
  },
}));
