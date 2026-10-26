import { describe, expect, it, vi } from "vitest";

// next/dynamic returns its loader and options, so the test can run them
vi.mock("next/dynamic", () => ({
  default: (loader: () => Promise<unknown>, options: object) => ({
    loader,
    options,
  }),
}));
vi.mock("@car-cutter/react-webplayer", () => ({
  WebPlayer: "WebPlayer",
  WebPlayerCustomMedia: "WebPlayerCustomMedia",
  WebPlayerIcon: "WebPlayerIcon",
}));
vi.mock("@car-cutter/react-webplayer/legacy", () => ({
  WebPlayer: "legacy WebPlayer",
  WebPlayerCustomMedia: "legacy WebPlayerCustomMedia",
  WebPlayerIcon: "legacy WebPlayerIcon",
}));

type Dynamic = { loader: () => Promise<unknown>; options: object };

const COMPONENTS = [
  "WebPlayer",
  "WebPlayerCustomMedia",
  "WebPlayerIcon",
] as const;

describe.each([
  ["default", () => import("./index"), ""],
  ["legacy", () => import("./legacy/index"), "legacy "],
])("%s entry", (_name, load, expectedPrefix) => {
  it.each(COMPONENTS)(
    "loads %s from react-webplayer on the client only",
    async component => {
      const entry = (await load()) as unknown as Record<string, Dynamic>;
      const { loader, options } = entry[component];

      expect(options).toEqual({ ssr: false });
      await expect(loader()).resolves.toBe(`${expectedPrefix}${component}`);
    }
  );

  it("re-exports the core constants", async () => {
    const entry = await load();

    expect(entry).toMatchObject({
      WEB_PLAYER_WC_TAG: "cc-webplayer",
      DEFAULT_EVENT_PREFIX: "cc-webplayer:",
    });
  });
});
