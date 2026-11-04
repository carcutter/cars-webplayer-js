// The `<script>` bundle, loaded by the script and iframe demos. Kept free of
// DOM and vite code: the vite plugin and the pages both import it.

export const CDN_BASE = "https://cdn.car-cutter.com/libs/web-player/v3";

/** Package building the bundle */
export const SCRIPT_PKG = "@car-cutter/script-webplayer";

/** Folder of the built bundle, from the repo root */
export const SCRIPT_DIST = "packages/webplayer-script/dist";

export const SCRIPT_BUNDLE = {
  /** File name, as published on the CDN */
  name: "bundle.js",
  /** Matches the built file in SCRIPT_DIST, whatever the version */
  // Not the bundle-react-*@… files a dist built before their removal may hold
  file: /^bundle-[^@]+\.js$/,
  cdnUrl: `${CDN_BASE}/bundle.js`,
  /** URL the demo dev servers serve the local build at */
  localPath: "/local/bundle.js",
};
