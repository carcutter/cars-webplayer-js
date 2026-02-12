import type { ExtendBehavior, MediaLoadStrategy, MediaWidth } from "./misc";

export type WebPlayerProps = {
  compositionUrl: string;

  // Integration mode
  integration?: boolean;
  maxItemsShown?: number;

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
  autoLoadInterior360?: boolean;

  // Miscellaneous
  categoriesFilter?: string;
  extendBehavior?: ExtendBehavior;
  eventPrefix?: string;
  demoSpin?: boolean;
  reverse360?: boolean;

  // Analytics
  analyticsEventPrefix?: string;
  /** @deprecated Monitoring now handles API calls via compositionUrl. */
  analyticsUrl?: string;
  /** @deprecated Monitoring uses compositionUrl as bearer token. */
  analyticsBearer?: string;
  /** @deprecated Monitoring handles its own request headers. */
  analyticsSimpleRequestsOnly?: boolean;
  analyticsDryRun?: boolean;
  analyticsDebug?: boolean;

  // Monitoring
  monitoring?: boolean;
};
