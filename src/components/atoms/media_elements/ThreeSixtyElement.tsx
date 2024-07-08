import { useCallback, useEffect, useRef, useState } from "react";

import CustomizableButton from "@/components/molecules/CustomizableButton";
import { useGlobalContext } from "@/providers/GlobalContext";
import { Item } from "@/types/composition";
import { clamp } from "@/utils/math";
import { positionToClassName } from "@/utils/style";

import ImageElement from "./ImageElement";

const DRAG_STEP_PX = 10;
const SCROLL_STEP_PX = 20;

const ZOOM_STEP = 0.6;
const MAX_ZOOM = 1 + ZOOM_STEP * 3;

type ThreeSixtyElementProps = Omit<Extract<Item, { type: "360" }>, "type">;

const ThreeSixtyElementInteractive: React.FC<ThreeSixtyElementProps> = ({
  images,
  hotspots,
}) => {
  const { reverse360, zoomPosition } = useGlobalContext();

  // -- Refs
  const container = useRef<HTMLDivElement>(null);
  const isMouseDown = useRef(false);
  const mouseStartXY = useRef<{ x: number; y: number } | null>(null);

  const zoomArea = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  // -- Image Index
  const [imageIndex, setImageIndex] = useState(0);
  const length = images.length;

  const [showingDetailImage, setShowingDetailImage] = useState(false);

  const displayPreviousImage = useCallback(() => {
    setImageIndex(currentIndex => (currentIndex - 1 + length) % length);
  }, [length]);
  const displayNextImage = useCallback(() => {
    setImageIndex(currentIndex => (currentIndex + 1) % length);
  }, [length]);

  // -- Zoom
  const [zoom, setZoom] = useState<number | null>(null);

  const shiftZoom = useCallback(
    (shift: number) => {
      const zoomAreaRef = zoomArea.current;
      if (!zoomAreaRef) {
        throw new Error("zoomArea.current is null");
      }

      const currentZoomValue = zoom ?? 1;
      const newZoomValue = clamp(currentZoomValue + shift, 1, MAX_ZOOM);

      setZoom(newZoomValue !== 1 ? newZoomValue : null);

      // -- When zoom just changed, we want to compensate the scroll position to keep the same point at the center
      const w = zoomAreaRef.clientWidth;
      const h = zoomAreaRef.clientHeight;
      const centerX = zoomAreaRef.scrollLeft + w / 2;
      const centerY = zoomAreaRef.scrollTop + h / 2;

      const newCenterX = (centerX * newZoomValue) / currentZoomValue;
      const newCenterY = (centerY * newZoomValue) / currentZoomValue;

      // We need to wait for the DOM to update the scroll position
      // because the element has not been resized yet and scroll position could be unreachable
      requestAnimationFrame(() => {
        zoomAreaRef.scrollLeft = newCenterX - w / 2;
        zoomAreaRef.scrollTop = newCenterY - h / 2;
      });
    },
    [zoom]
  );
  const increaseZoom = useCallback(() => {
    shiftZoom(ZOOM_STEP);
  }, [shiftZoom]);
  const decreaseZoom = useCallback(() => {
    shiftZoom(-ZOOM_STEP);
  }, [shiftZoom]);

  // -- Handle Click & Drag events
  useEffect(() => {
    const containerRef = container.current;

    if (!containerRef) {
      return;
    }

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault(); // Prevents native image dragging

      isMouseDown.current = true;
      mouseStartXY.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const onMouseEnd = () => {
      isMouseDown.current = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      // We don't want to rotate the 360 when showing a detail image, but we do not want to prevent the click event so that the parent slider can still work
      if (showingDetailImage) {
        return;
      }

      if (!isMouseDown.current) {
        return;
      }

      if (!mouseStartXY.current) {
        throw new Error("[onMouseMove] mouseStartXY.current is null");
      }

      if (!zoomArea.current) {
        throw new Error("zoomArea.current is null");
      }

      e.stopPropagation(); // Prevents parent slider from moving when rotating 360

      const walkX = e.clientX - mouseStartXY.current.x;
      const walkY = e.clientY - mouseStartXY.current.y;

      if (!zoom) {
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
        zoomArea.current.scrollLeft -= walkX;
        zoomArea.current.scrollTop -= walkY;
      }

      mouseStartXY.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    containerRef.addEventListener("mousedown", onMouseDown);
    containerRef.addEventListener("mouseleave", onMouseEnd);
    containerRef.addEventListener("mouseup", onMouseEnd);
    containerRef.addEventListener("mousemove", onMouseMove);

    return () => {
      containerRef.removeEventListener("mousedown", onMouseDown);
      containerRef.removeEventListener("mouseleave", onMouseEnd);
      containerRef.removeEventListener("mouseup", onMouseEnd);
      containerRef.removeEventListener("mousemove", onMouseMove);
    };
  }, [
    displayNextImage,
    displayPreviousImage,
    reverse360,
    showingDetailImage,
    zoom,
  ]);

  // -- Handle "invisible scroller" events to rotate 360.
  useEffect(() => {
    // We do not want to rotate while zooming or showing a detail image
    if (zoom || showingDetailImage) {
      return;
    }

    if (!scroller.current) {
      return;
    }

    const scrollerRef = scroller.current;

    const getSliderWidth = () => scrollerRef.getBoundingClientRect().width;

    const sliderCenterPosition =
      scrollerRef.scrollWidth / 2 - getSliderWidth() / 2;

    const centerScrollElement = () => {
      scrollerRef.scrollLeft = sliderCenterPosition;
    };

    centerScrollElement();

    const onScroll = () => {
      const walk = scrollerRef.scrollLeft - sliderCenterPosition;

      if (Math.abs(walk) < SCROLL_STEP_PX) {
        return;
      }

      // XOR operation to reverse the logic
      if (walk < 0 !== reverse360) {
        displayNextImage();
      } else {
        displayPreviousImage();
      }

      centerScrollElement();
    };

    scrollerRef.addEventListener("scroll", onScroll);

    return () => {
      scrollerRef.removeEventListener("scroll", onScroll);
    };
  }, [
    displayNextImage,
    displayPreviousImage,
    reverse360,
    showingDetailImage,
    zoom,
  ]);

  return (
    <div ref={container} className={!zoom ? "cursor-ew-resize" : "cursor-move"}>
      <div className="hidden">
        {/* Take the 2 prev & 2 next images and insert them on the DOM to ensure preload */}
        {[-2, -1, 1, 2].map(offset => {
          const index = (imageIndex + offset + length) % length;
          const image = images[index];
          return <ImageElement key={image} src={image} />;
        })}
      </div>

      <div ref={zoomArea} className="overflow-auto no-scrollbar">
        <div
          key={zoom} // Key is used to force re-render when zoom changes (if not, the scrollbar size is not updated)
          className="origin-top-left" // If not, will zoom at the center and crop the top-left part
          style={
            !zoom
              ? {}
              : {
                  transform: `scale(${zoom})`,
                }
          }
        >
          <ImageElement
            src={images[imageIndex]}
            hotspots={hotspots[imageIndex]}
            zoom={zoom}
            onShownDetailImageChange={v => setShowingDetailImage(!!v)}
          />
        </div>
      </div>

      {/* Scroller is an invisible element in front of the image to capture scroll event */}
      {/* Hotspots' z-index allow to keep them in front */}
      {/* Scroll is disabled while zooming or while showing detail image */}
      {!zoom && !showingDetailImage && (
        <div
          ref={scroller}
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
