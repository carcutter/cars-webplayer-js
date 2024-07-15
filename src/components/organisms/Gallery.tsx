import GalleryElement from "@/components/molecules/GalleryElement";
import { useGlobalContext } from "@/providers/GlobalContext";
import type { Item } from "@/types/composition";

type Props = {
  items: Item[];
  currentIndex: number;
  onItemClicked: (item: Item, index: number) => void;
};

const Gallery: React.FC<Props> = ({ items, currentIndex, onItemClicked }) => {
  const { aspectRatioClass } = useGlobalContext();

  return (
    <div className="absolute inset-2 top-auto z-gallery bg-neutral">
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex h-12 w-fit gap-2 p-1">
          {items.map((item, index) => (
            <div
              key={index}
              className={`h-full ${aspectRatioClass} cursor-pointer ${index === currentIndex ? "outline outline-2 outline-primary" : ""}`}
              onClick={() => onItemClicked(item, index)}
            >
              <GalleryElement item={item} />
            </div>
          ))}
        </div>
      </div>
      {/* Elements to create illusion of transparency on scroll */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-r from-neutral to-transparent" />
      <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-l from-neutral to-transparent" />
    </div>
  );
};

export default Gallery;
