import type { ExtendBehavior, MediaLoadStrategy, MediaWidth } from "./misc";

export type WebPlayerProps = {
  compositionUrl: string;

  // Layout
  hideCategoriesNav?: boolean;
  infiniteCarrousel?: boolean;
  permanentGallery?: boolean;

  // Medias loading
  mediaLoadStrategy?: MediaLoadStrategy;
  minMediaWidth?: MediaWidth;
  maxMediaWidth?: MediaWidth;
  preloadRange?: number;
  autoLoad360?: boolean;

  // Miscelaneous
  categoriesFilter?: string;
  extendBehavior?: ExtendBehavior;
  eventPrefix?: string;
  demoSpin?: boolean;
  reverse360?: boolean;
};
