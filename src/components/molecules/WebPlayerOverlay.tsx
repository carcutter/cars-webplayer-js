import { useCallback } from "react";

import CdnImage from "@/components/atoms/CdnImage";
import CloseButton from "@/components/atoms/CloseButton";
import CustomizableIcon from "@/components/atoms/CustomizableIcon";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import ExtendIcon from "@/components/icons/ExtendIcon";
import GalleryIcon from "@/components/icons/GalleryIcon";
import HotspotsIcon from "@/components/icons/HotspotsIcon";
import ReduceIcon from "@/components/icons/ReduceIcon";
import CategorySelect from "@/components/molecules/CategorySelect";
import Gallery from "@/components/organisms/Gallery";
import Button from "@/components/ui/Button";
import Separator from "@/components/ui/Separator";
import { useEscapeKeyEffect } from "@/hooks/useEscapeKeyEffect";
import { useCompositionContext } from "@/providers/CompositionContext";
import { useControlsContext } from "@/providers/ControlsContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import { positionToClassName } from "@/utils/style";
import { isSelfEvent } from "@/utils/web";

/**
 * WebPlayerOverlay component renders everything that is displayed on top of the carrousel.
 * - Category selection
 * - Controls (Next/Prev buttons, Zoom buttons, ...)
 * - Gallery
 * - Details overlay when an hotspot with image is clicked
 */
const WebPlayerOverlay: React.FC = () => {
  const { flatten, infiniteCarrousel, permanentGallery } = useGlobalContext();

  const { aspectRatioClass } = useCompositionContext();

  const {
    displayedItems: { length: dataLength },
    slidable,

    masterItemIndex,
    prevImage,
    nextImage,

    showGalleryControls,

    enableHotspotsControl,
    showHotspots,
    toggleHotspots,
    showGallery,
    toggleGallery,
    extendMode,
    toggleExtendMode,

    shownDetails,
    isShowingDetails,
    resetShownDetails,

    showZoomControls,
    isZooming,
    canZoomIn,
    zoomIn,
    canZoomOut,
    zoomOut,

    resetView,
  } = useControlsContext();

  // Handle click on overlay to exit details
  const handleDetailsOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      // Check if the click originated from the overlay itself
      if (!isSelfEvent(e)) {
        return;
      }

      resetShownDetails();
    },
    [resetShownDetails]
  );

  // Handle escape key to close details overlay
  useEscapeKeyEffect(resetShownDetails);

  const sharedClassName = "absolute z-overlay";

  const galleryControlsClassName = `transition-opacity ${showGalleryControls ? "opacity-100" : "opacity-0 !pointer-events-none"}`;

  return (
    <>
      {/* CategorySelect (on top) */}
      {!flatten && !isZooming && (
        <CategorySelect
          className={`${sharedClassName} ${positionToClassName("top")}`}
        />
      )}

      {/* Next/Prev buttons */}
      {slidable && !isZooming && (
        <>
          <Button
            shape="icon"
            color="neutral"
            className={`${sharedClassName} ${positionToClassName("middle-left")}`}
            onClick={prevImage}
            disabled={!infiniteCarrousel && masterItemIndex <= 0}
          >
            <CustomizableIcon customizationKey="CONTROLS_ARROW_LEFT">
              <ArrowRightIcon className="size-full rotate-180" />
            </CustomizableIcon>
          </Button>
          <Button
            shape="icon"
            color="neutral"
            className={`${sharedClassName} ${positionToClassName("middle-right")}`}
            onClick={nextImage}
            disabled={!infiniteCarrousel && masterItemIndex >= dataLength - 1}
          >
            <CustomizableIcon customizationKey="CONTROLS_ARROW_RIGHT">
              <ArrowRightIcon className="size-full" />
            </CustomizableIcon>
          </Button>
        </>
      )}

      {/* Bottom overlay : Gallery, Hotspots toggle, ... We need to disable pointer-event to allow the propagation to parent elements */}
      <div
        className={`${sharedClassName} ${positionToClassName("bottom-fullW")} pointer-events-none grid grid-cols-[auto,1fr,auto] items-end *:pointer-events-auto sm:gap-x-2`}
      >
        {/* Gallery's toogle button & Gallery */}
        {!permanentGallery && dataLength > 1 && !isZooming && (
          <>
            <Button
              className={galleryControlsClassName}
              variant="fill"
              color={showGallery ? "primary" : "neutral"}
              shape="icon"
              onClick={toggleGallery}
            >
              <CustomizableIcon customizationKey="CONTROLS_GALLERY">
                <GalleryIcon className="size-full" />
              </CustomizableIcon>
            </Button>

            {showGallery && (
              <Gallery
                className={`[mask-image:linear-gradient(to_left,transparent_0px,black_4px,black_calc(100%-4px),transparent_100%)] ${galleryControlsClassName}`}
                containerClassName="mx-1"
              />
            )}
          </>
        )}
        <div className="col-start-3 flex flex-col gap-y-1 sm:gap-y-2">
          {/* Zoom buttons */}
          {showZoomControls && (
            <div className="max-sm:hidden">
              <Button
                className="rounded-b-none"
                color="neutral"
                shape="icon"
                disabled={!canZoomIn}
                onClick={zoomIn}
              >
                {/* TODO: Use ICON */}+
              </Button>
              <Separator color="background" />
              <Button
                className="rounded-t-none"
                color="neutral"
                shape="icon"
                disabled={!canZoomOut}
                onClick={zoomOut}
              >
                {/* TODO: Use ICON */}-
              </Button>
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
              <ExtendIcon className="size-full" />
            ) : (
              <ReduceIcon className="size-full" />
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
            <HotspotsIcon className="size-full" />
          </Button>
        </div>
      </div>

      {/* Details overlay */}
      <div
        className={`${sharedClassName} inset-0 flex justify-end overflow-hidden bg-foreground/60 transition-opacity duration-details ${isShowingDetails ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={handleDetailsOverlayClick}
      >
        <div
          className={`h-full w-3/5 bg-background transition-transform duration-details ${isShowingDetails ? "translate-x-0" : "translate-x-full"}`}
        >
          {!!shownDetails && (
            <>
              <CdnImage
                className={`w-full ${aspectRatioClass} bg-foreground/65`}
                src={shownDetails.src}
                imgInPlayerWidthRatio={0.6}
              />

              <div className="space-y-1 p-3">
                <span>{shownDetails.title}</span>
                <p>{shownDetails.text}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Close button */}
      {(isZooming || isShowingDetails) && (
        <CloseButton
          className={`${sharedClassName} ${positionToClassName("top-right")}`}
          onClick={resetView}
        />
      )}
    </>
  );
};

export default WebPlayerOverlay;
