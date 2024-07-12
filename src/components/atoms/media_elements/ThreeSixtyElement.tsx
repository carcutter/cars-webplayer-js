import { useCallback, useEffect, useRef, useState } from "react";

import CustomizableButton from "@/components/molecules/CustomizableButton";
import { useGlobalContext } from "@/providers/GlobalContext";
import type { Item } from "@/types/composition";
import { clamp } from "@/utils/math";
import { positionToClassName } from "@/utils/style";

import ImageElement from "./ImageElement";

const DRAG_STEP_PX = 10;
const SCROLL_STEP_PX = 20;

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
  const tranformStyleRef = useRef<TransformStyle>({ x: 0, y: 0, scale: 1 });

  const [zoom, setZoom] = useState<number | null>(null);

  const setTransformStyle = useCallback((target: Partial<TransformStyle>) => {
    const transformElement = transformElementRef.current;
    if (!transformElement) {
      throw new Error("transformElementRef.current is null");
    }

    const {
      x: targetX,
      y: targetY,
      scale: targetScale,
    } = {
      ...tranformStyleRef.current,
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

    tranformStyleRef.current = { x, y, scale };
    transformElement.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }, []);

  const animateTransformStyle = useCallback(
    (target: Partial<TransformStyle>) => {
      const transformElement = transformElementRef.current;
      if (!transformElement) {
        throw new Error("transformElementRef.current is null");
      }

      const {
        x: startX,
        y: startY,
        scale: startScale,
      } = tranformStyleRef.current;

      const {
        x: targetX,
        y: targetY,
        scale: targetScale,
      } = {
        ...tranformStyleRef.current,
        ...target,
      };

      const animationDuration = 200;
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

  const shiftZoom = useCallback(
    (shift: number) => {
      const transformElement = transformElementRef.current;
      if (!transformElement) {
        throw new Error("transformElementRef.current is null");
      }

      const currentZoomValue = zoom ?? 1;
      const newZoomValue = clamp(currentZoomValue + shift, 1, MAX_ZOOM);

      setZoom(newZoomValue !== 1 ? newZoomValue : null);

      // -- Animation -- //
      // When zoom just changed, we want to compensate the scroll position to keep the same point at the center

      const { x: currentTransformX, y: currentTransformY } =
        tranformStyleRef.current;

      const containerW = transformElement.clientWidth;
      const containerH = transformElement.clientHeight;

      const zoomRatio = newZoomValue / currentZoomValue;

      const currentCenterX = containerW / 2 - currentTransformX;
      const currentCenterY = containerH / 2 - currentTransformY;
      const newCenterX = currentCenterX * zoomRatio;
      const newCenterY = currentCenterY * zoomRatio;

      const newTranformX = containerW / 2 - newCenterX;
      const newTransformY = containerH / 2 - newCenterY;

      animateTransformStyle({
        x: newTranformX,
        y: newTransformY,
        scale: newZoomValue,
      });
    },
    [animateTransformStyle, zoom]
  );
  const increaseZoom = useCallback(() => {
    shiftZoom(ZOOM_STEP);
  }, [shiftZoom]);
  const decreaseZoom = useCallback(() => {
    shiftZoom(-ZOOM_STEP);
  }, [shiftZoom]);

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
        const { x: currentTransformX, y: currentTransformY } =
          tranformStyleRef.current;

        setTransformStyle({
          x: currentTransformX + walkX,
          y: currentTransformY + walkY,
        });
      }

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
  }, [
    displayNextImage,
    displayPreviousImage,
    reverse360,
    setTransformStyle,
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
