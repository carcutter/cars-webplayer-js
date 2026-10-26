import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ANALYTICS_EVENT_DISPLAY,
  ANALYTICS_EVENT_ERROR,
  ANALYTICS_EVENT_INTERACTION,
  ANALYTICS_EVENT_LOAD,
  DEFAULT_ANALYTICS_EVENT_PREFIX,
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

import { WebPlayer, type WebPlayerProps } from "./WebPlayer";

const URL = "https://x/c.json";

afterEach(cleanup);

const dispatch = (name: string, detail?: unknown) =>
  document.dispatchEvent(new CustomEvent(name, { detail }));

const element = (container: HTMLElement) =>
  container.querySelector("cc-webplayer") as HTMLElement;

// Each `on…` prop and the event it listens to
const HANDLERS = [
  ["onCompositionLoading", DEFAULT_EVENT_PREFIX + EVENT_COMPOSITION_LOADING],
  ["onCompositionLoaded", DEFAULT_EVENT_PREFIX + EVENT_COMPOSITION_LOADED],
  [
    "onCompositionLoadError",
    DEFAULT_EVENT_PREFIX + EVENT_COMPOSITION_LOAD_ERROR,
  ],
  ["onItemChange", DEFAULT_EVENT_PREFIX + EVENT_ITEM_CHANGE],
  ["onExtendModeOn", DEFAULT_EVENT_PREFIX + EVENT_EXTEND_MODE_ON],
  ["onExtendModeOff", DEFAULT_EVENT_PREFIX + EVENT_EXTEND_MODE_OFF],
  ["onHotspotsOn", DEFAULT_EVENT_PREFIX + EVENT_HOTSPOTS_ON],
  ["onHotspotsOff", DEFAULT_EVENT_PREFIX + EVENT_HOTSPOTS_OFF],
  ["onGalleryOpen", DEFAULT_EVENT_PREFIX + EVENT_GALLERY_OPEN],
  ["onGalleryClose", DEFAULT_EVENT_PREFIX + EVENT_GALLERY_CLOSE],
  ["onAnalyticsLoad", DEFAULT_ANALYTICS_EVENT_PREFIX + ANALYTICS_EVENT_LOAD],
  [
    "onAnalyticsDisplay",
    DEFAULT_ANALYTICS_EVENT_PREFIX + ANALYTICS_EVENT_DISPLAY,
  ],
  [
    "onAnalyticsInteraction",
    DEFAULT_ANALYTICS_EVENT_PREFIX + ANALYTICS_EVENT_INTERACTION,
  ],
  ["onAnalyticsError", DEFAULT_ANALYTICS_EVENT_PREFIX + ANALYTICS_EVENT_ERROR],
] as const;

describe("<WebPlayer> attributes", () => {
  it("renders <cc-webplayer> with the given props as attributes", () => {
    const { container } = render(
      <WebPlayer
        compositionUrl={URL}
        permanentGallery
        integration={false}
        maxItemsShown={2}
        className="player"
        style={{ width: "50%" }}
      />
    );
    const el = element(container);

    expect(el.getAttribute("composition-url")).toBe(URL);
    expect(el.getAttribute("permanent-gallery")).toBe("true");
    expect(el.getAttribute("integration")).toBe("false");
    expect(el.getAttribute("max-items-shown")).toBe("2");
    expect(el.getAttribute("class")).toBe("player");
    expect(el.style.display).toBe("block");
    expect(el.style.width).toBe("50%");
  });

  it("leaves out props that aren't given, and the class when there's none", () => {
    const { container } = render(<WebPlayer compositionUrl={URL} />);
    const el = element(container);

    expect(el.getAttributeNames().sort()).toEqual(["composition-url", "style"]);
  });

  it("removes an attribute when its prop goes back to undefined", () => {
    const { container, rerender } = render(
      <WebPlayer compositionUrl={URL} permanentGallery />
    );
    rerender(<WebPlayer compositionUrl={URL} />);

    expect(element(container).hasAttribute("permanent-gallery")).toBe(false);
  });

  it("renders its children (custom medias, icons) inside the element", () => {
    const { container } = render(
      <WebPlayer compositionUrl={URL}>
        <span id="child" />
      </WebPlayer>
    );

    expect(element(container).querySelector("#child")).not.toBeNull();
  });
});

describe("<WebPlayer> events", () => {
  it.each(HANDLERS)("calls %s with the event detail", (prop, eventName) => {
    const handler = vi.fn();
    render(<WebPlayer compositionUrl={URL} {...{ [prop]: handler }} />);

    dispatch(eventName, { some: "detail" });

    expect(handler).toHaveBeenCalledExactlyOnceWith({ some: "detail" });
  });

  it("listens with custom event prefixes", () => {
    const onItemChange = vi.fn();
    const onAnalyticsLoad = vi.fn();
    render(
      <WebPlayer
        compositionUrl={URL}
        eventPrefix="a:"
        analyticsEventPrefix="b:"
        onItemChange={onItemChange}
        onAnalyticsLoad={onAnalyticsLoad}
      />
    );

    dispatch(DEFAULT_EVENT_PREFIX + EVENT_ITEM_CHANGE);
    dispatch("a:" + EVENT_ITEM_CHANGE, 1);
    dispatch("b:" + ANALYTICS_EVENT_LOAD, 2);

    expect(onItemChange).toHaveBeenCalledExactlyOnceWith(1);
    expect(onAnalyticsLoad).toHaveBeenCalledExactlyOnceWith(2);
  });

  it("swaps listeners when a handler changes, and removes them on unmount", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender, unmount } = render(
      <WebPlayer compositionUrl={URL} onGalleryOpen={first} />
    );

    rerender(<WebPlayer compositionUrl={URL} onGalleryOpen={second} />);
    dispatch(DEFAULT_EVENT_PREFIX + EVENT_GALLERY_OPEN);
    unmount();
    dispatch(DEFAULT_EVENT_PREFIX + EVENT_GALLERY_OPEN);

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("ignores events without a handler", () => {
    const props: WebPlayerProps = { compositionUrl: URL };
    render(<WebPlayer {...props} />);

    expect(() =>
      dispatch(DEFAULT_EVENT_PREFIX + EVENT_ITEM_CHANGE)
    ).not.toThrow();
  });
});
