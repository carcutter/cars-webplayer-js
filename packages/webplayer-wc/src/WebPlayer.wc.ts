import r2wc from "@r2wc/react-to-web-component";

import { WebPlayer } from "@car-cutter/react-webplayer";

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

export default WebPlayerWebComponent;
