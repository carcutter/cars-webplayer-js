import r2wc from "@r2wc/react-to-web-component";

import { WebPlayerIcon } from "@car-cutter/core-ui";

const WebPlayerIconWebComponent = r2wc(WebPlayerIcon, {
  shadow: "closed",
  props: {
    name: "string",
  },
});

export default WebPlayerIconWebComponent;
