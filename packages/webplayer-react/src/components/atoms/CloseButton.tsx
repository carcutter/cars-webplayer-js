import CloseIcon from "../icons/CloseIcon";
import Button, { ButtonProps } from "../ui/Button";

type Props = ButtonProps;

const CloseButton: React.FC<Props> = ({ className = "", ...props }) => {
  return (
    <Button color="neutral" shape="icon" className={className} {...props}>
      <CloseIcon className="size-full" />
    </Button>
  );
};

export default CloseButton;
