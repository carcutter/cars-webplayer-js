import Button from "@/components/ui/Button";
import Separator from "@/components/ui/Separator";
import { useGlobalContext } from "@/providers/GlobalContext";
import { Position } from "@/types/position";
import { positionToClassName } from "@/utils/style";

type OptionBarProps = {
  length: number;
  position?: Position;
};

const OptionsBar: React.FC<OptionBarProps> = ({
  length,
  position = "top-right",
}) => {
  const positionClassName = positionToClassName(position);

  const { showHotspots, setShowHotspots, setShowGallery, enableExtendMode } =
    useGlobalContext();

  const handleHotspotsClick = () => {
    setShowHotspots(v => !v);
  };

  const handleShowGalleryClick = () => {
    setShowGallery(v => !v);
  };

  const handleExtendClick = () => {
    enableExtendMode();
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

      {length > 1 && (
        <>
          <Separator orientation="vertical" />

          <Button
            variant="ghost"
            color="neutral"
            shape="icon"
            onClick={handleShowGalleryClick}
          >
            <img
              className="size-full"
              src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/motion.svg"
              alt="Gallery icon"
            />
          </Button>
        </>
      )}

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
          alt="Extend icon"
        />
      </Button>
    </div>
  );
};

export default OptionsBar;
