import CustomizableIcon from "@/components/atoms/CustomizableIcon";
import CloseIcon from "@/components/icons/CloseIcon";
import Button, { ButtonProps } from "@/components/ui/Button";

type Props = ButtonProps;

const CloseButton: React.FC<Props> = ({ className = "", ...props }) => {
  return (
    <Button color="neutral" shape="icon" className={className} {...props}>
      <CustomizableIcon customizationKey="CONTROLS_CLOSE">
        <CloseIcon className="size-full" />
      </CustomizableIcon>
    </Button>
  );
};

export default CloseButton;
