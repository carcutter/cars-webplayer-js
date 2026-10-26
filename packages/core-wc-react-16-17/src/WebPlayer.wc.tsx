import r2wc from "@r2wc/react-to-web-component";

import {
  WEB_PLAYER_WC_PROPS,
  WebPlayerWithInjectedStyles,
  patchWebComponentProps,
} from "@car-cutter/core-wc";

const WebPlayerWebComponent = r2wc(WebPlayerWithInjectedStyles, {
  shadow: "closed",
  props: WEB_PLAYER_WC_PROPS,
});

patchWebComponentProps(WebPlayerWebComponent, WEB_PLAYER_WC_PROPS);

export default WebPlayerWebComponent;
