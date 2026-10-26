import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Relative import, so vite bundles this TypeScript file with the config instead
// of letting Node load it (Node 22.14, used by the repo, can't strip types)
import { demoPort } from "../../packages/demo/src/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), demoPort("react-legacy")],
  resolve: {
    // Use this app's React 17 everywhere, including in @car-cutter/demo/react
    // and the webplayer, instead of the React 19 hoisted at the repo root
    dedupe: ["react", "react-dom"],
  },
});
