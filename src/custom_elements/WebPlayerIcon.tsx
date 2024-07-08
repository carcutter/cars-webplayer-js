import { useEffect } from "react";

import {
  useCustomizationContext,
  useCustomizationContextSafe,
} from "@/providers/CustomizationContext";

export type WebPlayerIconProps = { icon: string; color?: string };

const WebPlayerIconReact: React.FC<
  React.PropsWithChildren<WebPlayerIconProps>
> = ({ icon, color, children: Icon }) => {
  const { setIconConfig, resetIconConfig } = useCustomizationContext();

  useEffect(() => {
    if (!Icon && !color) {
      return;
    }

    setIconConfig(icon, {
      Icon,
      color,
    });

    return () => {
      resetIconConfig(icon);
    };
  }, [Icon, color, icon, resetIconConfig, setIconConfig]);

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
