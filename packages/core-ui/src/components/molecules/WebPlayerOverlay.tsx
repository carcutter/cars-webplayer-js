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
import IndexIndicator from "../atoms/IndexIndicator";
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
  const { hideCategories, infiniteCarrousel, permanentGallery } =
    useGlobalContext();

  const {
    items: { length: dataLength },
    aspectRatioStyle,
  } = useCompositionContext();

  const {
    slidable,

    carrouselItemIndex,
    masterItemIndex,
    prevItem,
    nextItem,

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

  return (
    <>
      {/* CategorySelect (on top) */}
      {!hideCategories && (
        <CategorySelect
          sharedClassName={cn(
            sharedClassName,
            "transition-opacity",
            !isZooming ? "opacity-100" : "!pointer-events-none opacity-0"
          )}
        />
      )}

      {/* Index Indicator */}
      {slidable && !isZooming && (
        <div className={cn(sharedClassName, positionToClassName("top-right"))}>
          <IndexIndicator
            currentIndex={carrouselItemIndex}
            maxIndex={dataLength - 1}
          />
        </div>
      )}

      {/* Next/Prev buttons */}
      {slidable && (
        <>
          <Button
            shape="icon"
            color="neutral"
            className={cn(
              sharedClassName,
              positionToClassName("middle-left"),
              !isZooming ? "opacity-100" : "!pointer-events-none opacity-0"
            )}
            onClick={prevItem}
            disabled={!infiniteCarrousel && masterItemIndex <= 0}
          >
            <CustomizableIcon customizationKey="CONTROLS_ARROW_LEFT">
              <ArrowRightIcon className="size-full rotate-180" />
            </CustomizableIcon>
          </Button>
          <Button
            shape="icon"
            color="neutral"
            className={cn(
              sharedClassName,
              positionToClassName("middle-right"),
              !isZooming ? "opacity-100" : "!pointer-events-none opacity-0"
            )}
            onClick={nextItem}
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
        {!permanentGallery && slidable && (
          <>
            <Button
              className={
                showGalleryControls && !isZooming
                  ? "opacity-100"
                  : "!pointer-events-none opacity-0"
              }
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
                  "transition-opacity",
                  showGalleryControls && !isZooming
                    ? "opacity-100"
                    : "!pointer-events-none opacity-0",
                  // Left & Right gradient mask to fade the gallery
                  "[mask-image:linear-gradient(to_left,transparent_0px,black_4px,black_calc(100%-4px),transparent_100%)]"
                )}
                containerClassName="mx-1"
              />
            )}
          </>
        )}
        <div className="col-start-3 flex flex-col items-end gap-y-1 small:gap-y-2">
          {/* Hotspot button */}
          {enableHotspotsControl && (
            <Switch
              className={cn(
                "transition-opacity",
                !isZooming ? "opacity-100" : "!pointer-events-none opacity-0"
              )}
              enabled={showHotspots}
              onToggle={toggleHotspots}
            >
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

              <div
                className={cn(
                  "space-y-1 px-2 py-1 small:p-3",
                  extendMode && "large:p-4"
                )}
              >
                {shownDetails.title && (
                  <span
                    className={cn(
                      "text-sm font-semibold small:text-base small:font-bold",
                      extendMode && "large:text-lg"
                    )}
                  >
                    {shownDetails.title}
                  </span>
                )}
                {shownDetails.text && (
                  <p
                    className={cn(
                      "text-xs text-foreground/65 small:text-sm",
                      extendMode && "large:text-base"
                    )}
                  >
                    {shownDetails.text}
                  </p>
                )}
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
