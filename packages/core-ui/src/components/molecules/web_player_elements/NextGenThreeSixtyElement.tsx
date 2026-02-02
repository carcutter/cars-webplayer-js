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

// ImageElement not used in 360 spin to avoid srcSet mismatches - using CdnImage directly

const AUTO_SPIN_DELAY = 750;
const AUTO_SPIN_DURATION = 1250;

const DRAG_SPIN_PX = 360; // 10px for each image of a 36 images spin
const SCROLL_SPIN_PX = 480; // 15px for each image of a 36 images spin

type NextGenThreeSixtyElementProps = Extract<
  CustomizableItem,
  { type: "next360" }
> & {
  itemIndex: number;
  onlyPreload: boolean;
};

const NextGenThreeSixtyElementInteractive: React.FC<
  NextGenThreeSixtyElementProps
> = ({ images, onlyPreload: _onlyPreload }) => {
  const { demoSpin, reverse360 } = useGlobalContext();
  const { isShowingDetails, isZooming } = useControlsContext();

  const disableSpin = isZooming || isShowingDetails; // We do not want to do anything while zooming or showing a detail image

  // - element refs
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // - Refs for direct DOM manipulation (avoids React re-renders on iOS)
  const imageIndexRef = useRef(0);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // - Throttling refs for iOS performance (avoid processing every touch event)
  const pendingUpdateRef = useRef<number | null>(null);
  const lastTouchXRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  // - Velocity tracking with pre-allocated ring buffer (avoids array allocations)
  const velocityBufferRef = useRef<{
    timestamps: Float64Array;
    values: Float64Array;
    index: number;
    count: number;
  }>({
    timestamps: new Float64Array(10),
    values: new Float64Array(10),
    index: 0,
    count: 0,
  });

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

  // - Flip book image index & details
  const [imageIndex, setImageIndex] = useState(0);

  // Keep ref in sync with state (for when state is updated externally, e.g., demo spin)
  useEffect(() => {
    imageIndexRef.current = imageIndex;
  }, [imageIndex]);

  const length = images.length;

  // - Direct DOM manipulation functions (bypass React re-renders for iOS performance)
  const updateVisibleImage = useCallback((newIndex: number) => {
    const prevIndex = imageIndexRef.current;
    if (prevIndex === newIndex) return;

    // Hide previous image via direct DOM manipulation
    const prevImage = imageRefs.current[prevIndex];
    if (prevImage) prevImage.style.opacity = "0";

    // Show new image via direct DOM manipulation
    const newImage = imageRefs.current[newIndex];
    if (newImage) newImage.style.opacity = "1";

    imageIndexRef.current = newIndex;
  }, []);

  const displayNextImageDirect = useCallback(() => {
    const newIndex = (imageIndexRef.current + 1) % length;
    updateVisibleImage(newIndex);
  }, [length, updateVisibleImage]);

  const displayPreviousImageDirect = useCallback(() => {
    const newIndex = (imageIndexRef.current - 1 + length) % length;
    updateVisibleImage(newIndex);
  }, [length, updateVisibleImage]);

  // Sync React state with ref (call when interaction ends)
  const syncImageIndexState = useCallback(() => {
    setImageIndex(imageIndexRef.current);
  }, []);

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

            const imageIndex = clamp(stepIndex % length, 0, length - 1);

            setImageIndex(imageIndex);

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

    const dragStepPx = DRAG_SPIN_PX / length;

    // Use refs for mutable state to avoid allocations
    let spinStartX: number | null = null;

    // Ring buffer helpers (no allocations)
    const velocityBuffer = velocityBufferRef.current;
    const resetVelocityBuffer = () => {
      velocityBuffer.index = 0;
      velocityBuffer.count = 0;
    };
    const addVelocityPoint = (timestamp: number, value: number) => {
      const idx = velocityBuffer.index;
      velocityBuffer.timestamps[idx] = timestamp;
      velocityBuffer.values[idx] = value;
      velocityBuffer.index = (idx + 1) % 10;
      if (velocityBuffer.count < 10) velocityBuffer.count++;
    };

    const startInertiaAnimation = () => {
      const startVelocity = (() => {
        // Calculate velocity from ring buffer (no allocations)
        const now = Date.now();
        const { timestamps, values, index, count } = velocityBuffer;

        if (count < 2) return 0;

        // Find valid points within last 50ms
        let firstIdx = -1;
        let lastIdx = -1;

        for (let i = 0; i < count; i++) {
          const bufIdx = (index - 1 - i + 10) % 10;
          if (now - timestamps[bufIdx] < 50) {
            if (lastIdx === -1) lastIdx = bufIdx;
            firstIdx = bufIdx;
          }
        }

        if (firstIdx === -1 || lastIdx === -1 || firstIdx === lastIdx) return 0;

        const timeDiff = timestamps[lastIdx] - timestamps[firstIdx];
        if (timeDiff <= 0) return 0;

        return (values[lastIdx] - values[firstIdx]) / (timeDiff / 1000);
      })();

      const startTime = Date.now();

      let walkX = 0;
      let lastFrameTime = startTime;

      const applyInertia = () => {
        const applyInertiaStep = () => {
          const now = Date.now();

          // Apply friction
          const elapsedSeconds = (now - startTime) / 1000;
          const decayFactor = Math.pow(0.05, elapsedSeconds); // NOTE: could be configurable
          const currentVelocity = startVelocity * decayFactor;

          // Update walk
          const timeSinceLastFrame = (now - lastFrameTime) / 1000;
          walkX += currentVelocity * timeSinceLastFrame;

          // The inertia is very low, we can stop it
          if (
            Math.abs(currentVelocity) < 5 * dragStepPx &&
            Math.abs(walkX) < dragStepPx
          ) {
            spinAnimationFrame.current = null;
            // Sync React state when inertia animation completes
            syncImageIndexState();
            return;
          }

          if (Math.abs(walkX) >= dragStepPx) {
            if (walkX > 0 !== reverse360) {
              displayNextImageDirect();
            } else {
              displayPreviousImageDirect();
            }

            walkX = 0;
          }

          lastFrameTime = now;

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
      resetVelocityBuffer();
      addVelocityPoint(Date.now(), x);
    };

    const onMouseMove = (e: MouseEvent) => {
      // Check if the user was actually spinning
      if (spinStartX === null) {
        return;
      }

      e.stopPropagation(); // Prevents parent slider from moving when rotating 360

      const { clientX: x } = e;

      // Track velocity (no object allocation)
      addVelocityPoint(Date.now(), x);

      const walkX = x - spinStartX;

      // If the user did not move enough, we do not want to rotate
      if (Math.abs(walkX) < dragStepPx) {
        return;
      }

      // XOR operation to reverse the logic - use direct DOM manipulation
      if (walkX > 0 !== reverse360) {
        displayNextImageDirect();
      } else {
        displayPreviousImageDirect();
      }

      // Reset the starting point to the current position
      spinStartX = x;
    };

    // Handle when the user releases the 360 or leaves the spinning area
    const onStopDragging = () => {
      // Check if the user was actually spinning
      if (spinStartX === null) {
        return;
      }

      // Clear the starting point
      spinStartX = null;

      startInertiaAnimation();
    };

    container.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onStopDragging);
    document.addEventListener("mouseup", onStopDragging);
    document.addEventListener("contextmenu", onStopDragging);

    // - Scroll events to update the image thanks to the "invisible scroller"

    const scrollStepPx = SCROLL_SPIN_PX / length;

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

      // XOR operation to reverse the logic - use direct DOM manipulation
      if (walk < 0 !== reverse360) {
        displayNextImageDirect();
      } else {
        displayPreviousImageDirect();
      }

      // We just changed the image, we want to re-center the scroller
      centerScroller();
    };

    scroller.addEventListener("scroll", onScroll);

    // - Touch events (only mandatory for Safari mobile)
    // NOTE: It is due to Safari mobile not allowing to update the scrollLeft property while scrolling
    //       If the behavior is updated, we can remove this part

    let mainTouchId: Touch["identifier"] | null = null;

    // Throttled touch processing (processes at most once per animation frame)
    const processTouchUpdate = () => {
      pendingUpdateRef.current = null;

      const x = lastTouchXRef.current;
      const startX = touchStartXRef.current;

      if (x === null || startX === null) return;

      const walkX = x - startX;

      // If the user did not move enough, we do not want to rotate
      if (Math.abs(walkX) < dragStepPx) {
        return;
      }

      // XOR operation to reverse the logic - use direct DOM manipulation
      if (walkX > 0 !== reverse360) {
        displayNextImageDirect();
      } else {
        displayPreviousImageDirect();
      }

      // Reset the starting point to the current position
      touchStartXRef.current = x;
      spinStartX = x;
    };

    const onTouchStart = (e: TouchEvent) => {
      // Ignore other touches
      if (mainTouchId !== null) {
        return;
      }

      if (e.changedTouches.length !== 1) {
        return;
      }

      // Cancel any ongoing inertia animation and pending updates
      cancelAnimation();
      if (pendingUpdateRef.current !== null) {
        cancelAnimationFrame(pendingUpdateRef.current);
        pendingUpdateRef.current = null;
      }

      // Take snapshot of the starting state
      const touch = e.changedTouches[0];
      mainTouchId = touch.identifier;
      const x = touch.clientX;

      spinStartX = x;
      touchStartXRef.current = x;
      lastTouchXRef.current = x;
      resetVelocityBuffer();
      addVelocityPoint(Date.now(), x);
    };

    const onTouchMove = (e: TouchEvent) => {
      // Check if the user was actually spinning
      if (spinStartX === null) {
        return;
      }

      // Find main touch without Array.from (avoid allocation)
      let mainTouch: Touch | null = null;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === mainTouchId) {
          mainTouch = e.changedTouches[i];
          break;
        }
      }

      // Ignore other touches
      if (!mainTouch) {
        return;
      }

      e.preventDefault(); // Prevent scroll

      const x = mainTouch.clientX;

      // Track velocity (no object allocation)
      addVelocityPoint(Date.now(), x);
      lastTouchXRef.current = x;

      // Throttle DOM updates to animation frames (critical for iOS performance)
      if (pendingUpdateRef.current === null) {
        pendingUpdateRef.current = requestAnimationFrame(processTouchUpdate);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      // Check if the user was actually spinning
      if (spinStartX === null) {
        return;
      }

      // Find main touch without Array.from (avoid allocation)
      let isMainTouch = false;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === mainTouchId) {
          isMainTouch = true;
          break;
        }
      }

      // Ignore other touches
      if (!isMainTouch) {
        return;
      }

      // Cancel any pending throttled update
      if (pendingUpdateRef.current !== null) {
        cancelAnimationFrame(pendingUpdateRef.current);
        pendingUpdateRef.current = null;
      }

      // Clear the starting point
      mainTouchId = null;
      spinStartX = null;
      touchStartXRef.current = null;
      lastTouchXRef.current = null;

      startInertiaAnimation();
    };

    // Use { passive: false } to allow preventDefault() on iOS Safari
    scroller.addEventListener("touchstart", onTouchStart, { passive: false });
    scroller.addEventListener("touchmove", onTouchMove, { passive: false });
    scroller.addEventListener("touchend", onTouchEnd);
    scroller.addEventListener("touchcancel", onTouchEnd);

    return () => {
      cancelSpinAnimation();
      // Cancel any pending throttled updates
      if (pendingUpdateRef.current !== null) {
        cancelAnimationFrame(pendingUpdateRef.current);
        pendingUpdateRef.current = null;
      }
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
  }, [
    clearAutoSpinTimeout,
    displayNextImageDirect,
    displayPreviousImageDirect,
    syncImageIndexState,
    disableSpin,
    reverse360,
    length,
  ]);

  return (
    <div ref={containerRef} className="cursor-ew-resize">
      {/* Scroller is element larger than the image to capture scroll event and then, make the 360 spin */}
      {/* NOTE: ImageElement is within so that it can capture events first */}
      <div ref={scrollerRef} className=" overflow-x-scroll">
        <div className="sticky left-0 top-0">
          {/* All images rendered and kept in DOM - switching done via opacity for instant display */}
          {/* Using refs and inline styles for direct DOM manipulation to avoid React re-renders on iOS */}
          {images.map((image, index) => (
            <CdnImage
              key={image.src}
              ref={el => {
                imageRefs.current[index] = el;
              }}
              src={image.src}
              className={cn(
                "pointer-events-none size-full object-cover",
                index === 0 ? "relative" : "absolute inset-0"
              )}
              style={{ opacity: index === imageIndex ? 1 : 0 }}
            />
          ))}
        </div>
        {/* Add space on both sides to allow scrolling */}
        {/* NOTE: We need the element to have an height, otherwise, Safari will ignore it */}
        {/*       We need a lot of extra space on the side, otherwise, the 360 will not have inertia on Safari */}
        <div className="pointer-events-none -mt-px h-px w-[calc(100%+1024px)]" />
      </div>
    </div>
  );
};

type NextGenThreeSixtyElementPlaceholderProps = {
  itemIndex: number;
  images: ImageWithHotspots[];
  onPlaceholderImageLoaded: () => void;
  onSpinImagesLoaded: () => void;
  onError: () => void;
};

const NextGenThreeSixtyElementPlaceholder: React.FC<
  NextGenThreeSixtyElementPlaceholderProps
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
        item_type: "exterior-360",
        item_position: itemIndex,
        action_properties: {
          action_name: "Exterior 360 Play",
          action_field: "exterior_360_play",
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
 * NextGenThreeSixtyElement component renders a carrousel's 360
 *
 * @prop `onlyPreload`: If true, zoom will not affect the 360. It is useful to pre-fetch images.
 * @prop `index`: The index of the item in the carrousel. Used to share state.
 */
const NextGenThreeSixtyElement: React.FC<
  NextGenThreeSixtyElementProps
> = props => {
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
      <NextGenThreeSixtyElementPlaceholder
        {...props}
        onPlaceholderImageLoaded={() =>
          setStatus(s => (s === null ? "placeholder" : s))
        }
        onSpinImagesLoaded={() => setStatus("spin")}
        onError={() => setStatus("error")}
      />
    );
  } else {
    return <NextGenThreeSixtyElementInteractive {...props} />;
  }
};

export default NextGenThreeSixtyElement;
