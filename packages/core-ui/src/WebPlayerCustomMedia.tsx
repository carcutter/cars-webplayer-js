import {
  useEffect,
  type FC as ReactFC,
  type PropsWithChildren as ReactPropsWithChildren,
} from "react";

import type { WebPlayerCustomMediaProps } from "@car-cutter/core";

import {
  useCustomizationContext,
  useCustomizationContextSafe,
} from "./providers/CustomizationContext";

const WebPlayerCustomMediaReact: ReactFC<
  ReactPropsWithChildren<WebPlayerCustomMediaProps>
> = ({ children: Media, index, thumbnailSrc }) => {
  const { registerCustomMedia, unregisterCustomMedia } =
    useCustomizationContext();

  useEffect(() => {
    if (!Media) {
      return;
    }

    const id = registerCustomMedia({
      Media,
      index,
      thumbnailSrc,
    });

    return () => {
      unregisterCustomMedia(id);
    };
  }, [Media, unregisterCustomMedia, index, registerCustomMedia, thumbnailSrc]);

  return null;
};

const WebPlayerCustomMedia: ReactFC<
  ReactPropsWithChildren<WebPlayerCustomMediaProps>
> = props => {
  const customizationCtx = useCustomizationContextSafe();

  // If the context is available, we are using the React version
  if (customizationCtx) {
    return <WebPlayerCustomMediaReact {...props} />;
  }

  // If not, we are using the Web Component version
  return <slot />;
};

export default WebPlayerCustomMedia;
