import {
  WEB_PLAYER_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
} from "@car-cutter/core-webplayer";

import WebPlayerWebComponent from "./WebPlayer.wc";
import WebPlayerIconWebComponent from "./WebPlayerIcon.wc";

export function checkCustomElementsDefinition() {
  return (
    customElements.get(WEB_PLAYER_WC_TAG) &&
    customElements.get(WEB_PLAYER_ICON_WC_TAG)
  );
}

export function defineCustomElements() {
  customElements.define(WEB_PLAYER_WC_TAG, WebPlayerWebComponent);
  customElements.define(WEB_PLAYER_ICON_WC_TAG, WebPlayerIconWebComponent);
}

export function ensureCustomElementsDefinition() {
  if (checkCustomElementsDefinition()) {
    return;
  }

  defineCustomElements();
}
