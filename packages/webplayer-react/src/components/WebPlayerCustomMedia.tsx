import {
  type FC as ReactFC,
  type PropsWithChildren as ReactPropsWithChildren,
} from "react";

import type { WebPlayerCustomMediaProps } from "@car-cutter/core";
import { webPlayerCustomMediaPropsToAttributes } from "@car-cutter/core-wc";

const WebPlayerCustomMedia: ReactFC<
  ReactPropsWithChildren<WebPlayerCustomMediaProps>
> = ({ children, ...props }) => {
  const attributes = webPlayerCustomMediaPropsToAttributes(props);

  return (
    <cc-webplayer-custom-media {...attributes}>
      {children}
    </cc-webplayer-custom-media>
  );
};

export { WebPlayerCustomMedia, type WebPlayerCustomMediaProps };
