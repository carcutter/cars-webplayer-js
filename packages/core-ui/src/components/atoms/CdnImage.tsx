import { useEffect, useMemo, useState } from "react";

import { cdnImgSrcWithWidth } from "@car-cutter/core";

import { useCompositionContext } from "../../providers/CompositionContext";
import { useGlobalContext } from "../../providers/GlobalContext";
import { cn } from "../../utils/style";

export type CdnImageProps = Omit<
  React.ComponentPropsWithoutRef<"img">,
  "sizes" | "srcSet"
> & {
  src: string;
} & (
    | { onlyThumbnail?: false; imgInPlayerWidthRatio?: number }
    | { onlyThumbnail: true; imgInPlayerWidthRatio?: never }
  ) & {
    fadeIn?: boolean;
  };

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
  className,
  onLoad,

  imgInPlayerWidthRatio = 1,
  onlyThumbnail,
  fadeIn,
  ...props
}) => {
  const {
    minMediaWidth,
    maxMediaWidth,
    mediaLoadStrategy,
    playerInViewportWidthRatio,
  } = useGlobalContext();

  const { imageHdWidth, imageSubWidths } = useCompositionContext();

  const [srcSet, sizes] = useMemo(() => {
    const imageWidths = imageSubWidths
      .concat(imageHdWidth)
      .sort((a, b) => a - b);

    // Filter out composition' widths that are not within the attribute constraints
    const usedImageWidths = imageWidths.filter(width => {
      if (minMediaWidth && width < minMediaWidth) {
        return false;
      }
      if (maxMediaWidth && width > maxMediaWidth) {
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

      switch (mediaLoadStrategy) {
        case "quality": {
          const biggestWidth = usedImageWidths.pop();

          sizesList = usedImageWidths.map(
            imageWidth =>
              `(max-width: ${viewportWidthMultiplier * imageWidth}px) ${imageWidth}px`
          );

          sizesList.push(`${biggestWidth}px`);
          break;
        }
        case "speed": {
          const smallestWidth = usedImageWidths.shift();

          sizesList = usedImageWidths
            .reverse()
            .map(
              imageWidth =>
                `(min-width: ${viewportWidthMultiplier * imageWidth}px) ${imageWidth}px`
            );

          sizesList.push(`${smallestWidth}px`);
          break;
        }
        case "closest": {
          sizesList = [];

          for (let i = 0; i < usedImageWidths.length - 1; i++) {
            const imageWidth = usedImageWidths[i];
            const nextImageWidth = usedImageWidths[i + 1];

            const breakpoint = (imageWidth + nextImageWidth) / 2;

            sizesList.push(
              `(max-width: ${viewportWidthMultiplier * breakpoint}px) ${imageWidth}px`
            );
          }

          sizesList.push(`${usedImageWidths[usedImageWidths.length - 1]}px`);
          break;
        }
      }
    }
    // Thumbnail
    else {
      const smallestWidth = usedImageWidths.shift();

      sizesList = [`${smallestWidth}px`];
    }

    return [srcSetList.join(", "), sizesList.join(", ")];
  }, [
    imageHdWidth,
    mediaLoadStrategy,
    imageSubWidths,
    imgInPlayerWidthRatio,
    maxMediaWidth,
    minMediaWidth,
    onlyThumbnail,
    playerInViewportWidthRatio,
    src,
  ]);

  // - Fade-in effect

  const [isLoaded, setIsLoaded] = useState<boolean>();

  useEffect(() => {
    if (isLoaded === true) {
      return;
    }

    // Give a little time to retrieve the image from the cache before showing the fade-in effect
    const timeout = setTimeout(() => {
      // NOTE: "??" to avoid race condition with the onLoad event
      setIsLoaded(v => v ?? false);
    }, 30);

    return () => clearTimeout(timeout);
  }, [isLoaded]);

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      className={cn(
        className,
        fadeIn &&
          cn(
            isLoaded !== undefined && "transition-opacity duration-200",
            isLoaded === false && "opacity-0",
            isLoaded === true && "opacity-100"
          )
      )}
      onLoad={e => {
        setIsLoaded(true);
        onLoad?.(e);
      }}
      {...props}
    />
  );
};

export default CdnImage;
