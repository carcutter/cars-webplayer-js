import { describe, expect, it, vi } from "vitest";

import {
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
  WEB_PLAYER_WC_TAG,
} from "@car-cutter/core";

import {
  checkCustomElementsDefinition,
  ensureCustomElementsDefinition,
} from "./wc";
import { WEB_PLAYER_WC_PROPS } from "./webplayer-props";

vi.mock("@car-cutter/core-ui", () => ({
  WebPlayer: () => null,
  WebPlayerCustomMedia: () => null,
  WebPlayerIcon: () => null,
}));
vi.mock("@car-cutter/core-ui/style.css?inline", () => ({ default: "" }));

const renderer = { render: vi.fn(), unmount: vi.fn() };

const observedAttributes = (tag: string) =>
  (customElements.get(tag) as unknown as { observedAttributes: string[] })
    .observedAttributes;

// In order: the elements stay defined from one test to the next
describe("WebPlayer's custom elements", () => {
  it("aren't defined at first", () => {
    expect(checkCustomElementsDefinition()).toBe(false);
  });

  it("are defined, with an attribute for every WebPlayer prop (#235)", () => {
    ensureCustomElementsDefinition(renderer);

    expect(checkCustomElementsDefinition()).toBe(true);
    const attributes = observedAttributes(WEB_PLAYER_WC_TAG);
    expect(attributes).toHaveLength(Object.keys(WEB_PLAYER_WC_PROPS).length);
    expect(attributes).toEqual(
      expect.arrayContaining([
        "integration",
        "max-items-shown",
        "composition-url",
      ])
    );
    expect(observedAttributes(WEB_PLAYER_CUSTOM_MEDIA_WC_TAG)).toEqual([
      "index",
      "thumbnail-src",
    ]);
    expect(observedAttributes(WEB_PLAYER_ICON_WC_TAG)).toEqual(["name"]);
  });

  it("aren't defined again", () => {
    const player = customElements.get(WEB_PLAYER_WC_TAG);

    ensureCustomElementsDefinition(renderer);

    expect(customElements.get(WEB_PLAYER_WC_TAG)).toBe(player);
  });
});
