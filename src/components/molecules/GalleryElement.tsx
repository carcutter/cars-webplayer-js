import CdnImage from "@/components/atoms/CdnImage";
import PlayIcon from "@/components/icons/PlayIcon";
import ThreeSixtyIcon from "@/components/icons/ThreeSixtyIcon";
import { useCompositionContext } from "@/providers/CompositionContext";
import type { Item } from "@/types/composition";

type Props = { item: Item };

const GalleryElement: React.FC<Props> = ({ item }) => {
  const { aspectRatioClass } = useCompositionContext();

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
      imgSrc = item.images[0].src;
      break;
    case "omni_directional":
      imgSrc = item.src;
      break;
    default:
      throw new Error(`Unsupported item type: ${type}`);
  }

  let imgNode: React.ReactNode;

  if (["360", "image"].includes(type)) {
    imgNode = (
      <CdnImage className="size-full object-cover" src={imgSrc} onlyThumbnail />
    );
  } else {
    // FUTURE : Add srcSet for video and omni_directional
    imgNode = <img className="size-full object-cover" src={imgSrc} />;
  }

  let overlayIcon: React.ReactNode;

  switch (type) {
    case "360":
      overlayIcon = (
        <ThreeSixtyIcon className="size-3/4 text-white grayscale" />
      );
      break;
    case "video":
      overlayIcon = (
        <div className="aspect-square h-3/5 rounded-full bg-foreground/50 p-1">
          <PlayIcon className="invert" />
        </div>
      );
      break;
  }

  return (
    <div className={`relative ${aspectRatioClass} bg-foreground/50`}>
      {imgNode}
      {overlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/25">
          {overlayIcon}
        </div>
      )}
    </div>
  );
};

export default GalleryElement;
