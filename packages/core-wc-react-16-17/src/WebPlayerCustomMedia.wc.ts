import r2wc from "@r2wc/react-to-web-component";

import { WebPlayerCustomMedia } from "@car-cutter/core-ui";

const WebPlayerCustomMediaWebComponent = r2wc(WebPlayerCustomMedia, {
  shadow: "closed",
  props: {
    index: "number",
    thumbnailSrc: "string",
  },
});

export default WebPlayerCustomMediaWebComponent;
