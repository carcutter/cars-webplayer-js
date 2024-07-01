import { useEffect } from "react";

import { useCustomizationContextSafe } from "@/providers/CustomizationContext";

export type WebPlayerIconProps = { feature: string; color?: string };

const WebPlayerIcon: React.FC<React.PropsWithChildren<WebPlayerIconProps>> = ({
  feature,
  color,
  children,
}) => {
  const setHotspotConfigWithCtx =
    useCustomizationContextSafe()?.setHotspotConfig;

  useEffect(() => {
    if (!setHotspotConfigWithCtx) {
      return;
    }

    if (!children && !color) {
      return;
    }

    setHotspotConfigWithCtx(feature, {
      Icon: children,
      color: color,
    });
  }, [children, color, feature, setHotspotConfigWithCtx]);

  return <slot />;
};

export default WebPlayerIcon;
