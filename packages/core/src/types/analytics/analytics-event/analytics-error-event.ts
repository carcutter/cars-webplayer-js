import type { WebplayerAction } from "../webplayer-action";
import type { WebplayerDisplayedItem } from "../webplayer-displayed-item";
import type { WebplayerError } from "../webplayer-error";
import type { WebplayerInstance } from "../webplayer-instance";

export type AnalyticsErrorEvent = {
  type: "error";
  timestamp: string;
  instance: WebplayerInstance;
  current?: WebplayerDisplayedItem;
  action?: WebplayerAction;
  error: WebplayerError;
};
