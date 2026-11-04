import { resolve } from "path";

import angular from "@analogjs/vite-plugin-angular";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Compiles the components (JIT), with their signal inputs and queries
  plugins: [angular({ tsconfig: resolve(__dirname, "tsconfig.spec.json") })],
  resolve: {
    // From this package (Angular 19): @angular/core/testing imports the
    // compiler as an optional peer, which pnpm resolves to the hoisted one
    // (Angular 21 of demo-angular)
    dedupe: ["@angular/compiler"],
  },
  test: {
    environment: "happy-dom",
    setupFiles: ["src/test-setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/test-setup.ts"],
      thresholds: { 100: true },
    },
  },
});
