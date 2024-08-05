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
    isCycling,
    finishCycling,

    extendMode,
    extendTransition,

    isZooming,

    freezeCarrousel,
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
  const mouseIsDown = useRef(false);
  const startX = useRef<number | null>(null);
  const startScrollLeft = useRef<number | null>(null);

  // -- Slider's functions -- //
  const computeClosestIndex = useCallback(() => {
    const slider = getSliderOrThrow("computeClosestSnapIndex");
    const children = Array.from(slider.children) as HTMLElement[];

    const currentScroll = slider.scrollLeft;

    const closestIndex = children.reduce(
      (currentClosestIndex, child, childIndex) => {
        const childScroll = child.offsetLeft;

        if (
          Math.abs(childScroll - currentScroll) <
          Math.abs(children[currentClosestIndex].offsetLeft - currentScroll)
        ) {
          return childIndex;
        }

        return currentClosestIndex;
      },
      0
    );

    return closestIndex % items.length; // Cycle the index
  }, [getSliderOrThrow, items.length]);

  const setStyleCursor = useCallback(
    (cursor: "auto" | "grab" | "grabbing") => {
      const slider = getSliderOrThrow("setStyleCursor");

      slider.style.cursor = cursor;
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
    (index: number, behavior: "instant" | "smooth") => {
      const scroll = () => {
        const slider = getSliderOrThrow("scrollToSnapIndex");
        const children = Array.from(slider.children) as HTMLElement[];

        const targetScroll = children[index].offsetLeft;

        slider.scrollTo({
          left: targetScroll,
          behavior,
        });
      };

      if (behavior === "instant") {
        scroll();
      } else {
        requestAnimationFrame(scroll);
      }
    },
    [getSliderOrThrow]
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

    scrollToIndex(carrouselItemIndex, "instant");
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
    // Sliding is disabled
    if (!slidable || freezeCarrousel || isCycling) {
      setStyleCursor("auto");
      return;
    }

    const slider = sliderRef.current;

    // DOM not ready yet
    if (!slider) {
      return;
    }

    setStyleCursor("grab");
    setStyleSnapState("mandatory");

    // - Handle when the user just clicked on the slider to start dragging
    const onMouseDown = (e: MouseEvent) => {
      // Ignore event if the user is not using left click
      if (e.button !== 0) {
        return;
      }

      e.preventDefault(); // Prevents native image dragging
      e.stopPropagation(); // Prevents overlay click when ending drag outside the carrousel

      // Take snapshot of the current state
      // NOTE: Since we are using scroll-smooth, the scrollLeft may not be correct as the animation is still running
      //       It's the reason why it can feel buggy when the user spams the click
      mouseIsDown.current = true;
      startX.current = e.pageX - slider.offsetLeft;
      startScrollLeft.current = slider.scrollLeft;

      // Set cursor
      setStyleCursor("grabbing");
      // Disable snap scrolling
      setStyleSnapState("none");
    };

    // Scroll according the user's dragging movement
    const onMouseMove = (e: MouseEvent) => {
      // Check if the user is actually dragging
      if (!mouseIsDown.current) {
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

    // - Handle when the user releases the slider
    const onStopDragging = () => {
      // Check if the user was actually clicking
      if (!mouseIsDown.current) {
        return;
      }

      mouseIsDown.current = false;

      // Reset cursor
      setStyleCursor("grab");
      // Reset snap scrolling.
      // NOTE: we are using setTimeout to avoid flickering because snap "mandatory" sets instantly the scroll position
      //       If we could get ride of the flickering, we could remove the setTimeout
      setTimeout(() => {
        //  but we have to handle the case where the user clicks again on the slider
        if (mouseIsDown.current) {
          return;
        }
        setStyleSnapState("mandatory");
      }, 400);

      // Snap scrolling
      const closestSnapIndex = computeClosestIndex();
      scrollToIndex(closestSnapIndex, "smooth");
    };

    slider.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onStopDragging);
    document.addEventListener("mouseup", onStopDragging);
    document.addEventListener("contextmenu", onStopDragging);

    return () => {
      slider.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onStopDragging);
      document.removeEventListener("mouseup", onStopDragging);
      document.removeEventListener("contextmenu", onStopDragging);
    };
  }, [
    computeClosestIndex,
    freezeCarrousel,
    isCycling,
    scrollToIndex,
    setStyleCursor,
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
    isCycling,
    isResizing,
    itemIndexCommand,
    items.length,
    setCarrouselItemIndex,
    setItemIndexCommand,
  ]);

  // Listen to ControlsContext's command to scroll to a specific index
  useEffect(() => {
    if (itemIndexCommand === null) {
      return;
    }

    if (isCycling) {
      // Should go from first item to last item
      if (itemIndexCommand === items.length - 1) {
        // Instantly go to the duplicate of the first item
        scrollToIndex(items.length, "instant");
        scrollToIndex(itemIndexCommand, "smooth");
        setTimeout(() => {
          finishCycling();
        }, 700);
      } else {
        // Smoothly go to the duplicate of the first item
        scrollToIndex(items.length, "smooth");
        setTimeout(() => {
          // Instantly go back to the real first item
          scrollToIndex(itemIndexCommand, "instant");
          finishCycling();
        }, 700);
      }
    }
    // Standard case
    else {
      scrollToIndex(itemIndexCommand, "smooth");
    }
  }, [finishCycling, isCycling, itemIndexCommand, items.length, scrollToIndex]);

  return (
    <div className={`relative ${aspectRatioClass} ${className}`}>
      <div
        ref={sliderRef}
        className={`flex size-full ${slidable ? "overflow-x-auto no-scrollbar *:snap-start *:snap-always" : "justify-center"} ${freezeCarrousel ? "!overflow-hidden" : ""}`}
      >
        {items.map((item, index) => {
          const imgSrc = item.type === "360" ? item.images[0] : item.src;

          const isShown = index === carrouselItemIndex;
          // Lazy param avoids loading images that are too far from the current one
          const lazy =
            Math.abs(index - carrouselItemIndex) > 1 && // Not next to the current one
            !(carrouselItemIndex === 0 && index === items.length - 1) && // Not the last one when the first one is shown
            !(carrouselItemIndex === items.length - 1 && index === 0); // Not the first one when the last one is shown

          return (
            <WebPlayerElement
              key={`${index}_${imgSrc}`}
              index={index}
              item={item}
              isShown={isShown}
              lazy={lazy}
            />
          );
        })}

        {isCycling && (
          // Duplicate the first element to allow cycling
          <WebPlayerElement
            index={0}
            item={items[0]}
            isShown={carrouselItemIndex === 0}
            lazy={false}
          />
        )}
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
