// Variants of the `<script>` bundle, shown by the script demo. Kept free of
// DOM and vite code: the vite plugin and the pages both import it.

export const CDN_BASE = "https://cdn.car-cutter.com/libs/web-player/v3";

export type BundleVariant = "default" | "react-16-17" | "react-18";

export const BUNDLE_VARIANTS: BundleVariant[] = [
  "default",
  "react-16-17",
  "react-18",
];

export interface ScriptBundle {
  /** File name, as published on the CDN */
  name: string;
  /** Package building it */
  pkg: string;
  /** Its folder in packages/ */
  dir: string;
  /** Matches the built file in `<dir>/dist`, whatever the version */
  file: RegExp;
  cdnUrl: string;
  /** URL the demo dev servers serve the local build at */
  localPath: string;
  /** React version the host page must provide as UMD globals, if any */
  react?: string;
}

export const SCRIPT_BUNDLES: Record<BundleVariant, ScriptBundle> = {
  default: {
    name: "bundle.js",
    pkg: "@car-cutter/script-webplayer",
    dir: "webplayer-script",
    file: /^bundle-.+\.js$/,
    cdnUrl: `${CDN_BASE}/bundle.js`,
    localPath: "/local/bundle.js",
  },
  "react-16-17": {
    name: "bundle-react-16-17.js",
    pkg: "@car-cutter/script-webplayer-react-16-17",
    dir: "webplayer-script-react-16-17",
    file: /^bundle-react-16-17@.+\.js$/,
    cdnUrl: `${CDN_BASE}/bundle-react-16-17.js`,
    localPath: "/local/bundle-react-16-17.js",
    react: "17.0.2",
  },
  "react-18": {
    name: "bundle-react-18.js",
    pkg: "@car-cutter/script-webplayer-react-18",
    dir: "webplayer-script-react-18",
    file: /^bundle-react-18@.+\.js$/,
    cdnUrl: `${CDN_BASE}/bundle-react-18.js`,
    localPath: "/local/bundle-react-18.js",
    react: "18.3.1",
  },
};

/** UMD builds of React and ReactDOM, defining the `React` / `ReactDOM` globals */
export function reactUmdUrls(version: string): string[] {
  return ["react", "react-dom"].map(
    lib => `https://unpkg.com/${lib}@${version}/umd/${lib}.production.min.js`
  );
}
