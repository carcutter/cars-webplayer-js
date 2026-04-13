import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DEFAULT_SPIN_CURSOR, type ImageWithHotspots } from "@car-cutter/core";

import spinCursorDefault from "../../../assets/cursors/spin-360-default.svg";
import { MAX_ZOOM } from "../../../const/zoom";
import { useControlsContext } from "../../../providers/ControlsContext";
import { useGlobalContext } from "../../../providers/GlobalContext";
import { getThemeConfig } from "../../../theme-config";
import { CustomizableItem } from "../../../types/customizable_item";
import { easeOut } from "../../../utils/animation";
import { clamp, lerp } from "../../../utils/math";
import { cn } from "../../../utils/style";
import { computeTouchesDistance } from "../../../utils/touch";
import CdnImage from "../../atoms/CdnImage";
import Exterior360PlayIcon from "../../icons/Exterior360PlayIcon";
import ThreeSixtyIcon from "../../icons/ThreeSixtyIcon";
import Hotspot from "../../molecules/Hotspot";
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

type SpinCursorState = "default" | "left" | "right";

const getCursorStyle = (
  cursorUrl: string,
  hotspot: { x: number; y: number },
  fallback: string
): React.CSSProperties => {
  return { cursor: `url("${cursorUrl}") ${hotspot.x} ${hotspot.y}, ${fallback}` };
};

type ZoomTransformStyle = {
  x: number;
  y: number;
  scale: number;
};

const NextGenThreeSixtyElementInteractive: React.FC<
  NextGenThreeSixtyElementProps
> = ({ images, itemIndex, onlyPreload }) => {
  const { demoSpin, reverse360, spinCursor, themeConfig } = useGlobalContext();
  const { currentItemHotspotsVisible, isShowingDetails, isZooming, zoom, setZoom } =
    useControlsContext();
  const theme = useMemo(() => getThemeConfig(themeConfig), [themeConfig]);

  const disableSpin = isZooming || isShowingDetails; // We do not want to do anything while zooming or showing a detail image

  // - element refs
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [isGrabbing, setIsGrabbing] = useState(false);
  const [spinCursorState, setSpinCursorState] =
    useState<SpinCursorState>("default");
  const activeCursor =
    spinCursor === "grab" && isGrabbing ? "grabbing" : spinCursor;
  const cursorStyle = theme?.cursor
    ? (() => {
        const cursorKey =
          spinCursorState === "left"
            ? "leftSpin"
            : spinCursorState === "right"
              ? "rightSpin"
              : "default";
        const entry = theme.cursor[cursorKey];
        return getCursorStyle(entry.url, entry.hotspot, activeCursor);
      })()
    : activeCursor === DEFAULT_SPIN_CURSOR
      ? { cursor: `url("${spinCursorDefault}") 45 28, ew-resize` }
      : { cursor: activeCursor };

  // - Refs for direct DOM manipulation (avoids React re-renders on iOS)
  const imageIndexRef = useRef(0);
  const mainImageRef = useRef<HTMLImageElement | null>(null);
  const [hotspotFrameIndex, setHotspotFrameIndex] = useState(0);

  // -- Zoom & Pan state -- //
  const zoomContainerRef = useRef<HTMLDivElement>(null);
  const zoomTransformRef = useRef<HTMLDivElement>(null);
  const zoomIsMouseDown = useRef(false);
  const zoomMouseStartXY = useRef<{ x: number; y: number } | null>(null);
  const zoomTouchStartXYmap = useRef(new Map<Touch["identifier"], Touch>());
  const zoomTransformStyleRef = useRef<ZoomTransformStyle>({ x: 0, y: 0, scale: 1 });
  const zoomAnimationFrame = useRef<number | null>(null);

  const setZoomTransformStyle = useCallback(
    (target: Partial<ZoomTransformStyle>) => {
      const transformElement = zoomTransformRef.current;
      if (!transformElement) return;

      const {
        x: targetX,
        y: targetY,
        scale: targetScale,
      } = { ...zoomTransformStyleRef.current, ...target };

      const scale = clamp(targetScale, 1, MAX_ZOOM);
      const containerW = transformElement.clientWidth;
      const containerH = transformElement.clientHeight;
      const scaledW = containerW * scale;
      const scaledH = containerH * scale;
      const x = clamp(targetX, -(scaledW - containerW), 0);
      const y = clamp(targetY, -(scaledH - containerH), 0);

      zoomTransformStyleRef.current = { x, y, scale };
      transformElement.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    },
    []
  );

  const animateZoomTransformStyle = useCallback(
    (target: Partial<ZoomTransformStyle>, animationDuration?: number) => {
      const { x: startX, y: startY, scale: startScale } = zoomTransformStyleRef.current;
      const { x: targetX, y: targetY, scale: targetScale } = {
        ...zoomTransformStyleRef.current,
        ...target,
      };

      if (zoomAnimationFrame.current) {
        cancelAnimationFrame(zoomAnimationFrame.current);
        zoomAnimationFrame.current = null;
      }

      const setTargetState = () => {
        setZoomTransformStyle({ x: targetX, y: targetY, scale: targetScale });
        setZoom(targetScale);
      };

      const targetAlreadyReached =
        Math.abs(targetX - startX) < 1 &&
        Math.abs(targetY - startY) < 1 &&
        Math.abs(targetScale - startScale) < 0.005;

      if (!animationDuration || targetAlreadyReached) {
        setTargetState();
        return;
      }

      const startTime = new Date().getTime();

      const animate = () => {
        const animateStep = () => {
          const currentTime = new Date().getTime();
          const timeElapsed = currentTime - startTime;

          if (timeElapsed >= animationDuration) {
            setTargetState();
            zoomAnimationFrame.current = null;
            return;
          }

          const progress = Math.min(timeElapsed / animationDuration, 1);
          const easedProgress = easeOut(progress);
          setZoomTransformStyle({
            x: lerp(startX, targetX, easedProgress),
            y: lerp(startY, targetY, easedProgress),
            scale: lerp(startScale, targetScale, easedProgress),
          });
          animate();
        };
        zoomAnimationFrame.current = requestAnimationFrame(animateStep);
      };

      animate();
    },
    [setZoomTransformStyle, setZoom]
  );

  const offsetZoomXY = useCallback(
    (offset: Partial<Omit<ZoomTransformStyle, "scale">>, animationDuration?: number) => {
      let { x, y } = zoomTransformStyleRef.current;
      if (offset.x) x += offset.x;
      if (offset.y) y += offset.y;
      animateZoomTransformStyle({ x, y }, animationDuration);
    },
    [animateZoomTransformStyle]
  );

  const setZoomTransformZoom = useCallback(
    (targetZoom: number, targetContainerPos: { x: number; y: number }, animationDuration?: number) => {
      const currentScale = zoomTransformStyleRef.current.scale;
      const newZoomValue = clamp(targetZoom, 1, MAX_ZOOM);
      const zoomRatio = newZoomValue / currentScale;
      const { x: currentX, y: currentY } = zoomTransformStyleRef.current;

      const currentTargetX = -currentX + targetContainerPos.x;
      const currentTargetY = -currentY + targetContainerPos.y;
      const newTargetX = currentTargetX * zoomRatio;
      const newTargetY = currentTargetY * zoomRatio;

      animateZoomTransformStyle(
        {
          x: -(newTargetX - targetContainerPos.x),
          y: -(newTargetY - targetContainerPos.y),
          scale: newZoomValue,
        },
        animationDuration
      );
    },
    [animateZoomTransformStyle]
  );

  const setZoomFromCenter = useCallback(
    (targetZoom: number) => {
      const transformElement = zoomTransformRef.current;
      if (!transformElement) return;
      setZoomTransformZoom(
        targetZoom,
        { x: transformElement.clientWidth / 2, y: transformElement.clientHeight / 2 },
        200
      );
    },
    [setZoomTransformZoom]
  );

  const offsetZoomLevel = useCallback(
    (offset: number, targetContainerPos: { x: number; y: number }, animationDuration?: number) => {
      setZoomTransformZoom(
        zoomTransformStyleRef.current.scale + offset,
        targetContainerPos,
        animationDuration
      );
    },
    [setZoomTransformZoom]
  );

  // - Respond to zoom state changes (zoom buttons, Escape reset, etc.)
  useEffect(() => {
    if (onlyPreload || !zoomTransformRef.current) return;
    setZoomFromCenter(zoom);
  }, [onlyPreload, setZoomFromCenter, zoom]);

  // - Mouse drag panning while zoomed
  useEffect(() => {
    if (onlyPreload || !isZooming) return;
    const transformElement = zoomTransformRef.current;
    if (!transformElement) return;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      zoomIsMouseDown.current = true;
      zoomMouseStartXY.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!zoomIsMouseDown.current || !zoomMouseStartXY.current) return;
      e.stopPropagation();
      offsetZoomXY({
        x: e.clientX - zoomMouseStartXY.current.x,
        y: e.clientY - zoomMouseStartXY.current.y,
      });
      zoomMouseStartXY.current = { x: e.clientX, y: e.clientY };
    };

    const onStopDragging = () => {
      zoomIsMouseDown.current = false;
    };

    transformElement.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onStopDragging);
    document.addEventListener("mouseup", onStopDragging);
    document.addEventListener("contextmenu", onStopDragging);

    return () => {
      transformElement.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onStopDragging);
      document.removeEventListener("mouseup", onStopDragging);
      document.removeEventListener("contextmenu", onStopDragging);
    };
  }, [isZooming, offsetZoomXY, onlyPreload]);

  // - Wheel zoom & pan
  useEffect(() => {
    if (onlyPreload) return;
    const container = zoomContainerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      const { ctrlKey: zoomEvent, clientX, clientY, deltaX, deltaY } = e;

      if (zoomEvent) {
        if (!isZooming && deltaY >= 0) return;
        const { left, top } = container.getBoundingClientRect();
        offsetZoomLevel(-0.01 * deltaY, { x: clientX - left, y: clientY - top });
      } else {
        if (!isZooming) return;
        offsetZoomXY({ x: -2 * deltaX, y: -2 * deltaY });
      }
      e.preventDefault();
    };

    container.addEventListener("wheel", onWheel);
    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, [isZooming, offsetZoomXY, offsetZoomLevel, onlyPreload]);

  // - Touch zoom (pinch) & pan while zoomed
  useEffect(() => {
    const container = zoomContainerRef.current;
    const transformElement = zoomTransformRef.current;
    if (!container || !transformElement) return;

    const touchMap = zoomTouchStartXYmap.current;

    const onTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        touchMap.set(touch.identifier, touch);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        touchMap.delete(e.changedTouches[i].identifier);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const nbrTouches = e.touches.length;

      if (nbrTouches === 1) {
        if (!isZooming) return;
        e.preventDefault();
        const touch = e.touches[0];
        const touchStart = touchMap.get(touch.identifier);
        if (!touchStart) return;
        offsetZoomXY({
          x: touch.clientX - touchStart.clientX,
          y: touch.clientY - touchStart.clientY,
        });
        touchMap.set(touch.identifier, touch);
      } else if (nbrTouches === 2) {
        e.preventDefault();
        const [touch1, touch2] = e.touches;
        const initial1 = touchMap.get(touch1.identifier);
        const initial2 = touchMap.get(touch2.identifier);
        if (!initial1 || !initial2) return;
        const initialDistance = computeTouchesDistance(initial1, initial2);
        const currentDistance = computeTouchesDistance(touch1, touch2);
        const { left, top } = container.getBoundingClientRect();
        offsetZoomLevel(currentDistance / initialDistance - 1, {
          x: (touch1.clientX + touch2.clientX) / 2 - left,
          y: (touch1.clientY + touch2.clientY) / 2 - top,
        });
        touchMap.set(touch1.identifier, touch1);
        touchMap.set(touch2.identifier, touch2);
      }
    };

    transformElement.addEventListener("touchstart", onTouchStart);
    transformElement.addEventListener("touchmove", onTouchMove);
    transformElement.addEventListener("touchend", onTouchEnd);
    transformElement.addEventListener("touchcancel", onTouchEnd);

    return () => {
      transformElement.removeEventListener("touchstart", onTouchStart);
      transformElement.removeEventListener("touchmove", onTouchMove);
      transformElement.removeEventListener("touchend", onTouchEnd);
      transformElement.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [isZooming, offsetZoomXY, offsetZoomLevel]);

  // - Throttling refs for iOS performance (avoid processing every touch event)
  const pendingUpdateRef = useRef<number | null>(null);
  const lastTouchXRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const lastProcessTimeRef = useRef(0);
  const MIN_PROCESS_INTERVAL = 16; // ~60fps max, helps older iOS devices

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

  const length = images.length;

  // - Direct DOM manipulation: change src of single image element (most memory efficient for iOS)
  const updateVisibleImage = useCallback(
    (newIndex: number) => {
      const prevIndex = imageIndexRef.current;
      if (prevIndex === newIndex) return;

      // Change src directly - images are preloaded so this should be instant from cache
      const img = mainImageRef.current;
      if (img) {
        img.src = images[newIndex].src;
      }

      imageIndexRef.current = newIndex;

      const prevHasHotspots = !!images[prevIndex]?.hotspots?.length;
      const nextHasHotspots = !!images[newIndex]?.hotspots?.length;

      if (prevHasHotspots || nextHasHotspots) {
        setHotspotFrameIndex(newIndex);
      }
    },
    [images]
  );

  const displayNextImageDirect = useCallback(() => {
    const newIndex = (imageIndexRef.current + 1) % length;
    updateVisibleImage(newIndex);
  }, [length, updateVisibleImage]);

  const displayPreviousImageDirect = useCallback(() => {
    const newIndex = (imageIndexRef.current - 1 + length) % length;
    updateVisibleImage(newIndex);
  }, [length, updateVisibleImage]);

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

            updateVisibleImage(imageIndex);

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
      let lastImageSwitchTime = startTime;

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

          // Time-based throttle for image switches during inertia (helps older iOS devices)
          const timeSinceLastSwitch = now - lastImageSwitchTime;
          if (
            Math.abs(walkX) >= dragStepPx &&
            timeSinceLastSwitch >= MIN_PROCESS_INTERVAL
          ) {
            if (walkX > 0 !== reverse360) {
              displayNextImageDirect();
            } else {
              displayPreviousImageDirect();
            }

            walkX = 0;
            lastImageSwitchTime = now;
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

    setIsGrabbing(false);

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
      setIsGrabbing(true);
      setSpinCursorState("default");

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
      if (walkX !== 0 && theme?.cursor) {
        setSpinCursorState(walkX < 0 ? "left" : "right");
      }

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
      setIsGrabbing(false);
      setSpinCursorState("default");

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

    // Throttled touch processing (processes at most once per animation frame AND respects min interval)
    const processTouchUpdate = () => {
      pendingUpdateRef.current = null;

      // Time-based throttle for older iOS devices (iPhone 12, etc.)
      const now = performance.now();
      if (now - lastProcessTimeRef.current < MIN_PROCESS_INTERVAL) {
        // Schedule another check on next frame if we skipped this one
        pendingUpdateRef.current = requestAnimationFrame(processTouchUpdate);
        return;
      }
      lastProcessTimeRef.current = now;

      const x = lastTouchXRef.current;
      const startX = touchStartXRef.current;

      if (x === null || startX === null) return;

      const walkX = x - startX;
      if (walkX !== 0 && theme?.cursor) {
        setSpinCursorState(walkX < 0 ? "left" : "right");
      }

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
      setIsGrabbing(true);
      setSpinCursorState("default");
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
      setIsGrabbing(false);
      setSpinCursorState("default");

      startInertiaAnimation();
    };

    // Use { passive: false } to allow preventDefault() on iOS Safari
    scroller.addEventListener("touchstart", onTouchStart, { passive: false });
    scroller.addEventListener("touchmove", onTouchMove, { passive: false });
    scroller.addEventListener("touchend", onTouchEnd);
    scroller.addEventListener("touchcancel", onTouchEnd);

    return () => {
      cancelSpinAnimation();
      setIsGrabbing(false);
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
    disableSpin,
    reverse360,
    theme,
    length,
    updateVisibleImage,
  ]);

  return (
    <div ref={containerRef} style={cursorStyle}>
      {/* Scroller is element larger than the image to capture scroll event and then, make the 360 spin */}
      {/* NOTE: ImageElement is within so that it can capture events first */}
      <div ref={scrollerRef} className=" overflow-x-scroll">
        <div className="sticky left-0 top-0">
          <div
            ref={zoomContainerRef}
            className={`relative size-full overflow-hidden ${isZooming ? "z-zoomed-image cursor-move" : ""}`}
          >
            <div ref={zoomTransformRef} className="origin-top-left">
              {/* Single image element - src changed via direct DOM manipulation */}
              {/* Images are preloaded by placeholder, so src changes are instant from cache */}
              <img
                ref={mainImageRef}
                src={images[0].src}
                className="pointer-events-none size-full object-cover"
                alt=""
              />
              {currentItemHotspotsVisible &&
                images[hotspotFrameIndex]?.hotspots?.map((hotspot, index) => (
                  <Hotspot
                    key={`${hotspotFrameIndex}-${index}`}
                    hotspot={hotspot}
                    item={{
                      item_type: "next360",
                      item_position: itemIndex,
                    }}
                  />
                ))}
            </div>
          </div>
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
  const { autoLoad360, emitAnalyticsEvent, themeConfig } = useGlobalContext();
  const { displayedCategoryId, displayedCategoryName } = useControlsContext();
  const theme = useMemo(() => getThemeConfig(themeConfig), [themeConfig]);

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
              ? { width: 74, height: 74, padding: 0 }
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
 * @prop `onlyPreload`: If true, zoom will not affect the 360. It is useful to pre-fetch images.
 * @prop `index`: The index of the item in the carrousel. Used to share state.
 */
const NextGenThreeSixtyElement: React.FC<
  NextGenThreeSixtyElementProps
> = props => {
  const { itemIndex } = props;

  const { setItemInteraction } = useControlsContext();

  const [status, setStatus] = useState<null | "placeholder" | "spin" | "error">(
    null
  );

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
