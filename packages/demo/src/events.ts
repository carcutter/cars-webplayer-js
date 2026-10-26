import {
  DEFAULT_EVENT_PREFIX,
  EVENT_COMPOSITION_LOADED,
  EVENT_COMPOSITION_LOADING,
  EVENT_COMPOSITION_LOAD_ERROR,
  EVENT_EXTEND_MODE_OFF,
  EVENT_EXTEND_MODE_ON,
  EVENT_GALLERY_CLOSE,
  EVENT_GALLERY_OPEN,
  EVENT_HOTSPOTS_OFF,
  EVENT_HOTSPOTS_ON,
  EVENT_ITEM_CHANGE,
} from "@car-cutter/core";

export const EVENT_PREFIX = DEFAULT_EVENT_PREFIX;

/** Player events dispatched on `document` as `cc-webplayer:<name>` */
export const PLAYER_EVENTS = [
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
] as const;

export type PlayerEventName = (typeof PLAYER_EVENTS)[number];

export interface EventLogEntry {
  id: number;
  time: string;
  name: PlayerEventName;
  detail: string;
}

/** Max entries kept in an event log */
export const EVENT_LOG_LIMIT = 50;

let lastId = 0;

export function createLogEntry(
  name: PlayerEventName,
  detail?: unknown
): EventLogEntry {
  return {
    id: ++lastId,
    time: new Date().toLocaleTimeString([], { hour12: false }),
    name,
    detail: describeEventDetail(name, detail),
  };
}

type CompositionLike = { categories?: { items?: unknown[] }[] };
type ItemChangeLike = { index?: number; item?: { type?: string } };

function describeEventDetail(name: PlayerEventName, detail: unknown): string {
  switch (name) {
    case "composition-loading":
      return typeof detail === "string"
        ? detail.slice(detail.lastIndexOf("/") + 1)
        : "";
    case "composition-loaded": {
      const categories = (detail as CompositionLike)?.categories ?? [];
      const items = categories.reduce(
        (sum, category) => sum + (category.items?.length ?? 0),
        0
      );
      return `${categories.length} categories · ${items} items`;
    }
    case "composition-load-error":
      return String(detail);
    case "item-change": {
      const { index, item } = (detail as ItemChangeLike) ?? {};
      return `#${index} · ${item?.type ?? "unknown"}`;
    }
    default:
      return "";
  }
}
