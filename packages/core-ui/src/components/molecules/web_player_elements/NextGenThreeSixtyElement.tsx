import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ImageWithHotspots } from "@car-cutter/core";

import { useControlsContext } from "../../../providers/ControlsContext";
import { useGlobalContext } from "../../../providers/GlobalContext";
import { CustomizableItem } from "../../../types/customizable_item";
import { clamp } from "../../../utils/math";
import { cn } from "../../../utils/style";
import CdnImage from "../../atoms/CdnImage";
import Exterior360PlayIcon from "../../icons/Exterior360PlayIcon";
import ThreeSixtyIcon from "../../icons/ThreeSixtyIcon";
import ErrorTemplate from "../../template/ErrorTemplate";
import Button from "../../ui/Button";

import ImageElement from "./ImageElement";

const AUTO_SPIN_DELAY = 750;
const AUTO_SPIN_DURATION = 1250;

// Total pixels to drag/scroll for a complete 360° spin (all images)
// Lower values = faster/more sensitive spin
const FULL_SPIN_DRAG_PX = 800; // ~700px drag for full rotation
const FULL_SPIN_SCROLL_PX = 900; // ~800px scroll for full rotation

type NextThreeSixtyElementProps = Extract<
  CustomizableItem,
  { type: "next360" }
> & {
  itemIndex: number;
  onlyPreload: boolean;
};

/**
 * Custom hook to preload images into memory for smooth canvas rendering
 */
const useImageCache = (images: ImageWithHotspots[]) => {
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const cache = imageCacheRef.current;
    let loadedCount = 0;

    images.forEach(({ src }) => {
      if (cache.has(src)) {
        loadedCount++;
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        cache.set(src, img);
        loadedCount++;
        if (loadedCount === images.length) {
          setIsReady(true);
        }
      };
    });

    // Check if all images were already cached
    if (loadedCount === images.length) {
      setIsReady(true);
    }
  }, [images]);

  return { imageCache: imageCacheRef.current, isReady };
};

const NextThreeSixtyElementInteractive: React.FC<
  NextThreeSixtyElementProps
> = ({ images, onlyPreload }) => {
  const { demoSpin, reverse360 } = useGlobalContext();
  const { isShowingDetails, isZooming } = useControlsContext();

  const disableSpin = isZooming || isShowingDetails; // We do not want to do anything while zooming or showing a detail image

  // - element refs
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // - Image cache for smooth canvas rendering
  const { imageCache, isReady: isCacheReady } = useImageCache(images);

  // - Value refs
  const playDemoSpinRef = useRef(demoSpin);
  const demoSpinTimeout = useRef<NodeJS.Timeout | null>(null);
  const clearAutoSpinTimeout = useCallback(() => {
    if (!demoSpinTimeout.current) {
      return;
    }

    clearTimeout(demoSpinTimeout.current);
    demoSpinTimeout.current = null;
  }, []);

  const spinAnimationFrame = useRef<number | null>(null);
  const cancelSpinAnimation = () => {
    if (!spinAnimationFrame.current) {
      return;
    }

    cancelAnimationFrame(spinAnimationFrame.current);
    spinAnimationFrame.current = null;
  };

  // - Flip book image index (using ref for immediate updates, state for render sync)
  const [imageIndex, setImageIndex] = useState(0);
  const imageIndexRef = useRef(0);
  const pendingRenderRef = useRef<number | null>(null);

  const length = images.length;

  // Calculate pixels per image change - fewer pixels = faster spin
  // For 180 images: 400px / 180 ≈ 2.2px per image (very responsive)
  // For 36 images: 400px / 36 ≈ 11px per image
  const dragStepPx = useMemo(() => FULL_SPIN_DRAG_PX / length, [length]);
  const scrollStepPx = useMemo(() => FULL_SPIN_SCROLL_PX / length, [length]);

  // Draw image to canvas - GPU accelerated
  const drawImageToCanvas = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const imageSrc = images[index]?.src;
      const img = imageCache.get(imageSrc);

      if (img) {
        // Set canvas size to match image (only once or on resize)
        if (canvas.width !== img.naturalWidth) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
    },
    [images, imageCache]
  );

  // Batched render update using rAF for smooth 60fps updates
  const scheduleRender = useCallback(
    (newIndex: number) => {
      imageIndexRef.current = newIndex;

      if (pendingRenderRef.current === null) {
        pendingRenderRef.current = requestAnimationFrame(() => {
          drawImageToCanvas(imageIndexRef.current);
          setImageIndex(imageIndexRef.current);
          pendingRenderRef.current = null;
        });
      }
    },
    [drawImageToCanvas]
  );

  const displayPreviousImage = useCallback(() => {
    const newIndex = (imageIndexRef.current - 1 + length) % length;
    scheduleRender(newIndex);
  }, [length, scheduleRender]);

  const displayNextImage = useCallback(() => {
    const newIndex = (imageIndexRef.current + 1) % length;
    scheduleRender(newIndex);
  }, [length, scheduleRender]);

  // Initial canvas draw when cache is ready
  useEffect(() => {
    if (isCacheReady) {
      drawImageToCanvas(imageIndex);
    }
  }, [isCacheReady, drawImageToCanvas, imageIndex]);

  // - Event listeners to handle spinning
  useEffect(() => {
    if (disableSpin) {
      clearAutoSpinTimeout();
      return;
    }

    const container = containerRef.current;
    const scroller = scrollerRef.current;

    // DOM not ready yet
    if (!container || !scroller) {
      return;
    }

    // -- Auto-spin
    if (playDemoSpinRef.current) {
      playDemoSpinRef.current = false;

      demoSpinTimeout.current = setTimeout(() => {
        const startTime = Date.now();

        const applyDemoSpin = () => {
          const applyDemoSpinStep = () => {
            const now = Date.now();

            const progress = (now - startTime) / AUTO_SPIN_DURATION;

            const easeOutQuad = (t: number) => t * (2 - t);

            const stepIndex = Math.round(easeOutQuad(progress) * length);

            const newImageIndex = clamp(stepIndex % length, 0, length - 1);

            scheduleRender(newImageIndex);

            if (stepIndex >= length) {
              return;
            }

            applyDemoSpin();
          };

          spinAnimationFrame.current = requestAnimationFrame(applyDemoSpinStep);
        };

        applyDemoSpin();
      }, AUTO_SPIN_DELAY);
    }

    // -- Inertia

    type PosX = { timestamp: number; value: number };

    let spinStartX: number | null = null;
    let lastPosXs: PosX[] = [];
    let accumulatedWalkX = 0; // Track sub-pixel movement for smooth high-image-count spins

    const addPosX = (posX: PosX) => {
      lastPosXs.push(posX);
      if (lastPosXs.length > 20) {
        lastPosXs.shift();
      }
    };

    const startInertiaAnimation = () => {
      const startVelocity = (() => {
        // Filter out points that are too old (to avoid inertia even after the user stopped)
        const now = Date.now();
        const filteredMouseXs = lastPosXs.filter(
          point => now - point.timestamp < 100
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

      // Skip inertia if velocity is too low
      const absVelocity = Math.abs(startVelocity);
      if (absVelocity < 100) {
        return;
      }

      // Calculate total distance to travel based on velocity
      // Higher deceleration = shorter distance, less sensitive
      const deceleration = 6000; // px/s² - how quickly to slow down
      const totalDistance = (absVelocity * absVelocity) / (2 * deceleration) * 0.5; // 0.5 multiplier to reduce travel

      // Calculate duration based on physics: t = v / a
      const duration = (absVelocity / deceleration) * 1000; // in ms

      // Clamp duration for UX (not too short, not too long)
      const clampedDuration = clamp(duration, 150, 800);

      const direction = startVelocity > 0 ? 1 : -1;
      const startTime = performance.now();
      let lastDistance = 0;

      // Ease-out quart for smooth deceleration
      // Starts fast, gradually slows to a very smooth stop
      const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

      const applyInertia = () => {
        const applyInertiaStep = () => {
          const now = performance.now();
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / clampedDuration, 1);

          // Apply easing to get current position in the animation
          const easedProgress = easeOutQuart(progress);

          // Calculate how far we should have traveled by now
          const currentDistance = totalDistance * easedProgress * direction;

          // Calculate delta since last frame
          const deltaDistance = currentDistance - lastDistance;
          lastDistance = currentDistance;

          // Accumulate and process into image changes
          accumulatedWalkX += deltaDistance;

          while (Math.abs(accumulatedWalkX) >= dragStepPx) {
            if (accumulatedWalkX > 0 !== reverse360) {
              displayNextImage();
              accumulatedWalkX -= dragStepPx;
            } else {
              displayPreviousImage();
              accumulatedWalkX += dragStepPx;
            }
          }

          // Animation complete
          if (progress >= 1) {
            spinAnimationFrame.current = null;
            accumulatedWalkX = 0;
            return;
          }

          applyInertia();
        };

        spinAnimationFrame.current = requestAnimationFrame(applyInertiaStep);
      };

      applyInertia();
    };

    // -- Mouse events (click &
    const cancelAnimation = () => {
      clearAutoSpinTimeout();
      cancelSpinAnimation();
    };

    // NOTE: As the useEffect should not re-render, we can use mutable variables. If it changes in the future, we should use useRef

    // Handle when the user just clicked on the 360 to start spinning
    const onMouseDown = (e: MouseEvent) => {
      // Ignore event if the user is not using the main button
      if (e.button !== 0) {
        return;
      }

      e.preventDefault(); // Prevents native image dragging
      e.stopPropagation(); // Prevents carrousel to slide

      // Cancel any ongoing inertia animation
      cancelAnimation();

      // Take snapshot of the starting state
      const x = e.clientX;
      spinStartX = x;
      accumulatedWalkX = 0;
      lastPosXs = [{ timestamp: Date.now(), value: x }];
    };

    const onMouseMove = (e: MouseEvent) => {
      // Check if the user was actually spinning
      if (spinStartX === null) {
        return;
      }

      e.stopPropagation(); // Prevents parent slider from moving when rotating 360

      const { clientX: x } = e;

      // Take a snapshot of the current state
      addPosX({ timestamp: Date.now(), value: x });

      // Accumulate movement for sub-pixel precision with many images
      accumulatedWalkX += x - spinStartX;
      spinStartX = x;

      // Process accumulated movement
      while (Math.abs(accumulatedWalkX) >= dragStepPx) {
        // XOR operation to reverse the logic
        if (accumulatedWalkX > 0 !== reverse360) {
          displayNextImage();
          accumulatedWalkX -= dragStepPx;
        } else {
          displayPreviousImage();
          accumulatedWalkX += dragStepPx;
        }
      }
    };

    // Handle when the user releases the 360 or leaves the spinning area
    const onStopDragging = () => {
      // Check if the user was actually spinning
      if (spinStartX === null) {
        return;
      }

      // Clear the starting point
      spinStartX = null;
      accumulatedWalkX = 0;

      startInertiaAnimation();
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

      if (Math.abs(walk) < scrollStepPx) {
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
    // NOTE: It is due to Safari mobile not allowing to update the scrollLeft property while scrolling
    //       If the behavior is updated, we can remove this part

    let mainTouchId: Touch["identifier"] | null = null;

    const onTouchStart = (e: TouchEvent) => {
      // Ignore other touches
      if (mainTouchId !== null) {
        return;
      }

      if (e.changedTouches.length !== 1) {
        return;
      }

      // Cancel any ongoing inertia animation
      cancelAnimation();

      // Take snapshot of the starting state
      const { identifier: id, clientX: x } = e.changedTouches[0];
      mainTouchId = id;

      spinStartX = x;
      accumulatedWalkX = 0;
      lastPosXs = [{ timestamp: Date.now(), value: x }];
    };

    const onTouchMove = (e: TouchEvent) => {
      // Check if the user was actually spinning
      if (!spinStartX) {
        return;
      }

      const mainTouch = Array.from(e.changedTouches).find(
        ({ identifier }) => identifier === mainTouchId
      );

      // Ignore other touches
      if (!mainTouch) {
        return;
      }

      e.preventDefault(); // Prevent scroll

      const { clientX: x } = mainTouch;

      // Take a snapshot of the current state
      addPosX({ timestamp: Date.now(), value: x });

      // Accumulate movement for sub-pixel precision with many images
      accumulatedWalkX += x - spinStartX;
      spinStartX = x;

      // Process accumulated movement
      while (Math.abs(accumulatedWalkX) >= dragStepPx) {
        // XOR operation to reverse the logic
        if (accumulatedWalkX > 0 !== reverse360) {
          displayNextImage();
          accumulatedWalkX -= dragStepPx;
        } else {
          displayPreviousImage();
          accumulatedWalkX += dragStepPx;
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      // Check if the user was actually spinning
      if (!spinStartX) {
        return;
      }

      const isMainTouch = Array.from(e.changedTouches).some(
        ({ identifier }) => identifier === mainTouchId
      );

      // Ignore other touches
      if (!isMainTouch) {
        return;
      }

      // Clear the starting point
      mainTouchId = null;
      spinStartX = null;
      accumulatedWalkX = 0;

      startInertiaAnimation();
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

      // Clean up pending render
      if (pendingRenderRef.current !== null) {
        cancelAnimationFrame(pendingRenderRef.current);
      }
    };
  }, [
    clearAutoSpinTimeout,
    displayNextImage,
    displayPreviousImage,
    disableSpin,
    reverse360,
    length,
    dragStepPx,
    scrollStepPx,
    scheduleRender,
  ]);

  return (
    <div ref={containerRef} className="cursor-ew-resize">
      {/* Scroller is element larger than the image to capture scroll event and then, make the 360 spin */}
      {/* NOTE: ImageElement is within so that it can capture events first */}
      <div ref={scrollerRef} className=" overflow-x-scroll">
        <div className="sticky left-0 top-0">
          {/* Canvas for smooth GPU-accelerated rendering */}
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute left-0 top-0 size-full"
            style={{ willChange: "contents" }}
          />
          {/* Fallback ImageElement for hotspots and initial render */}
          <ImageElement
            {...images[imageIndex]}
            onlyPreload={onlyPreload}
            itemIndex={-1}
          />
        </div>
        {/* Add space on both sides to allow scrolling */}
        {/* NOTE: We need the element to have an height, otherwise, Safari will ignore it */}
        {/*       We need a lot of extra space on the side, otherwise, the 360 will not have inertia on Safari */}
        <div className="pointer-events-none -mt-px h-px w-[calc(100%+1024px)]" />
      </div>
    </div>
  );
};

type NextThreeSixtyElementPlaceholderProps = {
  itemIndex: number;
  images: ImageWithHotspots[];
  onPlaceholderImageLoaded: () => void;
  onSpinImagesLoaded: () => void;
  onError: () => void;
};

const NextThreeSixtyElementPlaceholder: React.FC<
  NextThreeSixtyElementPlaceholderProps
> = ({
  itemIndex,
  images,
  onPlaceholderImageLoaded,
  onSpinImagesLoaded,
  onError,
}) => {
  const { autoLoad360, emitAnalyticsEvent } = useGlobalContext();
  const { displayedCategoryId, displayedCategoryName } = useControlsContext();

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

  const fetchSpinImages = useCallback(
    (type: "click" | "auto") => {
      if (loadingProgress !== null) {
        return;
      }

      setLoadingStatusMap(new Map(imagesSrc.map(src => [src, false])));
      emitAnalyticsEvent({
        type: "track",
        category_id: displayedCategoryId,
        category_name: displayedCategoryName,
        item_type: "next-360",
        item_position: itemIndex,
        action_properties: {
          action_name: "Next 360 Play",
          action_field: "next_360_play",
          action_value: type,
        },
      });
    },
    [
      loadingProgress,
      imagesSrc,
      emitAnalyticsEvent,
      displayedCategoryId,
      displayedCategoryName,
      itemIndex,
    ]
  );

  // Click play
  const onClickPLayButton = useCallback(() => {
    fetchSpinImages("click");
  }, [fetchSpinImages]);

  const onImageLoaded = useCallback((image: string) => {
    setLoadingStatusMap(prev => {
      const newStatusMap = new Map(prev);
      newStatusMap.set(image, true);
      return newStatusMap;
    });
  }, []);

  // Autoplay
  useEffect(() => {
    if (autoLoad360) {
      fetchSpinImages("auto");
    }
  }, [autoLoad360, fetchSpinImages]);

  // When all images are loaded, we emit the event
  useEffect(() => {
    if (loadingProgress === 100) {
      onSpinImagesLoaded();
    }
  }, [loadingProgress, onSpinImagesLoaded]);

  return (
    <div className="relative aspect-[4/3] w-full">
      {loadingProgress !== null && loadingProgress !== 100 && (
        // Add images to DOM to preload them
        <div className="hidden">
          {imagesSrc.map(src => (
            <CdnImage
              key={src}
              src={src}
              onLoad={() => onImageLoaded(src)}
              onError={onError}
            />
          ))}
        </div>
      )}

      <CdnImage
        className="size-full"
        src={imagesSrc[0]}
        onLoad={onPlaceholderImageLoaded}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-4 bg-foreground/35">
        <ThreeSixtyIcon className="size-20" />

        <Button color="neutral" shape="icon" onClick={onClickPLayButton}>
          <Exterior360PlayIcon className="size-full" />
        </Button>

        <div
          // Progress bar (invisible when not loading to avoid layout shift)
          className={cn(
            "relative h-1 w-3/5 overflow-hidden rounded-full bg-background",
            loadingProgress === null && "invisible"
          )}
        >
          <div
            className="h-full bg-primary transition-[width]"
            style={{ width: `${loadingProgress ?? 0}%` }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * NextThreeSixtyElement component renders a carrousel's 360
 *
 * @prop `onlyPreload`: If true, zoom will not affect the 360. It is useful to pre-fetch images.
 * @prop `index`: The index of the item in the carrousel. Used to share state.
 */
const NextThreeSixtyElement: React.FC<NextThreeSixtyElementProps> = props => {
  const { itemIndex } = props;

  const { setItemInteraction } = useControlsContext();

  const [status, setStatus] = useState<
    null | "placeholder" | "spin" | "error"
  >();

  // Update the item interaction state according to the readiness of the 360
  useEffect(() => {
    if (status === null || status === "error") {
      return;
    }

    setItemInteraction(itemIndex, status === "spin" ? "running" : "ready");
  }, [itemIndex, setItemInteraction, status]);

  if (status === "error") {
    return (
      <ErrorTemplate
        className="text-background"
        text="Spin could not be loaded"
      />
    );
  } else if (status !== "spin") {
    return (
      <NextThreeSixtyElementPlaceholder
        {...props}
        onPlaceholderImageLoaded={() =>
          setStatus(s => (s === null ? "placeholder" : s))
        }
        onSpinImagesLoaded={() => setStatus("spin")}
        onError={() => setStatus("error")}
      />
    );
  } else {
    return <NextThreeSixtyElementInteractive {...props} />;
  }
};

export default NextThreeSixtyElement;
