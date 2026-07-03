import type { AnalyticsDisplayEventProps } from "./analytics-display-event-props";
import type { AnalyticsErrorEventProps } from "./analytics-error-event-props";
import type { AnalyticsInteractionEventProps } from "./analytics-interaction-event-props";
import type { AnalyticsLoadEventProps } from "./analytics-load-event-props";

export type AnalyticsEventProps =
  | AnalyticsLoadEventProps
  | AnalyticsDisplayEventProps
  | AnalyticsInteractionEventProps
  | AnalyticsErrorEventProps;
