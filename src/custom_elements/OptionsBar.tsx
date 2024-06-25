import { Composition } from "@/types/composition";
import { positionXToClassName, positionYToClassName } from "@/utils/style";
import { PositionY } from "@/types/position";
import Separator from "../components/ui/Separator";
import Button from "../components/ui/Button";
import { useGlobalContext } from "@/providers/GlobalContext";

type OptionBarProps = {
  composition: Composition;
  selectedCategory: string;
  onChangeSelectedCategory: (category: string) => void;
  position?: Extract<PositionY, "top" | "bottom">;
};

const OptionsBar: React.FC<OptionBarProps> = ({
  composition,
  selectedCategory,
  onChangeSelectedCategory,
  position = "top",
}) => {
  const positionYClassName = positionYToClassName(position);
  const positionXClassName = positionXToClassName("center");

  const { showHotspots, setShowHotspots } = useGlobalContext();

  const handleCategoryClick = (category: string) => {
    if (category === selectedCategory) {
      return;
    }
    onChangeSelectedCategory(category);
  };

  const handleHotspotsClick = () => {
    setShowHotspots((v) => !v);
  };

  const handleExtendClick = () => {
    //
  };

  return (
    <div
      className={`absolute ${positionYClassName} ${positionXClassName} bg-background p-2 rounded flex gap-x-2`}
    >
      {/* Category selection */}
      <div className="flex gap-x-2">
        {composition.map(({ category, title }) => (
          <Button
            key={category}
            variant={category === selectedCategory ? "fill" : "ghost"}
            onClick={() => handleCategoryClick(category)}
          >
            {title}
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" />

      {/* Hotspot button */}
      <Button
        variant={showHotspots ? "fill" : "ghost"}
        onClick={handleHotspotsClick}
      >
        Hotspots
      </Button>

      <Separator orientation="vertical" />

      {/* Extend button */}
      <Button
        variant="ghost"
        color="neutral"
        shape="icon"
        onClick={handleExtendClick}
      >
        <img
          className="size-full"
          src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/fullscreen.svg"
          alt="Previous"
        />
      </Button>
    </div>
  );
};

export default OptionsBar;
