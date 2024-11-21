import type { ExtendBehavior, MediaLoadStrategy, MediaWidth } from "./misc";

export type WebPlayerProps = {
  compositionUrl: string;

  // Layout
  hideCategories?: boolean;
  infiniteCarrousel?: boolean;
  permanentGallery?: boolean;

  // Medias loading
  mediaLoadStrategy?: MediaLoadStrategy;
  minMediaWidth?: MediaWidth;
  maxMediaWidth?: MediaWidth;
  preloadRange?: number;

  // Miscelaneous
  extendBehavior?: ExtendBehavior;
  eventPrefix?: string;
  reverse360?: boolean;
};
