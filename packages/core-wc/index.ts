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

// -- Expose ancestor packages -- //
export { WEB_PLAYER_WC_TAG, WEB_PLAYER_ICON_WC_TAG } from "@car-cutter/core";

export {
  // - Components
  type WebPlayerProps,
  type WebPlayerIconProps,
  // - Events
  DEFAULT_EVENT_PREFIX,
  EVENT_COMPOSITION_LOADING,
  EVENT_COMPOSITION_LOADED,
  EVENT_COMPOSITION_LOAD_ERROR,
  EVENT_EXTEND_MODE_ON,
  EVENT_EXTEND_MODE_OFF,
  EVENT_HOTSPOTS_ON,
  EVENT_HOTSPOTS_OFF,
  EVENT_GALLERY_OPEN,
  EVENT_GALLERY_CLOSE,
} from "@car-cutter/core-ui";
