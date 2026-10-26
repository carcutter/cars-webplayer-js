// Vite plugins shared by the demo apps.

import { createReadStream, existsSync, readdirSync, statSync } from "node:fs";

import type { Plugin } from "vite";

import { SCRIPT_BUNDLES, type ScriptBundle } from "./bundles";
import { DEMO_PORTS, type DemoKey } from "./ports";

/** Serves the demo on its port from DEMO_PORTS, failing if it's taken */
export function demoPort(key: DemoKey): Plugin {
  return {
    name: "demo-port",
    config: () => ({ server: { port: DEMO_PORTS[key], strictPort: true } }),
  };
}

// -- Local bundles, for the demos that load the WebPlayer as a `<script>`
// bundle (script tag and iframe), so they can run the local build instead of
// the CDN one.

/** Most recently built file of a bundle, whatever the current version */
function findLocalBundle({ dir, file }: ScriptBundle): URL | undefined {
  const distDir = new URL(`../../${dir}/dist/`, import.meta.url);
  if (!existsSync(distDir)) {
    return undefined;
  }

  return readdirSync(distDir)
    .filter(name => file.test(name))
    .map(name => {
      const url = new URL(name, distDir);
      return { url, mtime: statSync(url).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime)[0]?.url;
}

/**
 * Serves the bundles built by the script-webplayer packages (turbo builds them
 * before `dev` starts, as the demos depend on them) at their `localPath`.
 * Files are resolved on every request, so rebuilding the package and reloading
 * the page is enough to pick up changes.
 */
export function localBundle(): Plugin {
  const bundlesByPath = new Map(
    Object.values(SCRIPT_BUNDLES).map(bundle => [bundle.localPath, bundle])
  );

  return {
    name: "local-webplayer-bundle",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Exact path only: a mounted route would also catch e.g. `.js.map`
        const bundle = bundlesByPath.get(req.url?.split("?")[0] ?? "");
        if (!bundle) {
          next();
          return;
        }

        const file = findLocalBundle(bundle);
        if (!file) {
          res.statusCode = 404;
          res.end(
            `No local build of ${bundle.pkg} in packages/${bundle.dir}/dist`
          );
          return;
        }

        res.setHeader("Content-Type", "text/javascript");
        res.setHeader("Cache-Control", "no-store");
        createReadStream(file).pipe(res);
      });
    },
  };
}
