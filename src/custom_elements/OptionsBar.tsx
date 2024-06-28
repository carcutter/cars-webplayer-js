import Button from "@/components/ui/Button";
import Separator from "@/components/ui/Separator";
import { useGlobalContext } from "@/providers/GlobalContext";
import { Position } from "@/types/position";
import { positionToClassName } from "@/utils/style";

type OptionBarProps = {
  position?: Position;
};

// TODO: Split category selection into a separate component
const OptionsBar: React.FC<OptionBarProps> = ({ position = "top-right" }) => {
  const positionClassName = positionToClassName(position);

  const { showHotspots, setShowHotspots } = useGlobalContext();

  const handleHotspotsClick = () => {
    setShowHotspots(v => !v);
  };

  const handleExtendClick = () => {
    // TODO
  };

  return (
    <div
      className={`absolute ${positionClassName} flex gap-x-2 rounded bg-background p-2 shadow`}
    >
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
