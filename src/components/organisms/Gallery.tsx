import { useEffect, useRef } from "react";

import GalleryElement from "@/components/molecules/GalleryElement";
import { useCompositionContext } from "@/providers/CompositionContext";
import { useControlsContext } from "@/providers/ControlsContext";
import type { Item } from "@/types/composition";
import { clamp } from "@/utils/math";

type Props = {
  className?: string;
};

const Gallery: React.FC<Props> = ({ className = "" }) => {
  const { aspectRatioClass } = useCompositionContext();

  const {
    displayedItems,

    extendMode,

    masterItemIndex,
    setItemIndexCommand,
  } = useControlsContext();

  const sliderRef = useRef<HTMLDivElement>(null);

  // Scroll in order to always have the target item in the middle
  useEffect(() => {
    const slider = sliderRef.current;

    // DOM not ready yet
    if (!slider) {
      return;
    }

    // Scroll the gallery to have the target in view
    const containerWidth = slider.clientWidth;
    const itemWidth = slider.scrollWidth / displayedItems.length;
    const targetScrollLeft =
      (masterItemIndex + 1 / 2) * itemWidth - containerWidth / 2;

    const maxScroll = slider.scrollWidth - slider.clientWidth;

    slider.scrollLeft = clamp(targetScrollLeft, 0, maxScroll);

    // Smooth scroll is enabled after the first scrolling (to avoid the initial scroll)
    slider.style.scrollBehavior = "smooth";
  }, [displayedItems.length, masterItemIndex]);

  const onItemClicked = (_item: Item, index: number) => {
    setItemIndexCommand(index);
  };

  return (
    <div
      ref={sliderRef}
      className={`relative h-12 w-full overflow-x-auto no-scrollbar ${!extendMode ? "" : "sm:h-20"} ${className}`}
    >
      <div className={`flex h-full gap-2 ${!extendMode ? "" : "sm:gap-4"}`}>
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
