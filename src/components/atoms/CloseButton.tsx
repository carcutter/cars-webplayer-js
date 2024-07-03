import Button, { ButtonProps } from "@/components/ui/Button";
import { Position } from "@/types/position";
import { positionToClassName } from "@/utils/style";

type Props = ButtonProps & { position?: Position };

const CloseButton: React.FC<Props> = ({ position = "top-right", ...props }) => {
  return (
    <Button
      color="neutral"
      shape="icon"
      className={`absolute ${positionToClassName(position)}`}
      {...props}
    >
      <img
        className="size-full"
        src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/close.svg"
        alt="Close"
      />
    </Button>
  );
};

export default CloseButton;
