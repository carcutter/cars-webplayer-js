import { useCallback, useEffect, useRef } from "react";

import { MAX_ZOOM } from "../../const/zoom";
import { useControlsContext } from "../../providers/ControlsContext";
import { easeOut } from "../../utils/animation";
import { clamp, lerp } from "../../utils/math";
import { computeTouchesDistance } from "../../utils/touch";

import CdnImage, { CdnImageProps } from "./CdnImage";

export type ZoomableCdnImageProps = Omit<
  CdnImageProps,
  "onlyThumbnail" | "imgInPlayerWidthRatio"
> & {
  onlyPreload?: boolean;
};

type TransformStyle = {
  x: number;
  y: number;
  scale: number;
};

/**
 * ZoomableCdnImage component renders an CdnImage with zoom & pan capabilities.
 *
 * It adjusts the CdnImage's size according to the zoom level.
 *
 * @prop `onlyPreload`: If true, zoom will not affect the image. It is useful to pre-fetch images.
 */
const ZoomableCdnImage: React.FC<ZoomableCdnImageProps> = ({
  onlyPreload,
  ...props
}) => {
  const { zoom, isZooming, setZoom } = useControlsContext();

  // -- Refs -- //
  // - element refs
  const containerRef = useRef<HTMLDivElement>(null);
  const transformElementRef = useRef<HTMLDivElement>(null);
  const getTransformElementOrThrow = useCallback((origin?: string) => {
    if (!transformElementRef.current) {
      throw new Error(
        `[${origin ?? "getTransformElementOrThrow"}] transformElementRef.current is null`
      );
    }

    return transformElementRef.current;
  }, []);

  // - value refs
  const isMouseDown = useRef(false);
  const mouseStartXY = useRef<{ x: number; y: number } | null>(null);

  const touchStartXYmap = useRef(new Map<Touch["identifier"], Touch>());

  const transformStyleRef = useRef<TransformStyle>({ x: 0, y: 0, scale: 1 });
  const currentAnimationFrame = useRef<number | null>(null);

  // -- Transform methods -- //

  const setTransformStyle = useCallback(
    (target: Partial<TransformStyle>) => {
      const transformElement = getTransformElementOrThrow("setTransformStyle");

      const {
        x: targetX,
        y: targetY,
        scale: targetScale,
      } = {
        ...transformStyleRef.current,
        ...target,
      };

      // Limit zoom
      const scale = clamp(targetScale, 1, MAX_ZOOM);

      const containerW = transformElement.clientWidth;
      const containerH = transformElement.clientHeight;

      const scaledW = containerW * scale;
      const scaledH = containerH * scale;

      // Ensure the image is not outside the container
      const x = clamp(targetX, -(scaledW - containerW), 0);
      const y = clamp(targetY, -(scaledH - containerH), 0);

      transformStyleRef.current = { x, y, scale };
      transformElement.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    },
    [getTransformElementOrThrow]
  );

  const animateTransformStyle = useCallback(
    (target: Partial<TransformStyle>, animationDuration?: number) => {
      const {
        x: startX,
        y: startY,
        scale: startScale,
      } = transformStyleRef.current;

      const {
        x: targetX,
        y: targetY,
        scale: targetScale,
      } = {
        ...transformStyleRef.current,
        ...target,
      };

      // If an animation is already running, we cancel it
      if (currentAnimationFrame.current) {
        cancelAnimationFrame(currentAnimationFrame.current);
        currentAnimationFrame.current = null;
      }

      const setTargetState = () => {
        setTransformStyle({ x: targetX, y: targetY, scale: targetScale });
        // Update zoom value on ControlsContext (we do not update at each step to avoid multiple re-renders)
        setZoom(targetScale);
      };

      // NOTE: Add some tolerance to avoid decimal issues
      const targetAlreadyReached =
        Math.abs(targetX - startX) < 1 &&
        Math.abs(targetY - startY) < 1 &&
        Math.abs(targetScale - startScale) < 0.005;

      // If no duration is specified or if the target is already reached, we apply the transform instantly
      if (!animationDuration || targetAlreadyReached) {
        setTargetState();
        return;
      }

      // - Animation

      const startTime = new Date().getTime();

      const animate = () => {
        const animateStep = () => {
          const currentTime = new Date().getTime();
          const timeElapsed = currentTime - startTime;

          if (timeElapsed >= animationDuration) {
            setTargetState();
            currentAnimationFrame.current = null;
            return;
          }

          const progress = Math.min(timeElapsed / animationDuration, 1);
          const easedProgress = easeOut(progress);

          const currentX = lerp(startX, targetX, easedProgress);
          const currentY = lerp(startY, targetY, easedProgress);
          const currentScale = lerp(startScale, targetScale, easedProgress);

          setTransformStyle({ x: currentX, y: currentY, scale: currentScale });

          // Next animation step
          animate();
        };

        currentAnimationFrame.current = requestAnimationFrame(animateStep);
      };

      animate();
    },
    [setTransformStyle, setZoom]
  );

  const offsetTransformXYStyle = useCallback(
    (
      offset: Partial<Omit<TransformStyle, "scale">>,
      animationDuration?: number
    ) => {
      let { x, y } = transformStyleRef.current;

      if (offset.x) {
        x += offset.x;
      }
      if (offset.y) {
        y += offset.y;
      }

      animateTransformStyle(
        {
          x,
          y,
        },
        animationDuration
      );
    },
    [animateTransformStyle]
  );

  const setTransformZoom = useCallback(
    (
      targetZoom: number,
      targetContainerPos: { x: number; y: number },
      animationDuration?: number
    ) => {
      // -- When zoom just changed, we want to keep the target point at the same visual position

      const currentTransformZoom = transformStyleRef.current.scale;
      const newZoomValue = clamp(targetZoom, 1, MAX_ZOOM);
      const zoomRatio = newZoomValue / currentTransformZoom;

      const { x: currentTransformX, y: currentTransformY } =
        transformStyleRef.current;

      const { x: targetContainerX, y: targetContainerY } = targetContainerPos;

      // # This equation is quite simple but hard to pull out of the hat
      // 1/ The target point is the position of the mouse in the container PLUS the current translation
      // 2/ Whatever the zoom, the target point will always be in the same relative position in the image. That's why we multiply the target point by the zoomRatio value
      // 3/ As the image is translated from the top-left corner, we have to subtract the target point to the translation
      // 4/ As the origin of the image is the top-left corner, we need to translate the image to the left & top : we need to reverse the sign of the translation

      // 1/
      const currentTargetX = -currentTransformX + targetContainerX;
      const currentTargetY = -currentTransformY + targetContainerY;

      // 2/
      const newTargetX = currentTargetX * zoomRatio;
      const newTargetY = currentTargetY * zoomRatio;

      // 3/
      const newLeftX = newTargetX - targetContainerX;
      const newTopY = newTargetY - targetContainerY;

      // 4/
      const newTransformX = -newLeftX;
      const newTransformY = -newTopY;

      animateTransformStyle(
        {
          x: newTransformX,
          y: newTransformY,
          scale: newZoomValue,
        },
        animationDuration
      );
    },
    [animateTransformStyle]
  );

  const setZoomFromCenter = useCallback(
    (targetZoom: number) => {
      const transformElement = getTransformElementOrThrow(
        "shiftZoomFromButton"
      );

      const containerW = transformElement.clientWidth;
      const containerH = transformElement.clientHeight;

      setTransformZoom(
        targetZoom,
        {
          x: containerW / 2,
          y: containerH / 2,
        },
        200
      );
    },
    [getTransformElementOrThrow, setTransformZoom]
  );

  const offsetTransformZoom = useCallback(
    (
      offset: number,
      targetContainerPos: { x: number; y: number },
      animationDuration?: number
    ) => {
      const { scale: currentScale } = transformStyleRef.current;

      setTransformZoom(
        currentScale + offset,
        targetContainerPos,
        animationDuration
      );
    },
    [setTransformZoom]
  );

  // -- Listeners -- //

  // - Update zoom when the ControlsContext's value changes (zoom buttons, reset with Escape, ...)
  useEffect(() => {
    if (onlyPreload) {
      return;
    }

    // DOM not ready yet
    if (!transformElementRef.current) {
      return;
    }

    setZoomFromCenter(zoom);
  }, [onlyPreload, setZoomFromCenter, zoom]);

  // -  Handle mouse dragging within zoomed image
  useEffect(() => {
    if (onlyPreload || !isZooming) {
      return;
    }

    const transformElement = transformElementRef.current;

    // DOM not ready yet
    if (!transformElement) {
      return;
    }

    // - Handle when the user just clicked
    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault(); // Prevents native image dragging
      e.stopPropagation(); // Prevents carrousel to slide

      // Take snapshot of the current state
      isMouseDown.current = true;
      mouseStartXY.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown.current) {
        return;
      }

      if (!mouseStartXY.current) {
        throw new Error("mouseStartXY.current is null");
      }

      e.stopPropagation(); // Prevents parents' action (slider from dragging, rotating 360, ...)

      const walkX = e.clientX - mouseStartXY.current.x;
      const walkY = e.clientY - mouseStartXY.current.y;
      offsetTransformXYStyle({
        x: walkX,
        y: walkY,
      });

      mouseStartXY.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    // - Handle when the user releases or leaves the area
    const onStopDragging = () => {
      isMouseDown.current = false;
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
  }, [isZooming, offsetTransformXYStyle, onlyPreload]);

  // - Listen to track pad & wheel from zooming/scrolling
  useEffect(() => {
    if (onlyPreload) {
      return;
    }

    const container = containerRef.current;

    // DOM not ready yet
    if (!container) {
      return;
    }

    const onWheel = (e: WheelEvent) => {
      const { ctrlKey: zoomEvent, clientX, clientY, deltaX, deltaY } = e;

      // Handle zoom
      if (zoomEvent) {
        // If we are not zooming and the user wants to zoom out, do nothing
        if (!isZooming && deltaY >= 0) {
          return;
        }

        const { left: parentOffsetX, top: parentOffsetY } =
          container.getBoundingClientRect();
        // Translate the mouse position to the container position
        const x = clientX - parentOffsetX;
        const y = clientY - parentOffsetY;

        offsetTransformZoom(-0.01 * deltaY, {
          x,
          y,
        });
      }
      // Handle pan
      else {
        // We do not want to pan if we are not zooming
        if (!isZooming) {
          return;
        }

        offsetTransformXYStyle({
          x: -2 * deltaX,
          y: -2 * deltaY,
        });
      }

      e.preventDefault(); // Prevents native page zooming
    };

    container.addEventListener("wheel", onWheel);

    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, [isZooming, offsetTransformXYStyle, offsetTransformZoom, onlyPreload]);

  // - Listen to touch for zoom (pinch with 2 finger) & pan (1 finger)
  useEffect(() => {
    const container = containerRef.current;
    const transformElement = transformElementRef.current;

    // DOM not ready yet
    if (!container || !transformElement) {
      return;
    }

    const touchStartXYmapRef = touchStartXYmap.current;

    const onTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        touchStartXYmapRef.set(touch.identifier, touch);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        touchStartXYmapRef.delete(touch.identifier);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const nbrTouches = e.touches.length;

      // 1 finger => pan
      if (nbrTouches === 1) {
        // If we are not zooming, we do not need to pan
        if (!isZooming) {
          return;
        }

        e.preventDefault(); // Prevents native scrolling (which would slide the carrousel)

        const touch = e.touches[0];
        const touchStart = touchStartXYmapRef.get(touch.identifier);

        if (!touchStart) {
          throw new Error("touchStart is null");
        }

        const walkX = touch.clientX - touchStart.clientX;
        const walkY = touch.clientY - touchStart.clientY;
        offsetTransformXYStyle({
          x: walkX,
          y: walkY,
        });
        touchStartXYmapRef.set(touch.identifier, touch);
      }
      // 2 fingers => zoom
      else if (nbrTouches === 2) {
        e.preventDefault(); // Prevents native page zooming

        const [touch1, touch2] = e.touches;

        const initialTouch1 = touchStartXYmapRef.get(touch1.identifier);
        const initialTouch2 = touchStartXYmapRef.get(touch2.identifier);

        if (!initialTouch1 || !initialTouch2) {
          throw new Error("initialTouch1 or initialTouch2 is null");
        }

        const initialDistance = computeTouchesDistance(
          initialTouch1,
          initialTouch2
        );
        const currentDistance = computeTouchesDistance(touch1, touch2);

        const distanceFactor = currentDistance / initialDistance;

        const { left: parentOffsetX, top: parentOffsetY } =
          container.getBoundingClientRect();

        offsetTransformZoom(distanceFactor - 1, {
          x: (touch1.clientX + touch2.clientX) / 2 - parentOffsetX,
          y: (touch1.clientY + touch2.clientY) / 2 - parentOffsetY,
        });

        touchStartXYmapRef.set(touch1.identifier, touch1);
        touchStartXYmapRef.set(touch2.identifier, touch2);
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
  }, [isZooming, offsetTransformXYStyle, offsetTransformZoom]);

  return (
    <div
      ref={containerRef}
      className={`relative size-full overflow-hidden ${isZooming ? "z-zoomed-image cursor-move" : ""}`}
    >
      <div
        ref={transformElementRef}
        className="origin-top-left" // If not, will zoom at the center and crop the top-left part
      >
        <CdnImage
          {...props}
          // We use the zoom to update CDN image's size. Zoom should not affect if the component is present for onlyPreload purpose
          // NOTE: Not working if multiple images are displayed
          imgInPlayerWidthRatio={!onlyPreload ? zoom : 1}
        />
      </div>
    </div>
  );
};

export default ZoomableCdnImage;
