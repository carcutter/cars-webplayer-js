import CloseIcon from "../icons/CloseIcon";
import Button, { ButtonProps } from "../ui/Button";

type Props = ButtonProps;

const CloseButton: React.FC<Props> = props => {
  return (
    <Button color="neutral" shape="icon" {...props}>
      <CloseIcon className="size-full" />
    </Button>
  );
};

export default CloseButton;
