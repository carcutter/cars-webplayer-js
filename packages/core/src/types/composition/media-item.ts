import type { ThreeSixtyItem } from "./360";
import type { ImageItem } from "./image";
import type { InteriorThreeSixtyItem } from "./interior360";
import type { NextGenThreeSixtyItem } from "./next360";
import type { VideoItem } from "./video";

export type MediaItem =
  | ImageItem
  | VideoItem
  | ThreeSixtyItem
  | NextGenThreeSixtyItem
  | InteriorThreeSixtyItem;
