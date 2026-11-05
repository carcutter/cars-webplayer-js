import { join } from "node:path";

import { defineConfig } from "@playwright/test";

import { CONSUMER_APPS, CONSUMERS_DIR } from "./consumers";
import config from "./playwright.config";

// The apps of consumers/, installed from the packed packages by
// `pnpm test:consumers`: each one is type-checked, built and previewed
export default defineConfig({
  ...config,
  projects: [{ name: "consumers", testMatch: /consumers\.spec\.ts/ }],
  webServer: CONSUMER_APPS.map(({ name, port }) => ({
    command: `pnpm run --if-present typecheck && pnpm build && pnpm preview --port ${port}`,
    cwd: join(CONSUMERS_DIR, name),
    url: `http://localhost:${port}/`,
    // Never a preview of an older build
    reuseExistingServer: false,
    // tsc prints its errors on stdout
    stdout: "pipe",
    timeout: 300_000,
  })),
});
