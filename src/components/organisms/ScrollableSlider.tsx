import { useCallback, useEffect, useRef, useState } from "react";
import IndexIndicator from "../atoms/IndexIndicator";
import NextPrevButtons from "../../custom_elements/NextPrevButtons";
import { positionToClassName } from "@/utils/style";

type Props<T extends object> = {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
};

const ScrollableSlider = <T extends object>({
  data,
  renderItem,
}: Props<T>): ReturnType<React.FC> => {
  const slider = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef<number | null>(null);
  const scrollLeft = useRef<number | null>(null);

  const [itemIndex, setItemIndex] = useState(0);
  const length = data.length;
  const slidable = length > 1;

  const setCursor = useCallback((cursor: "auto" | "grab" | "grabbing") => {
    if (!slider.current) {
      throw new Error("[setAutoScroll] slider.current is null");
    }

    slider.current.style.cursor = cursor;
  }, []);

  const setScrollBehavior = useCallback((behavior: "auto" | "smooth") => {
    if (!slider.current) {
      throw new Error("[setScrollBehavior] slider.current is null");
    }

    slider.current.style.scrollBehavior = behavior;
  }, []);

  const getContainerWidth = useCallback(() => {
    if (!slider.current) {
      throw new Error("[getContainerWidth] slider.current is null");
    }

    return slider.current.getBoundingClientRect().width;
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (!slider.current) {
        throw new Error("[scrollToIndex] slider.current is null");
      }

      if (index < 0 || index >= length) {
        throw new Error("Out of bounds index");
      }

      slider.current.scrollLeft = index * getContainerWidth();

      setItemIndex(index);
    },
    [getContainerWidth, length]
  );

  // Reset the index when the data changes
  useEffect(() => {
    setScrollBehavior("auto");
    scrollToIndex(0);
    setScrollBehavior("smooth");
  }, [data, scrollToIndex, setScrollBehavior]);

  const computeClosestIndex = useCallback(() => {
    if (!slider.current) {
      throw new Error("[computeClosestIndex] slider.current is null");
    }

    return Math.round(slider.current.scrollLeft / getContainerWidth());
  }, [getContainerWidth]);

  useEffect(() => {
    // Does not allow sliding if there is only one item
    if (!slidable) {
      setCursor("auto");
      return;
    }

    if (!slider?.current) {
      return;
    }

    setCursor("grab");

    const sliderRef = slider.current;

    const onMouseDown = (e: MouseEvent) => {
      if (!slider?.current) {
        throw new Error("[onMouseDown] slider.current is null");
      }

      e.preventDefault();

      isDown.current = true;
      startX.current = e.pageX - sliderRef.offsetLeft;
      scrollLeft.current = sliderRef.scrollLeft;

      slider.current.style.cursor = "grabbing";
      setScrollBehavior("auto");
    };

    const onMouseEnd = () => {
      if (!slider?.current) {
        throw new Error("[onMouseEnd] slider.current is null");
      }

      isDown.current = false;

      // Reset CSS
      slider.current.style.cursor = "grab";
      setScrollBehavior("smooth");

      // Snap to the closest image
      const closestIndex = computeClosestIndex();
      scrollToIndex(closestIndex);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown.current) {
        return;
      }

      if (startX.current === null || scrollLeft.current === null) {
        throw new Error("startX or scrollLeft is null");
      }

      e.preventDefault();

      const x = e.pageX - sliderRef.offsetLeft;
      const walk = x - startX.current;
      sliderRef.scrollLeft = scrollLeft.current - walk;
    };

    sliderRef.addEventListener("mousedown", onMouseDown);
    sliderRef.addEventListener("mouseleave", onMouseEnd);
    sliderRef.addEventListener("mouseup", onMouseEnd);
    sliderRef.addEventListener("mousemove", onMouseMove);

    return () => {
      sliderRef.removeEventListener("mousedown", onMouseDown);
      sliderRef.removeEventListener("mouseleave", onMouseEnd);
      sliderRef.removeEventListener("mouseup", onMouseEnd);
      sliderRef.removeEventListener("mousemove", onMouseMove);
    };
  }, [
    computeClosestIndex,
    scrollToIndex,
    setCursor,
    setScrollBehavior,
    slidable,
  ]);

  const scrollOffsetIndex = (offset: number) => {
    if (!slider.current) {
      throw new Error("[scrollOffsetIndex] slider.current is null");
    }

    const currentIndex = computeClosestIndex();

    scrollToIndex(currentIndex + offset);
  };

  const prevImage = () => {
    scrollOffsetIndex(-1);
  };

  const nextImage = () => {
    scrollOffsetIndex(1);
  };

  return (
    <>
      <div
        ref={slider}
        className="h-full flex overflow-x-hidden transition-transform"
      >
        {data.map((item, index) => renderItem(item, index))}
      </div>

      {slidable && (
        <>
          <div className={`absolute ${positionToClassName("top-right")}`}>
            <IndexIndicator currentIndex={itemIndex} length={length} />
          </div>

          <NextPrevButtons
            currentIndex={itemIndex}
            length={length}
            onPrev={prevImage}
            onNext={nextImage}
          />
        </>
      )}
    </>
  );
};

export default ScrollableSlider;
