import {
  type FC as ReactFC,
  type PropsWithChildren as ReactPropsWithChildren,
} from "react";

import { type WebPlayerCustomMediaProps } from "@car-cutter/core-ui";
import {
  ensureCustomElementsDefinition,
  webPlayerCustomMediaPropsToAttributes,
} from "@car-cutter/core-wc";

ensureCustomElementsDefinition();
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
