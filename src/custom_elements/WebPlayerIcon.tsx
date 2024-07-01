import { useEffect } from "react";

import { useCustomizationContext } from "@/providers/CustomizationContext";

export type WebPlayerIconProps = { feature: string; color?: string };

const WebPlayerIcon: React.FC<React.PropsWithChildren<WebPlayerIconProps>> = ({
  feature,
  color,
  children,
}) => {
  const { setHotspotConfig } = useCustomizationContext();

  useEffect(() => {
    if (!children) {
      return;
    }

    setHotspotConfig(feature, {
      Icon: children,
      color: color,
    });
  }, [children, color, feature, setHotspotConfig]);

  return null;
};

export default WebPlayerIcon;
