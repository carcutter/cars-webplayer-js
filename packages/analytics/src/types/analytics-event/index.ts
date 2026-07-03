import type { AnalyticsDisplayEvent } from "./analytics-display-event";
import type { AnalyticsErrorEvent } from "./analytics-error-event";
import type { AnalyticsInteractionEvent } from "./analytics-interaction-event";
import type { AnalyticsLoadEvent } from "./analytics-load-event";

export type AnalyticsEvent =
  | AnalyticsLoadEvent
  | AnalyticsDisplayEvent
  | AnalyticsInteractionEvent
  | AnalyticsErrorEvent;
