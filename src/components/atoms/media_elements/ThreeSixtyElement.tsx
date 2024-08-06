import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import CdnImage from "@/components/atoms/CdnImage";
import ImageElement from "@/components/atoms/media_elements/ImageElement";
import PlayIcon from "@/components/icons/PlayIcon";
import ThreeSixtyIcon from "@/components/icons/ThreeSixtyIcon";
import Button from "@/components/ui/Button";
import { useControlsContext } from "@/providers/ControlsContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import type { ImageWithHotspots, Item } from "@/types/composition";

const DRAG_STEP_PX = 10;
const SCROLL_STEP_PX = 15;

type ThreeSixtyElementProps = Extract<Item, { type: "360" }> & {
  index: number;
  onlyPreload: boolean;
};
type ThreeSixtyElementInteractive = Omit<ThreeSixtyElementProps, "index">;

const ThreeSixtyElementInteractive: React.FC<ThreeSixtyElementInteractive> = ({
  images,
  onlyPreload,
}) => {
  const { reverse360 } = useGlobalContext();
  const { isShowingDetails, isZooming } = useControlsContext();

  const disabled = isZooming || isShowingDetails; // We do not want to do anything while zooming or showing a detail image

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

  // - Event listeners to handle spinning with mouse dragging
  useEffect(() => {
    if (disabled) {
      return;
    }

    const container = containerRef.current;

    // DOM not ready yet
    if (!container) {
      return;
    }

    // Handle when the user just clicked on the 360 to start spinning
    const onMouseDown = (e: MouseEvent) => {
      // Ignore event if the user is not using left click
      if (e.button !== 0) {
        return;
      }

      e.preventDefault(); // Prevents native image dragging
      e.stopPropagation(); // Prevents carrousel to slide

      // Take snapshot of the current state
      isMouseDown.current = true;
      mouseStartX.current = e.clientX;
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

    // Handle when the user releases the 360 or leaves the spinning area
    const onStopDragging = () => {
      isMouseDown.current = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onStopDragging);
    document.addEventListener("mouseup", onStopDragging);
    document.addEventListener("contextmenu", onStopDragging);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onStopDragging);
      document.removeEventListener("mouseup", onStopDragging);
      document.removeEventListener("contextmenu", onStopDragging);
    };
  }, [displayNextImage, displayPreviousImage, disabled, reverse360]);

  // - Event listener to handle spinning with scrolling (thanks to the "invisible scroller")
  useEffect(() => {
    if (disabled) {
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
  }, [displayNextImage, displayPreviousImage, disabled, reverse360]);

  return (
    <div ref={containerRef} className="cursor-ew-resize">
      <div className="hidden">
        {/* Take the 2 prev & 2 next images and insert them on the DOM to ensure preload */}
        {[-2, -1, 1, 2].map(offset => {
          const index = (imageIndex + offset + length) % length;
          const { src } = images[index];
          return <CdnImage key={src} src={src} />;
        })}
      </div>

      {/* Scroller is element larger than the image to capture scroll event and then, make the 360 spin */}
      {/* NOTE: ImageElement is within so that it can capture events first */}
      <div ref={scrollerRef} className="overflow-x-scroll no-scrollbar">
        <div className="sticky left-0 top-0">
          <ImageElement {...images[imageIndex]} onlyPreload={onlyPreload} />
        </div>
        {/* Add space on both sides to allow scrolling */}
        <div style={{ width: `calc(100% + ${4 * SCROLL_STEP_PX}px` }} />
      </div>
    </div>
  );
};

type ThreeSixtyElementPlaceholderProps = {
  images: ImageWithHotspots[];
  onReady: () => void;
};

const ThreeSixtyElementPlaceholder: React.FC<
  ThreeSixtyElementPlaceholderProps
> = ({ images, onReady }) => {
  const imagesSrc = useMemo(() => images.map(({ src }) => src), [images]);

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

    setLoadingStatusMap(new Map(imagesSrc.map(src => [src, false])));

    // TODO: add a timeout to handle error ?
  }, [imagesSrc, loadingProgress]);

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
          {imagesSrc.map(src => (
            <CdnImage key={src} src={src} onLoad={() => onImageLoaded(src)} />
          ))}
        </div>
      )}

      <CdnImage className="size-full" src={imagesSrc[0]} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-4 bg-foreground/35">
        <ThreeSixtyIcon className="size-20 text-primary" />

        <Button color="neutral" shape="icon" onClick={fetchImages}>
          <PlayIcon className="size-full" />
        </Button>

        <div
          className={`relative h-1 w-3/5 overflow-hidden rounded-full bg-background ${loadingProgress !== null ? "" : "invisible"}`}
        >
          <div
            className="absolute inset-0 bg-primary transition-[right]"
            style={{ right: `${100 - (loadingProgress ?? 0)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const ThreeSixtyElement: React.FC<ThreeSixtyElementProps> = ({
  index,
  ...props
}) => {
  const { getItemInteraction, setItemInteraction } = useControlsContext();

  const [isReady, setIsReady] = useState(
    getItemInteraction(index) === "running"
  );

  useEffect(() => {
    setItemInteraction(index, isReady ? "running" : "pending");
  }, [index, isReady, setItemInteraction]);

  if (!isReady) {
    return (
      <ThreeSixtyElementPlaceholder
        {...props}
        onReady={() => setIsReady(true)}
      />
    );
  }

  return <ThreeSixtyElementInteractive {...props} />;
};

export default ThreeSixtyElement;
