import { useCallback, useEffect, useRef, useState } from "react";

import { RESIZE_TRANSITION_DURATION } from "../../const/browser";
import { useCompositionContext } from "../../providers/CompositionContext";
import { useControlsContext } from "../../providers/ControlsContext";
import { useGlobalContext } from "../../providers/GlobalContext";
import { easeOut } from "../../utils/animation";
import { clamp, lerp, modulo } from "../../utils/math";
import { cn } from "../../utils/style";
import WebPlayerElement from "../molecules/WebPlayerElement";
import WebPlayerOverlay from "../molecules/WebPlayerOverlay";

type Props = {
  className?: string;
};

/**
 * ThreeSixtyElement component renders the carrousel of items.
 */
const WebPlayerCarrousel: React.FC<Props> = ({ className = "" }) => {
  const { infiniteCarrousel, preloadRange, isFullScreen } = useGlobalContext();
  const { aspectRatioStyle } = useCompositionContext();

  const {
    items,

    slidable,

    carrouselItemIndex,
    setCarrouselItemIndex,
    itemIndexCommand,
    setItemIndexCommand,
    specialCommand,
    isRunningSpecialCommand,
    finishSpecialCommand,

    extendMode,
    extendTransition,
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

  // - value refs (NOTE: could be directly within the useEffect)
  const mouseIsDown = useRef(false);
  const startX = useRef<number | null>(null);
  const startScrollLeft = useRef<number | null>(null);

  // -- Slider's functions -- //
  const scrollAnimationFrame = useRef<number | null>(null);
  const cancelScrollAnimation = useCallback(() => {
    if (!scrollAnimationFrame.current) {
      return;
    }
    cancelAnimationFrame(scrollAnimationFrame.current);
  }, []);

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

    if (specialCommand === "first_to_last") {
      // The very last item is the first one (as we moved it to the end)
      return modulo(closestIndex, items.length);
    } else if (specialCommand === "last_to_first") {
      // The very first item is the last one (as we moved it to the start). It shifts the index by 1
      return modulo(closestIndex - 1, items.length);
    } else {
      return closestIndex;
    }
  }, [specialCommand, getSliderOrThrow, items.length]);

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
    (
      index: number,
      behavior: "instant" | "smooth",
      callback?: () => unknown
    ) => {
      cancelScrollAnimation();

      const slider = getSliderOrThrow("scrollToIndex");
      const children = Array.from(slider.children) as HTMLElement[];

      const startScroll = slider.scrollLeft;
      const targetScroll = children[index].offsetLeft;

      const setScrollInstant = (scroll: number) => {
        slider.scrollTo({
          left: scroll,
          behavior: "instant",
        });
      };

      const finishAnimation = () => {
        setScrollInstant(targetScroll);
        setStyleSnapState("mandatory");

        callback?.();
      };

      const distance = Math.abs(startScroll - targetScroll);

      if (distance < 1 || behavior === "instant") {
        finishAnimation();

        return;
      }

      // - Animation

      const animationDuration = clamp(distance / 2.5, 300, 1000);

      const startTime = new Date().getTime();

      setStyleSnapState("none");

      const animate = () => {
        const animateStep = () => {
          const currentTime = new Date().getTime();
          const timeElapsed = currentTime - startTime;

          if (timeElapsed >= animationDuration) {
            finishAnimation();
            return;
          }

          const progress = Math.min(timeElapsed / animationDuration, 1);
          const easedProgress = easeOut(progress);

          const currentScroll = lerp(startScroll, targetScroll, easedProgress);

          setScrollInstant(currentScroll);

          animate();
        };

        scrollAnimationFrame.current = requestAnimationFrame(animateStep);
      };

      animate();
    },
    [cancelScrollAnimation, getSliderOrThrow, setStyleSnapState]
  );

  // - Listen to resizing to avoid layer shift
  const [resizeTransitionTimeout, setResizeTransitionTimeout] =
    useState<NodeJS.Timeout>();
  const isResizing = !!resizeTransitionTimeout;

  useEffect(() => {
    const onResize = () => {
      clearTimeout(resizeTransitionTimeout);

      // Block carrousel for a short time to avoid layer shift
      const timeout = setTimeout(() => {
        setResizeTransitionTimeout(undefined);
      }, RESIZE_TRANSITION_DURATION);
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
    if (specialCommand) {
      return;
    }

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
    specialCommand,
    computeClosestIndex,
    scrollToIndex,
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
    if (!slidable || isRunningSpecialCommand) {
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

      // Cancel any ongoing scroll animation
      cancelScrollAnimation();

      // Take snapshot of the current state
      mouseIsDown.current = true;
      startX.current = e.pageX - slider.offsetLeft;
      startScrollLeft.current = slider.scrollLeft;

      // Change cursor
      setStyleCursor("grabbing");
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

      // Disable snap scrolling to allow free dragging
      setStyleSnapState("none");

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

      // Snap scrolling (NOTE: it will reset the snap behavior to mandatory once the animation is done)
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
    cancelScrollAnimation,
    computeClosestIndex,
    isRunningSpecialCommand,
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
    isRunningSpecialCommand,
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

    const cb = () => finishSpecialCommand();

    switch (specialCommand) {
      case "first_to_last":
        // Go to the "moved" first item instantly
        scrollToIndex(items.length, "instant");
        // Move to the last item
        scrollToIndex(items.length - 1, "smooth", cb);
        break;

      case "last_to_first":
        // Go to the "moved" last item instantly
        scrollToIndex(0, "instant");

        // Move to the first item (it shifted by 1 due to the "moved" last item)
        scrollToIndex(1, "smooth", cb);
        break;
      case "instant":
        scrollToIndex(itemIndexCommand, "instant", () => {
          // NOTE: timeout to avoid race condition (because we cannot really know when the instant scroll is done)
          setTimeout(() => {
            cb();
          }, 100);
        });
        break;
      default:
        scrollToIndex(itemIndexCommand, "smooth");
        break;
    }
  }, [
    specialCommand,
    finishSpecialCommand,
    itemIndexCommand,
    items.length,
    scrollToIndex,
  ]);

  const CyclePlaceholder = () => (
    <div className="h-full" style={aspectRatioStyle} />
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-carrousel transition-radius",
        className
      )}
      style={aspectRatioStyle}
    >
      <div
        ref={sliderRef}
        className={`flex size-full ${slidable ? "overflow-x-auto no-scrollbar *:snap-start *:snap-always" : "justify-center"}`}
      >
        {/* Empty element to allow cycling */}
        {specialCommand === "last_to_first" && <CyclePlaceholder />}

        {items.map((item, index) => {
          const isShown = index === carrouselItemIndex;
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          const transformStyle = (() => {
            if (specialCommand === "first_to_last" && isFirst) {
              return {
                transform: `translateX(${100 * items.length}%)`,
              };
            } else if (specialCommand === "last_to_first" && isLast) {
              return {
                transform: `translateX(-${100 * items.length}%)`,
              };
            }
          })();

          // - "inDisplayRange" avoids loading medias that are too far from the current one
          let inDisplayRange =
            Math.abs(index - carrouselItemIndex) <= preloadRange; // Consider medias in the preload range
          inDisplayRange ||= index === itemIndexCommand; // Consider the target media

          if (infiniteCarrousel) {
            // If we are at the start, consider medias at the end
            inDisplayRange ||=
              carrouselItemIndex < preloadRange &&
              items.length - index <= preloadRange - carrouselItemIndex;

            // If we are at the end, consider medias at the start
            inDisplayRange ||=
              carrouselItemIndex >= items.length - preloadRange &&
              index <= preloadRange - (items.length - carrouselItemIndex);
          }

          const key = (() => {
            let imgSrc: string;
            switch (item.type) {
              case "360":
                imgSrc = item.images[0].src;
                break;
              case "image":
                imgSrc = item.src;
                break;
              case "video":
                imgSrc = item.poster ?? "video";
                break;
              case "custom":
                imgSrc = "custom";
                break;
            }

            return `${index}_${imgSrc}`;
          })();

          return (
            <div
              key={key}
              className={cn(
                "h-full bg-foreground/35",
                carrouselItemIndex === index && "z-1" // Give high-ground to the shown item (to avoid 1px vertical line)
              )}
              style={{ ...aspectRatioStyle, ...transformStyle }}
            >
              {inDisplayRange && (
                <WebPlayerElement index={index} item={item} isShown={isShown} />
              )}
            </div>
          );
        })}

        {/*Empty element to allow cycling */}
        {specialCommand === "first_to_last" && <CyclePlaceholder />}
      </div>

      <WebPlayerOverlay />
    </div>
  );
};

export default WebPlayerCarrousel;
