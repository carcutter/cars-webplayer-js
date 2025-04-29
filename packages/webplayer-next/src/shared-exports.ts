// -- Expose ancestors package
export {
  // - Components
  WEB_PLAYER_WC_TAG,
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
  // - Events
  DEFAULT_EVENT_PREFIX,
  EVENT_COMPOSITION_LOADING,
  EVENT_COMPOSITION_LOADED,
  EVENT_COMPOSITION_LOAD_ERROR,
  EVENT_ITEM_CHANGE,
  EVENT_EXTEND_MODE_ON,
  EVENT_EXTEND_MODE_OFF,
  EVENT_HOTSPOTS_ON,
  EVENT_HOTSPOTS_OFF,
  EVENT_GALLERY_OPEN,
  EVENT_GALLERY_CLOSE,
  // - Utils
  generateCompositionUrl,
  // - Types
  type Item,
  type Composition,
  type MediaLoadStrategy,
} from "@car-cutter/core";

export type {
  WebPlayerProps,
  WebPlayerCustomMediaProps,
  WebPlayerIconProps,
} from "@car-cutter/react-webplayer";
