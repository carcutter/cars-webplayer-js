export {
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
  WEB_PLAYER_WC_TAG,
} from "./src/const/web-component";

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
} from "./src/const/webplayer-events";

export {
  ANALYTICS_EVENT_LOAD,
  ANALYTICS_EVENT_DISPLAY,
  ANALYTICS_EVENT_INTERACTION,
  ANALYTICS_EVENT_ERROR,
} from "./src/const/webplayer-events";

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
  DEFAULT_SPIN_CURSOR,
  DEFAULT_MONITORING,
} from "./src/const/webplayer-default-props";

export type { Category } from "./src/types/composition/category";
export type { Composition } from "./src/types/composition";
export type { Hotspot } from "./src/types/composition/hotspot";
export type { ImageWithHotspots } from "./src/types/composition/image";
export type { MediaItem } from "./src/types/composition/media-item";
export type { MediaWidth } from "./src/types/composition/media-width";
export type { AspectRatio } from "./src/types/composition/aspect-ratio";
export type { MediaLoadStrategy } from "./src/types/web-player/webplayer-media-load-strategy";

export type { WebPlayerProps } from "./src/types/web-player/webplayer-props";
export type { WebPlayerCustomMediaProps } from "./src/types/web-player/webplayer-custom-media-props";
export type { ExtendBehavior } from "./src/types/web-player/webplayer-extended-behavior";
export type {
  WebPlayerIconName,
  WebPlayerIconProps,
} from "./src/types/web-player/webplayer-icon-props";

export type { WebplayerInstance } from "./src/types/analytics/webplayer-instance";
export type { WebplayerDisplayedItem } from "./src/types/analytics/webplayer-displayed-item";
export type { WebplayerAction } from "./src/types/analytics/webplayer-action";
export type { WebplayerError } from "./src/types/analytics/webplayer-error";
export type { AnalyticsEventType } from "./src/types/analytics/analytics-event-type";
export type { AnalyticsLoadEventProps } from "./src/types/analytics/analytics-event-props/analytics-load-event-props";
export type { AnalyticsDisplayEventProps } from "./src/types/analytics/analytics-event-props/analytics-display-event-props";
export type { AnalyticsInteractionEventProps } from "./src/types/analytics/analytics-event-props/analytics-interaction-event-props";
export type { AnalyticsErrorEventProps } from "./src/types/analytics/analytics-event-props/analytics-error-event-props";
export type { AnalyticsEventProps } from "./src/types/analytics/analytics-event-props";
export type { AnalyticsLoadEvent } from "./src/types/analytics/analytics-event/analytics-load-event";
export type { AnalyticsDisplayEvent } from "./src/types/analytics/analytics-event/analytics-display-event";
export type { AnalyticsInteractionEvent } from "./src/types/analytics/analytics-event/analytics-interaction-event";
export type { AnalyticsErrorEvent } from "./src/types/analytics/analytics-event/analytics-error-event";
export type { AnalyticsEvent } from "./src/types/analytics/analytics-event";

export {
  getCdnImgSrcWithWidth,
  generateCompositionUrl,
  subscribeToAnalyticsEvents,
} from "./src/utils";
