import { useCallback } from "react";

import CloseButton from "@/components/atoms/CloseButton";
import CustomizableIcon from "@/components/atoms/CustomizableIcon";
import ZoomableCdnImage from "@/components/atoms/ZoomableCdnImage";
import CategorySelect from "@/components/molecules/CategorySelect";
import CustomizableButton from "@/components/molecules/CustomizableButton";
import Gallery from "@/components/organisms/Gallery";
import Button from "@/components/ui/Button";
import Separator from "@/components/ui/Separator";
import { useEscapeKeyEffect } from "@/hooks/useEscapeKeyEffect";
import { useControlsContext } from "@/providers/ControlsContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import { positionToClassName } from "@/utils/style";

const WebPlayerOverlay: React.FC = () => {
  const { flatten } = useGlobalContext();

  const {
    displayedItems: { length: dataLength },
    slidable,

    carrouselItemIndex,
    masterItemIndex,
    setItemIndexCommand,

    enableHotspotsControl,
    showHotspots,
    toggleHotspots,
    showGallery,
    toggleGallery,
    extendMode,
    toggleExtendMode,

    shownDetailImage,
    setShownDetailImage,

    showZoomControls,
    isZooming,
    resetZoom,
    canZoomIn,
    zoomIn,
    canZoomOut,
    zoomOut,
  } = useControlsContext();

  const prevImage = useCallback(() => {
    setItemIndexCommand(carrouselItemIndex - 1);
  }, [carrouselItemIndex, setItemIndexCommand]);

  const nextImage = useCallback(() => {
    setItemIndexCommand(carrouselItemIndex + 1);
  }, [carrouselItemIndex, setItemIndexCommand]);

  const resetView = useCallback(() => {
    resetZoom();
    setShownDetailImage(null);
  }, [resetZoom, setShownDetailImage]);

  // Handle escape key to unzoom/exit detail image
  useEscapeKeyEffect(resetView);

  const hideGalleryControls = isZooming || !!shownDetailImage;

  const sharedClassName = "absolute z-overlay";

  return (
    <>
      {/* CategorySelect (on top) */}
      {!hideGalleryControls && !flatten && (
        <div
          className={`${sharedClassName} ${positionToClassName("top-center")}`}
        >
          <CategorySelect />
        </div>
      )}

      {/* Next/Prev buttons */}
      {!hideGalleryControls && slidable && (
        <>
          <Button
            shape="icon"
            color="neutral"
            className={`${sharedClassName} ${positionToClassName("middle-left")}`}
            onClick={prevImage}
            disabled={masterItemIndex <= 0}
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
            className={`${sharedClassName} ${positionToClassName("middle-right")}`}
            onClick={nextImage}
            disabled={masterItemIndex >= dataLength - 1}
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

      {!!shownDetailImage && (
        <div className={`${sharedClassName} inset-0`}>
          <ZoomableCdnImage className="size-full" src={shownDetailImage} />
        </div>
      )}

      {/* Close button */}
      {hideGalleryControls && (
        <CloseButton
          className={`${sharedClassName} ${positionToClassName("top-right")}`}
          onClick={resetView}
        />
      )}

      {/* Bottom overlay : Gallery, Hotspots toggle, ... We need to disable pointer-event to allow the propagation to parent elements */}
      <div
        className={`${sharedClassName} ${positionToClassName("bottom-fullW")} pointer-events-none grid grid-cols-[auto,1fr,auto] items-end gap-x-1 *:pointer-events-auto sm:gap-x-2`}
      >
        {/* Gallery's toogle button & Gallery */}
        {!hideGalleryControls && dataLength > 1 && (
          <>
            <Button
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

            {showGallery && <Gallery />}
          </>
        )}

        <div className="col-start-3 flex flex-col gap-y-1 sm:gap-y-2">
          {/* Zoom buttons */}
          {showZoomControls && (
            <div className="max-sm:hidden">
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
          )}

          {/* Extend/Reduce button */}
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
            disabled={!enableHotspotsControl || hideGalleryControls}
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
