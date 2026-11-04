import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  input,
  output,
} from "@angular/core";

import {
  EVENT_LOG_LIMIT,
  createLogEntry,
  type EventLogEntry,
  type PlayerEventName,
} from "@car-cutter/demo";

/** Entries of an event log, the latest first */
export function eventLog() {
  const entries = signal<EventLogEntry[]>([]);
  const total = signal(0);

  const log = (name: PlayerEventName, detail?: unknown) => {
    entries.update(current =>
      [createLogEntry(name, detail), ...current].slice(0, EVENT_LOG_LIMIT)
    );
    total.update(count => count + 1);
  };

  const clear = () => {
    entries.set([]);
    total.set(0);
  };

  return {
    entries: entries.asReadonly(),
    total: total.asReadonly(),
    log,
    clear,
  };
}

@Component({
  selector: "demo-event-log",
  template: `
    <details class="dm-events" open>
      <summary class="dm-events__summary">
        <span>Player events</span>
        <span class="dm-events__count">{{ total() }}</span>
      </summary>
      <div class="dm-events__body">
        <div class="dm-events__toolbar">
          <span>{{ source() }}</span>
          <button type="button" class="dm-events__clear" (click)="clear.emit()">
            Clear
          </button>
        </div>
        @if (empty()) {
          <p class="dm-events__empty">Waiting for events…</p>
        }
        <ol class="dm-events__list">
          @for (entry of entries(); track entry.id) {
            <li class="dm-events__entry">
              <span class="dm-events__time">{{ entry.time }}</span>
              <span class="dm-events__name">{{ entry.name }}</span>
              <span class="dm-events__detail">{{ entry.detail }}</span>
            </li>
          }
        </ol>
      </div>
    </details>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventLog {
  readonly entries = input.required<EventLogEntry[]>();
  readonly total = input.required<number>();
  readonly source = input.required<string>();
  readonly clear = output();

  protected readonly empty = computed(() => this.entries().length === 0);
}
