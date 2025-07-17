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

const DRAG_SPIN_PX = 360; // 10px for each image of a 36 images spin
const SCROLL_SPIN_PX = 480; // 15px for each image of a 36 images spin

type ThreeSixtyElementProps = Extract<CustomizableItem, { type: "360" }> & {
  itemIndex: number;
  onlyPreload: boolean;
};

const ThreeSixtyElementInteractive: React.FC<ThreeSixtyElementProps> = ({
  images,
  onlyPreload,
}) => {
  const { demoSpin, reverse360 } = useGlobalContext();
  const { isShowingDetails, isZooming } = useControlsContext();

  const disableSpin = isZooming || isShowingDetails; // We do not want to do anything while zooming or showing a detail image

  // - element refs
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

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

  const length = images.length;

  const displayPreviousImage = useCallback(() => {
    setImageIndex(currentIndex => (currentIndex - 1 + length) % length);
  }, [length]);
  const displayNextImage = useCallback(() => {
    setImageIndex(currentIndex => (currentIndex + 1) % length);
  }, [length]);

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

    type PosX = { timestamp: number; value: number };

    let spinStartX: number | null = null;
    let lastPosXs: PosX[] = [];

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
            return;
          }

          if (Math.abs(walkX) >= dragStepPx) {
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

      const walkX = x - spinStartX;

      // If the user did not move enough, we do not want to rotate
      if (Math.abs(walkX) < dragStepPx) {
        return;
      }

      // XOR operation to reverse the logic
      if (walkX > 0 !== reverse360) {
        displayNextImage();
      } else {
        displayPreviousImage();
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

      const walkX = x - spinStartX;

      // If the user did not move enough, we do not want to rotate
      if (Math.abs(walkX) < dragStepPx) {
        return;
      }

      // XOR operation to reverse the logic
      if (walkX > 0 !== reverse360) {
        displayNextImage();
      } else {
        displayPreviousImage();
      }

      // Reset the starting point to the current position
      spinStartX = x;
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
    };
  }, [
    clearAutoSpinTimeout,
    displayNextImage,
    displayPreviousImage,
    disableSpin,
    reverse360,
    length,
  ]);

  return (
    <div ref={containerRef} className="cursor-ew-resize">
      {/* Scroller is element larger than the image to capture scroll event and then, make the 360 spin */}
      {/* NOTE: ImageElement is within so that it can capture events first */}
      <div ref={scrollerRef} className="no-scrollbar overflow-x-scroll">
        <div className="sticky left-0 top-0">
          {/* Flip book (Ensures image are already in the DOM) */}
          {images.map(image => (
            <CdnImage
              key={image.src}
              src={image.src}
              className="pointer-events-none !absolute left-0 top-0 -z-10"
            />
          ))}
          <ImageElement {...images[imageIndex]} onlyPreload={onlyPreload} />
        </div>
        {/* Add space on both sides to allow scrolling */}
        {/* NOTE: We need the element to have an height, otherwise, Safari will ignore it */}
        {/*       We need a lot of extra space on the side, otherwise, the 360 will not have inertia on Safari */}
        <div className="pointer-events-none -mt-px h-px w-[calc(100%+1024px)]" />
      </div>
    </div>
  );
};

type ThreeSixtyElementPlaceholderProps = {
  images: ImageWithHotspots[];
  onPlaceholderImageLoaded: () => void;
  onSpinImagesLoaded: () => void;
  onError: () => void;
};

const ThreeSixtyElementPlaceholder: React.FC<
  ThreeSixtyElementPlaceholderProps
> = ({ images, onPlaceholderImageLoaded, onSpinImagesLoaded, onError }) => {
  const { autoLoad360 } = useGlobalContext();

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

  const fetchSpinImages = useCallback(() => {
    if (loadingProgress !== null) {
      return;
    }

    setLoadingStatusMap(new Map(imagesSrc.map(src => [src, false])));
  }, [imagesSrc, loadingProgress]);

  const onImageLoaded = useCallback((image: string) => {
    setLoadingStatusMap(prev => {
      const newStatusMap = new Map(prev);
      newStatusMap.set(image, true);
      return newStatusMap;
    });
  }, []);

  // If autoLoad360 is enabled, we start loading the images
  useEffect(() => {
    if (autoLoad360) {
      fetchSpinImages();
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
        <ThreeSixtyIcon className="text-primary-light size-20" />

        <Button color="neutral" shape="icon" onClick={fetchSpinImages}>
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
 * ThreeSixtyElement component renders a carrousel's 360
 *
 * @prop `onlyPreload`: If true, zoom will not affect the 360. It is useful to pre-fetch images.
 * @prop `index`: The index of the item in the carrousel. Used to share state.
 */
const ThreeSixtyElement: React.FC<ThreeSixtyElementProps> = props => {
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
      <ThreeSixtyElementPlaceholder
        {...props}
        onPlaceholderImageLoaded={() =>
          setStatus(s => (s === null ? "placeholder" : s))
        }
        onSpinImagesLoaded={() => setStatus("spin")}
        onError={() => setStatus("error")}
      />
    );
  } else {
    return <ThreeSixtyElementInteractive {...props} />;
  }
};

export default ThreeSixtyElement;
