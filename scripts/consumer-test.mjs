// Tests the published WebPlayer packages the way a customer gets them:
// packed with `npm pack`, checked with publint and attw, then installed with
// npm in the apps of consumers/ (outside the yarn workspaces), type-checked,
// built, served and checked by the Playwright project "consumers".
//
// Usage: node scripts/consumer-test.mjs [app...]   (after `yarn build`)
// KEEP=1 keeps the temp folder.

import { execFileSync, spawn } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

/** Published packages, and their folder in packages/ */
const PACKAGES = {
  "@car-cutter/react-webplayer": "webplayer-react",
  "@car-cutter/next-webplayer": "webplayer-next",
  "@car-cutter/vue-webplayer": "webplayer-vue",
  "@car-cutter/wc-webplayer": "webplayer-wc",
  "@car-cutter/vanilla-webplayer": "webplayer-vanilla",
};

/** Ports of the app previews, after the demo apps' ones (4170-4178) */
const FIRST_PORT = 4180;

const run = (command, args, cwd, env = {}) =>
  execFileSync(command, args, {
    cwd,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });

const step = message => console.log(`\n▸ ${message}`);

const isPortFree = port =>
  new Promise(done => {
    const server = createServer()
      .once("error", () => done(false))
      .once("listening", () => server.close(() => done(true)))
      .listen(port);
  });

async function waitFor(url, timeout = 60_000) {
  for (const start = Date.now(); Date.now() - start < timeout; ) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // not up yet
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`${url} didn't start`);
}

const only = process.argv.slice(2);
const apps = readdirSync(join(ROOT, "consumers"), { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .filter(app => !only.length || only.includes(app));

for (const dir of Object.values(PACKAGES)) {
  if (!existsSync(join(ROOT, "packages", dir, "dist"))) {
    throw new Error(`packages/${dir} isn't built: run \`yarn build\` first`);
  }
}
for (const [i, app] of apps.entries()) {
  if (!(await isPortFree(FIRST_PORT + i))) {
    throw new Error(`Port ${FIRST_PORT + i} (for ${app}) is already in use`);
  }
}

const work = mkdtempSync(join(tmpdir(), "cc-consumers-"));
const servers = [];

try {
  step("Packing the packages");
  const tarballs = {};
  for (const [name, dir] of Object.entries(PACKAGES)) {
    const [{ filename }] = JSON.parse(
      execFileSync("npm", ["pack", "--json", "--pack-destination", work], {
        cwd: join(ROOT, "packages", dir),
      }).toString()
    );
    tarballs[name] = join(work, filename);
  }

  step("Checking the tarballs (publint, attw)");
  for (const tarball of Object.values(tarballs)) {
    run("npx", ["--no-install", "publint", tarball, "--level", "error"], ROOT);
    // Bundlers and Node from ESM must resolve everything. Known gaps, not
    // checked: the .d.ts read as ESM from CommonJS (false-esm) and the
    // `/legacy` subpath under moduleResolution "node" (node10)
    run(
      "npx",
      [
        "--no-install",
        "attw",
        tarball,
        "--profile",
        "node16",
        "--ignore-rules",
        "false-esm",
        "--format",
        "table-flipped",
      ],
      ROOT
    );
  }

  const targets = [];
  for (const [i, app] of apps.entries()) {
    step(`${app}: install, type-check and build`);
    const dir = join(work, app);
    cpSync(join(ROOT, "consumers", app), dir, {
      recursive: true,
      filter: source => !/\/(node_modules|dist|\.next)(\/|$)/.test(source),
    });

    // The packages (and the ones they depend on) come from the tarballs
    const pkgPath = join(dir, "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    for (const name of Object.keys(pkg.dependencies)) {
      if (tarballs[name]) pkg.dependencies[name] = `file:${tarballs[name]}`;
    }
    pkg.overrides = Object.fromEntries(
      Object.entries(tarballs).map(([name, tarball]) => [
        name,
        `file:${tarball}`,
      ])
    );
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

    run("npm", ["install", "--no-audit", "--no-fund", "--loglevel=error"], dir);
    if (pkg.scripts.typecheck) run("npm", ["run", "typecheck"], dir);
    run("npm", ["run", "build"], dir);

    const port = FIRST_PORT + i;
    servers.push(
      spawn("npm", ["run", "preview", "--", "--port", String(port)], {
        cwd: dir,
        stdio: "ignore",
        detached: true,
      })
    );
    targets.push({ name: app, url: `http://localhost:${port}/` });
  }

  step("Checking the apps in the browser");
  await Promise.all(targets.map(({ url }) => waitFor(url)));
  run(
    "yarn",
    ["workspace", "e2e", "playwright", "test", "--project=consumers"],
    ROOT,
    {
      CONSUMERS: JSON.stringify(targets),
    }
  );
} finally {
  // Each preview runs in its own process group: stop it with its children
  servers.forEach(server => {
    try {
      process.kill(-server.pid);
    } catch {
      // already stopped
    }
  });
  if (process.env.KEEP) console.log(`\nKept ${work}`);
  else rmSync(work, { recursive: true, force: true });
}
