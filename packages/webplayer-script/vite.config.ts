import { resolve } from "path";

import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig, type UserConfig } from "vite";

import { version } from "./package.json";
import variants from "./variants.json";

type Variant = {
  entry: string;
  name: string;
  /** Without extension, "{version}" replaced */
  fileName: string;
  chunkSizeWarningLimit: number;
  /** For the bundles using the React of the host page: its UMD globals */
  reactGlobals?: Record<string, string>;
};

// The <script> bundles published on the CDN, one per variant of variants.json,
// picked with SCRIPT_VARIANT (build.mjs builds them all). The default one
// bundles its own React (preact) through @car-cutter/wc-webplayer.
const VARIANTS: Record<string, Variant> = variants;

export default defineConfig((): UserConfig => {
  const variant = process.env.SCRIPT_VARIANT ?? "default";
  if (!Object.hasOwn(VARIANTS, variant)) {
    throw new Error(
      `Unknown SCRIPT_VARIANT "${variant}", expected one of: ${Object.keys(VARIANTS).join(", ")}`
    );
  }
  const { entry, name, chunkSizeWarningLimit, reactGlobals } =
    VARIANTS[variant];
  const fileName = VARIANTS[variant].fileName.replace("{version}", version);

  return {
    resolve: reactGlobals && {
      // JSX from the host page's React (see core-wc/src/jsx-runtime.ts)
      alias: {
        "react/jsx-runtime": resolve(
          __dirname,
          "../core-wc/src/jsx-runtime.ts"
        ),
      },
    },
    define: {
      "process.env": {
        NODE_ENV: "production",
      },
    },
    build: {
      lib: {
        name,
        fileName: () => `${fileName}.js`,
        entry: resolve(__dirname, entry),
        formats: ["umd"],
      },
      target: browserslistToEsbuild(),
      // The variants share dist: build.mjs empties it before building them
      emptyOutDir: false,

      chunkSizeWarningLimit,

      rollupOptions: reactGlobals && {
        external: Object.keys(reactGlobals),
        output: { globals: reactGlobals },
      },
    },
  };
});
