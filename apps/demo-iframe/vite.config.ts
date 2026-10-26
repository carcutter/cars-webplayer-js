import { defineConfig } from "vite";

// Relative import, so vite bundles this TypeScript file with the config instead
// of letting Node load it (Node 22.14, used by the repo, can't strip types)
import { demoPort, localBundle } from "../../packages/demo/src/vite";

export default defineConfig({
  plugins: [demoPort("iframe"), localBundle()],
});
