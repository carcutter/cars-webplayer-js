import { useMemo } from "react";

import { useCompositionContext } from "@/providers/CompositionContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import type { ImageWidth } from "@/types/misc";

function addWidthToCdnUrl(src: string, width: ImageWidth): string {
  // Extract the file name
  const split = src.split("/");
  const fileName = split.pop();
  const directoryName = split.join("/");

  return [directoryName, width, fileName].join("/");
}

type Props = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "sizes" | "srcSet"
> & {
  src: string;
};

const CdnImage: React.FC<Props> = ({ src, ...props }) => {
  const { minImageWidth, maxImageWidth, imageLoadStrategy, itemsShown } =
    useGlobalContext();

  const { imageHdWidth, imageSubWidths } = useCompositionContext();

  const [srcSet, sizes] = useMemo(() => {
    const imageWidths = imageSubWidths.concat(imageHdWidth);

    // Filter out the widths that are not within the constraints
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

    // Generate the srcSet attribute (list of image URLs with their widths)
    const getUrlForWidth = (width: ImageWidth) =>
      width !== imageHdWidth ? addWidthToCdnUrl(src, width) : src;
    const srcSetList = usedImageWidths.map(width => {
      const url = getUrlForWidth(width);
      return `${url} ${width}w`;
    });

    // Generate the sizes attribute (the web browser will choose the first matching rule, that's why we need to sort the widths in descending order for "speed" strategy)
    let sizesList: string[];
    if (imageLoadStrategy === "quality") {
      const biggerWidth = usedImageWidths.pop();

      sizesList = usedImageWidths.map(
        width => `(max-width: ${itemsShown * width}px) ${width}px`
      );

      sizesList.push(`${biggerWidth}px`);
    } else {
      const smallestWidth = usedImageWidths.shift();

      sizesList = usedImageWidths
        .reverse()
        .map(width => `(min-width: ${itemsShown * width}px) ${width}px`);

      sizesList.push(`${smallestWidth}px`);
    }

    return [srcSetList.join(", "), sizesList.join(", ")];
  }, [
    imageHdWidth,
    imageLoadStrategy,
    imageSubWidths,
    itemsShown,
    maxImageWidth,
    minImageWidth,
    src,
  ]);

  return <img src={src} srcSet={srcSet} sizes={sizes} {...props} />;
};

export default CdnImage;
