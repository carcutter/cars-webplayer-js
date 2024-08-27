export {
  // Default props
  DEFAULT_REVERSE_360,
  DEFAULT_IMAGE_LOAD_STRATEGY,
  DEFAULT_FLATTEN,
  DEFAULT_INFINITE_CARROUSEL,
  DEFAULT_EVENT_ID,
  DEFAULT_ALLOW_FULL_SCREEN,
  DEFAULT_PERMANENT_GALLERY,
  // WC
  WEB_PLAYER_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
} from "./src/const";

export type {
  // Composition
  AspectRatio,
  ImageWidth,
  Hotspot,
  ImageWithHotspots,
  Item,
  Category,
  Composition,
  // WebPlayer
  ImageLoadStrategy,
  WebPlayerProps,
  WebPlayerIconProps,
} from "./src/types";

export { getComposition, cdnImgSrcWithWidth } from "./src/utils";
