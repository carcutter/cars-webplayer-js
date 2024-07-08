import CustomizableIcon from "@/components/atoms/CustomizableIcon";
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
        <CustomizableIcon customizationKey="CONTROLS_ARROW_LEFT">
          <img
            className="size-full rotate-180"
            src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/arrow_forward.svg"
            alt="Previous icon"
          />
        </CustomizableIcon>
      </Button>
      <Button
        shape="icon"
        color="neutral"
        className={`absolute ${positionYClassName} ${positionXToClassName("right")}`}
        onClick={onNext}
        disabled={currentIndex >= maxIndex}
      >
        <CustomizableIcon customizationKey="CONTROLS_ARROW_RIGHT">
          <img
            className="size-full"
            src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/arrow_forward.svg"
            alt="Next icon"
          />
        </CustomizableIcon>
      </Button>
    </>
  );
};

export default NextPrevButtons;
