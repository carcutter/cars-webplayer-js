import type { WebplayerAction } from "../webplayer-action";
import type { WebplayerDisplayedItem } from "../webplayer-displayed-item";
import type { WebplayerInstance } from "../webplayer-instance";

export type AnalyticsInteractionEvent = {
  type: "interaction";
  timestamp: string;
  instance: WebplayerInstance;
  current: WebplayerDisplayedItem;
  action: WebplayerAction;
};
