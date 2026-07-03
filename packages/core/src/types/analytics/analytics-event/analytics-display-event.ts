import type { WebplayerDisplayedItem } from "../webplayer-displayed-item";
import type { WebplayerInstance } from "../webplayer-instance";

export type AnalyticsDisplayEvent = {
  type: "display";
  timestamp: string;
  instance: WebplayerInstance;
  item: WebplayerDisplayedItem;
};
