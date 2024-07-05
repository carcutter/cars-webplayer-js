import r2wc from "@r2wc/react-to-web-component";

import {
  WEB_PLAYER_CUSTOM_ELEMENTS_NAME,
  WEB_PLAYER_ICON_CUSTOM_ELEMENTS_NAME,
} from "./const/custom_elements";
import WebPlayer from "./custom_elements/WebPlayer";
import WebPlayerIcon from "./custom_elements/WebPlayerIcon";

const WebPlayerWebComponent = r2wc(WebPlayer, {
  shadow: "open",
  props: {
    compositionUrl: "string",

    aspectRatio: "string",

    reverse360: "boolean",

    minImageWidth: "number",
    maxImageWidth: "number",
    imageLoadStrategy: "string",

    categoriesOrder: "string",
    flatten: "boolean",

    maxItemsShown: "number",
    itemsShownBreakpoint: "number",

    eventId: "string",
  },
});

const WebPlayerIconWebComponent = r2wc(WebPlayerIcon, {
  shadow: "closed",
  props: {
    feature: "string",
    color: "string",
  },
});

customElements.define(WEB_PLAYER_CUSTOM_ELEMENTS_NAME, WebPlayerWebComponent);
customElements.define(
  WEB_PLAYER_ICON_CUSTOM_ELEMENTS_NAME,
  WebPlayerIconWebComponent
);
