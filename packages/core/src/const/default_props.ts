import type { MediaLoadStrategy, MediaWidth } from "../types/misc";

export const DEFAULT_HIDE_CATEGORIES = false satisfies boolean;
export const DEFAULT_INFINITE_CARROUSEL = false satisfies boolean;
export const DEFAULT_PERMANENT_GALLERY = false satisfies boolean;

export const DEFAULT_MEDIA_LOAD_STRATEGY =
  "quality" satisfies MediaLoadStrategy;
export const DEFAULT_MIN_MEDIA_WIDTH = 0 satisfies MediaWidth;
export const DEFAULT_MAX_MEDIA_WIDTH = Infinity satisfies MediaWidth;
export const DEFAULT_PRELOAD_RANGE = 1 satisfies number;

export const DEFAULT_PREVENT_FULL_SCREEN = false satisfies boolean;
export const DEFAULT_EVENT_PREFIX = "cc-webplayer:" satisfies string;
export const DEFAULT_REVERSE_360 = false satisfies boolean;
