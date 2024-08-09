import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import CdnImage from "@/components/atoms/CdnImage";
import PlayIcon from "@/components/icons/PlayIcon";
import ThreeSixtyIcon from "@/components/icons/ThreeSixtyIcon";
import ImageElement from "@/components/molecules/web_player_elements/ImageElement";
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

  // - Flip book image index & details
  const [imageIndex, setImageIndex] = useState(0);
  const length = images.length;

  const displayPreviousImage = useCallback(() => {
    setImageIndex(currentIndex => (currentIndex - 1 + length) % length);
  }, [length]);
  const displayNextImage = useCallback(() => {
    setImageIndex(currentIndex => (currentIndex + 1) % length);
  }, [length]);

  // - Event listeners to handle spinning
  useEffect(() => {
    if (disabled) {
      return;
    }

    const container = containerRef.current;
    const scroller = scrollerRef.current;

    // DOM not ready yet
    if (!container || !scroller) {
      return;
    }

    // -- Mouse events (click & drag)
    // NOTE: As the useEffect should not re-render, we can use mutable variables. If it changes in the future, we should use useRef
    let draggingStartX: number | null = null;
    let lastMouseXs: { timestamp: number; value: number }[] = [];
    let inertiaAnimationFrame: number | null = null;

    // Handle when the user just clicked on the 360 to start spinning
    const onMouseDown = (e: MouseEvent) => {
      // Ignore event if the user is not using the main button
      if (e.button !== 0) {
        return;
      }

      e.preventDefault(); // Prevents native image dragging
      e.stopPropagation(); // Prevents carrousel to slide

      // Cancel any ongoing inertia animation
      if (inertiaAnimationFrame !== null) {
        cancelAnimationFrame(inertiaAnimationFrame);
        inertiaAnimationFrame = null;
      }

      // Take snapshot of the starting state
      const x = e.clientX;
      draggingStartX = x;
      lastMouseXs = [{ timestamp: Date.now(), value: x }];
    };

    const onMouseMove = (e: MouseEvent) => {
      // Check if the user was actually spinning
      if (draggingStartX === null) {
        return;
      }

      e.stopPropagation(); // Prevents parent slider from moving when rotating 360

      // Take a snapshot of the current state
      lastMouseXs.push({ timestamp: Date.now(), value: e.clientX });
      // Limit the number of snapshots to avoid memory overload
      if (lastMouseXs.length > 20) {
        lastMouseXs.shift();
      }

      const walkX = e.clientX - draggingStartX;

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

      draggingStartX = e.clientX;
    };

    // Handle when the user releases the 360 or leaves the spinning area
    const onStopDragging = () => {
      // Check if the user was actually spinning
      if (draggingStartX === null) {
        return;
      }

      draggingStartX = null;

      // -- Inertia
      const startTime = Date.now();
      const startVelocity = (() => {
        // Filter out points that are too old (to avoid inertia even after the user stopped)
        const now = Date.now();
        const filteredMouseXs = lastMouseXs.filter(
          point => now - point.timestamp < 50
        );

        if (filteredMouseXs.length < 2) {
          return 0; // Not enough points to calculate velocity
        }

        const firstMouse = filteredMouseXs[0];
        const lastMouse = filteredMouseXs[filteredMouseXs.length - 1];

        // Compute mean velocity in px/s
        return (
          (lastMouse.value - firstMouse.value) /
          (1e-3 * Math.max(lastMouse.timestamp - firstMouse.timestamp, 1))
        );
      })();

      let walkX = 0;
      let lastFrameTime = startTime;

      const applyInertia = () => {
        const applyInertiaStep = () => {
          const now = Date.now();

          // Apply friction
          const elapsedSeconds = (now - startTime) / 1000;
          const currentVelocity =
            startVelocity * 0.5 * Math.pow(0.1, elapsedSeconds);

          // Update walk
          const timeSinceLastFrame = (now - lastFrameTime) / 1000;
          walkX += currentVelocity * timeSinceLastFrame;

          // The intertia is very low, we can stop it
          if (
            Math.abs(currentVelocity) < 5 * DRAG_STEP_PX &&
            Math.abs(walkX) < DRAG_STEP_PX
          ) {
            inertiaAnimationFrame = null;
            return;
          }

          if (Math.abs(walkX) >= DRAG_STEP_PX) {
            if (walkX > 0 !== reverse360) {
              displayNextImage();
            } else {
              displayPreviousImage();
            }

            walkX = 0;
          }

          lastFrameTime = now;

          applyInertia();
        };

        inertiaAnimationFrame = requestAnimationFrame(applyInertiaStep);
      };

      applyInertia();
    };

    container.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onStopDragging);
    document.addEventListener("mouseup", onStopDragging);
    document.addEventListener("contextmenu", onStopDragging);

    // - Scroll events to update the image thanks to the "invisible scroller"

    const getScrollerWidth = () => scroller.getBoundingClientRect().width;

    const getScrollerCenterPosition = () =>
      scroller.scrollWidth / 2 - getScrollerWidth() / 2;

    const centerScroller = () => {
      const target = getScrollerCenterPosition();
      scroller.scrollLeft = target;
    };

    // When initializing, we want to center the scroller
    centerScroller();

    const onScroll = () => {
      const walk = scroller.scrollLeft - getScrollerCenterPosition();

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

    // - Touch events (only mandatory for Safari mobile)

    let touchStart: { id: Touch["identifier"]; x: number } | null = null;

    const onTouchStart = (e: TouchEvent) => {
      // Ignore other touches
      if (touchStart) {
        return;
      }

      const touch = e.touches[0];
      touchStart = { id: touch.identifier, x: touch.clientX };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchStart) {
        return;
      }

      const { id: touchId, x: touchStartX } = touchStart;

      const touch = Array.from(e.changedTouches).find(
        ({ identifier }) => identifier === touchId
      );

      // Ignore other touches
      if (!touch) {
        return;
      }

      e.preventDefault(); // Prevent scroll

      const walkX = touch.clientX - touchStartX;

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

      touchStart = { id: touchId, x: touch.clientX };
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (touchStart === null) {
        return;
      }

      const { id: touchId } = touchStart;

      const isMainTouch = Array.from(e.changedTouches).some(
        ({ identifier }) => identifier === touchId
      );

      // Ignore other touches
      if (!isMainTouch) {
        return;
      }

      touchStart = null;
    };

    scroller.addEventListener("touchstart", onTouchStart);
    scroller.addEventListener("touchmove", onTouchMove);
    scroller.addEventListener("touchend", onTouchEnd);
    scroller.addEventListener("touchcancel", onTouchEnd);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onStopDragging);
      document.removeEventListener("mouseup", onStopDragging);
      document.removeEventListener("contextmenu", onStopDragging);

      scroller.removeEventListener("scroll", onScroll);

      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchmove", onTouchMove);
      scroller.removeEventListener("touchend", onTouchEnd);
      scroller.removeEventListener("touchcancel", onTouchEnd);
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
        {/* NOTE: We need the element to have an height, otherwise, Safari will ignore it */}
        {/*       We need a lot of extra space on the side, otherwise, the 360 will not have intertia on Safari */}
        <div className="pointer-events-none -mt-px h-px w-[calc(100%+1024px)]" />
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

/**
 * ThreeSixtyElement component renders a carrousel's 360
 *
 * @prop `onlyPreload`: If true, zoom will not affect the 360. It is useful to pre-fetch images.
 * @prop `index`: The index of the item in the carrousel. Used to share state.
 */
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
