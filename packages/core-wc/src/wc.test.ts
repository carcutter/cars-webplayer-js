import { describe, expect, it } from "vitest";

import {
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
  WEB_PLAYER_WC_TAG,
} from "@car-cutter/core";

import { checkCustomElementsDefinition } from "./wc";

describe("checkCustomElementsDefinition", () => {
  it("is true only once the three elements are defined", () => {
    expect(checkCustomElementsDefinition()).toBe(false);

    customElements.define(WEB_PLAYER_WC_TAG, class extends HTMLElement {});
    customElements.define(
      WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
      class extends HTMLElement {}
    );
    expect(checkCustomElementsDefinition()).toBe(false);

    customElements.define(WEB_PLAYER_ICON_WC_TAG, class extends HTMLElement {});
    expect(checkCustomElementsDefinition()).toBe(true);
  });
});
