import { PositionY } from "@/types/position";
import { positionYToClassName } from "@/utils/style";
import IconButton from "./atoms/IconButton";

type Props = {
  onPrev: () => void;
  onNext: () => void;
  position?: PositionY;
};

const NextPrevButtons: React.FC<Props> = ({
  onPrev,
  onNext,
  position = "middle",
}) => {
  const positionYClassName = positionYToClassName(position);

  return (
    <>
      <IconButton
        className={`absolute ${positionYClassName} left-0`}
        onClick={onPrev}
      >
        {"<"}
      </IconButton>
      <IconButton
        className={`absolute ${positionYClassName} right-0`}
        onClick={onNext}
      >
        {">"}
      </IconButton>
    </>
  );
};

export default NextPrevButtons;
