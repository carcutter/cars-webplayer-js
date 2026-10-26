import { mount } from "@vue/test-utils";
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

import WebPlayer from "./WebPlayer.vue";

const ensureCustomElementsDefinition = vi.hoisted(() => vi.fn());
vi.mock("@car-cutter/wc-webplayer", async importOriginal => ({
  ...(await importOriginal<object>()),
  ensureCustomElementsDefinition,
}));

const URL = "https://x/c.json";

// A <cc-webplayer> with an `integration` property, like the real element, and
// which dispatches composition-loading as soon as it's connected
const integrationSetter = vi.fn();
class FakeWebPlayer extends HTMLElement {
  set integration(value: unknown) {
    integrationSetter(value);
  }
  connectedCallback() {
    this.dispatchEvent(
      new CustomEvent(
        (this.getAttribute("event-prefix") ?? DEFAULT_EVENT_PREFIX) +
          EVENT_COMPOSITION_LOADING,
        { bubbles: true, composed: true, detail: "loading.json" }
      )
    );
  }
}
customElements.define("cc-webplayer", FakeWebPlayer);

const wrappers: { unmount: () => void }[] = [];
afterEach(() => {
  wrappers.splice(0).forEach(w => w.unmount());
  integrationSetter.mockClear();
});

function mountPlayer(props: Record<string, unknown> = {}) {
  const wrapper = mount(WebPlayer, {
    props: { compositionUrl: URL, ...props },
    attachTo: document.body,
  });
  wrappers.push(wrapper);
  return { wrapper, el: wrapper.element as HTMLElement };
}

const dispatch = (name: string, detail?: unknown) =>
  document.dispatchEvent(new CustomEvent(name, { detail }));

describe("<WebPlayer> attributes", () => {
  it("defines the custom elements when set up", () => {
    ensureCustomElementsDefinition.mockClear();
    mountPlayer();

    expect(ensureCustomElementsDefinition).toHaveBeenCalledTimes(1);
  });

  it("only sends the props that are given (#228)", () => {
    const { el } = mountPlayer({ permanentGallery: true });

    expect(el.getAttributeNames().sort()).toEqual([
      "composition-url",
      "permanent-gallery",
      "style",
    ]);
  });

  it("sends an explicit false as an attribute, never as a property (#228)", () => {
    const { el } = mountPlayer({ integration: false, monitoring: false });

    expect(el.getAttribute("integration")).toBe("false");
    expect(el.getAttribute("monitoring")).toBe("false");
    expect(integrationSetter).not.toHaveBeenCalled();
  });

  it("follows prop updates and removes the attribute of an undefined prop", async () => {
    const { wrapper, el } = mountPlayer({ permanentGallery: true });

    await wrapper.setProps({ permanentGallery: false });
    expect(el.getAttribute("permanent-gallery")).toBe("false");

    await wrapper.setProps({ permanentGallery: undefined });
    expect(el.hasAttribute("permanent-gallery")).toBe(false);
  });

  it("passes class and style through", () => {
    const { el } = mountPlayer({ class: "player", style: { width: "50%" } });

    expect(el.className).toBe("player");
    expect(el.style.display).toBe("block");
    expect(el.style.width).toBe("50%");
  });

  it("renders its slot inside the element", () => {
    const wrapper = mount(WebPlayer, {
      props: { compositionUrl: URL },
      slots: { default: '<span id="child" />' },
    });
    wrappers.push(wrapper);

    expect(wrapper.element.querySelector("#child")).not.toBeNull();
  });
});

describe("<WebPlayer> events", () => {
  it("catches composition-loading dispatched as soon as the element connects", () => {
    const { wrapper } = mountPlayer();

    expect(wrapper.emitted("compositionLoading")).toEqual([["loading.json"]]);
  });

  // [emit, dispatched event, emitted payload]
  it.each([
    ["compositionLoaded", DEFAULT_EVENT_PREFIX + EVENT_COMPOSITION_LOADED, [1]],
    [
      "compositionLoadError",
      DEFAULT_EVENT_PREFIX + EVENT_COMPOSITION_LOAD_ERROR,
      [1],
    ],
    ["itemChange", DEFAULT_EVENT_PREFIX + EVENT_ITEM_CHANGE, [1]],
    ["extendModeOn", DEFAULT_EVENT_PREFIX + EVENT_EXTEND_MODE_ON, []],
    ["extendModeOff", DEFAULT_EVENT_PREFIX + EVENT_EXTEND_MODE_OFF, []],
    ["hotspotsOn", DEFAULT_EVENT_PREFIX + EVENT_HOTSPOTS_ON, []],
    ["hotspotsOff", DEFAULT_EVENT_PREFIX + EVENT_HOTSPOTS_OFF, []],
    ["galleryOpen", DEFAULT_EVENT_PREFIX + EVENT_GALLERY_OPEN, []],
    ["galleryClose", DEFAULT_EVENT_PREFIX + EVENT_GALLERY_CLOSE, []],
    [
      "analyticsLoad",
      DEFAULT_ANALYTICS_EVENT_PREFIX + ANALYTICS_EVENT_LOAD,
      [1],
    ],
    [
      "analyticsDisplay",
      DEFAULT_ANALYTICS_EVENT_PREFIX + ANALYTICS_EVENT_DISPLAY,
      [1],
    ],
    [
      "analyticsInteraction",
      DEFAULT_ANALYTICS_EVENT_PREFIX + ANALYTICS_EVENT_INTERACTION,
      [1],
    ],
    [
      "analyticsError",
      DEFAULT_ANALYTICS_EVENT_PREFIX + ANALYTICS_EVENT_ERROR,
      [1],
    ],
  ])("emits %s", (emit, eventName, payload) => {
    const { wrapper } = mountPlayer();

    dispatch(eventName, 1);

    expect(wrapper.emitted(emit)).toEqual([payload]);
  });

  it("listens to the new prefixes when they change", async () => {
    const { wrapper } = mountPlayer();

    await wrapper.setProps({ eventPrefix: "a:", analyticsEventPrefix: "b:" });
    dispatch(DEFAULT_EVENT_PREFIX + EVENT_ITEM_CHANGE, "old");
    dispatch("a:" + EVENT_ITEM_CHANGE, "new");
    dispatch("b:" + ANALYTICS_EVENT_LOAD, "analytics");

    expect(wrapper.emitted("itemChange")).toEqual([["new"]]);
    expect(wrapper.emitted("analyticsLoad")).toEqual([["analytics"]]);
  });

  it("stops listening once unmounted", () => {
    const { wrapper } = mountPlayer();
    wrapper.unmount();
    wrappers.splice(wrappers.indexOf(wrapper), 1);

    dispatch(DEFAULT_EVENT_PREFIX + EVENT_ITEM_CHANGE);

    expect(wrapper.emitted("itemChange")).toBeUndefined();
  });
});
