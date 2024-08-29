export type ImageLoadStrategy = "quality" | "speed";

export type WebPlayerProps = {
  compositionUrl: string;

  // Layout
  flatten?: boolean;
  infiniteCarrousel?: boolean;
  permanentGallery?: boolean;

  // Images loading
  imageLoadStrategy?: ImageLoadStrategy;
  minImageWidth?: number;
  maxImageWidth?: number;

  // Miscelaneous
  allowFullScreen?: boolean;
  eventId?: string;
  reverse360?: boolean;
};
