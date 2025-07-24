// - Const
export {
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
  WEB_PLAYER_WC_TAG,
} from "./src/const/wc";

export {
  EVENT_COMPOSITION_LOAD_ERROR,
  EVENT_COMPOSITION_LOADED,
  EVENT_COMPOSITION_LOADING,
  EVENT_EXTEND_MODE_OFF,
  EVENT_EXTEND_MODE_ON,
  EVENT_GALLERY_CLOSE,
  EVENT_GALLERY_OPEN,
  EVENT_HOTSPOTS_OFF,
  EVENT_HOTSPOTS_ON,
  EVENT_ITEM_CHANGE,
} from "./src/const/event";

export {
  ANALYTICS_EVENT_IDENTIFY,
  ANALYTICS_EVENT_PAGE,
  ANALYTICS_EVENT_TRACK,
} from "./src/const/event";

export {
  DEFAULT_ANALYTICS_EVENT_PREFIX,
  DEFAULT_ANALYTICS_URL,
  DEFAULT_ANALYTICS_BEARER,
  DEFAULT_ANALYTICS_SIMPLE_REQUESTS_ONLY,
  DEFAULT_ANALYTICS_DRY_RUN,
  DEFAULT_ANALYTICS_DEBUG,
  DEFAULT_AUTO_LOAD_360,
  DEFAULT_AUTO_LOAD_INTERIOR_360,
  DEFAULT_CATEGORY_FILTER,
  DEFAULT_DEMO_SPIN,
  DEFAULT_EVENT_PREFIX,
  DEFAULT_EXTEND_BEHAVIOR,
  DEFAULT_HIDE_CATEGORIES_NAV,
  DEFAULT_INFINITE_CARROUSEL,
  DEFAULT_INTEGRATION,
  DEFAULT_MAX_ITEMS_SHOWN,
  DEFAULT_MAX_MEDIA_WIDTH,
  DEFAULT_MEDIA_LOAD_STRATEGY,
  DEFAULT_MIN_MEDIA_WIDTH,
  DEFAULT_PERMANENT_GALLERY,
  DEFAULT_PRELOAD_RANGE,
  DEFAULT_REVERSE_360,
} from "./src/const/default_props";

// - Utils
export { cdnImgSrcWithWidth, generateCompositionUrl } from "./src/utils";

// - Types
export type {
  Category,
  Composition,
  Hotspot,
  ImageWithHotspots,
  Item,
} from "./src/types/composition";

export type {
  AspectRatio,
  MediaLoadStrategy,
  MediaWidth,
} from "./src/types/misc";

// - Components props
export type { WebPlayerProps } from "./src/types/WebPlayer.props";
export type { WebPlayerCustomMediaProps } from "./src/types/WebPlayerCustomMedia.props";
export type {
  WebPlayerIconName,
  WebPlayerIconProps,
} from "./src/types/WebPlayerIcon.props";

// - Analytics
export type {
  // Types
  AnalyticsEventTypeIdentify,
  AnalyticsEventTypePage,
  AnalyticsEventTypeTrack,
  AnalyticsEventType,

  // Base
  AnalyticsEventBase,

  // Props
  AnalyticsIdentifyEventProps,
  AnalyticsPageEventProps,
  AnalyticsTrackEventProps,
  AnalyticsEventProps,

  // Events
  AnalyticsIdentifyEvent,
  AnalyticsPageEvent,
  AnalyticsTrackEvent,
  AnalyticsEvent,
} from "./src/types/analytics";

export { subscribeToAnalyticsEvents } from "./src/utils";
