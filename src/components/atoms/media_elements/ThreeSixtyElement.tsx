import { useCallback, useEffect, useRef, useState } from "react";

import CdnImage from "@/components/atoms/CdnImage";
import CustomizableButton from "@/components/molecules/CustomizableButton";
import { useControlsContext } from "@/providers/ControlsContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import type { Item } from "@/types/composition";

import ImageElement from "./ImageElement";

const DRAG_STEP_PX = 10;
const SCROLL_STEP_PX = 15;

type ThreeSixtyElementProps = Extract<Item, { type: "360" }> & {
  index: number;
};
type ThreeSixtyElementInteractive = Omit<ThreeSixtyElementProps, "index">;

const ThreeSixtyElementInteractive: React.FC<ThreeSixtyElementInteractive> = ({
  images,
  hotspots,
}) => {
  const { reverse360 } = useGlobalContext();
  const { showingDetailImage, isZooming } = useControlsContext();

  // -- Flip Book -- //
  // - element refs
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // - value refs
  const isMouseDown = useRef(false);
  const mouseStartX = useRef<number | null>(null);

  // - Flip book image index & details
  const [imageIndex, setImageIndex] = useState(0);
  const length = images.length;

  const displayPreviousImage = useCallback(() => {
    setImageIndex(currentIndex => (currentIndex - 1 + length) % length);
  }, [length]);
  const displayNextImage = useCallback(() => {
    setImageIndex(currentIndex => (currentIndex + 1) % length);
  }, [length]);

  // -- Event listeners to handle dragging (allow to spin) -- //
  useEffect(() => {
    // We do not want to rotate while zooming or showing a detail image
    if (isZooming || showingDetailImage) {
      return;
    }

    const container = containerRef.current;

    // DOM not ready yet
    if (!container) {
      return;
    }

    // - Handle when the user just clicked on the 360 to start spinning
    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault(); // Prevents native image dragging

      // Take snapshot of the current state
      isMouseDown.current = true;
      mouseStartX.current = e.clientX;
    };

    // - Handle when the user releases the 360 or leaves the spinning area
    const onMouseEnd = () => {
      isMouseDown.current = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      // Check if the user was actually spinning
      if (!isMouseDown.current) {
        return;
      }

      if (!mouseStartX.current) {
        throw new Error("mouseStartX.current is null");
      }

      e.stopPropagation(); // Prevents parent slider from moving when rotating 360

      const walkX = e.clientX - mouseStartX.current;

      // If the user did not move enough, we do not want to rotate
      if (Math.abs(walkX) < DRAG_STEP_PX) {
        return;
      }

      // XOR operation to reverse the logic
      if (walkX > 0 !== reverse360) {
        displayNextImage();
      } else {
        displayPreviousImage();
      }
      mouseStartX.current = e.clientX;
    };
    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mouseleave", onMouseEnd);
    container.addEventListener("mouseup", onMouseEnd);
    container.addEventListener("mousemove", onMouseMove);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mouseleave", onMouseEnd);
      container.removeEventListener("mouseup", onMouseEnd);
      container.removeEventListener("mousemove", onMouseMove);
    };
  }, [
    displayNextImage,
    displayPreviousImage,
    reverse360,
    showingDetailImage,
    isZooming,
  ]);

  // -- Event listeners to handle the "invisible scroller" that rotate 360 -- //
  useEffect(() => {
    // We do not want to rotate while zooming or showing a detail image
    if (isZooming || showingDetailImage) {
      return;
    }

    const scroller = scrollerRef.current;

    // DOM not ready yet
    if (!scroller) {
      return;
    }

    const getScrollerWidth = () => scroller.getBoundingClientRect().width;

    const scollerCenterPosition =
      scroller.scrollWidth / 2 - getScrollerWidth() / 2;

    const centerScroller = () => {
      scroller.scrollLeft = scollerCenterPosition;
    };

    // When initializing, we want to center the scroller
    centerScroller();

    // - Update the image when the user uses scrolling (and not dragging)
    const onScroll = () => {
      const walk = scroller.scrollLeft - scollerCenterPosition;

      if (Math.abs(walk) < SCROLL_STEP_PX) {
        return;
      }

      // XOR operation to reverse the logic
      if (walk < 0 !== reverse360) {
        displayNextImage();
      } else {
        displayPreviousImage();
      }

      // We just changed the image, we want to re-center the scroller
      centerScroller();
    };

    scroller.addEventListener("scroll", onScroll);

    return () => {
      scroller.removeEventListener("scroll", onScroll);
    };
  }, [
    displayNextImage,
    displayPreviousImage,
    reverse360,
    showingDetailImage,
    isZooming,
  ]);

  return (
    <div ref={containerRef} className="cursor-ew-resize">
      <div className="hidden">
        {/* Take the 2 prev & 2 next images and insert them on the DOM to ensure preload */}
        {[-2, -1, 1, 2].map(offset => {
          const index = (imageIndex + offset + length) % length;
          const src = images[index];
          return <CdnImage key={src} className="size-full" src={src} />;
        })}
      </div>

      <ImageElement src={images[imageIndex]} hotspots={hotspots[imageIndex]} />

      {/* Scroller is an invisible element in front of the image which capture scroll event to make the 360 spin */}
      {/* NOTE: Hotspots' z-index allow to keep them in front */}
      <div
        ref={scrollerRef}
        className="absolute inset-0 overflow-auto no-scrollbar"
      >
        <div
          className="h-full"
          style={{ width: `calc(100% + ${4 * SCROLL_STEP_PX}px` }}
        />
      </div>
    </div>
  );
};

type ThreeSixtyElementPlaceholderProps = {
  images: string[];
  onReady: () => void;
};

const ThreeSixtyElementPlaceholder: React.FC<
  ThreeSixtyElementPlaceholderProps
> = ({ images, onReady }) => {
  const [loadingStatusMap, setLoadingStatusMap] = useState<Map<
    string,
    boolean
  > | null>(null);

  const loadingProgress = loadingStatusMap
    ? ([...loadingStatusMap.values()].filter(loaded => loaded).length /
        images.length) *
      100
    : null;

  const fetchImages = useCallback(() => {
    if (loadingProgress !== null) {
      return;
    }

    setLoadingStatusMap(new Map(images.map(image => [image, false])));

    // TODO: add a timeout ?
  }, [images, loadingProgress]);

  const onImageLoaded = useCallback((image: string) => {
    setLoadingStatusMap(prev => {
      const newStatusMap = new Map(prev);
      newStatusMap.set(image, true);
      return newStatusMap;
    });
  }, []);

  useEffect(() => {
    if (loadingProgress === 100) {
      onReady();
    }
  }, [loadingProgress, onReady]);

  return (
    <div className="relative size-full">
      {loadingProgress !== null && loadingProgress !== 100 && (
        <div className="hidden">
          {images.map(image => (
            <CdnImage
              key={image}
              src={image}
              onLoad={() => onImageLoaded(image)}
            />
          ))}
        </div>
      )}

      <CdnImage src={images[0]} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-4 bg-foreground/35">
        <CustomizableButton
          customizationKey="CONTROLS_PLAY_360"
          color="neutral"
          shape="icon"
          onClick={fetchImages}
        >
          <img
            className="size-full"
            src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/play.svg"
            alt="Play"
          />
        </CustomizableButton>
        {loadingProgress !== null && (
          <div className="relative h-1 w-3/5 overflow-hidden rounded-full bg-background">
            <div
              className="absolute inset-0 bg-primary transition-[right]"
              style={{ right: `${100 - loadingProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const ThreeSixtyElement: React.FC<ThreeSixtyElementProps> = ({
  index,
  ...item
}) => {
  const { setItemInteraction } = useControlsContext();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setItemInteraction(index, isReady ? "running" : "pending");

    return () => {
      setItemInteraction(index, null);
    };
  }, [index, isReady, setItemInteraction]);

  if (!isReady) {
    return (
      <ThreeSixtyElementPlaceholder
        images={item.images}
        onReady={() => setIsReady(true)}
      />
    );
  }

  return <ThreeSixtyElementInteractive {...item} />;
};

export default ThreeSixtyElement;
