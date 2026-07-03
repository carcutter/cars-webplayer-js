/**
 * Vite plugin that strips all JavaScript chunks from the output
 * and keeps only generated CSS assets.
 *
 * Useful when you want to build style-only packages, extract CSS
 * for distribution, or prevent unnecessary JS files from being emitted.
 *
 * @returns {import("vite").Plugin} A Vite plugin instance.
 *
 * @example
 * ```js
 * import { defineConfig } from "vite";
 * import extractcss from "@car-cutter/export-css-plugin";
 *
 * export default defineConfig({
 *   plugins: [extractcss()],
 * });
 * ```
 */
export default function extractcss() {
  return {
    name: "extractcss",

    /**
     * Filters the generated bundle by:
     * - Removing all JS chunks (`chunk.type === "chunk"`)
     * - Removing any non-CSS assets
     *
     * @param {import("rollup").NormalizedOutputOptions} _ - Rollup output options (unused)
     * @param {import("rollup").OutputBundle} bundle - The generated output bundle
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
