import { Item } from "@/types/composition";
import { useCallback, useEffect, useRef, useState } from "react";
import ImageElement from "./ImageElement";
import { preloadImage } from "@/utils/web";

const STEP_PX = 10;

type ThreeSixtyElementProps = { item: Extract<Item, { type: "360" }> };

const ThreeSixtyElementInteractive: React.FC<ThreeSixtyElementProps> = ({
  item: { images, hotspots },
}) => {
  const container = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef<number | null>(null);

  const [imageIndex, setImageIndex] = useState(0);
  const length = images.length;

  const getContainerWidth = useCallback(() => {
    if (!container.current) {
      throw new Error("[getContainerWidth] slider.current is null");
    }

    return container.current.getBoundingClientRect().width;
  }, []);

  const displayPreviousImage = useCallback(() => {
    setImageIndex((currentIndex) => (currentIndex - 1 + length) % length);
  }, [length]);
  const displayNextImage = useCallback(() => {
    setImageIndex((currentIndex) => (currentIndex + 1) % length);
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

      if (Math.abs(walk) < STEP_PX) {
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
  }, [displayNextImage, displayPreviousImage, getContainerWidth]);

  return (
    <div ref={container} className="cursor-ew-resize">
      <div className="hidden">
        {/* Take the 2 prev & 2 next images and insert them on the DOM to ensure preload */}
        {[-2, -1, 1, 2].map((offset) => {
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
        className="absolute flex flex-col justify-center items-center gap-y-4 inset-0 bg-foreground/35 cursor-pointer"
        onClick={onClick}
      >
        <div className="text-background">PLAY 360</div>
        {loadingProgress !== null && (
          <div className="w-3/5 rounded-full h-1 bg-primary">
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
    const imagePromises = item.images.map((imageSrc) =>
      preloadImage(imageSrc).then(() =>
        setLoadingProgress(
          (prev) => (prev as number) + 100 / item.images.length
        )
      )
    );

    try {
      await Promise.all(imagePromises);
      setLoadingProgress(100);
    } catch (e) {
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
