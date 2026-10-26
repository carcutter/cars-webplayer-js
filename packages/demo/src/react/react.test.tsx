import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { EVENT_LOG_LIMIT } from "../events";
import { THEMES } from "../themes";

import {
  DemoPage,
  EventLog,
  useEventLog,
  usePlayerEventHandlers,
} from "./index";

afterEach(cleanup);

describe("<DemoPage>", () => {
  it("renders the themed header, the media and the events", () => {
    const { container, getByText } = render(
      <DemoPage
        theme={THEMES.react}
        media={<i id="media" />}
        events={<i id="events" />}
      />
    );

    expect(getByText(THEMES.react.title)).toBeDefined();
    expect(getByText(THEMES.react.pkg)).toBeDefined();
    expect(container.querySelector(".dm-stage #media")).not.toBeNull();
    expect(container.querySelector(".dm-below #events")).not.toBeNull();
    expect(
      (container.firstChild as HTMLElement).style.getPropertyValue(
        "--dm-header-bg"
      )
    ).toBe(THEMES.react.headerBg);
  });

  it("links to the index once mounted", () => {
    const { container } = render(
      <DemoPage theme={THEMES.react} media={null} events={null} />
    );

    expect(container.querySelector("a")!.getAttribute("href")).toMatch(
      /:4170\/$/
    );
  });
});

describe("useEventLog and <EventLog>", () => {
  it("logs entries newest first, keeps the last ones and clears", () => {
    const { result } = renderHook(() => useEventLog());

    act(() => {
      for (let i = 0; i < EVENT_LOG_LIMIT + 1; i++)
        result.current.log("gallery-open");
      result.current.log("item-change", { index: 3, item: { type: "video" } });
    });

    expect(result.current.total).toBe(EVENT_LOG_LIMIT + 2);
    expect(result.current.entries).toHaveLength(EVENT_LOG_LIMIT);
    expect(result.current.entries[0]).toMatchObject({
      name: "item-change",
      detail: "#3 · video",
    });

    act(() => result.current.clear());
    expect(result.current).toMatchObject({ total: 0, entries: [] });
  });

  it("renders the entries, the source and a working Clear button", () => {
    let cleared = false;
    const { container, getByText, rerender } = render(
      <EventLog
        entries={[]}
        total={0}
        log={() => {}}
        clear={() => (cleared = true)}
        source="Via props"
      />
    );
    expect(getByText("Waiting for events…")).toBeDefined();
    expect(getByText("Via props")).toBeDefined();

    rerender(
      <EventLog
        entries={[
          { id: 1, time: "10:00:00", name: "gallery-open", detail: "" },
        ]}
        total={1}
        log={() => {}}
        clear={() => (cleared = true)}
        source="Via props"
      />
    );
    expect(container.querySelector(".dm-events__name")!.textContent).toBe(
      "gallery-open"
    );
    expect(container.querySelector(".dm-events__empty")).toBeNull();

    fireEvent.click(getByText("Clear"));
    expect(cleared).toBe(true);
  });
});

describe("usePlayerEventHandlers", () => {
  it("logs each event under its name and keeps the same handlers", () => {
    const logged: [string, unknown][] = [];
    const log = (name: string, detail?: unknown) => logged.push([name, detail]);
    const { result, rerender } = renderHook(() => usePlayerEventHandlers(log));
    const first = result.current;

    rerender();
    expect(result.current).toBe(first);

    const h = result.current;
    h.onCompositionLoading("u");
    h.onCompositionLoaded({ categories: [] } as never);
    h.onCompositionLoadError("e");
    h.onItemChange({ index: 1 } as never);
    h.onExtendModeOn();
    h.onExtendModeOff();
    h.onHotspotsOn();
    h.onHotspotsOff();
    h.onGalleryOpen();
    h.onGalleryClose();

    expect(logged.map(([name]) => name)).toEqual([
      "composition-loading",
      "composition-loaded",
      "composition-load-error",
      "item-change",
      "extend-mode-on",
      "extend-mode-off",
      "hotspots-on",
      "hotspots-off",
      "gallery-open",
      "gallery-close",
    ]);
    expect(logged[0]).toEqual(["composition-loading", "u"]);
  });
});
