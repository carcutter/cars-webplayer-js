import { Item } from "@/types/composition";

type Props = { item: Item };

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

  return <img className="size-full object-cover" src={imgSrc} />;
};

export default GalleryElement;
