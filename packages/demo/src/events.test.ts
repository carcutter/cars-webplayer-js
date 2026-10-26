import { describe, expect, it } from "vitest";

import { EVENT_PREFIX, PLAYER_EVENTS, createLogEntry } from "./events";

describe("PLAYER_EVENTS", () => {
  it("lists the player events under the default prefix", () => {
    expect(EVENT_PREFIX).toBe("cc-webplayer:");
    expect(PLAYER_EVENTS).toEqual([
      "composition-loading",
      "composition-loaded",
      "composition-load-error",
      "item-change",
      "extend-mode-on",
      "extend-mode-off",
      "hotspots-on",
      "hotspots-off",
      "gallery-open",
      "gallery-close",
    ]);
  });
});

describe("createLogEntry", () => {
  it("gives each entry a new id and the current time", () => {
    const a = createLogEntry("gallery-open");
    const b = createLogEntry("gallery-open");

    expect(b.id).toBe(a.id + 1);
    expect(a.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(a).toMatchObject({ name: "gallery-open", detail: "" });
  });

  it.each([
    [
      "composition-loading",
      "https://x/y/composition_v3.json",
      "composition_v3.json",
    ],
    ["composition-loading", undefined, ""],
    [
      "composition-loaded",
      { categories: [{ items: [1, 2] }, { items: [3] }, {}] },
      "3 categories · 3 items",
    ],
    ["composition-loaded", undefined, "0 categories · 0 items"],
    ["composition-load-error", new Error("404"), "Error: 404"],
    ["item-change", { index: 2, item: { type: "image" } }, "#2 · image"],
    ["item-change", { index: 0, item: {} }, "#0 · unknown"],
    ["item-change", null, "#undefined · unknown"],
    ["hotspots-on", { any: "thing" }, ""],
  ] as const)("describes %s (%j)", (name, detail, expected) => {
    expect(createLogEntry(name, detail).detail).toBe(expected);
  });
});
