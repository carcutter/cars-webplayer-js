import {
  WEB_PLAYER_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
} from "@car-cutter/core";

import WebPlayerWebComponent from "./WebPlayer.wc";
import WebPlayerCustomMediaWebComponent from "./WebPlayerCustomMedia.wc";
import WebPlayerIconWebComponent from "./WebPlayerIcon.wc";

/**
 * Checks if WebPlayer's custom elements are defined and usable in the DOM.
 */
export function checkCustomElementsDefinition(): boolean {
  return (
    !!customElements.get(WEB_PLAYER_WC_TAG) &&
    !!customElements.get(WEB_PLAYER_CUSTOM_MEDIA_WC_TAG) &&
    !!customElements.get(WEB_PLAYER_ICON_WC_TAG)
  );
}

/**
 * Defines WebPlayer's custom elements in the DOM.
 */
export function defineCustomElements(): void {
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
