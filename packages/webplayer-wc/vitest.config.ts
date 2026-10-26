import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    coverage: {
      provider: "v8",
      include: ["index.ts"],
      thresholds: { 100: true },
    },
  },
});
