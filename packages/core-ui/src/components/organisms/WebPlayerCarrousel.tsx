import { useCallback, useEffect, useRef, useState, useMemo } from "react";

import { RESIZE_TRANSITION_DURATION } from "../../const/browser";
import { useIntegration } from "../../hooks/useIntegration";
import { useCompositionContext } from "../../providers/CompositionContext";
import { useControlsContext } from "../../providers/ControlsContext";
import { useGlobalContext } from "../../providers/GlobalContext";
import { easeOut } from "../../utils/animation";
import { clamp, lerp } from "../../utils/math";
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
  const {
    infiniteCarrousel,
    preloadRange,
    isFullScreen,
    maxItemsShown,
    integration,
  } = useGlobalContext();
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

  // Memoized effective max items shown calculation
  const { effectiveMaxItemsShown } = useIntegration();

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
    // const containerWidth = slider.clientWidth;
    // const itemWidth = containerWidth / maxItemsShown;

    // For multiple items shown, find the leftmost visible item
    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, childIndex) => {
      const childScroll = child.offsetLeft;
      const distance = Math.abs(childScroll - currentScroll);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = childIndex;
      }
    });

    // Ensure we don't go beyond the valid range when showing multiple items
    if (effectiveMaxItemsShown > 1) {
      const visibleItemsCount = Math.ceil(effectiveMaxItemsShown);
      // Account for the extra empty slide when maxItemsShown has fractional part and infinite carousel is disabled
      const totalSlides =
        items.length +
        (integration && !infiniteCarrousel && effectiveMaxItemsShown % 1 !== 0
          ? 1
          : 0);
      const maxValidIndex = Math.max(0, totalSlides - visibleItemsCount);
      closestIndex = Math.min(closestIndex, maxValidIndex);

      // In integration mode, when we're at the end position that shows the empty slide,
      // ensure carrouselItemIndex points to the last actual content item for proper display
      if (
        integration &&
        !infiniteCarrousel &&
        effectiveMaxItemsShown % 1 !== 0
      ) {
        const maxContentIndex = items.length - 1;
        closestIndex = Math.min(closestIndex, maxContentIndex);
      }
    }

    return closestIndex;
  }, [
    getSliderOrThrow,
    effectiveMaxItemsShown,
    items.length,
    infiniteCarrousel,
    integration,
  ]);

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

      // Calculate target scroll position considering maxItemsShown
      let targetScroll = children[index].offsetLeft;

      // For the last few items, adjust scroll to ensure they're fully visible
      const containerWidth = slider.clientWidth;
      const maxScroll = slider.scrollWidth - containerWidth;

      // If we're near the end and showing multiple items, limit the scroll
      if (effectiveMaxItemsShown > 1) {
        const visibleItemsCount = Math.ceil(effectiveMaxItemsShown);
        // Account for the extra empty slide when maxItemsShown has fractional part and infinite carousel is disabled
        const totalSlides =
          items.length +
          (integration && !infiniteCarrousel && effectiveMaxItemsShown % 1 !== 0
            ? 1
            : 0);
        if (index >= totalSlides - visibleItemsCount) {
          targetScroll = Math.min(targetScroll, maxScroll);
        }
      }

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
    [
      cancelScrollAnimation,
      getSliderOrThrow,
      setStyleSnapState,
      effectiveMaxItemsShown,
      items.length,
      infiniteCarrousel,
      integration,
    ]
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
    computeClosestIndex,
    scrollToIndex,
    specialCommand,
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

        let scrollLeft = startScrollLeft.current - walk;

        // Block dragging to the right when there are no more slides
        if (!infiniteCarrousel) {
          const maxScroll = slider.scrollWidth - slider.clientWidth;

          // If we're trying to drag beyond the right edge (past the last slide)
          if (scrollLeft > maxScroll) {
            scrollLeft = maxScroll;
          }
        }

        slider.scrollLeft = scrollLeft;
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
    infiniteCarrousel,
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
    isResizing,
    itemIndexCommand,
    maxItemsShown,
    setCarrouselItemIndex,
    setItemIndexCommand,
  ]);

  // Listen to ControlsContext's command to scroll to a specific index
  useEffect(() => {
    if (itemIndexCommand === null) {
      return;
    }

    const cb = () => {
      // NOTE: timeout to avoid race condition (because we cannot really know when the instant scroll is done)
      setTimeout(() => {
        setItemIndexCommand(null);
        finishSpecialCommand();
      }, 75);
    };

    switch (specialCommand) {
      case "first_to_last": {
        // Move to the last valid position considering maxItemsShown
        const visibleItemsCount = Math.ceil(effectiveMaxItemsShown);
        // Account for the extra empty slide when maxItemsShown has fractional part and infinite carousel is disabled
        const totalSlides =
          items.length +
          (integration && !infiniteCarrousel && effectiveMaxItemsShown % 1 !== 0
            ? 1
            : 0);
        const lastValidIndex =
          effectiveMaxItemsShown > 1
            ? Math.max(0, totalSlides - visibleItemsCount)
            : items.length - 1;
        scrollToIndex(lastValidIndex, "instant", cb);
        break;
      }
      case "last_to_first":
        // Move to the first item instantly
        scrollToIndex(0, "instant", cb);
        break;
      case "instant":
        scrollToIndex(itemIndexCommand, "instant", cb);
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
    setItemIndexCommand,
    effectiveMaxItemsShown,
    infiniteCarrousel,
    integration,
  ]);

  const containerStyles = useMemo(() => {
    if (!integration || isFullScreen) {
      return aspectRatioStyle;
    }
    return { aspectRatio: "auto" };
  }, [integration, isFullScreen, aspectRatioStyle]);

  const carouselItemStyles = useMemo(
    () => ({
      ...aspectRatioStyle,
      minWidth: `${100 / effectiveMaxItemsShown}%`,
      width: `${100 / effectiveMaxItemsShown}%`,
      flexShrink: 0,
    }),
    [aspectRatioStyle, effectiveMaxItemsShown]
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-carrousel transition-radius",
        className
      )}
      style={containerStyles}
    >
      <div
        ref={sliderRef}
        className={`flex size-full ${slidable ? "overflow-x-auto no-scrollbar *:snap-start *:snap-always" : "justify-center"}`}
      >
        {items.map((item, index) => {
          const isShown = index === carrouselItemIndex;
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          const transformStyle: React.CSSProperties | undefined = (() => {
            const visibleItemsCount = Math.ceil(effectiveMaxItemsShown);
            if (specialCommand === "first_to_last" && isFirst) {
              return {
                transform: `translateX(${(100 * items.length) / visibleItemsCount}%)`,
              };
            } else if (specialCommand === "last_to_first" && isLast) {
              return {
                transform: `translateX(-${(100 * items.length) / visibleItemsCount}%)`,
              };
            }
          })();

          // - "inDisplayRange" avoids loading medias that are too far from the current one
          const visibleItemsCount = Math.ceil(effectiveMaxItemsShown); // Number of items that are visible (including partial)
          const expandedPreloadRange = Math.max(
            preloadRange,
            visibleItemsCount
          );

          let inDisplayRange =
            Math.abs(index - carrouselItemIndex) <= expandedPreloadRange; // Consider medias in the expanded preload range
          inDisplayRange ||= index === itemIndexCommand; // Consider the target media

          // Also consider items currently visible in the viewport
          inDisplayRange ||=
            index >= carrouselItemIndex &&
            index < carrouselItemIndex + visibleItemsCount;

          if (infiniteCarrousel) {
            // If we are at the start, consider medias at the end
            inDisplayRange ||=
              carrouselItemIndex < expandedPreloadRange &&
              items.length - index <= expandedPreloadRange - carrouselItemIndex;

            // If we are at the end, consider medias at the start
            inDisplayRange ||=
              carrouselItemIndex >= items.length - expandedPreloadRange &&
              index <=
                expandedPreloadRange - (items.length - carrouselItemIndex);
          }

          const key = (() => {
            let imgSrc: string;
            switch (item.type) {
              case "360":
                imgSrc = item.images[0].src;
                break;
              case "interior-360":
                imgSrc = item.poster ?? "interior-360";
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
              default:
                imgSrc = "unknown";
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
              style={{ ...carouselItemStyles, ...transformStyle }}
            >
              {inDisplayRange && (
                <WebPlayerElement index={index} item={item} isShown={isShown} />
              )}
            </div>
          );
        })}
        {/* Empty transparent slide at the end to compensate for partial slides */}
        {integration &&
          !infiniteCarrousel &&
          !isFullScreen &&
          maxItemsShown % 1 !== 0 && (
            <div
              key="empty-slide"
              className="h-full"
              style={carouselItemStyles}
            />
          )}
      </div>

      <WebPlayerOverlay />
    </div>
  );
};

export default WebPlayerCarrousel;
