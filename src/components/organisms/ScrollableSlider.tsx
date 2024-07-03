import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import IndexIndicator from "@/components/atoms/IndexIndicator";
import NextPrevButtons from "@/components/molecules/NextPrevButtons";
import { useGlobalContext } from "@/providers/GlobalContext";
import { Item } from "@/types/composition";
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
  const indexes = useMemo(() => {
    if (!slidable) {
      return [0];
    }

    const maxLeftIndexInt = length - Math.ceil(itemsShown);

    const indexes = Array.from({ length: maxLeftIndexInt + 1 }, (_, i) => i);

    const fractionnalIndex = itemsShown % 1;
    if (fractionnalIndex !== 0) {
      indexes.push(maxLeftIndexInt + fractionnalIndex);
    }

    return indexes;
  }, [itemsShown, length, slidable]);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(0); // NOTE: Used only by the fixed index indicator

  // - Style functions
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

  const setSnapState = useCallback((type: "mandatory" | "none") => {
    if (!slider.current) {
      throw new Error("[setSnapBehavior] slider.current is null");
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

  const getElementWidth = useCallback(() => {
    return getContainerWidth() / itemsShown;
  }, [getContainerWidth, itemsShown]);

  const scrollLeftToIndex = useCallback(
    (index: number) => {
      if (!slider.current) {
        throw new Error("[scrollToIndex] slider.current is null");
      }

      if (!indexes.includes(index)) {
        throw new Error(`[scrollLeftToIndex] Unexpected index value: ${index}`);
      }

      slider.current.scrollLeft = index * getElementWidth();
    },
    [getElementWidth, indexes]
  );

  const computeLeftClosestIndex = useCallback(() => {
    if (!slider.current) {
      throw new Error("[computeClosestIndex] slider.current is null");
    }

    const decimalIndex = slider.current.scrollLeft / getElementWidth();

    return indexes.reduce(
      (prev, curr) =>
        Math.abs(curr - decimalIndex) < Math.abs(prev - decimalIndex)
          ? curr
          : prev,
      Infinity
    );
  }, [getElementWidth, indexes]);

  // - Reset the index when the items changes
  useEffect(() => {
    setScrollBehavior("auto");
    scrollLeftToIndex(0);
    setCurrentActiveIndex(0);
    setScrollBehavior("smooth");
  }, [items, scrollLeftToIndex, setScrollBehavior]);

  // - Event listeners
  useEffect(() => {
    // Does not allow sliding if there is only one item
    if (!slidable) {
      setCursor("auto");
      return;
    }

    // DOM not ready
    if (!slider.current) {
      return;
    }

    const sliderRef = slider.current;

    setCursor("grab");
    setScrollBehavior("smooth");
    setSnapState("mandatory");

    // Handle when the user just clicked on the slider
    const onMouseDown = (e: MouseEvent) => {
      if (!slider.current) {
        throw new Error("[onMouseDown] slider.current is null");
      }

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
      if (!slider.current) {
        throw new Error("[onMouseEnd] slider.current is null");
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
      const closestLeftIndex = computeLeftClosestIndex();
      scrollLeftToIndex(closestLeftIndex);
    };

    // Scroll according the user's dragging movement
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown.current) {
        return;
      }

      if (startX.current === null || scrollLeft.current === null) {
        throw new Error("[onMouseMove] startX or scrollLeft is null");
      }

      e.preventDefault(); // Prevents native dragging

      const scrollMultiplier = showOneItem ? ONE_ITEM_DRAG_MULTIPLIER : 1;
      const x = e.pageX - sliderRef.offsetLeft;
      const walk = x - startX.current;
      sliderRef.scrollLeft = scrollLeft.current - walk * scrollMultiplier;
    };

    // Update the index when the user scrolls with "standard" scrolling
    const onScroll = () => {
      const closestLeftIndex = computeLeftClosestIndex();
      setCurrentActiveIndex(closestLeftIndex);
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
    computeLeftClosestIndex,
    scrollLeftToIndex,
    setCursor,
    setScrollBehavior,
    setSnapState,
    showOneItem,
    slidable,
  ]);

  const scrollOffsetIndex = (offset: number) => {
    if (!slider.current) {
      throw new Error("[scrollOffsetIndex] slider.current is null");
    }

    const currentIndex = computeLeftClosestIndex();

    scrollLeftToIndex(currentIndex + offset);
  };

  const prevImage = () => {
    scrollOffsetIndex(-1);
  };

  const nextImage = () => {
    scrollOffsetIndex(1);
  };

  const handleOnGalleryItemClicked = (_item: Item, index: number) => {
    closeGallery();
    scrollLeftToIndex(index);
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
          const Item = renderItem(item, index, currentActiveIndex);
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
              <IndexIndicator
                currentIndex={currentActiveIndex}
                length={length}
              />
            </div>
          )}

          <NextPrevButtons
            currentIndex={currentActiveIndex}
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
