import { useCustomizationContext } from "@/providers/CustomizationContext";

type Props = { customizationKey: string; className?: string };

const CustomizableIcon: React.FC<React.PropsWithChildren<Props>> = ({
  customizationKey,
  className = "",
  children: fallbackIcon,
}) => {
  const { getIconConfig } = useCustomizationContext();
  const iconConfig = getIconConfig(customizationKey);

  if (!iconConfig) {
    return fallbackIcon;
  }

  return (
    <div
      className={className}
      // Override the background color with the one from the config if available
      style={{ color: iconConfig?.color }}
    >
      {/* Use the icon from the config if available. Else, replace it if needed */}
      {iconConfig?.Icon ?? fallbackIcon}
    </div>
  );
};

export default CustomizableIcon;
