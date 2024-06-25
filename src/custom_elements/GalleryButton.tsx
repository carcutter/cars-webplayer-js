import { PositionY } from "@/types/position";
import Button from "../components/ui/Button";
import { positionXToClassName, positionYToClassName } from "@/utils/style";

type Props = { position?: Extract<PositionY, "top" | "bottom"> };

const GalleryButton: React.FC<Props> = ({ position = "bottom" }) => {
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
