import {
  type FC as ReactFC,
  type PropsWithChildren as ReactPropsWithChildren,
} from "react";

import type { WebPlayerIconProps } from "@car-cutter/core";
import { webPlayerIconPropsToAttributes } from "@car-cutter/core-wc";

const WebPlayerIcon: ReactFC<ReactPropsWithChildren<WebPlayerIconProps>> = ({
  children,
  ...props
}) => {
  const attributes = webPlayerIconPropsToAttributes(props);

  return <cc-webplayer-icon {...attributes}>{children}</cc-webplayer-icon>;
};

export { WebPlayerIcon, type WebPlayerIconProps };
