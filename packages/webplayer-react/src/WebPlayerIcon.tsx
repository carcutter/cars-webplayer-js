import { type FC as ReactFC } from "react";

import { type WebPlayerIconProps } from "@car-cutter/core-ui";
import { ensureCustomElementsDefinition } from "@car-cutter/core-wc";

ensureCustomElementsDefinition();

const WebPlayerIcon: ReactFC<WebPlayerIconProps> = props => {
  return <cc-webplayer-icon {...props} />;
};

export { WebPlayerIconProps };

export default WebPlayerIcon;
