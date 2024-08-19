import {
  WEB_PLAYER_CUSTOM_ELEMENTS_NAME,
  WEB_PLAYER_ICON_CUSTOM_ELEMENTS_NAME,
} from "@car-cutter/core-webplayer";

import WebPlayerWebComponent from "./WebPlayer.wc";
import WebPlayerIconWebComponent from "./WebPlayerIcon.wc";

export function checkCustomElementsDefinition() {
  return (
    customElements.get(WEB_PLAYER_CUSTOM_ELEMENTS_NAME) &&
    customElements.get(WEB_PLAYER_ICON_CUSTOM_ELEMENTS_NAME)
  );
}

export function defineCustomElements() {
  customElements.define(WEB_PLAYER_CUSTOM_ELEMENTS_NAME, WebPlayerWebComponent);
  customElements.define(
    WEB_PLAYER_ICON_CUSTOM_ELEMENTS_NAME,
    WebPlayerIconWebComponent
  );
}

export function ensureCustomElementsDefinition() {
  if (checkCustomElementsDefinition()) {
    return;
  }

  defineCustomElements();
}
