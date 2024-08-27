import { useEffect } from "react";

import type { WebPlayerIconProps } from "@car-cutter/core-webplayer";

import {
  useCustomizationContext,
  useCustomizationContextSafe,
} from "../src/providers/CustomizationContext";

const WebPlayerIconReact: React.FC<
  React.PropsWithChildren<WebPlayerIconProps>
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

const WebPlayerIcon: React.FC<
  React.PropsWithChildren<WebPlayerIconProps>
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
