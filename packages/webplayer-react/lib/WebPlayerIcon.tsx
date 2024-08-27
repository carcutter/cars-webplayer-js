import {
  useEffect,
  type FC as ReactFC,
  type PropsWithChildren as ReactPropsWithChildren,
} from "react";

import type { WebPlayerIconProps } from "@car-cutter/core-webplayer";

import {
  useCustomizationContext,
  useCustomizationContextSafe,
} from "../src/providers/CustomizationContext";

const WebPlayerIconReact: ReactFC<
  ReactPropsWithChildren<WebPlayerIconProps>
> = ({ name, color, children: Icon }) => {
  const { setIconConfig, resetIconConfig } = useCustomizationContext();

  useEffect(() => {
    if (!Icon && !color) {
      return;
    }

    setIconConfig(name, {
      Icon,
      color,
    });

    return () => {
      resetIconConfig(name);
    };
  }, [Icon, color, name, resetIconConfig, setIconConfig]);

  return null;
};

const WebPlayerIcon: ReactFC<
  ReactPropsWithChildren<WebPlayerIconProps>
> = props => {
  const customizationCtx = useCustomizationContextSafe();

  // If the context is available, we are using the React version
  if (customizationCtx) {
    return <WebPlayerIconReact {...props} />;
  }

  // If not, we are using the Web Component version
  return <slot />;
};

export default WebPlayerIcon;
