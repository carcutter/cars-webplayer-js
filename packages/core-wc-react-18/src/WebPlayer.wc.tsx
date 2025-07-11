import r2wc from "@r2wc/react-to-web-component";

import { WebPlayerWithInjectedStyles } from "@car-cutter/core-wc";

const WebPlayerWebComponent = r2wc(WebPlayerWithInjectedStyles, {
  shadow: "closed",
  props: {
    compositionUrl: "string",

    // Layout
    hideCategoriesNav: "boolean",
    infiniteCarrousel: "boolean",
    permanentGallery: "boolean",
    integration: "boolean",
    maxItemsShown: "number",

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
  },
});

export default WebPlayerWebComponent;
