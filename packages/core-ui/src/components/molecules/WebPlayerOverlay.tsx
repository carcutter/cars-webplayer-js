import { useCallback } from "react";

import { useEscapeKeyEffect } from "../../hooks/useEscapeKeyEffect";
import { useCompositionContext } from "../../providers/CompositionContext";
import { useControlsContext } from "../../providers/ControlsContext";
import { useGlobalContext } from "../../providers/GlobalContext";
import { cn, positionToClassName } from "../../utils/style";
import { isSelfEvent } from "../../utils/web";
import CdnImage from "../atoms/CdnImage";
import CloseButton from "../atoms/CloseButton";
import CustomizableIcon from "../atoms/CustomizableIcon";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import ExtendIcon from "../icons/ExtendIcon";
import GalleryIcon from "../icons/GalleryIcon";
import HotspotsIcon from "../icons/HotspotsIcon";
import MinusIcon from "../icons/MinusIcon";
import PlusIcon from "../icons/PlusIcon";
import ReduceIcon from "../icons/ReduceIcon";
import Gallery from "../organisms/Gallery";
import Button from "../ui/Button";
import Separator from "../ui/Separator";
import Switch from "../ui/Switch";

import CategorySelect from "./CategorySelect";

/**
 * WebPlayerOverlay component renders everything that is displayed on top of the carrousel.
 * - Category selection
 * - Controls (Next/Prev buttons, Zoom buttons, ...)
 * - Gallery
 * - Details overlay when an hotspot with image is clicked
 */
const WebPlayerOverlay: React.FC = () => {
  const { flatten, infiniteCarrousel, permanentGallery } = useGlobalContext();

  const {
    items: { length: dataLength },
    aspectRatioStyle,
  } = useCompositionContext();

  const {
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
        <CategorySelect sharedClassName={sharedClassName} />
      )}

      {/* Next/Prev buttons */}
      {slidable && !isZooming && (
        <>
          <Button
            shape="icon"
            color="neutral"
            className={cn(sharedClassName, positionToClassName("middle-left"))}
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
            className={cn(sharedClassName, positionToClassName("middle-right"))}
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
        className={cn(
          sharedClassName,
          positionToClassName("bottom-fullW"),
          "pointer-events-none grid grid-cols-[auto,1fr,auto] items-end *:pointer-events-auto small:gap-x-2"
        )}
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
                className={cn(
                  galleryControlsClassName,
                  "[mask-image:linear-gradient(to_left,transparent_0px,black_4px,black_calc(100%-4px),transparent_100%)]"
                )}
                containerClassName="mx-1"
              />
            )}
          </>
        )}
        <div className="col-start-3 flex flex-col items-end gap-y-1 small:gap-y-2">
          {/* Hotspot button */}
          {enableHotspotsControl && !isZooming && (
            <Switch enabled={showHotspots} onToggle={toggleHotspots}>
              <HotspotsIcon className="size-full" />
            </Switch>
          )}

          {/* Zoom buttons */}
          {showZoomControls && (
            <div className="max-small:hidden">
              <Button
                className="rounded-b-none"
                color="neutral"
                shape="icon"
                disabled={!canZoomIn}
                onClick={zoomIn}
              >
                <PlusIcon className="size-full" />
              </Button>
              <Separator color="background" />
              <Button
                className="rounded-t-none"
                color="neutral"
                shape="icon"
                disabled={!canZoomOut}
                onClick={zoomOut}
              >
                <MinusIcon className="size-full" />
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
        </div>
      </div>

      {/* Details overlay */}
      <div
        className={cn(
          sharedClassName,
          "inset-0 flex justify-end overflow-hidden bg-foreground/60 transition-opacity duration-details",
          isShowingDetails ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={handleDetailsOverlayClick}
      >
        <div
          className={cn(
            "h-full w-3/5 bg-background transition-transform duration-details",
            isShowingDetails ? "translate-x-0" : "translate-x-full"
          )}
        >
          {!!shownDetails && (
            <>
              <CdnImage
                className="w-full bg-foreground/65"
                style={aspectRatioStyle}
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
          className={cn(sharedClassName, positionToClassName("top-right"))}
          onClick={resetView}
        />
      )}
    </>
  );
};

export default WebPlayerOverlay;
