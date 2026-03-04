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
  spinCursor?: string;

  // Analytics
  analyticsEventPrefix?: string;
  /** @deprecated Prefer monitoring (enabled by default). When set, disables monitoring and sends analytics to this URL instead. */
  analyticsUrl?: string;
  /** @deprecated Only used with analyticsUrl. Sets the Authorization bearer token for analytics requests. Ignored when analyticsSimpleRequestsOnly is true. */
  analyticsBearer?: string;
  /** @deprecated Only used with analyticsUrl. When true, sends CORS simple requests only (disables custom headers including analyticsBearer). */
  analyticsSimpleRequestsOnly?: boolean;
  analyticsDryRun?: boolean;
  analyticsDebug?: boolean;

  // Monitoring
  monitoring?: boolean;
};
