import type { Plugin } from "vite";

/**
 * Vite plugin that strips all JavaScript chunks from the output
 * and keeps only generated CSS assets.
 *
 * Useful when you want to build style-only packages, extract CSS
 * for distribution, or prevent unnecessary JS files from being emitted.
 *
 * @returns {Plugin} A Vite plugin instance.
 *
 * @example
 * ```ts
 * import { defineConfig } from "vite";
 * import extractcss from "./extractcss";
 *
 * export default defineConfig({
 *   plugins: [extractcss()],
 * });
 * ```
 */
export default function extractcss(): Plugin {
  return {
    name: "extractcss",

    /**
     * Filters the generated bundle by:
     * - Removing all JS chunks (`chunk.type === "chunk"`)
     * - Removing any non-CSS assets
     *
     * @param _ - Rollup output options (unused)
     * @param bundle - The generated output bundle
     */
    generateBundle(_, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === "chunk") {
          delete bundle[fileName];
        }

        if (!chunk.fileName.endsWith(".css")) {
          delete bundle[fileName];
        }
      }
    },
  };
}
