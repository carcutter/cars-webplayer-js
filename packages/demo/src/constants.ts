import { CDN_BASE } from "./bundles";
import { DEMO_PORTS, type DemoKey } from "./ports";

/** Demo composition rendered by every test page */
export const COMPOSITION_URL = `${CDN_BASE}/demos/composition_v3.json`;

/** Query string of the iframe integration: every param becomes a `cc-webplayer` attribute */
export const IFRAME_QUERY = `?composition-url=${encodeURIComponent(
  COMPOSITION_URL
)}`;

/** Hosted iframe integration, used by the "iframe" demo */
export const IFRAME_URL = `${CDN_BASE}/integrations/iframe/index.html${IFRAME_QUERY}`;

export const DOCS_URL = "https://carcutter.github.io/cars-webplayer-js/";
export const REPO_URL = "https://github.com/carcutter/cars-webplayer-js";

/**
 * URL of a demo on the current page's host, so links also work when the dev
 * servers are opened from another device (vite's `--host`; Next.js also needs
 * `-H 0.0.0.0` and `allowedDevOrigins`). Falls back to localhost when there's
 * no page (server-side rendering).
 */
export function demoUrl(key: DemoKey): string {
  const origin =
    typeof location === "undefined"
      ? "http://localhost"
      : `${location.protocol}//${location.hostname}`;

  return `${origin}:${DEMO_PORTS[key]}/`;
}

export { DEMO_PORTS, type DemoKey };
