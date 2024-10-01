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
  const { mediaLoadStrategy, playerInViewportWidthRatio } = useGlobalContext();

  const { imageHdWidth, usedMediaWidths } = useCompositionContext();

  const [srcSet, sizes] = useMemo(() => {
    // - Generate the srcSet attribute (list of image URLs with their widths)
    const srcSetList = usedMediaWidths.map(width => {
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
          const mediaWidths = [...usedMediaWidths]; // Copy the array to avoid mutation
          const biggestWidth = mediaWidths.pop();

          sizesList = mediaWidths.map(
            mediaWidth =>
              `(max-width: ${viewportWidthMultiplier * mediaWidth}px) ${mediaWidth}px`
          );

          sizesList.push(`${biggestWidth}px`);
          break;
        }
        case "balanced": {
          sizesList = [];

          for (let i = 0; i < usedMediaWidths.length - 1; i++) {
            const mediaWidth = usedMediaWidths[i];
            const nextMediaWidth = usedMediaWidths[i + 1];

            const breakpoint = Math.round((mediaWidth + nextMediaWidth) / 2);

            sizesList.push(
              `(max-width: ${viewportWidthMultiplier * breakpoint}px) ${mediaWidth}px`
            );
          }

          sizesList.push(`${usedMediaWidths[usedMediaWidths.length - 1]}px`);
          break;
        }
        case "speed": {
          const mediaWidths = [...usedMediaWidths]; // Copy the array to avoid mutation
          const smallestWidth = mediaWidths.shift();

          sizesList = mediaWidths
            .reverse()
            .map(
              mediaWidth =>
                `(min-width: ${viewportWidthMultiplier * mediaWidth}px) ${mediaWidth}px`
            );

          sizesList.push(`${smallestWidth}px`);
          break;
        }
      }
    }
    // Thumbnail
    else {
      const smallestWidth = usedMediaWidths[0];

      sizesList = [`${smallestWidth}px`];
    }

    return [srcSetList.join(", "), sizesList.join(", ")];
  }, [
    imageHdWidth,
    imgInPlayerWidthRatio,
    mediaLoadStrategy,
    onlyThumbnail,
    playerInViewportWidthRatio,
    src,
    usedMediaWidths,
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
