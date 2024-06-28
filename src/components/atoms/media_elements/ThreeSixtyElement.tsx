import { useCallback, useEffect, useRef, useState } from "react";

import Button from "@/components/ui/Button";
import { Item } from "@/types/composition";
import { positionToClassName } from "@/utils/style";
import { preloadImage } from "@/utils/web";

import ImageElement from "./ImageElement";

const DRAG_STEP_PX = 10;
const SCROLL_STEP_PX = 20;

const ZOOM_STEP = 0.5;
const MAX_ZOOM = 2.5;

type ThreeSixtyElementProps = { item: Extract<Item, { type: "360" }> };

const ThreeSixtyElementInteractive: React.FC<ThreeSixtyElementProps> = ({
  item: { images, hotspots },
}) => {
  // -- Refs
  const container = useRef<HTMLDivElement>(null);
  const isMouseDown = useRef(false);
  const mouseStartXY = useRef<{ x: number; y: number } | null>(null);

  const zoomArea = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  // -- Image Index
  const [imageIndex, setImageIndex] = useState(0);
  const length = images.length;

  const displayPreviousImage = useCallback(() => {
    setImageIndex(currentIndex => (currentIndex - 1 + length) % length);
  }, [length]);
  const displayNextImage = useCallback(() => {
    setImageIndex(currentIndex => (currentIndex + 1) % length);
  }, [length]);

  // -- Zoom
  const [zoom, setZoom] = useState<number | null>(null);

  const increaseZoom = useCallback(() => {
    setZoom(prev => {
      if (prev === null) {
        return 1 + ZOOM_STEP;
      }

      return Math.min(prev + ZOOM_STEP, MAX_ZOOM);
    });
  }, []);
  const decreaseZoom = useCallback(() => {
    setZoom(prev => {
      if (prev === null) {
        return null;
      }

      const newValue = prev - ZOOM_STEP;
      return newValue > 1 ? newValue : null;
    });
  }, []);

  // -- Handle Click & Drag events
  useEffect(() => {
    if (!container.current) {
      return;
    }

    const containerRef = container.current;

    const onMouseDown = (e: MouseEvent) => {
      if (!container.current) {
        throw new Error("[onMouseDown] slider.current is null");
      }

      e.preventDefault(); // Prevents native image dragging

      isMouseDown.current = true;
      mouseStartXY.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const onMouseEnd = () => {
      if (!container.current) {
        throw new Error("[onMouseEnd] container.current is null");
      }

      isMouseDown.current = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown.current) {
        return;
      }

      if (!mouseStartXY.current) {
        throw new Error("[onMouseMove] mouseStartXY.current is null");
      }

      if (!zoomArea.current) {
        throw new Error("zoomArea.current is null");
      }

      e.stopPropagation(); // Prevents slider from moving when rotating 360

      const walkX = e.clientX - mouseStartXY.current.x;
      const walkY = e.clientY - mouseStartXY.current.y;

      if (!zoom) {
        if (Math.abs(walkX) < DRAG_STEP_PX) {
          return;
        }

        if (walkX < 0) {
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
  }, [displayNextImage, displayPreviousImage, zoom]);

  // -- Handle "invisible scroller" events to control 360.
  // -- Not needed when zoomed because we use the native scrolling
  useEffect(() => {
    if (zoom) {
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

      if (walk > 0) {
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
    zoom, // Zoom is needed because is make the scroller appear/disappear
  ]);

  return (
    <div ref={container} className={!zoom ? "cursor-ew-resize" : "cursor-move"}>
      <div className="hidden">
        {/* Take the 2 prev & 2 next images and insert them on the DOM to ensure preload */}
        {[-2, -1, 1, 2].map(offset => {
          const index = (imageIndex + offset + length) % length;
          return <img key={index} src={images[index]} alt="" />;
        })}
      </div>

      <div ref={zoomArea} className="overflow-auto no-scrollbar">
        <div
          className="transition-transform"
          style={!zoom ? {} : { transform: `scale(${zoom})` }}
        >
          <ImageElement
            item={{
              type: "image",
              src: images[imageIndex],
              hotspots: hotspots[imageIndex],
            }}
          />
        </div>
      </div>

      {/* Scroller is an invisible element in front of the image to capture scroll event */}
      {!zoom && (
        <div
          ref={scroller}
          className="absolute inset-0 overflow-auto no-scrollbar"
        >
          <div className="size-full scale-110"></div>
        </div>
      )}

      {/* Zoom Buttons */}
      <div
        className={`absolute ${positionToClassName("middle-right")} flex flex-col gap-y-2`}
      >
        <Button
          color="neutral"
          shape="icon"
          disabled={zoom === MAX_ZOOM}
          onClick={increaseZoom}
        >
          +
        </Button>
        <Button
          color="neutral"
          shape="icon"
          disabled={!zoom || zoom === 1}
          onClick={decreaseZoom}
        >
          -
        </Button>
      </div>
    </div>
  );
};

type ThreeSixtyElementPlaceholderProps = {
  imageSrc: string;
  loadingProgress: number | null;
  onClick: () => void;
};

const ThreeSixtyElementPlaceholder: React.FC<
  ThreeSixtyElementPlaceholderProps
> = ({ imageSrc, loadingProgress, onClick }) => {
  return (
    <div className="relative size-full">
      <img className="size-full" src={imageSrc} alt="" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-4 bg-foreground/35">
        <Button className="text-background" onClick={onClick}>
          PLAY 360
        </Button>
        {loadingProgress !== null && (
          <div className="h-1 w-3/5 rounded-full bg-primary">
            <div
              className="h-full bg-primary/25"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const ThreeSixtyElement: React.FC<ThreeSixtyElementProps> = ({ item }) => {
  const [loadingProgress, setLoadingProgress] = useState<number | null>(null);

  const fetchImages = useCallback(async () => {
    setLoadingProgress(0);
    // TODO: Fix this
    const imagePromises = item.images.map(imageSrc =>
      preloadImage(imageSrc).then(() =>
        setLoadingProgress(prev => (prev as number) + 100 / item.images.length)
      )
    );

    try {
      await Promise.all(imagePromises);
      setLoadingProgress(100);
    } catch (e) {
      // TODO
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }, [item.images]);

  if (loadingProgress !== 100) {
    return (
      <ThreeSixtyElementPlaceholder
        imageSrc={item.images[0]}
        loadingProgress={loadingProgress}
        onClick={fetchImages}
      />
    );
  }

  return <ThreeSixtyElementInteractive item={item} />;
};

export default ThreeSixtyElement;
