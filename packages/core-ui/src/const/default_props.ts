import { WEB_PLAYER_WC_TAG } from "@car-cutter/core";

import { ImageLoadStrategy } from "../types/WebPlayer.props";

export const DEFAULT_FLATTEN = false;
export const DEFAULT_INFINITE_CARROUSEL = false;
export const DEFAULT_PERMANENT_GALLERY = false;

export const DEFAULT_IMAGE_LOAD_STRATEGY =
  "quality" satisfies ImageLoadStrategy;

export const DEFAULT_ALLOW_FULL_SCREEN = true;
export const DEFAULT_EVENT_PREFIX = `${WEB_PLAYER_WC_TAG}:`;
export const DEFAULT_REVERSE_360 = false;
