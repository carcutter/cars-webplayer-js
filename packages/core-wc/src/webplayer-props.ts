import type {
  WebPlayerCustomMediaProps,
  WebPlayerIconProps,
  WebPlayerProps,
} from "@car-cutter/core";

import type { PropType } from "./element";

// Props of the elements, read from their attributes. Typed against the props
// of the core, so that a prop added there fails the build until it's listed.

/** Props of <cc-webplayer> */
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
} as const satisfies Record<keyof WebPlayerProps, PropType>;

/** Props of <cc-webplayer-custom-media> */
export const WEB_PLAYER_CUSTOM_MEDIA_WC_PROPS = {
  index: "number",
  thumbnailSrc: "string",
} as const satisfies Record<keyof WebPlayerCustomMediaProps, PropType>;

/** Props of <cc-webplayer-icon> */
export const WEB_PLAYER_ICON_WC_PROPS = {
  name: "string",
} as const satisfies Record<keyof WebPlayerIconProps, PropType>;
