// Builds every <script> bundle of variants.json into an emptied dist, one
// after the other (vite.config.ts reads the variant from SCRIPT_VARIANT)
import { rmSync } from "node:fs";

import { build } from "vite";

import variants from "./variants.json" with { type: "json" };

const root = import.meta.dirname;

rmSync(`${root}/dist`, { recursive: true, force: true });
for (const variant of Object.keys(variants)) {
  process.env.SCRIPT_VARIANT = variant;
  await build({ root });
}
