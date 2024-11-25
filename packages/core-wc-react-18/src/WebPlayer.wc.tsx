import r2wc from "@r2wc/react-to-web-component";

import { WebPlayerWithInjectedStyles } from "@car-cutter/core-wc";

const WebPlayerWebComponent = r2wc(WebPlayerWithInjectedStyles, {
  shadow: "open",
  props: {
    compositionUrl: "string",

    hideCategoriesNav: "boolean",
    infiniteCarrousel: "boolean",
    permanentGallery: "boolean",

    minMediaWidth: "number",
    maxMediaWidth: "number",
    mediaLoadStrategy: "string",
    autoLoad360: "boolean",

    categoriesFilter: "string",
    extendBehavior: "boolean",
    eventPrefix: "string",
    demoSpin: "boolean",
    reverse360: "boolean",
  },
});

export default WebPlayerWebComponent;
