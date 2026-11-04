import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createElementClass, type Renderer } from "./element";

type Props = { flag?: boolean; maxCount?: number; label?: string };
type Element = HTMLElement & Record<keyof Props, unknown>;

const Component = () => null;

const renderer = {
  render: vi.fn(),
  unmount: vi.fn(),
} satisfies Renderer;

const ELEMENT_PROPS = {
  flag: "boolean",
  maxCount: "number",
  label: "string",
} as const;

customElements.define(
  "x-element",
  createElementClass<Props>(Component, ELEMENT_PROPS, renderer)
);

const lastProps = () => renderer.render.mock.lastCall?.[2];

/** Lets the render scheduled in a microtask run */
const flush = () => Promise.resolve();

async function create(attributes: Record<string, string> = {}) {
  const el = document.createElement("x-element") as Element;
  Object.entries(attributes).forEach(([key, value]) =>
    el.setAttribute(key, value)
  );
  document.body.append(el);
  await flush();
  return el;
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
});

afterEach(() => {
  document.body.replaceChildren();
  vi.runAllTimers();
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("createElementClass", () => {
  it("observes the dash-cased attribute of every prop", () => {
    expect(
      (
        customElements.get("x-element") as unknown as {
          observedAttributes: string[];
        }
      ).observedAttributes
    ).toEqual(["flag", "max-count", "label"]);
  });

  it("renders the component in a closed shadow root, with the parsed attributes", async () => {
    const el = await create({ flag: "true", "max-count": "3", label: "a" });

    expect(el.shadowRoot).toBeNull();
    expect(renderer.render).toHaveBeenCalledTimes(1);
    expect(renderer.render).toHaveBeenLastCalledWith(
      expect.any(ShadowRoot),
      Component,
      { flag: true, maxCount: 3, label: "a" }
    );
  });

  it.each([
    ["true", true],
    ["yes", true],
    ["1", true],
    ["false", false],
    ["0", false],
  ])('reads the boolean attribute "%s" as %s', async (value, expected) => {
    await create({ flag: value });
    expect(lastProps()).toEqual({ flag: expected });
  });

  it("leaves out the props without attribute, empty or invalid", async () => {
    await create({ label: "", flag: "", "max-count": "auto" });
    expect(lastProps()).toEqual({});
  });

  it("renders once connected, then once for the changes made in a row", async () => {
    const el = document.createElement("x-element") as Element;
    el.setAttribute("label", "a");
    await flush();
    expect(renderer.render).not.toHaveBeenCalled();

    document.body.append(el);
    await flush();
    el.setAttribute("label", "b");
    el.setAttribute("flag", "true");
    await flush();

    expect(renderer.render).toHaveBeenCalledTimes(2);
    expect(lastProps()).toEqual({ label: "b", flag: true });
  });

  it("unsets a prop when its attribute is removed (#235)", async () => {
    const el = await create({ flag: "true" });

    el.removeAttribute("flag");
    await flush();

    expect(lastProps()).toEqual({});
  });

  describe("properties", () => {
    it("read the parsed attributes", async () => {
      const el = await create({ flag: "false", "max-count": "2" });

      expect(el.flag).toBe(false);
      expect(el.maxCount).toBe(2);
      expect(el.label).toBeUndefined();
    });

    it("set the attributes, as the player reads some of them", async () => {
      const el = await create();

      el.flag = true;
      el.maxCount = 4;
      el.label = "a";
      await flush();

      expect(el.getAttribute("flag")).toBe("true");
      expect(el.getAttribute("max-count")).toBe("4");
      expect(lastProps()).toEqual({ flag: true, maxCount: 4, label: "a" });
    });

    it('parse a "false" or "3" string like the attribute (#229)', async () => {
      const el = await create();

      el.flag = "false";
      el.maxCount = "3";
      await flush();

      expect(el.flag).toBe(false);
      expect(el.maxCount).toBe(3);
      expect(lastProps()).toEqual({ flag: false, maxCount: 3 });
    });

    it.each([null, undefined])(
      "remove the attribute when set to %s",
      async value => {
        const el = await create({ label: "a" });

        el.label = value;
        await flush();

        expect(el.hasAttribute("label")).toBe(false);
        expect(lastProps()).toEqual({});
      }
    );

    it("don't render again for the value they already have", async () => {
      const el = await create({ "max-count": "2" });

      el.maxCount = 2;
      await flush();

      expect(renderer.render).toHaveBeenCalledTimes(1);
    });

    it("keep the values set before the element was defined", async () => {
      const el = document.createElement("x-later") as Element;
      el.setAttribute("max-count", "2");
      el.flag = false;
      el.label = "a";
      el.maxCount = undefined;
      document.body.append(el);

      customElements.define(
        "x-later",
        createElementClass<Props>(Component, ELEMENT_PROPS, renderer)
      );
      await flush();

      expect(Object.keys(el)).toEqual([]);
      expect(el.getAttribute("flag")).toBe("false");
      expect(lastProps()).toEqual({ flag: false, label: "a", maxCount: 2 });
    });
  });

  describe("removal", () => {
    it("unmounts the component once the element is removed", async () => {
      const el = await create();
      el.remove();
      expect(renderer.unmount).not.toHaveBeenCalled();

      vi.runAllTimers();

      expect(renderer.unmount).toHaveBeenCalledWith(
        renderer.render.mock.lastCall?.[0]
      );
    });

    it("keeps the component of an element moved in the DOM", async () => {
      const el = await create();
      const other = document.createElement("div");
      document.body.append(other);

      other.append(el);
      await flush();
      vi.runAllTimers();

      expect(renderer.unmount).not.toHaveBeenCalled();
      expect(renderer.render).toHaveBeenCalledTimes(2);
    });

    it("doesn't render a removed element on changes", async () => {
      const el = await create();
      el.remove();
      renderer.render.mockClear();

      el.setAttribute("label", "a");
      await flush();

      expect(renderer.render).not.toHaveBeenCalled();
    });
  });
});
