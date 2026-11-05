import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/** The apps of consumers/, installed by `pnpm test:consumers` */
export const CONSUMERS_DIR = fileURLToPath(
  new URL("../../consumers/", import.meta.url)
);

/** Ports of the app previews, after the demo apps' ones (4170-4179) */
const FIRST_PORT = 4180;

const ALL = readdirSync(CONSUMERS_DIR, { withFileTypes: true })
  .filter(
    entry =>
      entry.isDirectory() &&
      existsSync(join(CONSUMERS_DIR, entry.name, "package.json"))
  )
  .map(entry => entry.name);

/** Checked apps: all, or the ones in CONSUMERS (e.g. "react-17 vue-3.3") */
const only = process.env.CONSUMERS?.split(/[\s,]+/).filter(Boolean) ?? [];
for (const name of only) {
  if (!ALL.includes(name)) throw new Error(`No consumers/${name} app`);
}

export const CONSUMER_APPS = ALL.map((name, i) => ({
  name,
  port: FIRST_PORT + i,
})).filter(({ name }) => !only.length || only.includes(name));
