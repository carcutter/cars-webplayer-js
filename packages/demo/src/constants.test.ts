import { afterEach, describe, expect, it, vi } from "vitest";

import { BUNDLE_VARIANTS, SCRIPT_BUNDLES, reactUmdUrls } from "./bundles";
import {
  COMPOSITION_URL,
  IFRAME_QUERY,
  IFRAME_URL,
  demoUrl,
} from "./constants";
import { DEMO_PORTS } from "./ports";
import { THEMES, THEME_KEYS, themeStyle } from "./themes";

afterEach(() => vi.unstubAllGlobals());

describe("demoUrl", () => {
  it("uses the current page's protocol and host", () => {
    vi.stubGlobal("location", { protocol: "https:", hostname: "192.168.1.9" });

    expect(demoUrl("vue")).toBe(`https://192.168.1.9:${DEMO_PORTS.vue}/`);
  });

  it("falls back to localhost without a page (SSR)", () => {
    vi.stubGlobal("location", undefined);

    expect(demoUrl("index")).toBe(`http://localhost:${DEMO_PORTS.index}/`);
  });
});

describe("ports and themes", () => {
  it("gives every demo its own port, away from vite's 5173", () => {
    const ports = Object.values(DEMO_PORTS);
    expect(new Set(ports).size).toBe(ports.length);
    expect(ports).not.toContain(5173);
    expect(Object.keys(DEMO_PORTS).sort()).toEqual(
      ["index", ...THEME_KEYS].sort()
    );
  });

  it("maps a theme to the header and player CSS variables", () => {
    expect(themeStyle(THEMES.vue)).toEqual({
      "--dm-header-bg": THEMES.vue.headerBg,
      "--dm-header-fg": THEMES.vue.headerFg,
      "--dm-tile-bg": THEMES.vue.tileBg,
      "--dm-tile-fg": THEMES.vue.tileFg,
      "--cc-webplayer-primary": THEMES.vue.playerPrimary,
      "--cc-webplayer-primary-foreground": THEMES.vue.playerPrimaryFg,
    });
  });
});

describe("CDN URLs", () => {
  it("points the composition and the hosted iframe at the v3 CDN", () => {
    expect(COMPOSITION_URL).toBe(
      "https://cdn.car-cutter.com/libs/web-player/v3/demos/composition_v3.json"
    );
    expect(IFRAME_QUERY).toBe(
      `?composition-url=${encodeURIComponent(COMPOSITION_URL)}`
    );
    expect(IFRAME_URL).toBe(
      `https://cdn.car-cutter.com/libs/web-player/v3/integrations/iframe/index.html${IFRAME_QUERY}`
    );
  });
});

describe("SCRIPT_BUNDLES", () => {
  // Built file names, as the script-webplayer packages name them
  it.each([
    ["default", "bundle-3.2.17.js", "bundle-react-16-17@3.2.17.js"],
    ["react-16-17", "bundle-react-16-17@3.2.17.js", "bundle-3.2.17.js"],
    ["react-18", "bundle-react-18@3.2.17.js", "bundle-react-16-17@3.2.17.js"],
  ] as const)("finds the %s build by its file name", (variant, own, other) => {
    const { file } = SCRIPT_BUNDLES[variant];
    expect(file.test(own)).toBe(true);
    expect(file.test("script-webplayer.css")).toBe(false);
    if (variant !== "default") expect(file.test(other)).toBe(false);
  });

  it("has a variant per bundle, with its own local path", () => {
    expect(BUNDLE_VARIANTS).toEqual(Object.keys(SCRIPT_BUNDLES));
    const paths = Object.values(SCRIPT_BUNDLES).map(b => b.localPath);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("builds the React UMD URLs", () => {
    expect(reactUmdUrls("17.0.2")).toEqual([
      "https://unpkg.com/react@17.0.2/umd/react.production.min.js",
      "https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js",
    ]);
  });
});
