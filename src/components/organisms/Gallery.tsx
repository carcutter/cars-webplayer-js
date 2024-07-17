import GalleryElement from "@/components/molecules/GalleryElement";
import { useControlsContext } from "@/providers/ControlsContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import type { Item } from "@/types/composition";

const Gallery: React.FC = () => {
  const { aspectRatioClass } = useGlobalContext();

  // TODO: Move the scroll when target moves

  const {
    displayedItems,

    currentItemIndex,
    setTargetItemIndex,
  } = useControlsContext();

  const onItemClicked = (_item: Item, index: number) => {
    setTargetItemIndex(index);
  };

  return (
    <div className="overflow-x-auto no-scrollbar">
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
    // TODO: Mask elements to create illusion of transparency on scroll
  );
};

export default Gallery;
