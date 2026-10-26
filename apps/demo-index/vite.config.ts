import { readFileSync } from "node:fs";

import { defineConfig } from "vite";

// Relative import, so vite bundles this TypeScript file with the config instead
// of letting Node load it (Node 22.14, used by the repo, can't strip types)
import { demoPort } from "../../packages/demo/src/vite";

const { version } = JSON.parse(
  readFileSync(
    new URL("../../packages/webplayer-react/package.json", import.meta.url),
    "utf-8"
  )
);

export default defineConfig({
  define: {
    __WEBPLAYER_VERSION__: JSON.stringify(version),
  },
  plugins: [demoPort("index")],
});
