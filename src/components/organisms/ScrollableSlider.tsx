import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import IndexIndicator from "@/components/atoms/IndexIndicator";
import NextPrevButtons from "@/components/molecules/NextPrevButtons";
import { useGlobalContext } from "@/providers/GlobalContext";
import type { Item } from "@/types/composition";
import { aspectRatioStyle, positionToClassName } from "@/utils/style";

import Gallery from "./Gallery";

type Props = {
  items: Item[];
  renderItem: (
    item: Item,
    index: number,
    currentActiveIndex: number
  ) => React.ReactNode;
  keyExtractor?: (item: Item, index: number) => string;
};

const ONE_ITEM_DRAG_MULTIPLIER = 1.5;

const defaultKeyExtractor = (_item: unknown, index: number) => index.toString();

const ScrollableSlider: React.FC<Props> = ({
  items,
  renderItem,
  keyExtractor = defaultKeyExtractor,
}) => {
  const { aspectRatio, itemsShown, showGallery, closeGallery } =
    useGlobalContext();
  const showOneItem = itemsShown === 1;

  // - Refs
  const slider = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef<number | null>(null);
  const scrollLeft = useRef<number | null>(null);

  // - Indexing
  const length = items.length;
  const slidable = length > itemsShown;
  const snapIndexes = useMemo(() => {
    if (!slidable) {
      return [0];
    }

    const maxSnapIndexInt = length - Math.ceil(itemsShown);

    const indexes = Array.from({ length: maxSnapIndexInt + 1 }, (_, i) => i);

    // Add fractionnal index if displaying a fraction of an item
    const fractionnalIndex = itemsShown % 1;
    if (fractionnalIndex !== 0) {
      indexes.push(maxSnapIndexInt + fractionnalIndex);
    }

    return indexes;
  }, [itemsShown, length, slidable]);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0); // NOTE: Used only by the fixed index indicator

  // - Style functions
  const setCursor = useCallback((cursor: "auto" | "grab" | "grabbing") => {
    if (!slider.current) {
      throw new Error("[setCursor] slider.current is null");
    }

    slider.current.style.cursor = cursor;
  }, []);

  const setScrollBehavior = useCallback((behavior: "auto" | "smooth") => {
    if (!slider.current) {
      throw new Error("[setScrollBehavior] slider.current is null");
    }

    slider.current.style.scrollBehavior = behavior;
  }, []);

  const setSnapState = useCallback((type: "mandatory" | "none") => {
    if (!slider.current) {
      throw new Error("[setSnapState] slider.current is null");
    }

    if (type === "mandatory") {
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

  const getElementWidth = useCallback(
    () => getContainerWidth() / itemsShown,
    [getContainerWidth, itemsShown]
  );

  const scrollToSnapIndex = useCallback(
    (index: number) => {
      if (!slider.current) {
        throw new Error("[scrollToSnapIndex] slider.current is null");
      }

      if (!snapIndexes.includes(index)) {
        throw new Error(`[scrollToSnapIndex] Unexpected index value: ${index}`);
      }

      slider.current.scrollLeft = index * getElementWidth();
    },
    [getElementWidth, snapIndexes]
  );

  const computeClosestSnapIndex = useCallback(() => {
    if (!slider.current) {
      throw new Error("[computeClosestSnapIndex] slider.current is null");
    }

    const decimalIndex = slider.current.scrollLeft / getElementWidth();

    return snapIndexes.reduce(
      (prevClosest, curr) =>
        Math.abs(curr - decimalIndex) < Math.abs(prevClosest - decimalIndex)
          ? curr
          : prevClosest,
      Infinity
    );
  }, [getElementWidth, snapIndexes]);

  // - Reset the index when the items changes
  useEffect(() => {
    setScrollBehavior("auto");
    scrollToSnapIndex(0);
    setCurrentSnapIndex(0);
    setScrollBehavior("smooth");
  }, [items, scrollToSnapIndex, setScrollBehavior]);

  // - Event listeners
  useEffect(() => {
    // DOM not ready
    if (!slider.current) {
      return;
    }

    // Does not allow sliding if there is only one item
    if (!slidable) {
      setCursor("auto");
      return;
    }

    const sliderRef = slider.current;

    setCursor("grab");
    setScrollBehavior("smooth");
    setSnapState("mandatory");

    // Handle when the user just clicked on the slider
    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault(); // Prevents native image dragging

      isDown.current = true;
      startX.current = e.pageX - sliderRef.offsetLeft;
      scrollLeft.current = sliderRef.scrollLeft;

      // Set CSS
      setCursor("grabbing");
      setScrollBehavior("auto");
      setSnapState("none");
    };

    // Reset CSS & snap to the closest image when the user releases the slider
    const onMouseEnd = () => {
      if (!isDown.current) {
        return;
      }

      isDown.current = false;

      // Reset CSS
      setCursor("grab");
      setScrollBehavior("smooth");
      setTimeout(() => {
        // setTimeout to avoid flickering, but we have to handle the case where the user clicks again on the slider
        if (isDown.current) {
          return;
        }
        setSnapState("mandatory");
      }, 500);

      // Snap scrolling
      const closestSnapIndex = computeClosestSnapIndex();
      scrollToSnapIndex(closestSnapIndex);
    };

    // Scroll according the user's dragging movement
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown.current) {
        return;
      }

      if (startX.current === null || scrollLeft.current === null) {
        throw new Error("[onMouseMove] startX or scrollLeft is null");
      }

      const scrollMultiplier = showOneItem ? ONE_ITEM_DRAG_MULTIPLIER : 1;
      const x = e.pageX - sliderRef.offsetLeft;
      const walk = x - startX.current;
      sliderRef.scrollLeft = scrollLeft.current - walk * scrollMultiplier;
    };

    // Update the index when the user scrolls with "standard" scrolling
    const onScroll = () => {
      const closestSnapIndex = computeClosestSnapIndex();
      setCurrentSnapIndex(closestSnapIndex);
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
    computeClosestSnapIndex,
    scrollToSnapIndex,
    setCursor,
    setScrollBehavior,
    setSnapState,
    showOneItem,
    slidable,
  ]);

  const scrollOffsetIndex = useCallback(
    (offset: number) => {
      const currentSnapIndex = computeClosestSnapIndex();
      const newLeftIndex =
        snapIndexes[snapIndexes.indexOf(currentSnapIndex) + offset];

      scrollToSnapIndex(newLeftIndex);
    },
    [computeClosestSnapIndex, scrollToSnapIndex, snapIndexes]
  );

  const prevImage = useCallback(() => {
    scrollOffsetIndex(-1);
  }, [scrollOffsetIndex]);

  const nextImage = useCallback(() => {
    scrollOffsetIndex(1);
  }, [scrollOffsetIndex]);

  const handleOnGalleryItemClicked = (_item: Item, index: number) => {
    closeGallery();
    scrollToSnapIndex(index);
  };

  return (
    <div
      className="relative w-full"
      style={{
        aspectRatio: aspectRatioStyle(aspectRatio, itemsShown),
      }}
    >
      <div
        ref={slider}
        className={`flex size-full ${slidable ? "overflow-x-auto transition-transform no-scrollbar *:snap-mandatory *:snap-start" : "justify-center"}`}
      >
        {items.map((item, index) => {
          const Item = renderItem(item, index, currentSnapIndex);
          const key = keyExtractor(item, index);

          return (
            <div key={key} className="relative">
              {Item}
              {slidable && !showOneItem && (
                <div
                  className={`absolute ${positionToClassName("bottom-right")}`}
                >
                  <IndexIndicator currentIndex={index} length={length} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {slidable && (
        <>
          {showOneItem && (
            <div className={`absolute ${positionToClassName("bottom-right")}`}>
              <IndexIndicator currentIndex={currentSnapIndex} length={length} />
            </div>
          )}

          <NextPrevButtons
            currentIndex={currentSnapIndex}
            maxIndex={length - itemsShown}
            onPrev={prevImage}
            onNext={nextImage}
          />
        </>
      )}

      {/* Gallery */}
      {showGallery && (
        <Gallery items={items} onItemClicked={handleOnGalleryItemClicked} />
      )}
    </div>
  );
};

export default ScrollableSlider;
