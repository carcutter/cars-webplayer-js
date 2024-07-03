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

  const {
    showHotspots,
    setShowHotspots,
    openGallery,
    extendMode,
    enableExtendMode,
    disableExtendMode,
  } = useGlobalContext();

  const handleHotspotsClick = () => {
    setShowHotspots(v => !v);
  };

  const handleShowGalleryClick = () => {
    openGallery();
  };

  const handleExtendClick = () => {
    enableExtendMode();
  };

  const handleCloseClick = () => {
    disableExtendMode();
  };

  return (
    <div
      className={`absolute ${positionClassName} flex gap-x-2 rounded bg-background p-2 shadow`}
    >
      {/* Hotspot button */}
      <Button
        variant={showHotspots ? "fill" : "ghost"}
        shape="icon"
        onClick={handleHotspotsClick}
      >
        <img
          className="size-full"
          src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/info.svg"
          alt="Hotspot icon"
        />
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

      {/* Extend/Close button */}
      <Button
        variant="ghost"
        color="neutral"
        shape="icon"
        onClick={!extendMode ? handleExtendClick : handleCloseClick}
      >
        {!extendMode ? (
          <img
            className="size-full"
            src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/fullscreen.svg"
            alt="Extend icon"
          />
        ) : (
          <img
            className="size-full"
            src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/close.svg"
            alt="Extend icon"
          />
        )}
      </Button>
    </div>
  );
};

export default OptionsBar;
