import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      dts({
        tsconfigPath: resolve(__dirname, "./tsconfig.app.json"),
        rollupTypes: true,
      }),
    ],

    // BUILD
    define: {
      "process.env": {
        NODE_ENV: mode,
      },
    },
    // FUTURE: Find a way to build in watch mode. The simple script "watch": "vite build --watch" does not work because it does not rebuild the TS.
    build: {
      lib: {
        name: "core-ui",
        fileName: "index",
        entry: resolve(__dirname, "./index.ts"),
      },
      copyPublicDir: false, // The only public file is mock data

      // React is an external dependency, it should be provided by the consumer
      rollupOptions: {
        external: ["@r2wc/react-to-web-component", "react", "react-dom"],
        output: {
          globals: {
            "@r2wc/react-to-web-component": "r2wc",
            react: "React",
            "react-dom": "ReactDOM",
          },
        },
      },
    },
  };
});
