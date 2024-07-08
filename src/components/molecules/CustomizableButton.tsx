import CustomizableIcon from "@/components/atoms/CustomizableIcon";
import Button, { ButtonProps } from "@/components/ui/Button";
import { useCustomizationContext } from "@/providers/CustomizationContext";

type Props = ButtonProps & { customizationKey: string; iconClassName?: string };

const CustomizableButton: React.FC<React.PropsWithChildren<Props>> = ({
  customizationKey,
  iconClassName,
  children: fallbackIcon,
  ...props
}) => {
  const { getIconConfig } = useCustomizationContext();
  const iconConfig = getIconConfig(customizationKey);

  if (iconConfig?.override) {
    return <button {...props}>{iconConfig.Icon}</button>;
  }

  return (
    <Button {...props}>
      <CustomizableIcon
        customizationKey={customizationKey}
        className={iconClassName}
      >
        {fallbackIcon}
      </CustomizableIcon>
    </Button>
  );
};

export default CustomizableButton;
