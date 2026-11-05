import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
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
} from "@car-cutter/wc-webplayer";

import { WebPlayer } from "./web-player";

const ensureCustomElementsDefinition = vi.hoisted(() => vi.fn());
vi.mock("@car-cutter/wc-webplayer", async importOriginal => ({
  ...(await importOriginal<object>()),
  ensureCustomElementsDefinition,
}));

const URL = "https://x/c.json";

// A <cc-webplayer> with an `integration` property, like the real element, and
// which dispatches composition-loading once it renders with its composition-url
// (on a microtask, like the real element)
const integrationSetter = vi.fn();
class FakeWebPlayer extends HTMLElement {
  static observedAttributes = ["composition-url"];
  set integration(value: unknown) {
    integrationSetter(value);
  }
  attributeChangedCallback() {
    queueMicrotask(() => this.#dispatchLoading());
  }
  #dispatchLoading() {
    this.dispatchEvent(
      new CustomEvent(
        (this.getAttribute("event-prefix") || DEFAULT_EVENT_PREFIX) +
          EVENT_COMPOSITION_LOADING,
        { bubbles: true, composed: true, detail: "loading.json" }
      )
    );
  }
}
customElements.define("cc-webplayer", FakeWebPlayer);

@Component({
  imports: [WebPlayer],
  template: `
    <car-cutter-webplayer
      [compositionUrl]="compositionUrl()"
      [permanentGallery]="permanentGallery()"
      [integration]="integration()"
      [monitoring]="monitoring()"
      [eventPrefix]="eventPrefix()"
      [analyticsEventPrefix]="analyticsEventPrefix()"
      (compositionLoading)="log('compositionLoading', $event)"
      (compositionLoaded)="log('compositionLoaded', $event)"
      (compositionLoadError)="log('compositionLoadError', $event)"
      (itemChange)="log('itemChange', $event)"
      (extendModeOn)="log('extendModeOn')"
      (extendModeOff)="log('extendModeOff')"
      (hotspotsOn)="log('hotspotsOn')"
      (hotspotsOff)="log('hotspotsOff')"
      (galleryOpen)="log('galleryOpen')"
      (galleryClose)="log('galleryClose')"
      (analyticsLoad)="log('analyticsLoad', $event)"
      (analyticsDisplay)="log('analyticsDisplay', $event)"
      (analyticsInteraction)="log('analyticsInteraction', $event)"
      (analyticsError)="log('analyticsError', $event)"
    >
      <span id="child"></span>
    </car-cutter-webplayer>
  `,
})
class Host {
  readonly compositionUrl = signal(URL);
  readonly permanentGallery = signal<boolean | undefined>(undefined);
  readonly integration = signal<boolean | undefined>(undefined);
  readonly monitoring = signal<boolean | null | undefined>(undefined);
  readonly eventPrefix = signal<string | undefined>(undefined);
  readonly analyticsEventPrefix = signal<string | undefined>(undefined);

  readonly emitted: Record<string, unknown[][]> = {};
  log(name: string, ...payload: unknown[]) {
    (this.emitted[name] ??= []).push(payload);
  }
}

afterEach(() => {
  TestBed.resetTestingModule();
  integrationSetter.mockClear();
});

/** Mounts the host, once the element has rendered */
async function mountPlayer(inputs: Partial<Record<keyof Host, unknown>> = {}) {
  const fixture = TestBed.createComponent(Host);
  const host = fixture.componentInstance;
  Object.entries(inputs).forEach(([name, value]) =>
    (host[name as keyof Host] as ReturnType<typeof signal>).set(value)
  );
  fixture.detectChanges();
  await Promise.resolve();

  const el = (fixture.nativeElement as HTMLElement).querySelector(
    "cc-webplayer"
  ) as HTMLElement;
  return { fixture, host, el };
}

/** An event of the player, dispatched from its element like the real one */
const dispatch = (name: string, detail?: unknown) =>
  document
    .querySelector("cc-webplayer")!
    .dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));

describe("<car-cutter-webplayer> attributes", () => {
  it("defines the custom elements when loaded", async () => {
    ensureCustomElementsDefinition.mockClear();
    vi.resetModules();
    await import("./web-player");

    expect(ensureCustomElementsDefinition).toHaveBeenCalledTimes(1);
  });

  it("only sends the inputs that are given (#228)", async () => {
    const { el } = await mountPlayer({ permanentGallery: true });

    expect(el.getAttributeNames().sort()).toEqual([
      "composition-url",
      "permanent-gallery",
      "style",
    ]);
    expect(el.getAttribute("composition-url")).toBe(URL);
  });

  it("sends an explicit false as an attribute, never as a property (#228)", async () => {
    const { el } = await mountPlayer({ integration: false, monitoring: false });

    expect(el.getAttribute("integration")).toBe("false");
    expect(el.getAttribute("monitoring")).toBe("false");
    expect(integrationSetter).not.toHaveBeenCalled();
  });

  it("leaves a null boolean input unset, like an undefined one", async () => {
    const { el } = await mountPlayer({ monitoring: null });

    expect(el.hasAttribute("monitoring")).toBe(false);
  });

  it("follows input updates and removes the attribute of an undefined input", async () => {
    const { fixture, host, el } = await mountPlayer({ permanentGallery: true });

    host.permanentGallery.set(false);
    fixture.detectChanges();
    expect(el.getAttribute("permanent-gallery")).toBe("false");

    host.permanentGallery.set(undefined);
    fixture.detectChanges();
    expect(el.hasAttribute("permanent-gallery")).toBe(false);
  });

  it("projects its content inside the element", async () => {
    const { el } = await mountPlayer();

    expect(el.querySelector("#child")).not.toBeNull();
  });
});

describe("<car-cutter-webplayer> boolean inputs", () => {
  @Component({
    imports: [WebPlayer],
    template: `<car-cutter-webplayer
      compositionUrl="u"
      permanentGallery
      demoSpin="false"
    />`,
  })
  class StaticHost {}

  it("reads bare and static attributes like booleanAttribute", () => {
    const fixture = TestBed.createComponent(StaticHost);
    fixture.detectChanges();
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      "cc-webplayer"
    )!;

    expect(el.getAttribute("permanent-gallery")).toBe("true");
    expect(el.getAttribute("demo-spin")).toBe("false");
  });
});

describe("<car-cutter-webplayer> created outside of a change detection", () => {
  // As with createComponent from an event handler: the element renders on a
  // microtask, before the next change detection
  function createPlayer() {
    const fixture = TestBed.createComponent(WebPlayer);
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      "cc-webplayer"
    )!;
    const loading: string[] = [];
    fixture.componentInstance.compositionLoading.subscribe(url =>
      loading.push(url)
    );
    return { fixture, el, loading };
  }

  it("gets its attributes and listeners before the element renders", async () => {
    const { fixture, el, loading } = createPlayer();
    fixture.componentRef.setInput("compositionUrl", URL);
    fixture.componentRef.setInput("eventPrefix", "early:");

    await Promise.resolve();
    expect(el.getAttribute("composition-url")).toBe(URL);
    await Promise.resolve();
    expect(loading).toEqual(["loading.json"]);
  });

  it("waits for the change detection when a required input isn't set", async () => {
    const { el } = createPlayer();

    await Promise.resolve();

    expect(el.hasAttribute("composition-url")).toBe(false);
  });

  it("reports the errors other than a missing required input", () => {
    // Runs the microtasks queued at creation here, to catch what they throw
    const microtasks: VoidFunction[] = [];
    const spy = vi
      .spyOn(globalThis, "queueMicrotask")
      .mockImplementation(callback => microtasks.push(callback));
    const { fixture } = createPlayer();
    spy.mockRestore();
    fixture.componentRef.setInput("compositionUrl", {
      toString: () => {
        throw new Error("broken");
      },
    });

    expect(() => microtasks.forEach(callback => callback())).toThrow("broken");
  });

  it("does nothing once destroyed", async () => {
    const { fixture, loading } = createPlayer();
    fixture.componentRef.setInput("compositionUrl", URL);
    fixture.destroy();

    await Promise.resolve();
    dispatch(DEFAULT_EVENT_PREFIX + EVENT_COMPOSITION_LOADING, "late");

    expect(loading).toEqual([]);
  });
});

describe("<car-cutter-webplayer> events", () => {
  it("catches composition-loading dispatched on the first render", async () => {
    const { host } = await mountPlayer({ eventPrefix: "custom:" });

    expect(host.emitted.compositionLoading).toEqual([["loading.json"]]);
  });

  // [output, dispatched event, emitted payload]
  it.each([
    [
      "compositionLoading",
      DEFAULT_EVENT_PREFIX + EVENT_COMPOSITION_LOADING,
      [1],
    ],
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
  ])("emits %s", async (output, eventName, payload) => {
    const { host } = await mountPlayer();
    delete host.emitted.compositionLoading;

    dispatch(eventName, 1);

    expect(host.emitted[output]).toEqual([payload]);
  });

  it("doesn't emit the events of other players", async () => {
    const { host } = await mountPlayer();
    const other = document.createElement("div");
    document.body.append(other);

    other.dispatchEvent(
      new CustomEvent(DEFAULT_EVENT_PREFIX + EVENT_ITEM_CHANGE, {
        bubbles: true,
      })
    );
    other.remove();

    expect(host.emitted.itemChange).toBeUndefined();
  });

  it("listens with the default prefixes when they are empty", async () => {
    const { host } = await mountPlayer({
      eventPrefix: "",
      analyticsEventPrefix: "",
    });

    dispatch(DEFAULT_EVENT_PREFIX + EVENT_ITEM_CHANGE, 1);
    dispatch(DEFAULT_ANALYTICS_EVENT_PREFIX + ANALYTICS_EVENT_LOAD, 2);

    expect(host.emitted.itemChange).toEqual([[1]]);
    expect(host.emitted.analyticsLoad).toEqual([[2]]);
  });

  it("listens to the new prefixes when they change", async () => {
    const { fixture, host } = await mountPlayer();

    host.eventPrefix.set("a:");
    host.analyticsEventPrefix.set("b:");
    fixture.detectChanges();
    dispatch(DEFAULT_EVENT_PREFIX + EVENT_ITEM_CHANGE, "old");
    dispatch(DEFAULT_ANALYTICS_EVENT_PREFIX + ANALYTICS_EVENT_LOAD, "old");
    dispatch("a:" + EVENT_ITEM_CHANGE, "new");
    dispatch("b:" + ANALYTICS_EVENT_LOAD, "analytics");

    expect(host.emitted.itemChange).toEqual([["new"]]);
    expect(host.emitted.analyticsLoad).toEqual([["analytics"]]);
  });

  it("stops listening once destroyed", async () => {
    const { fixture, host } = await mountPlayer();
    fixture.destroy();

    dispatch(DEFAULT_EVENT_PREFIX + EVENT_ITEM_CHANGE);

    expect(host.emitted.itemChange).toBeUndefined();
  });
});
