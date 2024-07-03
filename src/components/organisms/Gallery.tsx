import CloseButton from "@/components/atoms/CloseButton";
import GalleryElement from "@/components/molecules/GalleryElement";
import { useGlobalContext } from "@/providers/GlobalContext";
import { Item } from "@/types/composition";

type Props = {
  items: Item[];
  onItemClicked: (item: Item, index: number) => void;
};

const Gallery: React.FC<Props> = ({ items, onItemClicked }) => {
  const { closeGallery } = useGlobalContext();

  return (
    <div className="absolute inset-0 z-30 bg-slate-100">
      <div className="grid size-full auto-cols-fr grid-flow-col grid-rows-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => onItemClicked(item, index)}
          >
            <GalleryElement item={item} />
          </div>
        ))}
      </div>

      <CloseButton onClick={closeGallery} />
    </div>
  );
};

export default Gallery;
