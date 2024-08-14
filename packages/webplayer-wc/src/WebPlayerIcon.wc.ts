import r2wc from "@r2wc/react-to-web-component";

import { WebPlayerIcon } from "@car-cutter/react-webplayer";

const WebPlayerIconWebComponent = r2wc(WebPlayerIcon, {
  shadow: "closed",
  props: {
    name: "string",
    color: "string",
  },
});

export default WebPlayerIconWebComponent;
