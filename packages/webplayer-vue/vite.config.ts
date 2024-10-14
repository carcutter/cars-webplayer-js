import { resolve } from "path";

import vue from "@vitejs/plugin-vue";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag =>
            [
              "cc-webplayer",
              "cc-webplayer-custom-media",
              "cc-webplayer-icon",
            ].includes(tag),
        },
      },
    }),
    dts({
      tsconfigPath: resolve(__dirname, "./tsconfig.app.json"),
      rollupTypes: true,
      bundledPackages: ["@car-cutter/core", "@car-cutter/core-wc"],
    }),
  ],

  define: {
    "process.env": {
      NODE_ENV: "production",
    },
  },
  build: {
    lib: {
      name: "CarCutterWebplayerVue",
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        vue2: resolve(__dirname, "src/vue2/index.ts"),
      },
    },
    target: browserslistToEsbuild(),

    chunkSizeWarningLimit: 5,

    // Vue is an external dependency, it should be provided by the consumer
    rollupOptions: {
      external: ["vue", "@car-cutter/wc-webplayer"],
      output: {
        globals: {
          vue: "Vue",

          "@car-cutter/wc-webplayer": "CarCutterWebplayerWC",
        },
      },
    },
  },
});
