import type { ImageLoadStrategy, ImageWidth } from "@car-cutter/core";

export type WebPlayerProps = {
  compositionUrl: string;

  // Layout
  hideCategories?: boolean;
  infiniteCarrousel?: boolean;
  permanentGallery?: boolean;

  // Images loading
  imageLoadStrategy?: ImageLoadStrategy;
  minImageWidth?: ImageWidth;
  maxImageWidth?: ImageWidth;

  // Miscelaneous
  preventFullScreen?: boolean;
  eventPrefix?: string;
  reverse360?: boolean;
};
