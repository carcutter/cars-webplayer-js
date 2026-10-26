import { ref } from "vue";

import {
  EVENT_LOG_LIMIT,
  createLogEntry,
  type EventLogEntry,
  type PlayerEventName,
} from "@car-cutter/demo";

export function useEventLog() {
  const entries = ref<EventLogEntry[]>([]);
  const total = ref(0);

  const log = (name: PlayerEventName, detail?: unknown) => {
    entries.value = [createLogEntry(name, detail), ...entries.value].slice(
      0,
      EVENT_LOG_LIMIT
    );
    total.value++;
  };

  const clear = () => {
    entries.value = [];
    total.value = 0;
  };

  return { entries, total, log, clear };
}
