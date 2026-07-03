import type { WebplayerAction } from "../webplayer-action";
import type { WebplayerDisplayedItem } from "../webplayer-displayed-item";

export type AnalyticsInteractionEventProps = {
  type: "interaction";
  current: WebplayerDisplayedItem;
  action: WebplayerAction;
};
