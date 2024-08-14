import {
  WEB_PLAYER_CUSTOM_ELEMENTS_NAME,
  WEB_PLAYER_ICON_CUSTOM_ELEMENTS_NAME,
} from "@car-cutter/core-webplayer";

import WebPlayerWebComponent from "./WebPlayer.wc";
import WebPlayerIconWebComponent from "./WebPlayerIcon.wc";

export function defineWebPlayerCustomElements() {
  customElements.define(WEB_PLAYER_CUSTOM_ELEMENTS_NAME, WebPlayerWebComponent);
  customElements.define(
    WEB_PLAYER_ICON_CUSTOM_ELEMENTS_NAME,
    WebPlayerIconWebComponent
  );
}
