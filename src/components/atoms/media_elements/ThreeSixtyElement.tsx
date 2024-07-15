import { useCallback, useEffect, useRef, useState } from "react";

import CustomizableButton from "@/components/molecules/CustomizableButton";
import { useGlobalContext } from "@/providers/GlobalContext";
import type { Item } from "@/types/composition";
import { clamp } from "@/utils/math";
import { positionToClassName } from "@/utils/style";

import ImageElement from "./ImageElement";

const DRAG_STEP_PX = 10;
const SCROLL_STEP_PX = 15;

const ZOOM_STEP = 0.6;
const MAX_ZOOM = 1 + ZOOM_STEP * 3;

type ThreeSixtyElementProps = Omit<Extract<Item, { type: "360" }>, "type">;

type TransformStyle = {
  x: number;
  y: number;
  scale: number;
};

const ThreeSixtyElementInteractive: React.FC<ThreeSixtyElementProps> = ({
  images,
  hotspots,
}) => {
  const { reverse360, zoomPosition } = useGlobalContext();

  // -- Flip Book -- //
  // - element refs
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // - value refs
  const isMouseDown = useRef(false);
  const mouseStartXY = useRef<{ x: number; y: number } | null>(null);

  // - Flip book image index & details
  const [imageIndex, setImageIndex] = useState(0);
  const length = images.length;

  const displayPreviousImage = useCallback(() => {
    setImageIndex(currentIndex => (currentIndex - 1 + length) % length);
  }, [length]);
  const displayNextImage = useCallback(() => {
    setImageIndex(currentIndex => (currentIndex + 1) % length);
  }, [length]);

  const [showingDetailImage, setShowingDetailImage] = useState(false);

  // -- Transform Element (zoom/pan) -- //
  const transformElementRef = useRef<HTMLDivElement>(null);
  const getTransformElementOrThrow = useCallback((origin?: string) => {
    if (!transformElementRef.current) {
      throw new Error(
        `[${origin ?? "getTransformElementOrThrow"}] transformElementRef.current is null`
      );
    }

    return transformElementRef.current;
  }, []);
  const transformStyleRef = useRef<TransformStyle>({ x: 0, y: 0, scale: 1 });

  const [zoom, setZoom] = useState<number | null>(null);
  const currentZoomValue = zoom ?? 1;

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

      if (!animationDuration) {
        setTransformStyle({ x: targetX, y: targetY, scale: targetScale });
        return;
      }

      const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);

      const startTime = new Date().getTime();

      const animateStep = () => {
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
        }
      };

      requestAnimationFrame(animateStep);
    },
    [setTransformStyle]
  );

  const offsetTransformStyle = useCallback(
    (offset: Partial<TransformStyle>, animationDuration?: number) => {
      let { x, y, scale } = transformStyleRef.current;

      if (offset.x) {
        x += offset.x;
      }
      if (offset.y) {
        y += offset.y;
      }
      if (offset.scale) {
        scale += offset.scale;
      }

      animateTransformStyle(
        {
          x,
          y,
          scale,
        },
        animationDuration
      );
    },
    [animateTransformStyle]
  );

  const shiftZoom = useCallback(
    (
      shift: number,
      targetContainerPos: { x: number; y: number },
      animationDuration?: number
    ) => {
      const newZoomValue = clamp(currentZoomValue + shift, 1, MAX_ZOOM);

      setZoom(newZoomValue !== 1 ? newZoomValue : null);

      // -- Animation -- //
      // When zoom just changed, we want to keep the target point at the same visual position

      const zoomRatio = newZoomValue / currentZoomValue;

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
    [animateTransformStyle, currentZoomValue]
  );

  const shiftZoomFromCenter = useCallback(
    (shift: number) => {
      const transformElement = getTransformElementOrThrow(
        "shiftZoomFromButton"
      );

      const containerW = transformElement.clientWidth;
      const containerH = transformElement.clientHeight;

      shiftZoom(
        shift,
        {
          x: containerW / 2,
          y: containerH / 2,
        },
        200
      );
    },
    [getTransformElementOrThrow, shiftZoom]
  );

  const increaseZoom = useCallback(() => {
    shiftZoomFromCenter(ZOOM_STEP);
  }, [shiftZoomFromCenter]);
  const decreaseZoom = useCallback(() => {
    shiftZoomFromCenter(-ZOOM_STEP);
  }, [shiftZoomFromCenter]);

  // -- Event listeners to handle dragging (allow to spin & move within zoomed image) -- //
  useEffect(() => {
    const container = containerRef.current;

    // DOM not ready yet
    if (!container) {
      return;
    }

    // - Handle when the user just clicked on the 360 to start spinning
    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault(); // Prevents native image dragging

      // Take snapshot of the current state
      isMouseDown.current = true;
      mouseStartXY.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    // - Handle when the user releases the 360 or leaves the spinning area
    const onMouseEnd = () => {
      isMouseDown.current = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      // We don't want to rotate the 360 when showing a detail image, but we do not want to prevent the click event so that the parent slider can still work
      if (showingDetailImage) {
        return;
      }

      // Check if the user was actually spinning
      if (!isMouseDown.current) {
        return;
      }

      if (!mouseStartXY.current) {
        throw new Error("mouseStartXY.current is null");
      }

      e.stopPropagation(); // Prevents parent slider from moving when rotating 360

      const walkX = e.clientX - mouseStartXY.current.x;
      const walkY = e.clientY - mouseStartXY.current.y;

      if (!zoom) {
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
      } else {
        offsetTransformStyle({
          x: walkX,
          y: walkY,
        });
      }

      mouseStartXY.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const onWheel = (e: WheelEvent) => {
      const { clientX, clientY, deltaX, deltaY } = e;

      // If we are scrolling horizontally, we want to spin the 360, not zoom
      if (deltaX !== 0 && Math.abs(deltaX) + 2 > Math.abs(deltaY)) {
        return;
      }

      e.preventDefault();

      const contrainer = containerRef.current;
      if (!contrainer) {
        throw new Error("containerRef.current is null");
      }
      const { left: parentOffsetX, top: parentOffsetY } =
        contrainer.getBoundingClientRect();

      // Translate the mouse position to the container position
      const x = clientX - parentOffsetX;
      const y = clientY - parentOffsetY;

      shiftZoom(-0.01 * deltaY, {
        x,
        y,
      });
    };

    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mouseleave", onMouseEnd);
    container.addEventListener("mouseup", onMouseEnd);
    container.addEventListener("mousemove", onMouseMove);

    container.addEventListener("wheel", onWheel);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mouseleave", onMouseEnd);
      container.removeEventListener("mouseup", onMouseEnd);
      container.removeEventListener("mousemove", onMouseMove);

      container.removeEventListener("wheel", onWheel);
    };
  }, [
    currentZoomValue,
    displayNextImage,
    displayPreviousImage,
    getTransformElementOrThrow,
    offsetTransformStyle,
    reverse360,
    shiftZoom,
    showingDetailImage,
    zoom,
  ]);

  // -- Event listeners to handle the "invisible scroller" that rotate 360 -- //
  useEffect(() => {
    // We do not want to rotate while zooming or showing a detail image
    if (zoom || showingDetailImage) {
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
      requestAnimationFrame(() => {
        scroller.scrollLeft = scollerCenterPosition;
      });
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
  }, [
    displayNextImage,
    displayPreviousImage,
    reverse360,
    showingDetailImage,
    zoom,
  ]);

  return (
    <div
      ref={containerRef}
      className={!zoom ? "cursor-ew-resize" : "cursor-move"}
    >
      <div className="hidden">
        {/* Take the 2 prev & 2 next images and insert them on the DOM to ensure preload */}
        {[-2, -1, 1, 2].map(offset => {
          const index = (imageIndex + offset + length) % length;
          const image = images[index];
          return <ImageElement key={image} src={image} />;
        })}
      </div>

      <div
        ref={transformElementRef}
        className="origin-top-left" // If not, will zoom at the center and crop the top-left part
      >
        <ImageElement
          src={images[imageIndex]}
          hotspots={hotspots[imageIndex]}
          zoom={zoom}
          onShownDetailImageChange={v => setShowingDetailImage(!!v)}
        />
      </div>

      {/* Scroller is an invisible element in front of the image to capture scroll event */}
      {/* Hotspots' z-index allow to keep them in front */}
      {/* Scroll is disabled while zooming or while showing detail image */}
      {!zoom && !showingDetailImage && (
        <div
          ref={scrollerRef}
          className="absolute inset-0 overflow-auto no-scrollbar"
        >
          <div
            className="h-full"
            style={{ width: `calc(100% + ${4 * SCROLL_STEP_PX}px` }}
          />
        </div>
      )}

      {/* Zoom Buttons */}
      {!showingDetailImage && (
        <div
          className={`absolute ${positionToClassName(zoomPosition)} flex gap-2 ${zoomPosition === "middle-right" ? "flex-col" : "flex-row-reverse"}`}
        >
          <CustomizableButton
            customizationKey="CONTROLS_ZOOM_IN"
            color="neutral"
            shape="icon"
            disabled={zoom === MAX_ZOOM}
            onClick={increaseZoom}
          >
            +
          </CustomizableButton>
          <CustomizableButton
            customizationKey="CONTROLS_ZOOM_OUT"
            color="neutral"
            shape="icon"
            disabled={!zoom || zoom === 1}
            onClick={decreaseZoom}
          >
            -
          </CustomizableButton>
        </div>
      )}
    </div>
  );
};

type ThreeSixtyElementPlaceholderProps = {
  images: string[];
  onReady: () => void;
};

const ThreeSixtyElementPlaceholder: React.FC<
  ThreeSixtyElementPlaceholderProps
> = ({ images, onReady }) => {
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

    setLoadingStatusMap(new Map(images.map(image => [image, false])));

    // TODO: add a timeout ?
  }, [images, loadingProgress]);

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
          {images.map(image => (
            <ImageElement
              key={image}
              src={image}
              onLoad={() => onImageLoaded(image)}
            />
          ))}
        </div>
      )}

      <ImageElement src={images[0]} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-4 bg-foreground/35">
        <CustomizableButton
          customizationKey="CONTROLS_PLAY_360"
          color="neutral"
          shape="icon"
          onClick={fetchImages}
        >
          <img
            className="size-full"
            src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/play.svg"
            alt="Play"
          />
        </CustomizableButton>
        {loadingProgress !== null && (
          <div className="relative h-1 w-3/5 overflow-hidden rounded-full bg-background">
            <div
              className="absolute inset-0 bg-primary transition-[right]"
              style={{ right: `${100 - loadingProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const ThreeSixtyElement: React.FC<ThreeSixtyElementProps> = props => {
  const [isReady, setIsReady] = useState(false);

  if (!isReady) {
    return (
      <ThreeSixtyElementPlaceholder
        images={props.images}
        onReady={() => setIsReady(true)}
      />
    );
  }

  return <ThreeSixtyElementInteractive {...props} />;
};

export default ThreeSixtyElement;
