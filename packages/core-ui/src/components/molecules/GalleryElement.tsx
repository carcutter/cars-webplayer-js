import type { Item } from "@car-cutter/core";

import { useCompositionContext } from "../../providers/CompositionContext";
import { useControlsContext } from "../../providers/ControlsContext";
import { cn } from "../../utils/style";
import CdnImage from "../atoms/CdnImage";
import PlayIcon from "../icons/PlayIcon";
import ThreeSixtyIcon from "../icons/ThreeSixtyIcon";

const GalleryIconWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { extendMode } = useControlsContext();

  return (
    <div
      className={cn(
        "flex aspect-square h-3/4 items-center justify-center rounded-full bg-foreground/50 p-1",
        extendMode && "large:h-3/5 large:p-2"
      )}
    >
      {children}
    </div>
  );
};

type GalleryElementProps = { item: Item };

const GalleryElement: React.FC<GalleryElementProps> = ({ item }) => {
  const { aspectRatioStyle } = useCompositionContext();

  const { type } = item;

  let imgNode: React.ReactNode;

  if (type !== "omni_directional") {
    let imgSrc: string;

    switch (type) {
      case "360":
        imgSrc = item.images[0].src;
        break;
      case "image":
        imgSrc = item.src;
        break;
      case "video":
        imgSrc = item.poster;
        break;
    }

    imgNode = (
      <CdnImage className="size-full object-cover" src={imgSrc} onlyThumbnail />
    );
  } else {
    // FUTURE : Add srcSet for omni_directional
    const imgSrc = item.src;

    imgNode = <img className="size-full object-cover" src={imgSrc} />;
  }

  let overlayIcon: React.ReactNode;

  switch (type) {
    case "360":
      overlayIcon = (
        <GalleryIconWrapper>
          <ThreeSixtyIcon className="size-full text-primary" />
        </GalleryIconWrapper>
      );
      break;
    case "video":
      overlayIcon = (
        <GalleryIconWrapper>
          <PlayIcon className="size-full p-0.5 text-background" />
        </GalleryIconWrapper>
      );
      break;
  }

  return (
    <div
      className="relative overflow-hidden rounded-gallery bg-foreground/30"
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
