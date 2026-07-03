import type { WebplayerAction } from "../webplayer-action";
import type { WebplayerDisplayedItem } from "../webplayer-displayed-item";
import type { WebplayerError } from "../webplayer-error";

export type AnalyticsErrorEventProps = {
  type: "error";
  current?: WebplayerDisplayedItem;
  action?: WebplayerAction;
  error: WebplayerError;
};
