import { useCallback } from "react";

import CloseButton from "@/components/atoms/CloseButton";
import CustomizableIcon from "@/components/atoms/CustomizableIcon";
import IndexIndicator from "@/components/atoms/IndexIndicator";
import CategorySelect from "@/components/molecules/CategorySelect";
import CustomizableButton from "@/components/molecules/CustomizableButton";
import Gallery from "@/components/organisms/Gallery";
import Button from "@/components/ui/Button";
import Separator from "@/components/ui/Separator";
import { useControlsContext } from "@/providers/ControlsContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import { positionToClassName } from "@/utils/style";

const WebPlayerOverlay: React.FC = () => {
  const { flatten } = useGlobalContext();

  const {
    displayedItems: { length: dataLength },
    slidable,

    currentItemIndex,
    setTargetItemIndex,

    showHotspots,
    toggleHotspots,
    showGallery,
    toggleGallery,
    extendMode,
    toggleExtendMode,

    isZoomed,
    resetZoom,
    canZoomIn,
    zoomIn,
    canZoomOut,
    zoomOut,
  } = useControlsContext();

  const prevImage = useCallback(() => {
    setTargetItemIndex(currentItemIndex - 1);
  }, [currentItemIndex, setTargetItemIndex]);

  const nextImage = useCallback(() => {
    setTargetItemIndex(currentItemIndex + 1);
  }, [currentItemIndex, setTargetItemIndex]);

  const handleCloseClick = useCallback(() => {
    resetZoom();
  }, [resetZoom]);

  return (
    <>
      {/* CategorySelect (on top) */}
      {!flatten && (
        <div className={`absolute ${positionToClassName("top-center")}`}>
          <CategorySelect />
        </div>
      )}

      {/* Index indicator & Next/Prev buttons */}
      {!isZoomed && slidable && (
        <>
          <div className={`absolute ${positionToClassName("top-right")}`}>
            <IndexIndicator
              currentIndex={currentItemIndex}
              maxIndex={dataLength - 1}
            />
          </div>

          <Button
            shape="icon"
            color="neutral"
            className={`absolute ${positionToClassName("middle-left")}`}
            onClick={prevImage}
            disabled={currentItemIndex <= 0}
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
            className={`absolute ${positionToClassName("middle-right")}`}
            onClick={nextImage}
            disabled={currentItemIndex >= dataLength}
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
      )}

      {/* Close button */}
      {isZoomed && <CloseButton onClick={handleCloseClick} />}

      {/* Bottom overlay : Gallery, Hotspots toggle, ... */}
      <div
        className={`absolute ${positionToClassName("bottom-fullW")} grid grid-cols-[auto,1fr,auto] items-end gap-x-1 sm:gap-x-2`}
      >
        {/* Gallery's toogle button & Gallery */}
        {dataLength > 1 && (
          <>
            <Button
              className={isZoomed ? "invisible" : ""}
              variant="fill"
              color={showGallery ? "primary" : "neutral"}
              shape="icon"
              onClick={toggleGallery}
            >
              <CustomizableIcon customizationKey="CONTROLS_GALLERY">
                <img
                  className="size-full"
                  src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/motion.svg"
                  alt="Gallery icon"
                />
              </CustomizableIcon>
            </Button>
            {showGallery && <Gallery className={isZoomed ? "invisible" : ""} />}
          </>
        )}

        <div className="col-start-3 flex flex-col gap-y-1 sm:gap-y-2">
          {/* Zoom buttons */}
          <div>
            <CustomizableButton
              className="rounded-b-none"
              customizationKey="CONTROLS_ZOOM_IN"
              color="neutral"
              shape="icon"
              disabled={!canZoomIn}
              onClick={zoomIn}
            >
              +
            </CustomizableButton>
            <Separator color="background" />
            <CustomizableButton
              className="rounded-t-none"
              customizationKey="CONTROLS_ZOOM_OUT"
              color="neutral"
              shape="icon"
              disabled={!canZoomOut}
              onClick={zoomOut}
            >
              -
            </CustomizableButton>
          </div>

          {/* Extend/Close button */}
          <Button
            variant="fill"
            color={extendMode ? "primary" : "neutral"}
            shape="icon"
            onClick={toggleExtendMode}
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
          {/* Hotspot button */}
          <Button
            variant="fill"
            color={showHotspots ? "primary" : "neutral"}
            shape="icon"
            disabled={isZoomed}
            onClick={toggleHotspots}
          >
            <CustomizableIcon customizationKey="CONTROLS_HOTSPOTS">
              <img
                className="size-full"
                src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/info.svg"
                alt="Hotspot icon"
              />
            </CustomizableIcon>
          </Button>
        </div>
      </div>
    </>
  );
};

export default WebPlayerOverlay;
