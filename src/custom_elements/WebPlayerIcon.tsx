import { useEffect } from "react";

import {
  useCustomizationContext,
  useCustomizationContextSafe,
} from "@/providers/CustomizationContext";

export type WebPlayerIconProps = {
  name: string;
  color?: string;
  override?: boolean;
};

const WebPlayerIconReact: React.FC<
  React.PropsWithChildren<WebPlayerIconProps>
> = ({ name, color, override, children: Icon }) => {
  const { setIconConfig, resetIconConfig } = useCustomizationContext();

  useEffect(() => {
    if (!Icon && !color) {
      return;
    }

    setIconConfig(name, {
      Icon,
      color,
      override,
    });

    return () => {
      resetIconConfig(name);
    };
  }, [Icon, color, name, override, resetIconConfig, setIconConfig]);

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
