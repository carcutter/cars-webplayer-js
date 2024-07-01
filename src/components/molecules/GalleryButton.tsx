import Button from "@/components/ui/Button";
import { Item } from "@/types/composition";
import { PositionY } from "@/types/position";
import { positionXToClassName, positionYToClassName } from "@/utils/style";

type Props = {
  data: Item[];
  position?: Extract<PositionY, "top" | "bottom">;
};

// TODO: Implement the behavior
const GalleryButton: React.FC<Props> = ({ data, position = "bottom" }) => {
  if (data.length < 2) {
    return null;
  }

  const positionYClassName = positionYToClassName(position);
  const positionXClassName = positionXToClassName("center");

  return (
    <Button
      color="neutral"
      className={`absolute ${positionYClassName} ${positionXClassName}`}
    >
      Gallerie
    </Button>
  );
};

export default GalleryButton;
