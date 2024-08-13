import CloseIcon from "@/components/icons/CloseIcon";
import Button, { ButtonProps } from "@/components/ui/Button";

type Props = ButtonProps;

const CloseButton: React.FC<Props> = ({ className = "", ...props }) => {
  return (
    <Button color="neutral" shape="icon" className={className} {...props}>
      <CloseIcon className="size-full" />
    </Button>
  );
};

export default CloseButton;
