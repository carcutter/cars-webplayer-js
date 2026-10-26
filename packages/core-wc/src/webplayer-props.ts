import type { WebPlayerProps } from "@car-cutter/core";

type R2wcPropType = "string" | "number" | "boolean";

/**
 * r2wc props of the <cc-webplayer> element, shared by the React 16 / 17 and
 * React 18 builds. Typed against WebPlayerProps, so that a prop added to the
 * core fails the build until it's listed here.
 */
export const WEB_PLAYER_WC_PROPS = {
  compositionUrl: "string",

  // Integration mode
  integration: "boolean",
  maxItemsShown: "number",

  // Layout
  hideCategoriesNav: "boolean",
  forceTopNav: "boolean",
  infiniteCarrousel: "boolean",
  permanentGallery: "boolean",

  // Medias loading
  mediaLoadStrategy: "string",
  minMediaWidth: "number",
  maxMediaWidth: "number",
  preloadRange: "number",
  autoLoad360: "boolean",
  autoLoadInterior360: "boolean",

  // Miscellaneous
  categoriesFilter: "string",
  extendBehavior: "string",
  eventPrefix: "string",
  demoSpin: "boolean",
  reverse360: "boolean",
  spinCursor: "string",
  themeConfig: "string",

  // Analytics
  analyticsEventPrefix: "string",
  analyticsUrl: "string",
  analyticsBearer: "string",
  analyticsSimpleRequestsOnly: "boolean",
  analyticsDryRun: "boolean",
  analyticsDebug: "boolean",

  // Monitoring
  monitoring: "boolean",
} as const satisfies Record<keyof WebPlayerProps, R2wcPropType>;
