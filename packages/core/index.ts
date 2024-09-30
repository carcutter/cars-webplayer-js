// - Const
export {
  WEB_PLAYER_WC_TAG,
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
} from "./src/const/wc";

export {
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
} from "./src/const/event";

export {
  DEFAULT_HIDE_CATEGORIES,
  DEFAULT_INFINITE_CARROUSEL,
  DEFAULT_PERMANENT_GALLERY,
  DEFAULT_MEDIA_LOAD_STRATEGY,
  DEFAULT_PRELOAD_RANGE,
  DEFAULT_PREVENT_FULL_SCREEN,
  DEFAULT_EVENT_PREFIX,
  DEFAULT_REVERSE_360,
} from "./src/const/default_props";

// - Utils
export { generateCompositionUrl, cdnImgSrcWithWidth } from "./src/utils";

// - Types
export type {
  Hotspot,
  ImageWithHotspots,
  Item,
  Category,
  Composition,
} from "./src/types/composition";

export type {
  AspectRatio,
  MediaWidth,
  MediaLoadStrategy,
} from "./src/types/misc";
