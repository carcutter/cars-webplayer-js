import type { Item } from "@car-cutter/core/src/types/composition";

import { WebPlayerCustomMediaProps } from "./WebPlayerCustomMedia.props";

export type CustomMedia = WebPlayerCustomMediaProps & {
  Media: React.ReactNode;
};

type CustomItem = {
  type: "custom";
} & CustomMedia;

export type CustomisableItem = Item | CustomItem;
