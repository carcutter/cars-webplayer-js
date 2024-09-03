export { default as WebPlayer } from "./src/WebPlayer";
export { default as WebPlayerIcon } from "./src/WebPlayerIcon";

export type {
  ImageLoadStrategy,
  WebPlayerProps,
} from "./src/types/WebPlayer.props";

export type { WebPlayerIconProps } from "./src/types/WebPlayerIcon.props";

// - Events
export { DEFAULT_EVENT_PREFIX } from "./src/const/default_props";
export {
  EVENT_COMPOSITION_LOADING,
  EVENT_COMPOSITION_LOADED,
  EVENT_COMPOSITION_LOAD_ERROR,
  EVENT_EXTEND_MODE_ON,
  EVENT_EXTEND_MODE_OFF,
  EVENT_HOTSPOTS_ON,
  EVENT_HOTSPOTS_OFF,
  EVENT_GALLERY_OPEN,
  EVENT_GALLERY_CLOSE,
} from "./src/const/event";
