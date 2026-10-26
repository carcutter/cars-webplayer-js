import { describe, expect, it, vi } from "vitest";

import * as entry from "./index";

vi.mock("@car-cutter/core-ui", () => ({
  WebPlayer: () => null,
  WebPlayerCustomMedia: () => null,
  WebPlayerIcon: () => null,
}));
vi.mock("@car-cutter/core-ui/dist/style.css?inline", () => ({ default: "" }));

describe("@car-cutter/wc-webplayer", () => {
  it("defines the custom elements on demand", () => {
    expect(entry.checkCustomElementsDefinition()).toBe(false);

    entry.ensureCustomElementsDefinition();

    expect(entry.checkCustomElementsDefinition()).toBe(true);
  });

  it("exposes the attribute helpers and the core constants", () => {
    expect(entry.webPlayerPropsToAttributes({ compositionUrl: "u" })).toEqual({
      "composition-url": "u",
    });
    expect(entry.webPlayerCustomMediaPropsToAttributes({ index: 1 })).toEqual({
      index: "1",
    });
    expect(entry.webPlayerIconPropsToAttributes({ name: "UI_IMAGE" })).toEqual({
      name: "UI_IMAGE",
    });
    expect(entry).toMatchObject({
      WEB_PLAYER_WC_TAG: "cc-webplayer",
      WEB_PLAYER_CUSTOM_MEDIA_WC_TAG: "cc-webplayer-custom-media",
      WEB_PLAYER_ICON_WC_TAG: "cc-webplayer-icon",
      DEFAULT_EVENT_PREFIX: "cc-webplayer:",
    });
  });
});
