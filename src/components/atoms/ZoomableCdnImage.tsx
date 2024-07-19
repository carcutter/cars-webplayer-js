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

// TODO: Zoom is with wheel which does not allow to scroll
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

      if (!animationDuration) {
        setTransformStyle({ x: targetX, y: targetY, scale: targetScale });
        setZoom(targetScale);
        return;
      }

      const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);

      const startTime = new Date().getTime();

      const animateStep = () => {
        // Animation was interrupted
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

  // -  Handle dragging within zoomed image
  useEffect(() => {
    if (!isZooming) {
      return;
    }

    const container = containerRef.current;

    // DOM not ready yet
    if (!container) {
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
  }, [isZooming, offsetTransformXYStyle]);

  // - Listen to wheel zooming
  useEffect(() => {
    const container = containerRef.current;

    // DOM not ready yet
    if (!container) {
      return;
    }

    const onWheel = (e: WheelEvent) => {
      const { clientX, clientY, deltaX, deltaY } = e;

      // If we are scrolling horizontally, we don't want to not zoom (maybe we want to spin the 360 or scroll the slider)
      if (deltaX !== 0 && Math.abs(deltaX) + 2 > Math.abs(deltaY)) {
        return;
      }

      e.preventDefault();

      const { left: parentOffsetX, top: parentOffsetY } =
        container.getBoundingClientRect();

      // Translate the mouse position to the container position
      const x = clientX - parentOffsetX;
      const y = clientY - parentOffsetY;

      setTransformZoom(zoom - 0.01 * deltaY, {
        x,
        y,
      });
    };

    container.addEventListener("wheel", onWheel);

    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, [setTransformZoom, zoom]);

  return (
    <div
      ref={containerRef}
      className={`relative size-full overflow-hidden ${isZooming ? "z-zoomed-image cursor-move" : ""}`}
    >
      <div
        ref={transformElementRef}
        className="pointer-events-none origin-top-left" // If not, will zoom at the center and crop the top-left part
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
