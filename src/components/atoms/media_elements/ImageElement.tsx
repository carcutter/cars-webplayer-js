import { useMemo, useState } from "react";

import Hotspot from "@/components/molecules/Hotspot";
import Button from "@/components/ui/Button";
import { useCompositionContext } from "@/providers/CompositionContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import { ImageWidth, Item } from "@/types/composition";
import { positionToClassName } from "@/utils/style";

function urlForWidth(src: string, width: ImageWidth): string {
  // Extract the file name
  const split = src.split("/");
  const fileName = split.pop();
  const directoryName = split.join("/");

  return [directoryName, width, fileName].join("/");
}

type Props = {
  item: Extract<Item, { type: "image" }>;
  zoom?: number | null;
  withSrcSet?: boolean;
  onShownDetailImageChange?: (shownDetailImage: string | null) => void;
};

// TODO: Add a way to use a max width
const ImageElement: React.FC<Props> = ({
  item: { src, hotspots },
  zoom,
  withSrcSet,
  onShownDetailImageChange,
}) => {
  const { showHotspots } = useGlobalContext();
  const { imageWidths } = useCompositionContext();

  const [detailImageShown, setDetailImageShown] = useState<string | null>(null);

  const handleShowDetailImageClick = (shownDetailImage: string) => {
    setDetailImageShown(shownDetailImage);
    onShownDetailImageChange?.(shownDetailImage);
  };
  const handleCloseDetailImageClick = () => {
    setDetailImageShown(null);
    onShownDetailImageChange?.(null);
  };

  // Genereate srcSet
  const srcSet = useMemo(() => {
    if (!withSrcSet) {
      return;
    }

    const getUrlForWidth = (width: ImageWidth) => urlForWidth(src, width);
    return imageWidths
      .map(width => {
        const url = getUrlForWidth(width);
        return `${url} ${width}w`;
      })
      .join(", ");
  }, [imageWidths, src, withSrcSet]);

  return (
    <div className="relative size-full overflow-hidden">
      <img className="size-full" src={src} srcSet={srcSet} alt="" />
      {showHotspots &&
        !zoom && // Hotspots are not shown when zoomed in to avoid hiding anything
        !detailImageShown && // Hotspots have a z-index to stay over the scrollArea, but we don't want them to be clickable when the detail image is shown
        hotspots?.map((hotspot, index) => (
          <Hotspot
            key={index}
            hotspot={hotspot}
            onShowDetailImageClick={handleShowDetailImageClick}
          />
        ))}

      {detailImageShown && (
        <div
          className="absolute inset-0 cursor-auto"
          onMouseDown={e => e.stopPropagation()}
        >
          <img className="size-full" src={detailImageShown} alt="" />
          <Button
            color="neutral"
            shape="icon"
            className={`absolute ${positionToClassName("top-right")}`}
            onClick={handleCloseDetailImageClick}
          >
            <img
              className="size-full"
              src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/close.svg"
              alt="Close"
            />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageElement;
