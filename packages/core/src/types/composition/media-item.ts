import type { ImageItem } from "./image";
import type { InteriorThreeSixtyItem } from "./interior-three-sixty";
import type { NextGenThreeSixtyItem } from "./next-three-sixty";
import type { ThreeSixtyItem } from "./three-sixty";
import type { VideoItem } from "./video";

export type MediaItem =
  | ImageItem
  | VideoItem
  | ThreeSixtyItem
  | NextGenThreeSixtyItem
  | InteriorThreeSixtyItem;
