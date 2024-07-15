import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import IndexIndicator from "@/components/atoms/IndexIndicator";
import NextPrevButtons from "@/components/molecules/NextPrevButtons";
import WebPlayerElement from "@/components/molecules/WebPlayerElement";
import { useGlobalContext } from "@/providers/GlobalContext";
import type { Item } from "@/types/composition";
import { aspectRatioStyle, positionToClassName } from "@/utils/style";

import Gallery from "./Gallery";

type Props = {
  items: Item[];
};

const ONE_ITEM_DRAG_MULTIPLIER = 1.5;

const WebPlayerCarrousel: React.FC<Props> = ({ items }) => {
  const { aspectRatio, itemsShown, showGallery } = useGlobalContext();
  const showOneItem = itemsShown === 1;

  // -- Refs -- //
  // - element refs
  const sliderRef = useRef<HTMLDivElement>(null);
  const getSliderOrThrow = useCallback((origin?: string) => {
    if (!sliderRef.current) {
      throw new Error(`[${origin ?? "sliderOrThrow"}] slider.current is null`);
    }

    return sliderRef.current;
  }, []);

  // - value refs
  const isDown = useRef(false);
  const startX = useRef<number | null>(null);
  const startScrollLeft = useRef<number | null>(null);

  // -- Snapping -- //
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
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0); // NOTE: Used by the fixed index indicator & gallery

  const getContainerWidth = useCallback(() => {
    const slider = getSliderOrThrow("getContainerWidth");

    return slider.getBoundingClientRect().width;
  }, [getSliderOrThrow]);

  const getElementWidth = useCallback(
    () => getContainerWidth() / itemsShown,
    [getContainerWidth, itemsShown]
  );

  const scrollToSnapIndex = useCallback(
    (index: number) => {
      const slider = getSliderOrThrow("scrollToSnapIndex");

      if (!snapIndexes.includes(index)) {
        throw new Error(`[scrollToSnapIndex] Unexpected index value: ${index}`);
      }

      requestAnimationFrame(() => {
        slider.scrollLeft = index * getElementWidth();
      });
    },
    [getElementWidth, getSliderOrThrow, snapIndexes]
  );

  const computeClosestSnapIndex = useCallback(() => {
    const slider = getSliderOrThrow("computeClosestSnapIndex");

    const decimalIndex = slider.scrollLeft / getElementWidth();

    return snapIndexes.reduce(
      (prevClosest, curr) =>
        Math.abs(curr - decimalIndex) < Math.abs(prevClosest - decimalIndex)
          ? curr
          : prevClosest,
      Infinity
    );
  }, [getElementWidth, getSliderOrThrow, snapIndexes]);

  const scrollOffsetIndex = useCallback(
    (offsetIndex: number) => {
      const currentSnapIndex = computeClosestSnapIndex();
      const newLeftIndex =
        snapIndexes[snapIndexes.indexOf(currentSnapIndex) + offsetIndex];

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

  // -- Update Style functions -- //
  const setStyleCursor = useCallback(
    (cursor: "auto" | "grab" | "grabbing") => {
      const slider = getSliderOrThrow("setStyleCursor");

      slider.style.cursor = cursor;
    },
    [getSliderOrThrow]
  );

  const setStyleScrollBehavior = useCallback(
    (behavior: "auto" | "smooth") => {
      const slider = getSliderOrThrow("setStyleScrollBehavior");

      slider.style.scrollBehavior = behavior;
    },
    [getSliderOrThrow]
  );

  const setStyleSnapState = useCallback(
    (type: "mandatory" | "none") => {
      const slider = getSliderOrThrow("setStyleSnapState");

      if (type === "mandatory") {
        slider.style.scrollSnapType = "x mandatory";
      } else {
        slider.style.scrollSnapType = "none";
      }
    },
    [getSliderOrThrow]
  );

  // - Reset the index when the items changes (typically when the user changes the category)
  useEffect(() => {
    setStyleScrollBehavior("auto");
    scrollToSnapIndex(0);
    setCurrentSnapIndex(0);
    setStyleScrollBehavior("smooth");
  }, [items, scrollToSnapIndex, setStyleScrollBehavior]);

  // -- Event listeners to handle the slider -- //
  useEffect(() => {
    // Sliding is disabled when there is only one item
    if (!slidable) {
      setStyleCursor("auto");
      return;
    }

    const slider = sliderRef.current;

    // DOM not ready yet
    if (!slider) {
      return;
    }

    setStyleCursor("grab");
    setStyleScrollBehavior("smooth");
    setStyleSnapState("mandatory");

    // - Handle when the user just clicked on the slider to start dragging
    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault(); // Prevents native image dragging

      // Take snapshot of the current state
      // NOTE: Since we are using scroll-smooth, the scrollLeft may not be correct as the animation is still running
      //       It's the reason why it can feel buggy when the user spams the click
      isDown.current = true;
      startX.current = e.pageX - slider.offsetLeft;
      startScrollLeft.current = slider.scrollLeft;

      // Set CSS
      setStyleCursor("grabbing");
      setStyleScrollBehavior("auto");
      setStyleSnapState("none");
    };

    // - Handle when the user releases the slider or leaves the dragging area
    const onMouseEnd = () => {
      // Check if the user was actually dragging
      if (!isDown.current) {
        return;
      }

      isDown.current = false;

      // Reset CSS
      setStyleCursor("grab");
      setStyleScrollBehavior("smooth");
      setTimeout(() => {
        // setTimeout to avoid flickering, but we have to handle the case where the user clicks again on the slider
        if (isDown.current) {
          return;
        }
        setStyleSnapState("mandatory");
      }, 500);

      // Snap scrolling
      const closestSnapIndex = computeClosestSnapIndex();
      scrollToSnapIndex(closestSnapIndex);
    };

    // Scroll according the user's dragging movement
    const onMouseMove = (e: MouseEvent) => {
      // Check if the user is actually dragging
      if (!isDown.current) {
        return;
      }

      if (startX.current === null) {
        throw new Error("[onMouseMove] startX is null");
      }

      const x = e.pageX - slider.offsetLeft;
      const walk = x - startX.current;

      requestAnimationFrame(() => {
        if (startScrollLeft.current === null) {
          throw new Error("[onMouseMove] scrollLeft is null");
        }

        const scrollMultiplier = showOneItem ? ONE_ITEM_DRAG_MULTIPLIER : 1;

        slider.scrollLeft = startScrollLeft.current - walk * scrollMultiplier;
      });
    };

    // - Update the index when the user uses scrolling (and not dragging)
    const onScroll = () => {
      const closestSnapIndex = computeClosestSnapIndex();
      setCurrentSnapIndex(closestSnapIndex);
    };

    slider.addEventListener("mousedown", onMouseDown);
    slider.addEventListener("mouseleave", onMouseEnd);
    slider.addEventListener("mouseup", onMouseEnd);
    slider.addEventListener("mousemove", onMouseMove);
    slider.addEventListener("scroll", onScroll);

    return () => {
      slider.removeEventListener("mousedown", onMouseDown);
      slider.removeEventListener("mouseleave", onMouseEnd);
      slider.removeEventListener("mouseup", onMouseEnd);
      slider.removeEventListener("mousemove", onMouseMove);
      slider.removeEventListener("scroll", onScroll);
    };
  }, [
    computeClosestSnapIndex,
    scrollToSnapIndex,
    setStyleCursor,
    setStyleScrollBehavior,
    setStyleSnapState,
    showOneItem,
    slidable,
  ]);

  // - Misc

  const handleOnGalleryItemClicked = (_item: Item, index: number) => {
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
        ref={sliderRef}
        className={`flex size-full ${slidable ? "overflow-x-auto transition-transform no-scrollbar *:snap-mandatory *:snap-start" : "justify-center"}`}
      >
        {items.map((item, index) => {
          const key = item.type === "360" ? item.images[0] : item.src;

          return (
            <div key={key} className="relative">
              <WebPlayerElement
                item={item}
                lazy={
                  Math.abs(index - currentSnapIndex) > Math.ceil(itemsShown)
                }
              />
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
        <Gallery
          items={items}
          currentIndex={currentSnapIndex}
          onItemClicked={handleOnGalleryItemClicked}
        />
      )}
    </div>
  );
};

export default WebPlayerCarrousel;
