import type { MediaItem, WebPlayerCustomMediaProps } from "@car-cutter/core";

export type CustomMedia = WebPlayerCustomMediaProps & {
  Media: React.ReactNode;
};

type CustomItem = {
  type: "custom";
} & CustomMedia;

export type CustomizableItem = MediaItem | CustomItem;
