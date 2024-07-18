import CdnImage from "@/components/atoms/CdnImage";
import type { Item } from "@/types/composition";

type Props = { item: Item };

// TODO
// - Add visual way to identify the type of the item
// - Add srcSet for video and omni_directional
const GalleryElement: React.FC<Props> = ({ item }) => {
  const { type } = item;

  let imgSrc: string;

  switch (type) {
    case "image":
      imgSrc = item.src;
      break;
    case "video":
      imgSrc = item.poster;
      break;
    case "360":
      imgSrc = item.images[0];
      break;
    case "omni_directional":
      imgSrc = item.src;
      break;
    default:
      throw new Error(`Unsupported item type: ${type}`);
  }

  if (["360", "image"].includes(type)) {
    return (
      <CdnImage className="size-full object-cover" src={imgSrc} onlyThumbnail />
    );
  } else {
    return <img className="size-full object-cover" src={imgSrc} />;
  }
};

export default GalleryElement;
