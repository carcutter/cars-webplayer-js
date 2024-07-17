import { useEffect, useRef } from "react";

import GalleryElement from "@/components/molecules/GalleryElement";
import { useControlsContext } from "@/providers/ControlsContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import type { Item } from "@/types/composition";
import { clamp } from "@/utils/math";

const Gallery: React.FC = () => {
  const { aspectRatioClass } = useGlobalContext();

  const {
    displayedItems,

    currentItemIndex,
    targetItemIndex,
    setTargetItemIndex,
  } = useControlsContext();

  const sliderRef = useRef<HTMLDivElement>(null);

  // Scroll in order to always have the target item in the middle
  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    requestAnimationFrame(() => {
      const containerWidth = slider.clientWidth;
      const itemWidth = slider.scrollWidth / displayedItems.length;
      const targetScrollLeft =
        (targetItemIndex + 1 / 2) * itemWidth - containerWidth / 2;

      const maxScroll = slider.scrollWidth - slider.clientWidth;

      slider.scrollLeft = clamp(targetScrollLeft, 0, maxScroll);
    });
  }, [displayedItems.length, targetItemIndex]);

  const onItemClicked = (_item: Item, index: number) => {
    setTargetItemIndex(index);
  };

  return (
    <div
      ref={sliderRef}
      className="relative -mx-1 overflow-x-auto scroll-smooth px-1 no-scrollbar [mask-image:linear-gradient(to_left,transparent_0px,black_4px,black_calc(100%-4px),transparent_100%)]"
    >
      <div className="flex h-12 w-fit gap-2">
        {displayedItems.map((item, index) => (
          <div
            key={index}
            className={`
                relative h-full ${aspectRatioClass} cursor-pointer
                after:absolute after:inset-0 after:border-2 after:border-primary after:transition-opacity ${index === currentItemIndex ? "after:opacity-100" : "after:opacity-0 hover:after:opacity-70"}
              `}
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
