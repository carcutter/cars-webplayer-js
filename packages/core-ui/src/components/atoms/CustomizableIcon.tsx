import { useCustomizationContext } from "../../providers/CustomizationContext";
import { WebPlayerIconName } from "../../types/WebPlayerIcon.props";

type Props = { customizationKey: WebPlayerIconName; className?: string };

const CustomizableIcon: React.FC<React.PropsWithChildren<Props>> = ({
  customizationKey,
  className,
  children: fallbackIcon,
}) => {
  const { getIconConfig } = useCustomizationContext();
  const iconConfig = getIconConfig(customizationKey);

  const customIcon = iconConfig?.Icon;

  if (!customIcon) {
    return fallbackIcon;
  }

  if (!className) {
    return customIcon;
  }

  return <div className={className}>{customIcon}</div>;
};

export default CustomizableIcon;
