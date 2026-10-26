import { describe, expect, it, vi } from "vitest";

import { patchWebComponentProps, propsToAttributes } from "./utils";

describe("propsToAttributes", () => {
  it("dash-cases keys, stringifies values and skips undefined ones", () => {
    expect(
      propsToAttributes({
        compositionUrl: "https://x/c.json",
        permanentGallery: false,
        maxItemsShown: 2,
        autoLoad360: true,
        eventPrefix: undefined,
      })
    ).toEqual({
      "composition-url": "https://x/c.json",
      "permanent-gallery": "false",
      "max-items-shown": "2",
      "auto-load360": "true",
    });
  });
});

const R2WC_PROPS = Symbol.for("r2wc.props");
const R2WC_RENDER = Symbol.for("r2wc.render");

type FakeElement = HTMLElement & {
  [R2WC_PROPS]: Record<string, unknown>;
  [R2WC_RENDER]: () => void;
  flag?: unknown;
  count?: unknown;
  label?: unknown;
};

/**
 * Mimics what r2wc does with the props it's given: typed property setters
 * reflected to attributes, and an attributeChangedCallback that parses
 * non-empty values only
 */
function defineFakeR2wcElement(tag: string, props: Record<string, string>) {
  const render = vi.fn();
  const attributeOf = (name: string) =>
    name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

  class FakeR2wc extends HTMLElement {
    [R2WC_PROPS]: Record<string, unknown> = {};
    [R2WC_RENDER] = render;

    static get observedAttributes() {
      return Object.keys(props).map(attributeOf);
    }

    attributeChangedCallback(
      name: string,
      _old: string | null,
      value: string | null
    ) {
      const prop = Object.keys(props).find(key => attributeOf(key) === name);
      if (!prop || !value) return;
      this[R2WC_PROPS][prop] =
        props[prop] === "boolean"
          ? /^[ty1-9]/i.test(value)
          : props[prop] === "number"
          ? parseFloat(value)
          : value;
      this[R2WC_RENDER]();
    }
  }

  Object.keys(props).forEach(name => {
    Object.defineProperty(FakeR2wc.prototype, name, {
      configurable: true,
      get(this: FakeElement) {
        return this[R2WC_PROPS][name];
      },
      set(this: FakeElement, value: unknown) {
        this[R2WC_PROPS][name] = value;
        const reflected =
          props[name] === "boolean" ? (value ? "true" : "false") : `${value}`;
        if (this.getAttribute(attributeOf(name)) !== reflected) {
          this.setAttribute(attributeOf(name), reflected);
        }
      },
    });
  });

  return { FakeR2wc, render };
}

describe("patchWebComponentProps", () => {
  const props = { flag: "boolean", count: "number", label: "string" };
  const { FakeR2wc, render } = defineFakeR2wcElement("x-patched", props);
  patchWebComponentProps(FakeR2wc, props);
  customElements.define("x-patched", FakeR2wc);

  const create = () => {
    const el = document.createElement("x-patched") as FakeElement;
    document.body.append(el);
    return el;
  };

  it('parses a "false" string set on a boolean property (#229)', () => {
    const el = create();
    el.flag = "false";
    expect(el.flag).toBe(false);
    expect(el.getAttribute("flag")).toBe("false");

    el.flag = "true";
    expect(el.flag).toBe(true);
  });

  it("keeps real booleans and numbers as they are", () => {
    const el = create();
    el.flag = true;
    el.count = 2;
    expect(el.flag).toBe(true);
    expect(el.count).toBe(2);
  });

  it("parses a number string set on a number property", () => {
    const el = create();
    el.setAttribute("count", "3");
    el.count = "3";
    expect(el.count).toBe(3);
  });

  it("leaves string properties untouched", () => {
    const el = create();
    el.label = "hello";
    expect(el.label).toBe("hello");
  });

  it("resets the prop and re-renders when its attribute is removed (#235)", () => {
    const el = create();
    el.setAttribute("flag", "true");
    expect(el.flag).toBe(true);
    render.mockClear();

    el.removeAttribute("flag");

    expect(el.flag).toBeUndefined();
    expect("flag" in el[R2WC_PROPS]).toBe(false);
    expect(render).toHaveBeenCalledTimes(1);
  });

  it("still lets r2wc parse attribute values", () => {
    const el = create();
    el.setAttribute("count", "7");
    expect(el.count).toBe(7);
  });

  it("ignores props without a property setter", () => {
    class Plain extends HTMLElement {
      static get observedAttributes() {
        return ["flag"];
      }
      attributeChangedCallback = vi.fn();
    }
    patchWebComponentProps(Plain, { flag: "boolean" });
    expect(
      Object.getOwnPropertyDescriptor(Plain.prototype, "flag")
    ).toBeUndefined();
  });

  it("passes the removal of an unknown attribute on to r2wc", () => {
    const original = vi.fn();
    class Other extends HTMLElement {}
    Other.prototype.attributeChangedCallback = original;
    patchWebComponentProps(Other, { flag: "boolean" });

    Other.prototype.attributeChangedCallback.call(
      document.createElement("div"),
      "unknown",
      "a",
      null
    );

    expect(original).toHaveBeenCalledWith("unknown", "a", null);
  });
});
