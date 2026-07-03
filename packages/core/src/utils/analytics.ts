import { DEFAULT_ANALYTICS_EVENT_PREFIX } from "../const/webplayer-default-props";
import type { AnalyticsEvent } from "../types/analytics/analytics-event";
import type { AnalyticsEventType } from "../types/analytics/analytics-event-type";

/**
 * Adds event listeners to the document and removes previous listeners for the same event name.
 *
 * @param {string} eventName - The name of the event to listen to.
 * @param {Function} listener - The listener function to add.
 */
const _analyticsEventListeners = new Map<string, (event: Event) => void>();

const _addEventListenersAndRemovePrevious = (
  eventName: string,
  listener: (event: Event) => void
) => {
  // Remove the previous listener
  const currentListener = _analyticsEventListeners.get(eventName);
  if (currentListener) document.removeEventListener(eventName, currentListener);
  // Add the new listener
  _analyticsEventListeners.set(eventName, listener);
  document.addEventListener(eventName, listener);
};

export function subscribeToAnalyticsEvents<TType extends AnalyticsEventType>(
  type: TType,
  onEvent: (event: Extract<AnalyticsEvent, { type: TType }>) => void,
  analyticsEventPrefix?: string
) {
  const prefix = analyticsEventPrefix ?? DEFAULT_ANALYTICS_EVENT_PREFIX;
  const eventName = prefix + type;
  _addEventListenersAndRemovePrevious(eventName, (event: Event) => {
    onEvent((event as CustomEvent<Extract<AnalyticsEvent, { type: TType }>>).detail);
  });
}
