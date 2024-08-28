import PlayIcon from "../icons/PlayIcon";
import Button, { ButtonProps } from "../ui/Button";

type Props = ButtonProps;

const PlayButton: React.FC<Props> = ({ className = "", ...props }) => {
  return (
    <Button color="neutral" shape="icon" className={className} {...props}>
      <PlayIcon className="size-full" />
    </Button>
  );
};

export default PlayButton;
