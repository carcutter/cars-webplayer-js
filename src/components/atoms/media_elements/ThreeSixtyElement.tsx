import { useCallback, useEffect, useRef, useState } from "react";

import { Item } from "@/types/composition";
import { preloadImage } from "@/utils/web";

import ImageElement from "./ImageElement";

const DRAG_STEP_PX = 10;
const SCROLL_STEP_PX = 20;

type ThreeSixtyElementProps = { item: Extract<Item, { type: "360" }> };

const ThreeSixtyElementInteractive: React.FC<ThreeSixtyElementProps> = ({
  item: { images, hotspots },
}) => {
  const container = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef<number | null>(null);

  const scroller = useRef<HTMLDivElement>(null);

  const [imageIndex, setImageIndex] = useState(0);
  const length = images.length;

  const displayPreviousImage = useCallback(() => {
    setImageIndex(currentIndex => (currentIndex - 1 + length) % length);
  }, [length]);
  const displayNextImage = useCallback(() => {
    setImageIndex(currentIndex => (currentIndex + 1) % length);
  }, [length]);

  useEffect(() => {
    if (!container?.current) {
      return;
    }

    const containerRef = container.current;

    const onMouseDown = (e: MouseEvent) => {
      if (!container?.current) {
        throw new Error("[onMouseDown] slider.current is null");
      }

      e.preventDefault();

      isDown.current = true;
      startX.current = e.clientX;
    };

    const onMouseEnd = () => {
      if (!container?.current) {
        throw new Error("[onMouseEnd] slider.current is null");
      }

      isDown.current = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown.current) {
        return;
      }

      if (startX.current === null) {
        throw new Error("startX or scrollLeft is null");
      }

      e.preventDefault();

      const walk = e.clientX - startX.current;

      if (Math.abs(walk) < DRAG_STEP_PX) {
        return;
      }

      if (walk < 0) {
        displayNextImage();
      } else {
        displayPreviousImage();
      }

      startX.current = e.clientX;
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
  }, [displayNextImage, displayPreviousImage]);

  useEffect(() => {
    if (!scroller?.current) {
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
  }, [displayNextImage, displayPreviousImage]);

  return (
    <div ref={container} className="cursor-ew-resize">
      <div className="hidden">
        {/* Take the 2 prev & 2 next images and insert them on the DOM to ensure preload */}
        {[-2, -1, 1, 2].map(offset => {
          const index = (imageIndex + offset + length) % length;
          return <img key={index} src={images[index]} alt="" />;
        })}
      </div>

      <ImageElement
        item={{
          type: "image",
          src: images[imageIndex],
          hotspots: hotspots[imageIndex],
        }}
      />

      {/* Scroller is an invisible element in front of the image to capture scroll event */}
      <div
        ref={scroller}
        className="absolute inset-0 overflow-auto no-scrollbar"
      >
        <div className="h-full w-[200%]"></div>
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
      <div
        className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-y-4 bg-foreground/35"
        onClick={onClick}
      >
        <div className="text-background">PLAY 360</div>
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
