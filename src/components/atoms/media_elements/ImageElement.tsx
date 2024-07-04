import { useMemo, useState } from "react";

import CloseButton from "@/components/atoms/CloseButton";
import Hotspot from "@/components/molecules/Hotspot";
import { useCompositionContext } from "@/providers/CompositionContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import { Item } from "@/types/composition";
import { ImageWidth } from "@/types/misc";

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

const ImageElement: React.FC<Props> = ({
  item: { src, hotspots },
  zoom,
  withSrcSet,
  onShownDetailImageChange,
}) => {
  const { minImageWidth, maxImageWidth, itemsShown, showHotspots } =
    useGlobalContext();
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
  const [srcSet, sizes] = useMemo(() => {
    const usedImageWidths = imageWidths.filter(width => {
      if (minImageWidth && width < minImageWidth) {
        return false;
      }
      if (maxImageWidth && width > maxImageWidth) {
        return false;
      }
      return true;
    });

    if (!withSrcSet || usedImageWidths.length === 0) {
      return [undefined, undefined];
    }

    // Ensure the widths are sorted
    usedImageWidths.sort((a, b) => a - b);

    const getUrlForWidth = (width: ImageWidth) => urlForWidth(src, width);
    const srcSetList = usedImageWidths.map(width => {
      const url = getUrlForWidth(width);
      return `${url} ${width}w`;
    });

    const sizesList = usedImageWidths.map(
      width => `(max-width: ${0.1 * itemsShown * width}px) ${width}px`
    );

    if (!maxImageWidth) {
      const hdWidth = 1600; // TODO: Use the actual width of the original image
      srcSetList.push(`${src} ${hdWidth}w`);
      sizesList.push(`${hdWidth}px`);
    }

    return [srcSetList.join(", "), sizesList.join(", ")];
  }, [imageWidths, itemsShown, maxImageWidth, minImageWidth, src, withSrcSet]);

  return (
    <div className="relative size-full overflow-hidden">
      <img
        className="size-full"
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt=""
      />
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
          className="absolute inset-0 z-10 cursor-auto"
          onMouseDown={e => e.stopPropagation()}
        >
          <img className="size-full" src={detailImageShown} alt="" />
          <CloseButton onClick={handleCloseDetailImageClick} />
        </div>
      )}
    </div>
  );
};

export default ImageElement;
