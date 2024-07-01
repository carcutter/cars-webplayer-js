import r2wc from "@r2wc/react-to-web-component";

import WebPlayer from "./custom_elements/WebPlayer";
import WebPlayerIcon from "./custom_elements/WebPlayerIcon";

const WebPlayerWebComponent = r2wc(WebPlayer, {
  shadow: "open",
  props: {
    compositionUrl: "string",

    aspectRatio: "string",
    flatten: "boolean",
    maxItemsShown: "number",
    breakpoint: "number",
  },
});

const WebPlayerIconWebComponent = r2wc(WebPlayerIcon, {
  props: {
    feature: "string",
    color: "string",
  },
});

customElements.define("cc-web-player", WebPlayerWebComponent);
customElements.define("cc-web-player-icon", WebPlayerIconWebComponent);
