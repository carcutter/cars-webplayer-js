import {
  useEffect,
  type FC as ReactFC,
  type PropsWithChildren as ReactPropsWithChildren,
} from "react";

import {
  useCustomizationContext,
  useCustomizationContextSafe,
} from "./providers/CustomizationContext";
import { WebPlayerIconProps } from "./types/WebPlayerIcon.props";

const WebPlayerIconReact: ReactFC<
  ReactPropsWithChildren<WebPlayerIconProps>
> = ({ name, children: Icon }) => {
  const { registerIconConfig, unregisterIconConfig } =
    useCustomizationContext();

  useEffect(() => {
    if (!Icon) {
      return;
    }

    registerIconConfig(name, {
      Icon,
    });

    return () => {
      unregisterIconConfig(name);
    };
  }, [Icon, name, registerIconConfig, unregisterIconConfig]);

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
