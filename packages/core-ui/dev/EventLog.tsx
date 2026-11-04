import { isValidElement, memo, useLayoutEffect, useRef, useState } from "react";

import type { AnalyticsEventType } from "@car-cutter/analytics";
import {
  EVENT_COMPOSITION_LOAD_ERROR,
  EVENT_COMPOSITION_LOADED,
  EVENT_COMPOSITION_LOADING,
  EVENT_EXTEND_MODE_OFF,
  EVENT_EXTEND_MODE_ON,
  EVENT_GALLERY_CLOSE,
  EVENT_GALLERY_OPEN,
  EVENT_HOTSPOTS_OFF,
  EVENT_HOTSPOTS_ON,
  EVENT_ITEM_CHANGE,
} from "@car-cutter/core";

const PLAYER_EVENTS = [
  EVENT_COMPOSITION_LOADING,
  EVENT_COMPOSITION_LOADED,
  EVENT_COMPOSITION_LOAD_ERROR,
  EVENT_ITEM_CHANGE,
  EVENT_EXTEND_MODE_ON,
  EVENT_EXTEND_MODE_OFF,
  EVENT_HOTSPOTS_ON,
  EVENT_HOTSPOTS_OFF,
  EVENT_GALLERY_OPEN,
  EVENT_GALLERY_CLOSE,
];

const ANALYTICS_EVENTS: AnalyticsEventType[] = [
  "load",
  "display",
  "interaction",
  "error",
];

/** Most recent first, at most */
const MAX_ENTRIES = 100;

/** The detail is stringified once, when the event is received */
type Entry = { id: number; time: string; name: string; detail: string };

/**
 * The detail of an event, readable: errors (composition-load-error) would be
 * "{}", and the React elements of custom medias (item-change) hold circular
 * references to their fibers (repeated objects are only shown once)
 */
function stringifyDetail(detail: unknown): string {
  const seen = new WeakSet<object>();

  try {
    return (
      JSON.stringify(
        detail,
        (_key, value: unknown) => {
          if (value instanceof Error) {
            return { name: value.name, message: value.message };
          }
          if (isValidElement(value)) return "[React element]";
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return "[Repeated]";
            seen.add(value);
          }
          return value;
        },
        2
      ) ?? "—"
    );
  } catch (error) {
    return `Not serializable: ${error}`;
  }
}

type Props = {
  eventPrefix: string;
  analyticsEventPrefix: string;
};

/** The events the player dispatches on the document, as a host page gets them */
const EventLog: React.FC<Props> = memo(function EventLog({
  eventPrefix,
  analyticsEventPrefix,
}) {
  const [entries, setEntries] = useState<Entry[]>([]);
  // Kept with the entries by Fast Refresh, unlike a module variable
  const nextId = useRef(0);

  // Before the effects of the player, which dispatch events when it mounts
  // or when the prefixes change
  useLayoutEffect(() => {
    const names = [
      ...PLAYER_EVENTS.map(name => eventPrefix + name),
      ...ANALYTICS_EVENTS.map(name => analyticsEventPrefix + name),
    ];
    const onEvent = (event: Event) => {
      const entry: Entry = {
        id: nextId.current++,
        time: new Date().toLocaleTimeString(),
        name: event.type,
        detail: stringifyDetail((event as CustomEvent).detail),
      };
      setEntries(previous => [entry, ...previous].slice(0, MAX_ENTRIES));
    };

    names.forEach(name => document.addEventListener(name, onEvent));
    return () =>
      names.forEach(name => document.removeEventListener(name, onEvent));
  }, [eventPrefix, analyticsEventPrefix]);

  return (
    <section className="pg-log">
      <header>
        <h2 title="In React's StrictMode, the events of the player's mount are dispatched twice">
          Events ({entries.length})
        </h2>
        <button type="button" onClick={() => setEntries([])}>
          Clear
        </button>
      </header>
      <ol>
        {entries.map(({ id, time, name, detail }) => (
          <li key={id}>
            <details>
              <summary>
                <time>{time}</time> {name}
              </summary>
              <pre>{detail}</pre>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
});

export default EventLog;
