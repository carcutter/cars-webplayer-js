import { useCallback, useEffect, useRef, useState } from "react";

import IndexIndicator from "@/components/atoms/IndexIndicator";
import WebPlayerElement from "@/components/molecules/WebPlayerElement";
import WebPlayerOverlay from "@/components/molecules/WebPlayerOverlay";
import { useCompositionContext } from "@/providers/CompositionContext";
import { useControlsContext } from "@/providers/ControlsContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import { positionToClassName } from "@/utils/style";

type Props = {
  className?: string;
};

const WebPlayerCarrousel: React.FC<Props> = ({ className = "" }) => {
  const { isFullScreen } = useGlobalContext();
  const { aspectRatioClass } = useCompositionContext();

  const {
    displayedItems: items,
    slidable,

    carrouselItemIndex,
    setCarrouselItemIndex,
    itemIndexCommand,
    setItemIndexCommand,

    extendMode,
    extendTransition,

    isZooming,
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

  // -- Slider's functions -- //
  const getContainerWidth = useCallback(() => {
    const slider = getSliderOrThrow("getContainerWidth");

    return slider.getBoundingClientRect().width;
  }, [getSliderOrThrow]);

  const computeClosestIndex = useCallback(() => {
    const slider = getSliderOrThrow("computeClosestSnapIndex");

    const decimalIndex = slider.scrollLeft / getContainerWidth();

    return Math.round(decimalIndex);
  }, [getContainerWidth, getSliderOrThrow]);

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

  const scrollToIndex = useCallback(
    (index: number, instant?: boolean) => {
      const scroll = () => {
        const slider = getSliderOrThrow("scrollToSnapIndex");
        slider.scrollLeft = index * getContainerWidth();
      };

      if (!instant) {
        requestAnimationFrame(scroll);
      } else {
        setStyleScrollBehavior("auto");
        scroll(); // NOTE: We do not use requestAnimationFrame which would happen after the scroll behavior reseted to smooth
        setStyleScrollBehavior("smooth");
      }
    },
    [getContainerWidth, getSliderOrThrow, setStyleScrollBehavior]
  );

  // - Listen to resizing to avoid layer shift
  const [resizeTransitionTimeout, setResizeTransitionTimeout] =
    useState<NodeJS.Timeout>();
  const isResizing = !!resizeTransitionTimeout;

  useEffect(() => {
    const onResize = () => {
      clearTimeout(resizeTransitionTimeout);
      const timeout = setTimeout(() => {
        setResizeTransitionTimeout(undefined);
      }, 500);
      setResizeTransitionTimeout(timeout);
    };

    addEventListener("resize", onResize);
    document.addEventListener("fullscreenchange", onResize);

    return () => {
      removeEventListener("resize", onResize);
      document.removeEventListener("fullscreenchange", onResize);
    };
  }, [resizeTransitionTimeout]);

  // -- Update the scroll when the layout changes
  // 1) when the user changes the category (need to reset the first index)
  // 2) when the user toggles the extend mode
  useEffect(() => {
    const closestIndex = computeClosestIndex();

    // When changing layout with full-screen for instance, the scroll position can be messed-up
    if (Number.isNaN(closestIndex)) {
      return;
    }

    if (closestIndex === carrouselItemIndex) {
      return;
    }

    scrollToIndex(carrouselItemIndex, true);
  }, [
    carrouselItemIndex,
    scrollToIndex,
    computeClosestIndex,
    // - Run the effect when those values change
    items,
    resizeTransitionTimeout,
    isFullScreen,
    extendMode,
    extendTransition,
  ]);

  // -- Event listeners to handle the slider dragging -- //
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
      e.stopPropagation(); // Prevents overlay click when ending drag outside the carrousel

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

        slider.scrollLeft = startScrollLeft.current - walk;
      });
    };

    slider.addEventListener("mousedown", onMouseDown);
    slider.addEventListener("mouseleave", onMouseEnd);
    slider.addEventListener("mouseup", onMouseEnd);
    slider.addEventListener("mousemove", onMouseMove);

    return () => {
      slider.removeEventListener("mousedown", onMouseDown);
      slider.removeEventListener("mouseleave", onMouseEnd);
      slider.removeEventListener("mouseup", onMouseEnd);
      slider.removeEventListener("mousemove", onMouseMove);
    };
  }, [
    computeClosestIndex,
    scrollToIndex,
    setStyleCursor,
    setStyleScrollBehavior,
    setStyleSnapState,
    slidable,
  ]);

  // -- Event listeners to handle the slider scrolling -- //
  useEffect(() => {
    // Event listener can mess things when toggling full-screen
    if (extendTransition || isResizing) {
      return;
    }

    const slider = sliderRef.current;

    // DOM not ready yet
    if (!slider) {
      return;
    }

    // - Update the carrouselItemIndex when the user moves the carrousel (scrolling/dragging)
    // NOTE: it is also triggered when the layout changes (full-screen/resizing)
    const onScroll = () => {
      const closestIndex = computeClosestIndex();

      // When changing layout with full-screen, the scroll position can be messed-up
      if (Number.isNaN(closestIndex)) {
        return;
      }

      setCarrouselItemIndex(closestIndex);

      // Reset the command once it has been executed
      if (closestIndex === itemIndexCommand) {
        setItemIndexCommand(null);
      }
    };

    slider.addEventListener("scroll", onScroll);

    return () => {
      slider.removeEventListener("scroll", onScroll);
    };
  }, [
    computeClosestIndex,
    extendTransition,
    isResizing,
    itemIndexCommand,
    setCarrouselItemIndex,
    setItemIndexCommand,
  ]);

  // Listen to ControlsContext's command to scroll to a specific index
  useEffect(() => {
    if (itemIndexCommand === null) {
      return;
    }

    scrollToIndex(itemIndexCommand);
  }, [scrollToIndex, itemIndexCommand]);

  return (
    <div className={`relative ${aspectRatioClass} ${className}`}>
      <div
        ref={sliderRef}
        className={`flex size-full ${slidable ? "overflow-x-auto no-scrollbar *:snap-start *:snap-always" : "justify-center"}`}
      >
        {items.map((item, index) => {
          const imgSrc = item.type === "360" ? item.images[0] : item.src;

          return (
            <WebPlayerElement
              key={`${index}_${imgSrc}`}
              index={index}
              item={item}
              currentIndex={carrouselItemIndex}
            />
          );
        })}
      </div>

      {slidable && !isZooming && (
        <div className={`absolute ${positionToClassName("top-right")}`}>
          <IndexIndicator
            currentIndex={carrouselItemIndex}
            maxIndex={items.length - 1}
          />
        </div>
      )}

      <WebPlayerOverlay />
    </div>
  );
};

export default WebPlayerCarrousel;
