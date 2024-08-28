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
