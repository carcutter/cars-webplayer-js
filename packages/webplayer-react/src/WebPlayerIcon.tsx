import {
  type FC as ReactFC,
  type PropsWithChildren as ReactPropsWithChildren,
} from "react";

import { type WebPlayerIconProps } from "@car-cutter/core-ui";
import {
  ensureCustomElementsDefinition,
  webPlayerIconPropsToAttributes,
} from "@car-cutter/core-wc";

ensureCustomElementsDefinition();

const WebPlayerIcon: ReactFC<ReactPropsWithChildren<WebPlayerIconProps>> = ({
  children,
  ...props
}) => {
  const attributes = webPlayerIconPropsToAttributes(props);

  return <cc-webplayer-icon {...attributes}>{children}</cc-webplayer-icon>;
};

export { WebPlayerIcon, type WebPlayerIconProps };
