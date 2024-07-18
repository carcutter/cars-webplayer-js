import { useCallback, useEffect, useRef } from "react";

import IndexIndicator from "@/components/atoms/IndexIndicator";
import WebPlayerElement from "@/components/molecules/WebPlayerElement";
import { useControlsContext } from "@/providers/ControlsContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import { positionToClassName } from "@/utils/style";

const ONE_ITEM_DRAG_MULTIPLIER = 1.5;

const WebPlayerCarrousel: React.FC = () => {
  const { aspectRatioClass } = useGlobalContext();
  const {
    displayedItems: items,
    slidable,

    carrouselItemIndex,
    setCarrouselItemIndex,
    itemIndexCommand,
    setItemIndexCommand,
  } = useControlsContext();

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
  const getContainerWidth = useCallback(() => {
    const slider = getSliderOrThrow("getContainerWidth");

    return slider.getBoundingClientRect().width;
  }, [getSliderOrThrow]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const slider = getSliderOrThrow("scrollToSnapIndex");

      requestAnimationFrame(() => {
        slider.scrollLeft = index * getContainerWidth();
      });
    },
    [getContainerWidth, getSliderOrThrow]
  );

  const computeClosestIndex = useCallback(() => {
    const slider = getSliderOrThrow("computeClosestSnapIndex");

    const decimalIndex = slider.scrollLeft / getContainerWidth();

    return Math.round(decimalIndex);
  }, [getContainerWidth, getSliderOrThrow]);

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

  // TODO : Reset the index when the items changes (typically when the user changes the category)
  useEffect(() => {
    setStyleScrollBehavior("auto");
    scrollToIndex(0);
    setStyleScrollBehavior("smooth");
  }, [items, scrollToIndex, setStyleScrollBehavior]);

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
      const closestSnapIndex = computeClosestIndex();
      scrollToIndex(closestSnapIndex);
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

        slider.scrollLeft =
          startScrollLeft.current - walk * ONE_ITEM_DRAG_MULTIPLIER;
      });
    };

    // - Update the carrouselItemIndex when the user moves the carrousel (scrolling/dragging)
    const onScroll = () => {
      const closestIndex = computeClosestIndex();
      setCarrouselItemIndex(closestIndex);

      // Reset the command once it has been executed
      if (closestIndex === itemIndexCommand) {
        setItemIndexCommand(null);
      }
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
    computeClosestIndex,
    itemIndexCommand,
    scrollToIndex,
    setCarrouselItemIndex,
    setItemIndexCommand,
    setStyleCursor,
    setStyleScrollBehavior,
    setStyleSnapState,
    slidable,
  ]);

  // Listen to ControlsContext's command to scroll to a specific index
  useEffect(() => {
    if (itemIndexCommand === null) {
      return;
    }

    scrollToIndex(itemIndexCommand);
  }, [scrollToIndex, itemIndexCommand]);

  return (
    <div className={`relative w-full ${aspectRatioClass}`}>
      <div
        ref={sliderRef}
        className={`flex size-full ${slidable ? "overflow-x-auto transition-transform no-scrollbar *:snap-mandatory *:snap-start" : "justify-center"}`}
      >
        {items.map((item, index) => {
          const imgSrc = item.type === "360" ? item.images[0] : item.src;

          return (
            <WebPlayerElement
              key={`${index}_${imgSrc}`}
              index={index}
              item={item}
              lazy={Math.abs(index - carrouselItemIndex) > 1}
            />
          );
        })}
      </div>

      {slidable && (
        <div className={`absolute ${positionToClassName("top-right")}`}>
          <IndexIndicator
            currentIndex={carrouselItemIndex}
            maxIndex={items.length - 1}
          />
        </div>
      )}
    </div>
  );
};

export default WebPlayerCarrousel;
