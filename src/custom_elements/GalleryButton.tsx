import { PositionY } from "@/types/position";
import Button from "../components/ui/Button";
import { positionXToClassName, positionYToClassName } from "@/utils/style";
import { Item } from "@/types/composition";

type Props = {
  data: Item[];
  position?: Extract<PositionY, "top" | "bottom">;
};

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
