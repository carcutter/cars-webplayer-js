export type ImageLoadStrategy = "quality" | "speed";

export type WebPlayerProps = {
  compositionUrl: string;

  reverse360?: boolean;

  minImageWidth?: number;
  maxImageWidth?: number;
  imageLoadStrategy?: ImageLoadStrategy;

  flatten?: boolean;
  infiniteCarrousel?: boolean;

  eventId?: string;

  allowFullScreen?: boolean;

  permanentGallery?: boolean;
};
