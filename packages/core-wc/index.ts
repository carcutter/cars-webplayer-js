export {
  checkCustomElementsDefinition,
  defineCustomElements,
  ensureCustomElementsDefinition,
} from "./src/wc";

export {
  type WebPlayerAttributes,
  webPlayerPropsToAttributes,
} from "./src/WebPlayer.wc";

export {
  type WebPlayerIconAttributes,
  webPlayerIconPropsToAttributes,
} from "./src/WebPlayerIcon.wc";

// Expose parent package
export {
  type WebPlayerProps,
  type WebPlayerIconProps,
} from "@car-cutter/core-ui";
