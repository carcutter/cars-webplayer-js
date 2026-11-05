import { realpathSync } from "fs";
import { resolve } from "path";

import vue from "@vitejs/plugin-vue";
import browserslistToEsbuild from "browserslist-to-esbuild";
import ts from "typescript";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const dtsTsconfigPath = resolve(import.meta.dirname, "./tsconfig.dts.json");
const dtsTsconfig = ts.readConfigFile(dtsTsconfigPath, path =>
  ts.sys.readFile(path)
);
const dtsPaths = (
  dtsTsconfig.config as
    { compilerOptions?: { paths?: Record<string, string[]> } } | undefined
)?.compilerOptions?.paths;
if (!dtsPaths) {
  throw new Error(
    `${dtsTsconfigPath} must set compilerOptions.paths` +
      (dtsTsconfig.error
        ? `: ${ts.flattenDiagnosticMessageText(dtsTsconfig.error.messageText, "\n")}`
        : "")
  );
}

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
      // Resolves the private workspace packages it uses (not dependencies of
      // the published package) to their built declarations, which are rolled
      // up into its own .d.ts
      tsconfigPath: dtsTsconfigPath,
      compilerOptions: {
        paths: {
          ...dtsPaths,
          // vue to the lowest supported version (peer ^3.3), so that the
          // declarations work with it. Through the real folder of vue-3.3:
          // through its pnpm symlink, they would import "vue-3.3/dist/vue.js"
          // instead of "vue"
          vue: [
            realpathSync(resolve(import.meta.dirname, "node_modules/vue-3.3")),
          ],
        },
      },
      bundleTypes: {
        bundledPackages: [
          "@car-cutter/core",
          "@car-cutter/core-wc",
          "@car-cutter/analytics",
        ],
      },
      // Keeps the package names in the declarations, for bundledPackages
      pathsToAliases: false,
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
        index: resolve(import.meta.dirname, "src/index.ts"),
      },
      // With a single entry, vite would build "es" + "umd" (index.umd.cjs),
      // while package.json points CommonJS at index.cjs
      formats: ["es", "cjs"],
    },
    target: browserslistToEsbuild(),

    chunkSizeWarningLimit: 5,

    // Vue is an external dependency, it should be provided by the consumer
    rolldownOptions: {
      external: ["vue", "@car-cutter/wc-webplayer"],
      output: {
        // "use strict" in the CommonJS / UMD files too, as Rollup did
        strict: true,
        globals: {
          vue: "Vue",

          "@car-cutter/wc-webplayer": "CarCutterWebplayerWC",
        },
      },
    },
  },
});
