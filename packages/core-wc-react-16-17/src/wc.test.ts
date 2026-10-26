import { describe, expect, it, vi } from "vitest";

import {
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
  WEB_PLAYER_WC_TAG,
} from "@car-cutter/core";
import { WEB_PLAYER_WC_PROPS } from "@car-cutter/core-wc";

import { ensureCustomElementsDefinition } from "../index";

vi.mock("@car-cutter/core-ui", () => ({
  WebPlayer: () => null,
  WebPlayerCustomMedia: () => null,
  WebPlayerIcon: () => null,
}));
vi.mock("@car-cutter/core-ui/dist/style.css?inline", () => ({ default: "" }));

const observedAttributes = (tag: string) =>
  (customElements.get(tag) as unknown as { observedAttributes: string[] })
    .observedAttributes;

describe("ensureCustomElementsDefinition", () => {
  it("defines the three elements, once", () => {
    ensureCustomElementsDefinition();
    ensureCustomElementsDefinition();

    expect(customElements.get(WEB_PLAYER_WC_TAG)).toBeDefined();
    expect(customElements.get(WEB_PLAYER_CUSTOM_MEDIA_WC_TAG)).toBeDefined();
    expect(customElements.get(WEB_PLAYER_ICON_WC_TAG)).toBeDefined();
  });

  it("observes an attribute for every WebPlayer prop (#235)", () => {
    ensureCustomElementsDefinition();

    const attributes = observedAttributes(WEB_PLAYER_WC_TAG);
    expect(attributes).toHaveLength(Object.keys(WEB_PLAYER_WC_PROPS).length);
    expect(attributes).toEqual(
      expect.arrayContaining([
        "integration",
        "max-items-shown",
        "composition-url",
      ])
    );
  });

  it("observes the custom media and icon attributes", () => {
    ensureCustomElementsDefinition();

    expect(observedAttributes(WEB_PLAYER_CUSTOM_MEDIA_WC_TAG)).toEqual([
      "index",
      "thumbnail-src",
    ]);
    expect(observedAttributes(WEB_PLAYER_ICON_WC_TAG)).toEqual(["name"]);
  });
});
