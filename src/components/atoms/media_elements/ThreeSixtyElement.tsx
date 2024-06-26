import { Item } from "@/types/composition";
import { useCallback, useEffect, useRef, useState } from "react";
import ImageElement from "./ImageElement";

type Props = { item: Extract<Item, { type: "360" }> };

const STEP = 10;

const ThreeSixtyElement: React.FC<Props> = ({ item: { images, hotspots } }) => {
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

      if (Math.abs(walk) < STEP) {
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

export default ThreeSixtyElement;
