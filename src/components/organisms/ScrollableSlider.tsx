import { useCallback, useEffect, useRef, useState } from "react";

import IndexIndicator from "@/components/atoms/IndexIndicator";
import { positionToClassName } from "@/utils/style";

import NextPrevButtons from "../../custom_elements/NextPrevButtons";

type Props<T extends object> = {
  data: T[];
  renderItem: (item: T, index: number, currentIndex: number) => React.ReactNode;
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

  const setSnapState = useCallback((activated: boolean) => {
    if (!slider.current) {
      throw new Error("[setSnapBehavior] slider.current is null");
    }

    if (activated) {
      slider.current.style.scrollSnapType = "x mandatory";
    } else {
      slider.current.style.scrollSnapType = "none";
    }
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
    },
    [getContainerWidth, length]
  );

  // Reset the index when the data changes
  useEffect(() => {
    setScrollBehavior("auto");
    scrollToIndex(0);
    setItemIndex(0);
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

    const sliderRef = slider.current;

    setCursor("grab");
    setScrollBehavior("smooth");
    setSnapState(true);

    // Take "measures" when the user clicks on the slider
    const onMouseDown = (e: MouseEvent) => {
      if (!slider?.current) {
        throw new Error("[onMouseDown] slider.current is null");
      }

      e.preventDefault();

      isDown.current = true;
      startX.current = e.pageX - sliderRef.offsetLeft;
      scrollLeft.current = sliderRef.scrollLeft;

      // Set CSS
      setCursor("grabbing");
      setScrollBehavior("auto");
      setSnapState(false);
    };

    // Reset CSS & snap to the closest image when the user releases the slider
    const onMouseEnd = () => {
      if (!slider?.current) {
        throw new Error("[onMouseEnd] slider.current is null");
      }

      isDown.current = false;

      // Reset CSS
      setCursor("grab");
      setScrollBehavior("smooth");
      setTimeout(() => {
        // SetTimeout to avoid flickering
        setSnapState(true);
      }, 300);

      // Snap to the closest image
      const closestIndex = computeClosestIndex();
      scrollToIndex(closestIndex);
    };

    // Scroll according the user's dragging movement
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

    // Update the index when the user scrolls with "standard" scrolling
    const onScroll = () => {
      const closestIndex = computeClosestIndex();
      setItemIndex(closestIndex);
    };

    sliderRef.addEventListener("mousedown", onMouseDown);
    sliderRef.addEventListener("mouseleave", onMouseEnd);
    sliderRef.addEventListener("mouseup", onMouseEnd);
    sliderRef.addEventListener("mousemove", onMouseMove);
    sliderRef.addEventListener("scroll", onScroll);

    return () => {
      sliderRef.removeEventListener("mousedown", onMouseDown);
      sliderRef.removeEventListener("mouseleave", onMouseEnd);
      sliderRef.removeEventListener("mouseup", onMouseEnd);
      sliderRef.removeEventListener("mousemove", onMouseMove);
      sliderRef.removeEventListener("scroll", onScroll);
    };
  }, [
    computeClosestIndex,
    scrollToIndex,
    setCursor,
    setScrollBehavior,
    setSnapState,
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
    <div className="relative size-full">
      <div
        ref={slider}
        className="flex size-full overflow-x-auto transition-transform no-scrollbar *:snap-mandatory *:snap-start"
      >
        {data.map((item, index) => renderItem(item, index, itemIndex))}
      </div>

      {slidable && (
        <>
          <div className={`absolute ${positionToClassName("bottom-right")}`}>
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
    </div>
  );
};

export default ScrollableSlider;
