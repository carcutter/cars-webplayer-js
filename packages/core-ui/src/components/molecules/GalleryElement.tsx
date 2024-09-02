import type { Item } from "@car-cutter/core";

import { useCompositionContext } from "../../providers/CompositionContext";
import CdnImage from "../atoms/CdnImage";
import PlayIcon from "../icons/PlayIcon";
import ThreeSixtyIcon from "../icons/ThreeSixtyIcon";

type Props = { item: Item };

const GalleryElement: React.FC<Props> = ({ item }) => {
  const { aspectRatioStyle } = useCompositionContext();

  const { type } = item;

  let imgNode: React.ReactNode;

  if (type === "360" || type === "image") {
    const imgSrc = type === "360" ? item.images[0].src : item.src;

    imgNode = (
      <CdnImage className="size-full object-cover" src={imgSrc} onlyThumbnail />
    );
  } else {
    const imgSrc = type === "video" ? item.poster : item.src;

    // FUTURE : Add srcSet for video and omni_directional
    imgNode = <img className="size-full object-cover" src={imgSrc} />;
  }

  let overlayIcon: React.ReactNode;

  switch (type) {
    case "360":
      overlayIcon = (
        <ThreeSixtyIcon className="size-3/4 text-background grayscale" />
      );
      break;
    case "video":
      overlayIcon = (
        <div className="aspect-square h-3/5 rounded-full bg-foreground/50 p-1">
          <PlayIcon className="size-full text-background" />
        </div>
      );
      break;
  }

  return (
    <div
      className="relative overflow-hidden rounded-gallery bg-foreground/50"
      style={aspectRatioStyle}
    >
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
