import type { AnalyticsLoadEventProps } from "../analytics-event-props/analytics-load-event-props";
import type { WebplayerInstance } from "../webplayer-instance";

export type AnalyticsLoadEvent = {
  type: "load";
  timestamp: string;
  instance: WebplayerInstance;
  config: AnalyticsLoadEventProps["config"];
};
