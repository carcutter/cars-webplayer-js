import Button from "@/components/ui/Button";
import { PositionY } from "@/types/position";
import { positionXToClassName, positionYToClassName } from "@/utils/style";

type Props = {
  currentIndex: number;
  maxIndex: number;
  onPrev: () => void;
  onNext: () => void;
  positionY?: PositionY;
};

const NextPrevButtons: React.FC<Props> = ({
  currentIndex,
  maxIndex,
  onPrev,
  onNext,
  positionY = "middle",
}) => {
  const positionYClassName = positionYToClassName(positionY);

  return (
    <>
      <Button
        shape="icon"
        color="neutral"
        className={`absolute ${positionYClassName} ${positionXToClassName("left")}`}
        onClick={onPrev}
        disabled={currentIndex <= 0}
      >
        <img
          className="size-full rotate-180"
          src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/arrow_forward.svg"
          alt="Previous"
        />
      </Button>
      <Button
        shape="icon"
        color="neutral"
        className={`absolute ${positionYClassName} ${positionXToClassName("right")}`}
        onClick={onNext}
        disabled={currentIndex >= maxIndex}
      >
        <img
          className="size-full"
          src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/arrow_forward.svg"
          alt="Next"
        />
      </Button>
    </>
  );
};

export default NextPrevButtons;
