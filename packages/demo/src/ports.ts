// Kept apart from constants.ts: vite configs import it, without the DOM types

import type { ThemeKey } from "./themes";

export type DemoKey = "index" | ThemeKey;

/**
 * Dev-server port of each demo app, away from vite's default 5173 so that
 * they don't take the port of other apps. The vite apps read it through the
 * `demoPort()` plugin; demo-next sets it in its `dev` script.
 */
export const DEMO_PORTS: Record<DemoKey, number> = {
  index: 4170,
  react: 4171,
  next: 4172,
  vanilla: 4173,
  script: 4174,
  wc: 4175,
  vue: 4176,
  iframe: 4177,
  "react-legacy": 4178,
};
