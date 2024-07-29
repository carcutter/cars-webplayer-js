import { useCallback, useEffect, useRef } from "react";

import GalleryElement from "@/components/molecules/GalleryElement";
import { useCompositionContext } from "@/providers/CompositionContext";
import { useControlsContext } from "@/providers/ControlsContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import type { Item } from "@/types/composition";
import { clamp } from "@/utils/math";

type Props = {
  className?: string;
  containerClassName?: string;
};

const Gallery: React.FC<Props> = ({
  className = "",
  containerClassName = "",
}) => {
  const { isFullScreen } = useGlobalContext();

  const { aspectRatioClass } = useCompositionContext();

  const {
    displayedItems,

    extendMode,
    extendTransition,

    masterItemIndex,
    setItemIndexCommand,
  } = useControlsContext();

  const sliderRef = useRef<HTMLDivElement>(null);
  const getSliderOrThrow = useCallback(() => {
    if (!sliderRef.current) {
      throw new Error("slider.current is null");
    }

    return sliderRef.current;
  }, []);

  const slideToIndex = useCallback(
    (index: number, behavior: "instant" | "smooth") => {
      const slider = getSliderOrThrow();

      // Scroll the gallery to have the target in view
      const containerWidth = slider.clientWidth;
      const itemWidth = slider.scrollWidth / displayedItems.length;
      const targetScrollLeft = (index + 1 / 2) * itemWidth - containerWidth / 2;

      const maxScroll = slider.scrollWidth - slider.clientWidth;

      slider.scrollTo({
        left: clamp(targetScrollLeft, 0, maxScroll),
        behavior,
      });
    },
    [displayedItems.length, getSliderOrThrow]
  );

  // -- Effects

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

  const onItemClicked = (_item: Item, index: number) => {
    setItemIndexCommand(index);
  };

  return (
    <div
      ref={sliderRef}
      className={`relative h-12 w-full overflow-x-auto no-scrollbar ${!extendMode ? "" : "sm:h-20"} ${className}`}
    >
      <div
        className={`flex h-full w-fit gap-2 ${!extendMode ? "" : "sm:gap-4"} ${containerClassName}`}
      >
        {displayedItems.map((item, index) => (
          <div
            key={index}
            className={
              `relative h-full ${aspectRatioClass} cursor-pointer` +
              ` after:absolute after:inset-0 after:border-2 after:border-primary after:transition-opacity ${index === masterItemIndex ? "after:opacity-100" : "after:opacity-0 hover:after:opacity-70"}`
            }
            onClick={() => onItemClicked(item, index)}
          >
            <GalleryElement item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
