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
  DEFAULT_HIDE_CATEGORIES_NAV,
  DEFAULT_INFINITE_CARROUSEL,
  DEFAULT_PERMANENT_GALLERY,
  DEFAULT_INTEGRATION,
  DEFAULT_MAX_ITEMS_SHOWN,
  DEFAULT_MEDIA_LOAD_STRATEGY,
  DEFAULT_MIN_MEDIA_WIDTH,
  DEFAULT_MAX_MEDIA_WIDTH,
  DEFAULT_PRELOAD_RANGE,
  DEFAULT_AUTO_LOAD_360,
  DEFAULT_AUTO_LOAD_INTERIOR_360,
  DEFAULT_CATEGORY_FILTER,
  DEFAULT_EXTEND_BEHAVIOR,
  DEFAULT_EVENT_PREFIX,
  DEFAULT_DEMO_SPIN,
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

// - Components props
export type { WebPlayerProps } from "./src/types/WebPlayer.props";
export type { WebPlayerCustomMediaProps } from "./src/types/WebPlayerCustomMedia.props";
export type {
  WebPlayerIconProps,
  WebPlayerIconName,
} from "./src/types/WebPlayerIcon.props";
