import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Fragment as ReactFragment,
} from "react";

import { useCompositionContext } from "../../providers/CompositionContext";
import { useControlsContext } from "../../providers/ControlsContext";
import { useGlobalContext } from "../../providers/GlobalContext";
import { CustomizableItem } from "../../types/customizable_item";
import { clamp } from "../../utils/math";
import { cn } from "../../utils/style";
import GalleryElement from "../molecules/GalleryElement";
import Separator from "../ui/Separator";

type Props = {
  className?: string;
  containerClassName?: string;
};

const Gallery: React.FC<Props> = ({
  className = "",
  containerClassName = "",
}) => {
  const {
    hideCategoriesNav,
    infiniteCarrousel,
    permanentGallery,
    isFullScreen,
    maxItemsShown,
  } = useGlobalContext();

  const { categories, aspectRatioStyle } = useCompositionContext();

  const {
    items,

    extendMode,
    extendTransition,

    masterItemIndex,
    prevItem,
    nextItem,
    scrollToItemIndex,

    resetView,
  } = useControlsContext();

  const separatorIndexes = useMemo(() => {
    if (hideCategoriesNav) {
      return [];
    }

    const indexes = new Array<number>();

    let currentCategory = categories[0];

    const findItemCategory = (item: CustomizableItem) => {
      return categories.find(category =>
        category.items.some(categoryItem => categoryItem === item)
      );
    };

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const itemCategory = findItemCategory(item);

      if (!itemCategory) {
        continue;
      }

      if (itemCategory !== currentCategory) {
        indexes.push(i);
        currentCategory = itemCategory;
      }
    }

    return indexes;
  }, [categories, hideCategoriesNav, items]);

  const sliderRef = useRef<HTMLDivElement>(null);
  const getSliderOrThrow = useCallback(() => {
    if (!sliderRef.current) {
      throw new Error("slider.current is null");
    }

    return sliderRef.current;
  }, []);

  const mouseIsDown = useRef(false);
  const sliderStartSnapshot = useRef<{ x: number; scrollLeft: number } | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);

  const slideToIndex = useCallback(
    (index: number, behavior: "instant" | "smooth") => {
      const slider = getSliderOrThrow();

      // Scroll the gallery to have the target in view
      const containerWidth = slider.clientWidth;
      const itemWidth = slider.scrollWidth / items.length;
      const targetScrollLeft = (index + 1 / 2) * itemWidth - containerWidth / 2;

      const maxScroll = slider.scrollWidth - slider.clientWidth;

      slider.scrollTo({
        left: clamp(targetScrollLeft, 0, maxScroll),
        behavior,
      });
    },
    [items.length, getSliderOrThrow]
  );

  // -- Effects
  // - Event listeners to handle the slider dragging -- //
  useEffect(() => {
    const slider = sliderRef.current;

    // DOM not ready yet
    if (!slider) {
      return;
    }

    // Handle when the user just clicked on the slider
    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault(); // Prevents native text selection (which highlights images)

      // Take snapshot of the starting state
      mouseIsDown.current = true;
      sliderStartSnapshot.current = {
        x: e.pageX - slider.offsetLeft,
        scrollLeft: slider.scrollLeft,
      };
    };

    // Scroll according the user's dragging movement
    const onMouseMove = (e: MouseEvent) => {
      // Check if the user is actually dragging
      if (!mouseIsDown.current) {
        return;
      }

      if (sliderStartSnapshot.current === null) {
        throw new Error("[onMouseMove] scrollStart is null");
      }

      const x = e.pageX - slider.offsetLeft;
      const walk = x - sliderStartSnapshot.current.x;

      // Safeguard to prevent unwanted dragging when the user just clicked
      if (!isDragging && Math.abs(walk) < 5) {
        return;
      }

      const newScrollLeft = sliderStartSnapshot.current.scrollLeft - walk;

      setIsDragging(true);

      requestAnimationFrame(() => {
        slider.scrollLeft = newScrollLeft;
      });
    };

    // Handle when the user releases the slider
    const onStopDragging = () => {
      // Check if the user was actually dragging
      if (!mouseIsDown.current) {
        return;
      }

      mouseIsDown.current = false;

      // As the mouseup event is triggered before the click event, we need to wait a bit before resetting the dragging state
      requestAnimationFrame(() => {
        setIsDragging(false);
      });
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
  }, [isDragging]);

  // Ref to use index within effect without re-rendering
  const lastMasterItemIndexRef = useRef(masterItemIndex);

  // Scroll smoothly in order to always have the target item in the middle
  useEffect(() => {
    const slider = sliderRef.current;

    // DOM not ready yet
    if (!slider) {
      return;
    }

    slideToIndex(masterItemIndex, "smooth");
    lastMasterItemIndexRef.current = masterItemIndex;
  }, [masterItemIndex, slideToIndex]);

  // Scroll instantly to handle layout shift when going to full-screen
  useEffect(() => {
    const slider = sliderRef.current;

    // DOM not ready yet
    if (!slider) {
      return;
    }

    slideToIndex(lastMasterItemIndexRef.current, "instant");
  }, [
    slideToIndex,
    // - Run the effect when those values change
    isFullScreen,
    extendMode,
    extendTransition,
  ]);

  const onItemClicked = (itemIndex: number) => {
    // User is dragging the slider, ignore the click
    if (isDragging) {
      return;
    }

    // Handle infinite carrousel
    if (
      infiniteCarrousel &&
      itemIndex === items.length - 1 &&
      masterItemIndex === 0
    ) {
      prevItem();
    } else if (
      infiniteCarrousel &&
      itemIndex === 0 &&
      masterItemIndex === items.length - 1
    ) {
      nextItem();
    } else {
      if (
        !isFullScreen &&
        maxItemsShown !== 1 &&
        itemIndex === items.length - 1
      ) {
        const visibleItemsCount = Math.ceil(maxItemsShown);
        const totalSlides = items.length + 1; // +1 for compensation slide
        const targetIndex = Math.max(0, totalSlides - visibleItemsCount);
        scrollToItemIndex(targetIndex);
      } else {
        scrollToItemIndex(itemIndex);
      }
    }

    resetView();
  };

  // Function to determine the class for each gallery item when hovering or active
  const getGalleryItemClass = (index: number, masterIndex: number) => {
    if (maxItemsShown !== 1) return "after:opacity-0 hover:after:opacity-70";
    if (index === masterIndex) return "after:opacity-100";
    return "after:opacity-0 hover:after:opacity-70";
  };

  return (
    <div
      ref={sliderRef}
      className={cn(
        "relative w-full overflow-x-auto no-scrollbar",
        isDragging ? "cursor-grab" : "cursor-grabbing",
        className
      )}
    >
      <div
        className={cn(
          "flex h-10 w-fit gap-1 small:h-12 small:gap-2",
          extendMode && "large:h-20 large:gap-4",
          containerClassName
        )}
      >
        {items.map((item, index) => (
          <ReactFragment key={index}>
            {separatorIndexes.includes(index) && (
              <div className="my-2">
                <Separator
                  color={
                    permanentGallery && !isFullScreen ? "neutral" : "background"
                  }
                  orientation="vertical"
                />
              </div>
            )}

            <div
              className={cn(
                "relative h-full overflow-hidden rounded-gallery transition-radius",
                !isDragging && "cursor-pointer",
                "after:absolute after:inset-0 after:rounded-gallery after:border-2 after:border-primary after:transition-all",
                getGalleryItemClass(index, masterItemIndex)
              )}
              style={aspectRatioStyle}
              onClick={() => onItemClicked(index)}
            >
              <GalleryElement item={item} />
            </div>
          </ReactFragment>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
