import { useCallback, useState } from "react";

import {
  EVENT_LOG_LIMIT,
  createLogEntry,
  type EventLogEntry,
  type PlayerEventName,
} from "../events";

export function useEventLog() {
  const [entries, setEntries] = useState<EventLogEntry[]>([]);
  const [total, setTotal] = useState(0);

  const log = useCallback((name: PlayerEventName, detail?: unknown) => {
    // Created outside the updater, which StrictMode calls twice in dev
    const entry = createLogEntry(name, detail);
    setEntries(prev => [entry, ...prev].slice(0, EVENT_LOG_LIMIT));
    setTotal(prev => prev + 1);
  }, []);

  const clear = useCallback(() => {
    setEntries([]);
    setTotal(0);
  }, []);

  return { entries, total, log, clear };
}

type Props = ReturnType<typeof useEventLog> & { source: string };

export function EventLog({ entries, total, clear, source }: Props) {
  return (
    <details className="dm-events" open>
      <summary className="dm-events__summary">
        <span>Player events</span>
        <span className="dm-events__count">{total}</span>
      </summary>
      <div className="dm-events__body">
        <div className="dm-events__toolbar">
          <span>{source}</span>
          <button type="button" className="dm-events__clear" onClick={clear}>
            Clear
          </button>
        </div>
        {entries.length === 0 && (
          <p className="dm-events__empty">Waiting for events…</p>
        )}
        <ol className="dm-events__list">
          {entries.map(entry => (
            <li key={entry.id} className="dm-events__entry">
              <span className="dm-events__time">{entry.time}</span>
              <span className="dm-events__name">{entry.name}</span>
              <span className="dm-events__detail">{entry.detail}</span>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}
