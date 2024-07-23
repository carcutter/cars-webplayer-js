import type { Position, PositionY } from "@/types/position";
import type { AspectRatio, ImageLoadStrategy } from "@/types/webPlayerProps";

export const DEFAULT_ASPECT_RATIO = "4:3" satisfies AspectRatio;
export const DEFAULT_REVERSE_360 = false;
export const DEFAULT_IMAGE_LOAD_STRATEGY =
  "quality" satisfies ImageLoadStrategy;
export const DEFAULT_FLATTEN = false;
export const DEFAULT_EVENT_ID = "cc-event";
export const DEFAULT_ALLOW_FULL_SCREEN = true;
export const DEFAULT_CATEGORY_POSITION = "top" satisfies PositionY;
export const DEFAULT_OPTIONS_POSITION = "top-right" satisfies Position;
export const DEFAULT_NEXT_PREV_POSITION = "middle" satisfies PositionY;
export const DEFAULT_ZOOM_POSITION = "bottom-center" satisfies Position;
