import { describe, expect, it, vi } from "vitest";

import {
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
  WEB_PLAYER_WC_TAG,
} from "@car-cutter/core";

import { ensureCustomElementsDefinition } from "./wc";

vi.mock("@car-cutter/core-ui", () => ({
  WebPlayer: () => null,
  WebPlayerCustomMedia: () => null,
  WebPlayerIcon: () => null,
}));
vi.mock("@car-cutter/core-ui/style.css?inline", () => ({ default: "" }));

describe("ensureCustomElementsDefinition", () => {
  it("defines none of the elements if another bundle defined some", () => {
    customElements.define(WEB_PLAYER_ICON_WC_TAG, class extends HTMLElement {});

    expect(() =>
      ensureCustomElementsDefinition({ render: vi.fn(), unmount: vi.fn() })
    ).toThrow(`${WEB_PLAYER_ICON_WC_TAG} already defined`);
    expect(customElements.get(WEB_PLAYER_WC_TAG)).toBeUndefined();
    expect(customElements.get(WEB_PLAYER_CUSTOM_MEDIA_WC_TAG)).toBeUndefined();
  });
});
