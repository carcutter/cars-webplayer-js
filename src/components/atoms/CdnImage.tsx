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

export type CdnImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "sizes" | "srcSet"
> & {
  src: string;
} & (
    | { onlyThumbnail?: false; imgInPlayerWidthRatio?: number }
    | { onlyThumbnail: true; imgInPlayerWidthRatio?: never }
  );

const CdnImage: React.FC<CdnImageProps> = ({
  src,
  imgInPlayerWidthRatio = 1,
  onlyThumbnail,
  ...props
}) => {
  const {
    minImageWidth,
    maxImageWidth,
    imageLoadStrategy,
    playerInViewportWidthRatio,
  } = useGlobalContext();

  const { imageHdWidth, imageSubWidths } = useCompositionContext();

  const [srcSet, sizes] = useMemo(() => {
    const imageWidths = imageSubWidths
      .concat(imageHdWidth)
      .sort((a, b) => a - b);

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

    // - Generate the srcSet attribute (list of image URLs with their widths)
    const srcSetList = usedImageWidths.map(width => {
      const url = width !== imageHdWidth ? addWidthToCdnUrl(src, width) : src;
      return `${url} ${width}w`;
    });

    // - Generate the sizes attribute (the web browser will choose the first matching rule, that's why we need to sort the widths in descending order for "speed" strategy)
    let sizesList: string[];

    if (!onlyThumbnail) {
      const viewportWidthMultiplier =
        1 / (imgInPlayerWidthRatio * playerInViewportWidthRatio);

      if (imageLoadStrategy === "quality") {
        const biggerWidth = usedImageWidths.pop();

        sizesList = usedImageWidths.map(
          imgWidth =>
            `(max-width: ${viewportWidthMultiplier * imgWidth}px) ${imgWidth}px`
        );

        sizesList.push(`${biggerWidth}px`);
      } else {
        const smallestWidth = usedImageWidths.shift();

        sizesList = usedImageWidths
          .reverse()
          .map(
            imageWidth =>
              `(min-width: ${viewportWidthMultiplier * imageWidth}px) ${imageWidth}px`
          );

        sizesList.push(`${smallestWidth}px`);
      }
    } else {
      const smallestWidth = usedImageWidths.shift();

      sizesList = [`${smallestWidth}px`];
    }

    return [srcSetList.join(", "), sizesList.join(", ")];
  }, [
    imageHdWidth,
    imageLoadStrategy,
    imageSubWidths,
    imgInPlayerWidthRatio,
    maxImageWidth,
    minImageWidth,
    onlyThumbnail,
    playerInViewportWidthRatio,
    src,
  ]);

  return <img src={src} srcSet={srcSet} sizes={sizes} {...props} />;
};

export default CdnImage;
