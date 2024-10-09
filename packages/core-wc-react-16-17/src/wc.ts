import {
  WEB_PLAYER_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
} from "@car-cutter/core";
import { checkCustomElementsDefinition } from "@car-cutter/core-wc";

import WebPlayerWebComponent from "./WebPlayer.wc";
import WebPlayerCustomMediaWebComponent from "./WebPlayerCustomMedia.wc";
import WebPlayerIconWebComponent from "./WebPlayerIcon.wc";

/**
 * Defines WebPlayer's custom elements in the DOM.
 */
function defineCustomElements(): void {
  customElements.define(WEB_PLAYER_WC_TAG, WebPlayerWebComponent);
  customElements.define(
    WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
    WebPlayerCustomMediaWebComponent
  );
  customElements.define(WEB_PLAYER_ICON_WC_TAG, WebPlayerIconWebComponent);
}

/**
 * Ensures that WebPlayer's custom elements are defined in the DOM.
 * If they are not already defined, it defines them.
 */
export function ensureCustomElementsDefinition(): void {
  if (checkCustomElementsDefinition()) {
    return;
  }

  defineCustomElements();
}
