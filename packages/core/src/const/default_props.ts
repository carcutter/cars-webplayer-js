import type {
  ExtendBehavior,
  MediaLoadStrategy,
  MediaWidth,
} from "../types/misc";

export const DEFAULT_HIDE_CATEGORIES_NAV = false satisfies boolean;
export const DEFAULT_INFINITE_CARROUSEL = false satisfies boolean;
export const DEFAULT_PERMANENT_GALLERY = false satisfies boolean;

export const DEFAULT_MEDIA_LOAD_STRATEGY =
  "quality" satisfies MediaLoadStrategy;
export const DEFAULT_MIN_MEDIA_WIDTH = 0 satisfies MediaWidth;
export const DEFAULT_MAX_MEDIA_WIDTH = Infinity satisfies MediaWidth;
export const DEFAULT_PRELOAD_RANGE = 1 satisfies number;
export const DEFAULT_AUTO_LOAD_360 = false satisfies boolean;
export const DEFAULT_AUTO_LOAD_INTERIOR_360 = false satisfies boolean;

export const DEFAULT_CATEGORY_FILTER = "*" satisfies string;
export const DEFAULT_EXTEND_BEHAVIOR = "full_screen" satisfies ExtendBehavior;
export const DEFAULT_EVENT_PREFIX = "cc-webplayer:" satisfies string;
export const DEFAULT_DEMO_SPIN = false satisfies boolean;
export const DEFAULT_REVERSE_360 = false satisfies boolean;
export const DEFAULT_INTEGRATION = false satisfies boolean;
export const DEFAULT_MAX_ITEMS_SHOWN = 1 satisfies number;

export const DEFAULT_ANALYTICS_URL = "" satisfies string;
export const DEFAULT_ANALYTICS_BEARER = "" satisfies string;
export const DEFAULT_ANALYTICS_SIMPLE_REQUESTS_ONLY = false satisfies boolean;
export const DEFAULT_ANALYTICS_DRY_RUN = false satisfies boolean;
export const DEFAULT_ANALYTICS_DEBUG = false satisfies boolean;
