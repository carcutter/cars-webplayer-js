import { describe, expect, it, vi } from "vitest";

const define18 = vi.hoisted(() => vi.fn());
const define1617 = vi.hoisted(() => vi.fn());
vi.mock("@car-cutter/core-wc-react-18", () => ({
  ensureCustomElementsDefinition: define18,
}));
vi.mock("@car-cutter/core-wc-react-16-17", () => ({
  ensureCustomElementsDefinition: define1617,
}));

const API = [
  "WebPlayer",
  "WebPlayerCustomMedia",
  "WebPlayerIcon",
  "WEB_PLAYER_WC_TAG",
  "WEB_PLAYER_ICON_WC_TAG",
  "DEFAULT_EVENT_PREFIX",
  "EVENT_ITEM_CHANGE",
  "ANALYTICS_EVENT_LOAD",
  "generateCompositionUrl",
];

describe("entry points", () => {
  it("the default entry defines the React 18+ elements", async () => {
    const entry = await import("../index");

    expect(define18).toHaveBeenCalledTimes(1);
    expect(define1617).not.toHaveBeenCalled();
    expect(Object.keys(entry)).toEqual(expect.arrayContaining(API));
  });

  it("the legacy entry defines the React 16 / 17 elements", async () => {
    const entry = await import("./legacy");

    expect(define1617).toHaveBeenCalledTimes(1);
    expect(Object.keys(entry)).toEqual(expect.arrayContaining(API));
  });
});
