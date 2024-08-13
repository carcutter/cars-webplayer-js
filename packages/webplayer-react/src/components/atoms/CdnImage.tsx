import { useMemo } from "react";

import { useCompositionContext } from "@/providers/CompositionContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import { cdnImgSrcWithWidth } from "@/utils/car-cutter";

export type CdnImageProps = Omit<
  React.ComponentPropsWithoutRef<"img">,
  "sizes" | "srcSet"
> & {
  src: string;
} & (
    | { onlyThumbnail?: false; imgInPlayerWidthRatio?: number }
    | { onlyThumbnail: true; imgInPlayerWidthRatio?: never }
  );

/**
 * CdnImage component renders an image with optimized loading strategies.
 *
 * This component renders  an <img/> element with dynamic `srcSet` and `sizes` attributes.
 *
 * @prop `imgInPlayerWidthRatio`: The ratio of the image width to the player width. It is used to know which sized image to load.
 *    - 1 means the image is as wide as the player.
 *    - 0.5 means the image is half as wide as the player.
 * @prop `onlyThumbnail`: If true, the image will only be loaded at the smallest size. (useful for thumbnails in Gallery)
 */
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

    // Filter out composition' widths that are not within the attribute constraints
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
      const url = width !== imageHdWidth ? cdnImgSrcWithWidth(src, width) : src;
      return `${url} ${width}w`;
    });

    // - Generate the sizes attribute
    // NOTE: the web browser will choose the first matching rule, that's why we need to sort the widths in descending order for "speed" strategy
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
