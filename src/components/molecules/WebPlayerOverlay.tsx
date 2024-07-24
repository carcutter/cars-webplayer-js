import { useCallback } from "react";

import CdnImage from "@/components/atoms/CdnImage";
import CloseButton from "@/components/atoms/CloseButton";
import CustomizableIcon from "@/components/atoms/CustomizableIcon";
import CategorySelect from "@/components/molecules/CategorySelect";
import CustomizableButton from "@/components/molecules/CustomizableButton";
import Gallery from "@/components/organisms/Gallery";
import Button from "@/components/ui/Button";
import Separator from "@/components/ui/Separator";
import { useEscapeKeyEffect } from "@/hooks/useEscapeKeyEffect";
import { useControlsContext } from "@/providers/ControlsContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import { positionToClassName } from "@/utils/style";
import { isSelfEvent } from "@/utils/web";

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

    shownDetails,
    showingDetails,
    setShownDetails,

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
    setShownDetails(null);
  }, [resetZoom, setShownDetails]);

  // Handle escape key to unzoom/exit details
  useEscapeKeyEffect(resetView);

  // Handle click on overlay to exit details
  const handleDetailsOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      // Check if the click originated from the overlay itself
      if (!isSelfEvent(e)) {
        return;
      }

      resetView();
    },
    [resetView]
  );

  const sharedClassName = "absolute z-overlay";

  return (
    <>
      {/* CategorySelect (on top) */}
      {!isZooming && !flatten && (
        <div
          className={`${sharedClassName} ${positionToClassName("top-center")}`}
        >
          <CategorySelect />
        </div>
      )}

      {/* Next/Prev buttons */}
      {!isZooming && slidable && (
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
                className="rotate-180"
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
                src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/arrow_forward.svg"
                alt="Next icon"
              />
            </CustomizableIcon>
          </Button>
        </>
      )}

      {/* Bottom overlay : Gallery, Hotspots toggle, ... We need to disable pointer-event to allow the propagation to parent elements */}
      <div
        className={`${sharedClassName} ${positionToClassName("bottom-fullW")} pointer-events-none grid grid-cols-[auto,1fr,auto] items-end gap-x-1 *:pointer-events-auto sm:gap-x-2`}
      >
        {/* Gallery's toogle button & Gallery */}
        {!isZooming && dataLength > 1 && (
          <>
            <Button
              variant="fill"
              color={showGallery ? "primary" : "neutral"}
              shape="icon"
              onClick={toggleGallery}
            >
              <CustomizableIcon customizationKey="CONTROLS_GALLERY">
                <img
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
                  src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/fullscreen.svg"
                  alt="Extend icon"
                />
              </CustomizableIcon>
            ) : (
              <CustomizableIcon customizationKey="CONTROLS_REDUCE">
                <img
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
            disabled={!enableHotspotsControl || isZooming}
            onClick={toggleHotspots}
          >
            <CustomizableIcon customizationKey="CONTROLS_HOTSPOTS">
              <img
                src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/info.svg"
                alt="Hotspot icon"
              />
            </CustomizableIcon>
          </Button>
        </div>
      </div>

      <div
        className={`${sharedClassName} inset-0 flex justify-end overflow-hidden bg-foreground/60 transition-opacity duration-details ${showingDetails ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={handleDetailsOverlayClick}
      >
        <div
          className={`h-full w-3/5 bg-background transition-transform duration-details ${showingDetails ? "translate-x-0" : "translate-x-full"}`}
        >
          {!!shownDetails && (
            <>
              <CdnImage src={shownDetails.src} imgInPlayerWidthRatio={0.6} />

              <div className="space-y-1 p-3">
                <span>{shownDetails.title}</span>
                <p>{shownDetails.text}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Close button */}
      {(isZooming || showingDetails) && (
        <CloseButton
          className={`${sharedClassName} ${positionToClassName("top-right")}`}
          onClick={resetView}
        />
      )}
    </>
  );
};

export default WebPlayerOverlay;
