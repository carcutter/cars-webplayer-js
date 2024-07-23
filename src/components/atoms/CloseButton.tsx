import CustomizableIcon from "@/components/atoms/CustomizableIcon";
import Button, { ButtonProps } from "@/components/ui/Button";

type Props = ButtonProps;

const CloseButton: React.FC<Props> = ({ className = "", ...props }) => {
  return (
    <Button color="neutral" shape="icon" className={className} {...props}>
      <CustomizableIcon customizationKey="CONTROLS_CLOSE">
        <img
          src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/close.svg"
          alt="Close"
        />
      </CustomizableIcon>
    </Button>
  );
};

export default CloseButton;
