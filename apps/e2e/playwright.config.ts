import { defineConfig, devices } from "@playwright/test";

import { DEMO_PORTS, type DemoKey } from "@car-cutter/demo";

const CI = !!process.env.CI;

/** Workspace of each demo app */
const DEMO_APPS: Record<DemoKey, string> = {
  index: "demo-index",
  react: "demo-react",
  "react-legacy": "demo-react-legacy",
  next: "demo-next",
  vanilla: "demo-vanilla",
  script: "demo-script",
  wc: "demo-wc",
  vue: "demo-vue",
  iframe: "demo-iframe",
};

export default defineConfig({
  testDir: "tests",
  timeout: 60_000,
  expect: { timeout: 20_000 },
  retries: CI ? 2 : 0,
  forbidOnly: CI,
  reporter: CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    ...devices["Desktop Chrome"],
    viewport: { width: 1280, height: 720 },
    trace: "retain-on-failure",
  },
  projects: [
    // The demos on the local builds of the packages
    { name: "demos", grepInvert: /@cdn/ },
    // The files published on the CDN, checked on a schedule
    { name: "cdn", grep: /@cdn/ },
  ],
  // The demo dev servers, on their ports from packages/demo/src/ports.ts
  webServer: Object.entries(DEMO_APPS).map(([key, workspace]) => ({
    command: `yarn workspace ${workspace} dev`,
    url: `http://localhost:${DEMO_PORTS[key as DemoKey]}/`,
    reuseExistingServer: !CI,
    timeout: 120_000,
  })),
});
