// Vite plugins shared by the demo apps.

import { createReadStream, existsSync, readdirSync, statSync } from "node:fs";

import type { Plugin } from "vite";

import { SCRIPT_BUNDLE, SCRIPT_DIST } from "./bundles";
import { DEMO_PORTS, type DemoKey } from "./ports";

/** Serves the demo on its port from DEMO_PORTS, failing if it's taken */
export function demoPort(key: DemoKey): Plugin {
  return {
    name: "demo-port",
    config: () => ({ server: { port: DEMO_PORTS[key], strictPort: true } }),
  };
}

// -- Local bundle, for the demos that load the WebPlayer as a `<script>`
// bundle (script tag and iframe), so they can run the local build instead of
// the CDN one.

/** Most recently built file of the bundle, whatever the current version */
function findLocalBundle(): URL | undefined {
  const distDir = new URL(`../../../${SCRIPT_DIST}/`, import.meta.url);
  if (!existsSync(distDir)) {
    return undefined;
  }

  return readdirSync(distDir)
    .filter(name => SCRIPT_BUNDLE.file.test(name))
    .map(name => {
      const url = new URL(name, distDir);
      return { url, mtime: statSync(url).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime)[0]?.url;
}

/**
 * Serves the bundle built by the script-webplayer package (turbo builds it
 * before `dev` starts, as the demos depend on it) at its `localPath`. The file
 * is resolved on every request, so rebuilding the package and reloading the
 * page is enough to pick up changes.
 */
export function localBundle(): Plugin {
  return {
    name: "local-webplayer-bundle",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Exact path only: a mounted route would also catch e.g. `.js.map`
        if (req.url?.split("?")[0] !== SCRIPT_BUNDLE.localPath) {
          next();
          return;
        }

        const file = findLocalBundle();
        if (!file) {
          res.statusCode = 404;
          res.end(`No local build of ${SCRIPT_BUNDLE.name} in ${SCRIPT_DIST}`);
          return;
        }

        res.setHeader("Content-Type", "text/javascript");
        res.setHeader("Cache-Control", "no-store");
        createReadStream(file).pipe(res);
      });
    },
  };
}
