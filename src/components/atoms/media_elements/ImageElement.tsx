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
  const { imageHdWidth, imageSubWidths } = useCompositionContext();

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
    // TODO: The parameter withSrcSet should always be true (but for the moment, the mock data is erroned)
    if (!withSrcSet) {
      return [undefined, undefined];
    }

    const imageWidths = imageSubWidths.concat(imageHdWidth);

    const usedImageWidths = imageWidths.filter(width => {
      if (minImageWidth && width < minImageWidth) {
        return false;
      }
      if (maxImageWidth && width > maxImageWidth) {
        return false;
      }
      return true;
    });

    if (usedImageWidths.length === 0) {
      throw new Error("No image widths available for the given constraints");
    }

    // Ensure the widths are sorted
    usedImageWidths.sort((a, b) => a - b);

    const getUrlForWidth = (width: ImageWidth) =>
      width !== imageHdWidth ? urlForWidth(src, width) : src;
    const srcSetList = usedImageWidths.map(width => {
      const url = getUrlForWidth(width);
      return `${url} ${width}w`;
    });

    const biggerWidth = usedImageWidths.pop();

    const sizesList = usedImageWidths.map(
      width => `(max-width: ${itemsShown * width}px) ${width}px`
    );

    sizesList.push(`${biggerWidth}px`);

    return [srcSetList.join(", "), sizesList.join(", ")];
  }, [
    imageHdWidth,
    imageSubWidths,
    itemsShown,
    maxImageWidth,
    minImageWidth,
    src,
    withSrcSet,
  ]);

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
