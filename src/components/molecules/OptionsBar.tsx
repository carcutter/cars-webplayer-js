import CustomizableIcon from "@/components/atoms/CustomizableIcon";
import Button from "@/components/ui/Button";
import Separator from "@/components/ui/Separator";
import { useGlobalContext } from "@/providers/GlobalContext";
import { positionToClassName } from "@/utils/style";

type OptionBarProps = {
  dataLength: number;
};

const OptionsBar: React.FC<OptionBarProps> = ({ dataLength }) => {
  const {
    optionsPosition: position,

    showHotspots,
    toggleHotspots,
    showGallery,
    toggleGallery,
    extendMode,
    enableExtendMode,
    disableExtendMode,
  } = useGlobalContext();

  const positionClassName = positionToClassName(position);

  const handleHotspotsClick = () => {
    toggleHotspots();
  };

  const handleGalleryClick = () => {
    toggleGallery();
  };

  const handleExtendClick = () => {
    enableExtendMode();
  };

  const handleCloseClick = () => {
    disableExtendMode();
  };

  return (
    <div
      className={`absolute ${positionClassName} flex gap-x-1 rounded bg-background p-1 shadow sm:gap-x-2 sm:p-2`}
    >
      {/* Hotspot button */}
      <Button
        variant={showHotspots ? "fill" : "ghost"}
        shape="icon"
        onClick={handleHotspotsClick}
      >
        <CustomizableIcon customizationKey="CONTROLS_HOTSPOTS">
          <img
            className="size-full"
            src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/info.svg"
            alt="Hotspot icon"
          />
        </CustomizableIcon>
      </Button>

      {dataLength > 1 && (
        <>
          <Separator orientation="vertical" />

          <Button
            variant={showGallery ? "fill" : "ghost"}
            shape="icon"
            onClick={handleGalleryClick}
          >
            <CustomizableIcon customizationKey="CONTROLS_GALLERY">
              <img
                className="size-full"
                src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/motion.svg"
                alt="Gallery icon"
              />
            </CustomizableIcon>
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
          <CustomizableIcon customizationKey="CONTROLS_EXTEND">
            <img
              className="size-full"
              src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/fullscreen.svg"
              alt="Extend icon"
            />
          </CustomizableIcon>
        ) : (
          <CustomizableIcon customizationKey="CONTROLS_REDUCE">
            <img
              className="size-full"
              src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/close_fullscreen.svg"
              alt="Extend icon"
            />
          </CustomizableIcon>
        )}
      </Button>
    </div>
  );
};

export default OptionsBar;
