import CustomizableIcon from "@/components/atoms/CustomizableIcon";
import CloseIcon from "@/components/icons/CloseIcon";
import Button, { ButtonProps } from "@/components/ui/Button";

type Props = ButtonProps;

const PlayButton: React.FC<Props> = ({ className = "", ...props }) => {
  return (
    <Button color="neutral" shape="icon" className={className} {...props}>
      <CustomizableIcon customizationKey="CONTROLS_PLAY">
        <CloseIcon className="size-full" />
      </CustomizableIcon>
    </Button>
  );
};

export default PlayButton;
