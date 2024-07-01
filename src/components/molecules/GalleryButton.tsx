import Button from "@/components/ui/Button";
import { useGlobalContext } from "@/providers/GlobalContext";
import { Item } from "@/types/composition";
import { PositionY } from "@/types/position";
import { positionsToClassName } from "@/utils/style";

type Props = {
  data: Item[];
  positionY?: Extract<PositionY, "top" | "bottom">;
};

const GalleryButton: React.FC<Props> = ({ data, positionY = "bottom" }) => {
  const { setShowGallery } = useGlobalContext();

  if (data.length < 2) {
    return null;
  }

  const positionClassName = positionsToClassName({
    positionY,
    positionX: "center",
  });

  const handleClick = () => {
    setShowGallery(v => !v);
  };

  return (
    <Button
      color="neutral"
      className={`absolute ${positionClassName}`}
      onClick={handleClick}
    >
      Gallerie
    </Button>
  );
};

export default GalleryButton;
