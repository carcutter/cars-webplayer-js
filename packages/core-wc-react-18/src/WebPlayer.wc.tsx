import r2wc from "@r2wc/react-to-web-component";

import {
  WebPlayerWithInjectedStyles,
  parseBooleanProperties,
} from "@car-cutter/core-wc";

const props = {
  compositionUrl: "string",

  // Layout
  hideCategoriesNav: "boolean",
  forceTopNav: "boolean",
  infiniteCarrousel: "boolean",
  permanentGallery: "boolean",
  integration: "boolean",
  maxItemsShown: "number",
  themeConfig: "string",

  // Medias loading
  minMediaWidth: "number",
  maxMediaWidth: "number",
  mediaLoadStrategy: "string",
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

  // Analytics
  analyticsEventPrefix: "string",
  analyticsUrl: "string",
  analyticsBearer: "string",
  analyticsSimpleRequestsOnly: "boolean",
  analyticsDryRun: "boolean",
  analyticsDebug: "boolean",

  // Monitoring
  monitoring: "boolean",
} as const;

const WebPlayerWebComponent = r2wc(WebPlayerWithInjectedStyles, {
  shadow: "closed",
  props,
});

parseBooleanProperties(WebPlayerWebComponent, props);

export default WebPlayerWebComponent;
