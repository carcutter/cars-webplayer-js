import type { AspectRatio } from "./aspect-ratio";
import type { Category } from "./category";
import type { MediaWidth } from "./media-width";

export type Composition = {
  aspectRatio: AspectRatio;
  imageHdWidth: MediaWidth;
  imageSubWidths: MediaWidth[];
  categories: Category[];
};
