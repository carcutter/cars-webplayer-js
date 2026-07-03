import type { MediaItem } from "./media-item";

export type Category = {
  id: string;
  title: string;
  items: MediaItem[];
};
