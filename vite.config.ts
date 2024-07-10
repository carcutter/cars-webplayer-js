import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isLightMode = mode === "light";

  const pathToDir = (dir: string) => path.resolve(__dirname, dir);

  return {
    resolve: {
      alias: {
        "@/components": pathToDir("./src/components"),
        "@/const": pathToDir("./src/const"),
        "@/hooks": pathToDir("./src/hooks"),
        "@/lib": pathToDir("./src/lib"),
        "@/providers": pathToDir("./src/providers"),
        "@/types": pathToDir("./src/types"),
        "@/utils": pathToDir("./src/utils"),

        ...(isLightMode && {
          zod: pathToDir("./mock_modules/zod.mock.ts"),
        }),
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
        entry: "./src/index.wc.tsx",
        name: "cc-web-player",
        fileName: format => `cc-web-player.${format}.js`,
      },
      target: "esnext",
      chunkSizeWarningLimit: 150,
      copyPublicDir: false, // The only public file is mock data
    },
  };
});
