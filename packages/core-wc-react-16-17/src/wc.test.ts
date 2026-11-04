import { describe, expect, it, vi } from "vitest";

import {
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
  WEB_PLAYER_WC_TAG,
} from "@car-cutter/core";

import { ensureCustomElementsDefinition } from "../index";

vi.mock("@car-cutter/core-ui", () => ({
  WebPlayer: () => null,
  WebPlayerCustomMedia: () => null,
  WebPlayerIcon: () => null,
}));
vi.mock("@car-cutter/core-ui/style.css?inline", () => ({ default: "" }));

describe("ensureCustomElementsDefinition", () => {
  it("defines the three elements, once", () => {
    ensureCustomElementsDefinition();
    ensureCustomElementsDefinition();

    expect(customElements.get(WEB_PLAYER_WC_TAG)).toBeDefined();
    expect(customElements.get(WEB_PLAYER_CUSTOM_MEDIA_WC_TAG)).toBeDefined();
    expect(customElements.get(WEB_PLAYER_ICON_WC_TAG)).toBeDefined();
  });
});
