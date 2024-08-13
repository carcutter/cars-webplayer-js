import r2wc from "@r2wc/react-to-web-component";

import {
  WEB_PLAYER_CUSTOM_ELEMENTS_NAME,
  WEB_PLAYER_ICON_CUSTOM_ELEMENTS_NAME,
} from "@car-cutter/core-webplayer";
import { WebPlayerIcon, WebPlayer } from "@car-cutter/react-webplayer";

const WebPlayerWebComponent = r2wc(WebPlayer, {
  shadow: "open",
  props: {
    compositionUrl: "string",

    reverse360: "boolean",

    minImageWidth: "number",
    maxImageWidth: "number",
    imageLoadStrategy: "string",

    flatten: "boolean",
    infiniteCarrousel: "boolean",

    eventId: "string",

    allowFullScreen: "boolean",

    permanentGallery: "boolean",
  },
});

const WebPlayerIconWebComponent = r2wc(WebPlayerIcon, {
  shadow: "closed",
  props: {
    name: "string",
    color: "string",
  },
});

customElements.define(WEB_PLAYER_CUSTOM_ELEMENTS_NAME, WebPlayerWebComponent);
customElements.define(
  WEB_PLAYER_ICON_CUSTOM_ELEMENTS_NAME,
  WebPlayerIconWebComponent
);
