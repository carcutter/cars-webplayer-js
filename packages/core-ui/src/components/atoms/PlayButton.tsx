import PlayIcon from "../icons/PlayIcon";
import Button, { ButtonProps } from "../ui/Button";

type Props = ButtonProps;

const PlayButton: React.FC<Props> = props => {
  return (
    <Button color="neutral" shape="icon" {...props}>
      <PlayIcon className="size-full" />
    </Button>
  );
};

export default PlayButton;
