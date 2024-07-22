import { useCallback, useEffect, useRef } from "react";

import { MAX_ZOOM } from "@/const/zoom";
import { useControlsContext } from "@/providers/ControlsContext";
import { clamp } from "@/utils/math";

import CdnImage, { CdnImageProps } from "./CdnImage";

type Props = Omit<CdnImageProps, "onlyThumbnail" | "imgInPlayerWidthRatio">;

type TransformStyle = {
  x: number;
  y: number;
  scale: number;
};

const ZoomableCdnImage: React.FC<Props> = props => {
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
  const currentAnimationIdRef = useRef<number>(0);

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

      const animationId = ++currentAnimationIdRef.current;

      const targetAlreadyReached =
        startX === targetX && startY === targetY && startScale === targetScale;

      if (!animationDuration || targetAlreadyReached) {
        setTransformStyle({ x: targetX, y: targetY, scale: targetScale });
        setZoom(targetScale);
        return;
      }

      const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);

      const startTime = new Date().getTime();

      const animateStep = () => {
        // Check if a new animation has been requested in the meantime
        if (animationId !== currentAnimationIdRef.current) {
          return;
        }

        // linear interpolation
        const lerp = (start: number, end: number, progress: number) =>
          start + (end - start) * progress;

        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / animationDuration, 1);
        const easedProgress = easeOut(progress);

        const currentX = lerp(startX, targetX, easedProgress);
        const currentY = lerp(startY, targetY, easedProgress);
        const currentScale = lerp(startScale, targetScale, easedProgress);

        setTransformStyle({ x: currentX, y: currentY, scale: currentScale });

        if (timeElapsed < animationDuration) {
          requestAnimationFrame(animateStep);
        } else {
          setZoom(targetScale);
        }
      };

      requestAnimationFrame(animateStep);
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
      // 3/ As the image is translated from the top-left corner, we have to substract the target point to the translation
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

  // -- Listeners -- //

  // - Update zoom when the ControlsContext's value changes
  useEffect(() => {
    // DOM not ready yet
    if (!transformElementRef.current) {
      return;
    }

    setZoomFromCenter(zoom);
  }, [setZoomFromCenter, zoom]);

  // -  Handle mouse dragging within zoomed image
  useEffect(() => {
    if (!isZooming) {
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

      // Take snapshot of the current state
      isMouseDown.current = true;
      mouseStartXY.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    // - Handle when the user releases
    const onMouseEnd = () => {
      isMouseDown.current = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown.current) {
        return;
      }

      if (!mouseStartXY.current) {
        throw new Error("mouseStartXY.current is null");
      }

      e.stopPropagation(); // Prevents parents' action (slider from draggin, rotating 360, ...)

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

    transformElement.addEventListener("mousedown", onMouseDown);
    transformElement.addEventListener("mouseleave", onMouseEnd);
    transformElement.addEventListener("mouseup", onMouseEnd);
    transformElement.addEventListener("mousemove", onMouseMove);

    return () => {
      transformElement.removeEventListener("mousedown", onMouseDown);
      transformElement.removeEventListener("mouseleave", onMouseEnd);
      transformElement.removeEventListener("mouseup", onMouseEnd);
      transformElement.removeEventListener("mousemove", onMouseMove);
    };
  }, [isZooming, offsetTransformXYStyle]);

  // - Listen to trackpad & wheel from zooming/scrolling
  useEffect(() => {
    const container = containerRef.current;

    // DOM not ready yet
    if (!container) {
      return;
    }

    const onWheel = (e: WheelEvent) => {
      const { ctrlKey: zoomEvent, clientX, clientY, deltaX, deltaY } = e;

      // If we are not zooming, we do only want to take care of zoom events
      if (!isZooming && !zoomEvent) {
        return;
      }

      // Avoid to zoom the page
      e.preventDefault();

      if (zoomEvent) {
        const { left: parentOffsetX, top: parentOffsetY } =
          container.getBoundingClientRect();
        // Translate the mouse position to the container position
        const x = clientX - parentOffsetX;
        const y = clientY - parentOffsetY;

        setTransformZoom(zoom - 0.01 * deltaY, {
          x,
          y,
        });
      } else {
        offsetTransformXYStyle({
          x: -2 * deltaX,
          y: -2 * deltaY,
        });
      }
    };

    container.addEventListener("wheel", onWheel);

    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, [isZooming, offsetTransformXYStyle, setTransformZoom, zoom]);

  // - Listen to touch for zoom & pan
  useEffect(() => {
    const transformElement = transformElementRef.current;

    if (!transformElement) {
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
        // If we are not zooming, we do only want to take care of zoom events
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

        const computeDistance = (touchA: Touch, touchB: Touch) => {
          return Math.sqrt(
            (touchA.clientX - touchB.clientX) ** 2 +
              (touchA.clientY - touchB.clientY) ** 2
          );
        };

        const [touch1, touch2] = e.touches;

        const intialTouch1 = touchStartXYmapRef.get(touch1.identifier);
        const intialTouch2 = touchStartXYmapRef.get(touch2.identifier);
        if (!intialTouch1 || !intialTouch2) {
          throw new Error("intialTouch1 or intialTouch2 is null");
        }

        const initialDistance = computeDistance(intialTouch1, intialTouch2);
        const currentDistance = computeDistance(touch1, touch2);

        const distanceFactor = currentDistance / initialDistance;

        setTransformZoom(distanceFactor * zoom, {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
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
  }, [isZooming, offsetTransformXYStyle, setTransformZoom, zoom]);

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
          className="size-full"
          {...props}
          imgInPlayerWidthRatio={zoom}
        />
      </div>
    </div>
  );
};

export default ZoomableCdnImage;
