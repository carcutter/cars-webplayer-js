import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DEFAULT_SPIN_CURSOR, type ImageWithHotspots } from "@car-cutter/core";

import spinCursorDefault from "../../../assets/cursors/spin-360-default.svg";
import { useControlsContext } from "../../../providers/ControlsContext";
import { useGlobalContext } from "../../../providers/GlobalContext";
import { getThemeConfig } from "../../../theme-config";
import { CustomizableItem } from "../../../types/customizable_item";
import { clamp } from "../../../utils/math";
import { cn } from "../../../utils/style";
import CdnImage from "../../atoms/CdnImage";
import Exterior360PlayIcon from "../../icons/Exterior360PlayIcon";
import ThreeSixtyIcon from "../../icons/ThreeSixtyIcon";
import ErrorTemplate from "../../template/ErrorTemplate";
import Button from "../../ui/Button";
import Hotspot from "../Hotspot";

import ImageElement from "./ImageElement";

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

const getCursorString = (
  cursorUrl: string,
  hotspot: { x: number; y: number },
  fallback: string
): string => {
  return `url("${cursorUrl}") ${hotspot.x} ${hotspot.y}, ${fallback}`;
};

const NextGenThreeSixtyElementInteractive: React.FC<
  NextGenThreeSixtyElementProps & {
    hidden?: boolean;
    onAllFramesLoaded?: () => void;
    onFrameLoaded?: () => void;
    onFrameError?: () => void;
    /** Pre-resolved URLs (currentSrc) for each frame, populated during loading phase */
    resolvedFrameUrls: React.MutableRefObject<string[]>;
  }
> = ({ images, itemIndex, onlyPreload, hidden, onAllFramesLoaded, onFrameLoaded, onFrameError, resolvedFrameUrls }) => {
  const { demoSpin, reverse360, spinCursor, themeConfig } = useGlobalContext();
  const { isShowingDetails, isZooming, currentItemHotspotsVisible } =
    useControlsContext();
  const theme = useMemo(() => getThemeConfig(themeConfig), [themeConfig]);

  const disableSpin = isZooming || isShowingDetails || !!hidden; // We do not want to do anything while zooming, showing a detail image, or while hidden

  // - Track frame loading for pre-mount preloading
  const loadedCountRef = useRef(0);
  const allFramesLoadedRef = useRef(false);
  const onFrameLoad = useCallback(
    (index: number, imgEl: HTMLImageElement) => {
      // Capture the actual URL the browser selected from srcSet.
      // onLoad can fire multiple times for the same <img> when the browser
      // switches srcSet candidates (e.g. on viewport/DPR changes), so only
      // count this frame the first time we see a resolved URL for its slot.
      const resolvedUrl = imgEl.currentSrc || imgEl.src;
      const previousUrl = resolvedFrameUrls.current[index];
      if (previousUrl === resolvedUrl) {
        return;
      }

      const isNewSlot = !previousUrl;
      resolvedFrameUrls.current[index] = resolvedUrl;

      if (!isNewSlot) {
        // srcSet swap on an already-counted frame: update the resolved URL
        // but do not double-count it.
        return;
      }

      loadedCountRef.current += 1;
      onFrameLoaded?.();
      if (
        !allFramesLoadedRef.current &&
        loadedCountRef.current >= images.length &&
        onAllFramesLoaded
      ) {
        allFramesLoadedRef.current = true;
        onAllFramesLoaded();
      }
    },
    [images.length, onAllFramesLoaded, onFrameLoaded, resolvedFrameUrls]
  );

  // - Element refs
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // - Single flipbook <img> element ref for imperative src swapping
  const flipbookImgRef = useRef<HTMLImageElement>(null);

  // - Per-frame hotspot group refs for imperative visibility toggling.
  //   This mirrors the flipbook pattern: hotspots for all frames are mounted
  //   once, and only display:none/block is flipped per frame swap to avoid
  //   any React re-renders during spin.
  const hotspotGroupRefs = useRef<(HTMLDivElement | null)[]>([]);

  // - Frame index: ref for imperative updates during spin, state for resting ImageElement
  const imageIndexRef = useRef(0);
  const [restingImageIndex, setRestingImageIndex] = useState(0);

  const length = images.length;

  // - Cursor refs (to avoid re-renders during drag)
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const spinCursorRef = useRef(spinCursor);
  spinCursorRef.current = spinCursor;

  const applyDefaultCursor = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const currentTheme = themeRef.current;
    const cursor = spinCursorRef.current;

    if (currentTheme?.cursor) {
      const entry = currentTheme.cursor.default;
      container.style.cursor = getCursorString(entry.url, entry.hotspot, cursor);
    } else if (cursor === DEFAULT_SPIN_CURSOR) {
      container.style.cursor = `url("${spinCursorDefault}") 45 28, ew-resize`;
    } else {
      container.style.cursor = cursor;
    }
  }, []);

  const applyCursorForDirection = useCallback(
    (direction: "left" | "right", isGrabbing: boolean) => {
      const container = containerRef.current;
      if (!container) return;

      const currentTheme = themeRef.current;
      const cursor = spinCursorRef.current;
      const activeCursor =
        cursor === "grab" && isGrabbing ? "grabbing" : cursor;

      if (currentTheme?.cursor) {
        const cursorKey = direction === "left" ? "leftSpin" : "rightSpin";
        const entry = currentTheme.cursor[cursorKey];
        container.style.cursor = getCursorString(
          entry.url,
          entry.hotspot,
          activeCursor
        );
      } else if (activeCursor === DEFAULT_SPIN_CURSOR) {
        container.style.cursor = `url("${spinCursorDefault}") 45 28, ew-resize`;
      } else {
        container.style.cursor = activeCursor;
      }
    },
    []
  );

  const applyGrabbingCursor = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const currentTheme = themeRef.current;
    const cursor = spinCursorRef.current;

    if (currentTheme?.cursor) {
      const entry = currentTheme.cursor.default;
      const activeCursor = cursor === "grab" ? "grabbing" : cursor;
      container.style.cursor = getCursorString(
        entry.url,
        entry.hotspot,
        activeCursor
      );
    } else if (cursor === "grab") {
      container.style.cursor = "grabbing";
    }
  }, []);

  // - Imperative frame switching: swap src on the single flipbook <img> (no React re-render)
  const showFrame = useCallback((newIndex: number) => {
    const prev = imageIndexRef.current;
    if (prev === newIndex) return;

    const img = flipbookImgRef.current;
    const url = resolvedFrameUrls.current[newIndex];
    if (img && url) {
      img.src = url;
    }

    // Toggle hotspot group visibility imperatively (no React re-render).
    const prevGroup = hotspotGroupRefs.current[prev];
    const nextGroup = hotspotGroupRefs.current[newIndex];
    if (prevGroup) prevGroup.style.display = "none";
    if (nextGroup) nextGroup.style.display = "block";

    imageIndexRef.current = newIndex;
  }, [resolvedFrameUrls]);

  const displayNextImage = useCallback(() => {
    showFrame((imageIndexRef.current + 1) % length);
  }, [length, showFrame]);

  const displayPreviousImage = useCallback(() => {
    showFrame((imageIndexRef.current - 1 + length) % length);
  }, [length, showFrame]);

  // Track whether the user is actively spinning (drag/touch/inertia/demo) to hide ImageElement overlay
  const [isSpinActive, setIsSpinActive] = useState(false);

  // - Sync resting frame when spin ends (single React render for ImageElement hotspots)
  const syncRestingFrame = useCallback(() => {
    setRestingImageIndex(imageIndexRef.current);
    setIsSpinActive(false);
  }, []);

  // - Value refs
  const playDemoSpinRef = useRef(demoSpin);
  const demoSpinTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  // - Set initial cursor on mount and when theme/spinCursor change
  useEffect(() => {
    applyDefaultCursor();
  }, [applyDefaultCursor, theme, spinCursor]);

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
      setIsSpinActive(true);

      demoSpinTimeout.current = setTimeout(() => {
        const startTime = Date.now();

        const applyDemoSpin = () => {
          const applyDemoSpinStep = () => {
            const now = Date.now();

            const progress = (now - startTime) / AUTO_SPIN_DURATION;

            const easeOutQuad = (t: number) => t * (2 - t);

            const stepIndex = Math.round(easeOutQuad(progress) * length);

            const frameIndex = clamp(stepIndex % length, 0, length - 1);

            showFrame(frameIndex);

            if (stepIndex >= length) {
              syncRestingFrame();
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
    let isGrabbing = false;

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

      // If velocity is negligible, sync immediately
      if (Math.abs(startVelocity) < 5 * dragStepPx) {
        syncRestingFrame();
        return;
      }

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
            syncRestingFrame();
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

    // -- Mouse events
    const cancelAnimation = () => {
      clearAutoSpinTimeout();
      cancelSpinAnimation();
    };

    isGrabbing = false;
    applyDefaultCursor();

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
      isGrabbing = true;
      setIsSpinActive(true);
      applyGrabbingCursor();

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
      if (walkX !== 0 && themeRef.current?.cursor) {
        applyCursorForDirection(walkX < 0 ? "left" : "right", isGrabbing);
      }

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
      isGrabbing = false;
      applyDefaultCursor();

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
      isGrabbing = true;
      setIsSpinActive(true);
      applyGrabbingCursor();

      // Take snapshot of the starting state
      const { identifier: id, clientX: x } = e.changedTouches[0];
      mainTouchId = id;

      spinStartX = x;
      lastPosXs = [{ timestamp: Date.now(), value: x }];
    };

    const onTouchMove = (e: TouchEvent) => {
      // Check if the user was actually spinning
      if (spinStartX === null) {
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
      if (walkX !== 0 && themeRef.current?.cursor) {
        applyCursorForDirection(walkX < 0 ? "left" : "right", isGrabbing);
      }

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
      if (spinStartX === null) {
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
      isGrabbing = false;
      applyDefaultCursor();

      startInertiaAnimation();
    };

    scroller.addEventListener("touchstart", onTouchStart, { passive: false });
    scroller.addEventListener("touchmove", onTouchMove, { passive: false });
    scroller.addEventListener("touchend", onTouchEnd);
    scroller.addEventListener("touchcancel", onTouchEnd);

    return () => {
      clearAutoSpinTimeout();
      cancelSpinAnimation();
      applyDefaultCursor();
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
    applyDefaultCursor,
    applyGrabbingCursor,
    applyCursorForDirection,
    clearAutoSpinTimeout,
    displayNextImage,
    displayPreviousImage,
    disableSpin,
    reverse360,
    length,
    showFrame,
    syncRestingFrame,
  ]);

  return (
    <div ref={containerRef} style={hidden ? { position: 'absolute', width: '100%', height: '100%', opacity: 0, pointerEvents: 'none' } : undefined}>
      {/* Hidden CdnImage elements for preloading via srcSet (only during loading phase).
          Their onLoad captures currentSrc into resolvedFrameUrls. */}
      {!allFramesLoadedRef.current && (
        <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', opacity: 0 }}>
          {images.map((image, i) => (
            <CdnImage
              key={image.src}
              src={image.src}
              className="size-full object-cover"
              onLoad={(e) => onFrameLoad(i, e.currentTarget)}
              onError={() => onFrameError?.()}
            />
          ))}
        </div>
      )}
      {/* Scroller is element larger than the image to capture scroll event and then, make the 360 spin */}
      {/* NOTE: ImageElement is within so that it can capture events first */}
      <div ref={scrollerRef} className="overflow-x-scroll">
        <div className="sticky left-0 top-0">
          {/* Single flipbook image: src is swapped imperatively during spin (no React re-render).
              Uses the resolved currentSrc URLs that match the browser's srcSet cache. */}
          <img
            ref={flipbookImgRef}
            src={resolvedFrameUrls.current[0] || images[0].src}
            className={cn(
              "pointer-events-none !absolute left-0 top-0 size-full object-cover",
              isSpinActive ? "z-[2]" : "-z-10"
            )}
            alt=""
          />
          <ImageElement
            {...images[restingImageIndex]}
            onlyPreload={onlyPreload}
            itemIndex={-1}
            suppressHotspots
          />
          {/* Per-frame hotspot overlay.
              All frames' hotspots are mounted once; only display:none/block is
              flipped imperatively in showFrame() to track the visible frame
              without triggering React re-renders during spin.
              The wrapper is non-interactive while spinning to avoid hijacking
              drag/touch gestures. */}
          {currentItemHotspotsVisible && (
            <div
              className={cn(
                "absolute inset-0 z-[3]",
                isSpinActive ? "pointer-events-none" : "pointer-events-auto"
              )}
            >
              {images.map((image, i) => (
                <div
                  key={i}
                  ref={el => {
                    hotspotGroupRefs.current[i] = el;
                  }}
                  className="absolute inset-0"
                  style={{ display: i === restingImageIndex ? "block" : "none" }}
                >
                  {image.hotspots?.map((hotspot, hi) => (
                    <Hotspot
                      key={hi}
                      hotspot={hotspot}
                      item={{
                        item_type: "next360",
                        item_position: itemIndex,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
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
  loadingProgress: number | null;
  onPlaceholderImageLoaded: () => void;
  onPlaceholderImageError?: () => void;
  onStartLoading: (type: "click" | "auto") => void;
};

const NextGenThreeSixtyElementPlaceholder: React.FC<
  NextGenThreeSixtyElementPlaceholderProps
> = ({
  itemIndex,
  images,
  loadingProgress,
  onPlaceholderImageLoaded,
  onPlaceholderImageError,
  onStartLoading,
}) => {
  const { autoLoad360, emitAnalyticsEvent, themeConfig } = useGlobalContext();
  const { displayedCategoryId, displayedCategoryName } = useControlsContext();
  const theme = useMemo(() => getThemeConfig(themeConfig), [themeConfig]);

  const fetchSpinImages = useCallback(
    (type: "click" | "auto") => {
      if (loadingProgress !== null) {
        return;
      }

      onStartLoading(type);
      emitAnalyticsEvent({
        type: "interaction",
        current: {
          category_id: displayedCategoryId,
          category_name: displayedCategoryName,
          item_type: "next360",
          item_position: itemIndex,
        },
        action: {
          name: "Next 360 Play",
          field: "next360_play",
          value: type,
        },
      });
    },
    [
      loadingProgress,
      onStartLoading,
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

  // Autoplay
  useEffect(() => {
    if (autoLoad360) {
      fetchSpinImages("auto");
    }
  }, [autoLoad360, fetchSpinImages]);

  return (
    <div className="relative aspect-[4/3] w-full">
      <CdnImage
        className="size-full"
        src={images[0].src}
        onLoad={onPlaceholderImageLoaded}
        onError={() => onPlaceholderImageError?.()}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-4 bg-foreground/35">
        <ThreeSixtyIcon className="size-20" isVisible={theme?.threeSixtyIcon} />

        <Button
          aria-label="Play 360 view"
          className={
            theme?.playButton
              ? "border-0 bg-transparent p-0 shadow-none hover:bg-transparent"
              : undefined
          }
          style={
            theme?.playButton
              ? { width: 140, height: 140, padding: 0 }
              : undefined
          }
          color="neutral"
          shape="icon"
          onClick={onClickPLayButton}
        >
          {theme?.playButton ? (
            <img className="size-full" src={theme.playButton.default} alt="" />
          ) : (
            <Exterior360PlayIcon className="size-full" />
          )}
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
 * The interactive component is pre-mounted (hidden) during loading so that
 * all 180 CdnImage frames are rendered and cached by the browser before
 * the user starts spinning. This eliminates the first-spin mount lag and
 * ensures the browser cache matches the exact srcSet URLs that CdnImage uses.
 *
 * @prop `onlyPreload`: If true, zoom will not affect the 360. It is useful to pre-fetch images.
 * @prop `index`: The index of the item in the carrousel. Used to share state.
 */
const NextGenThreeSixtyElement: React.FC<
  NextGenThreeSixtyElementProps
> = props => {
  const { itemIndex, images } = props;

  const { setItemInteraction } = useControlsContext();

  const [status, setStatus] = useState<null | "placeholder" | "loading" | "spin" | "error">(
    null
  );

  // Track loading progress from the pre-mounted interactive component's CdnImage onLoad events
  const [loadedFrameCount, setLoadedFrameCount] = useState(0);
  const loadingProgress = status === "loading" || status === "spin"
    ? (loadedFrameCount / images.length) * 100
    : null;

  // Ref to store resolved currentSrc URLs from CdnImage srcSet selection
  const resolvedFrameUrls = useRef<string[]>([]);

  const onAllFramesLoaded = useCallback(() => {
    setStatus("spin");
  }, []);

  const onStartLoading = useCallback((_type: "click" | "auto") => {
    setStatus("loading");
  }, []);

  const onFrameLoadedForProgress = useCallback(() => {
    setLoadedFrameCount(c => c + 1);
  }, []);

  const onFrameError = useCallback(() => {
    setStatus("error");
  }, []);

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
  }

  const isSpinning = status === "spin";

  const showInteractive = status === "loading" || isSpinning;

  return (
    <div className="relative">
      {/* Placeholder overlay: visible until spin is ready.
          We keep the slot in the tree (null when spinning) so the Interactive
          component below stays at a stable position and React does not
          unmount/remount it when the placeholder disappears. */}
      {!isSpinning ? (
        <NextGenThreeSixtyElementPlaceholder
          itemIndex={itemIndex}
          images={images}
          loadingProgress={loadingProgress}
          onPlaceholderImageLoaded={() =>
            setStatus(s => (s === null ? "placeholder" : s))
          }
          onPlaceholderImageError={onFrameError}
          onStartLoading={onStartLoading}
        />
      ) : null}
      {/* Interactive component: pre-mounted hidden during loading, revealed when spin starts.
          The CdnImage frames inside serve as the preloader — their onLoad events drive the
          progress bar, and the browser caches the exact srcSet URLs. */}
      {showInteractive && (
        <NextGenThreeSixtyElementInteractive
          {...props}
          hidden={!isSpinning}
          onAllFramesLoaded={onAllFramesLoaded}
          onFrameLoaded={onFrameLoadedForProgress}
          onFrameError={onFrameError}
          resolvedFrameUrls={resolvedFrameUrls}
        />
      )}
    </div>
  );
};

export default NextGenThreeSixtyElement;
