import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

const CUSTOM_ELEMENTS = [
  "cc-webplayer",
  "cc-webplayer-custom-media",
  "cc-webplayer-icon",
];

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => CUSTOM_ELEMENTS.includes(tag),
        },
      },
    }),
  ],
  test: {
    environment: "happy-dom",
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,vue}"],
      exclude: ["src/**/*.test.ts"],
      thresholds: { 100: true },
    },
  },
});
