import { useCallback } from "react";

import { useEscapeKeyEffect } from "../../hooks/useEscapeKeyEffect";
import { useCompositionContext } from "../../providers/CompositionContext";
import { useControlsContext } from "../../providers/ControlsContext";
import { useGlobalContext } from "../../providers/GlobalContext";
import { cn, positionToClassName } from "../../utils/style";
import { isSelfEvent } from "../../utils/web";
import CloseButton from "../atoms/CloseButton";
import CustomizableIcon from "../atoms/CustomizableIcon";
import DetailsOverlay from "../atoms/DetailsOverlay";
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
  const {
    hideCategoriesNav,
    infiniteCarrousel,
    permanentGallery,
    extendBehavior,
    maxItemsShown,
    isFullScreen,
    integration,
  } = useGlobalContext();

  const {
    aspectRatioStyle,
    categories: { length: categoriesListLength },
  } = useCompositionContext();

  const {
    items: { length: itemListLength },

    slidable,

    carrouselItemIndex,
    masterItemIndex,
    prevItem,
    nextItem,

    showGalleryControls,

    enableHotspotsControl,
    currentItemHotspotsVisible,
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

  // Handle index count when integration is enabled
  const getIntegrationIndicatorNumbers = () => {
    // For single item view, just return the current index
    if (maxItemsShown === 1) return carrouselItemIndex;

    // Calculate visible complete items
    const visibleCompleteItems = Math.floor(maxItemsShown);

    // Adjust index based on visible items (subtract 1 because first item is already counted in carrouselItemIndex)
    const indexOffset = visibleCompleteItems - 1;

    return carrouselItemIndex + indexOffset;
  };

  // Calculate master index when integration is enabled
  const getMasterIndex = () => {
    // Return regular index when integration is disabled
    if (!integration) return masterItemIndex;

    // Calculate visible complete items
    const visibleCompleteItems = Math.floor(maxItemsShown);

    // Apply the same offset calculation for consistency
    const indexOffset = visibleCompleteItems - 1;

    return masterItemIndex + indexOffset;
  };

  return (
    <>
      {/* CategorySelect (on top) */}
      {!hideCategoriesNav && categoriesListLength > 1 && (
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
            currentIndex={(() => {
              if (!integration || isFullScreen) return carrouselItemIndex;
              return getIntegrationIndicatorNumbers();
            })()}
            maxIndex={itemListLength - 1}
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
            <CustomizableIcon customizationKey="CONTROLS_PREV">
              <ArrowRightIcon className="size-full -scale-x-100" />
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
            disabled={
              !infiniteCarrousel && getMasterIndex() >= itemListLength - 1
            }
          >
            <CustomizableIcon customizationKey="CONTROLS_NEXT">
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
              <GalleryIcon className="size-full" />
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
              enabled={currentItemHotspotsVisible}
              onToggle={toggleHotspots}
            >
              <HotspotsIcon className="size-full" />
            </Switch>
          )}
          {/* Zoom buttons */}
          {showZoomControls && (!integration || isFullScreen) && (
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
          {extendBehavior !== "none" && (
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
          )}
        </div>
      </div>
      {/* Details Overlay */}
      <DetailsOverlay
        isVisible={isShowingDetails}
        className={sharedClassName}
        url={shownDetails?.src}
        title={shownDetails?.title}
        description={shownDetails?.text}
        clickHandler={handleDetailsOverlayClick}
        extendMode={extendMode}
        maxItemsShown={maxItemsShown}
        aspectRatioStyle={aspectRatioStyle}
      >
        {/* Button that closes the overlay */}
        <CloseButton
          className="absolute right-2 top-2 z-10"
          onClick={resetShownDetails}
        />
      </DetailsOverlay>

      {/* Close button */}
      {isZooming && (
        <CloseButton
          className={cn(sharedClassName, positionToClassName("top-right"))}
          onClick={resetView}
        />
      )}
    </>
  );
};

export default WebPlayerOverlay;
