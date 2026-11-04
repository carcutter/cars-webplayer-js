import type { ComponentType } from "react";

import { camelToDashedCase } from "./utils";

/** Types of the props an element reads from its attributes */
export type PropType = "string" | "number" | "boolean";

/**
 * Renders a component into the shadow root of an element, with the React the
 * element is built for (React 18+, React 16 / 17, or preact through its
 * React aliases)
 */
export interface Renderer {
  /** Renders the component, or renders it again with new props */
  render<P extends object>(
    container: ShadowRoot,
    Component: ComponentType<P>,
    props: P
  ): void;
  unmount(container: ShadowRoot): void;
}

/** Parse a non-empty attribute value: undefined leaves the prop unset */
const PARSERS: Record<PropType, (value: string) => unknown> = {
  string: value => value,
  // "true", "yes", "1"... are true
  boolean: value => /^[ty1-9]/i.test(value),
  number: value => {
    const number = parseFloat(value);
    return Number.isNaN(number) ? undefined : number;
  },
};

/**
 * A custom element rendering a component in a closed shadow root.
 *
 * Its attributes hold its state: each prop is read from its dash-cased
 * attribute, and setting the property of the same name sets the attribute
 * (as frameworks like Vue set properties, the player reads some attributes,
 * and a "false" or "3" string is parsed like the attribute). Removing the
 * attribute, or setting the property to null or undefined, unsets the prop,
 * so that the component uses its default again. So does an empty value, or
 * a number that isn't one.
 */
export function createElementClass<P extends object>(
  Component: ComponentType<P>,
  propTypes: { [K in keyof P & string]?: PropType },
  renderer: Renderer
): CustomElementConstructor {
  const props = Object.entries(propTypes) as [string, PropType][];
  const attributes = props.map(([name]) => camelToDashedCase(name));

  function readProp(element: HTMLElement, index: number): unknown {
    const value = element.getAttribute(attributes[index]);
    return value ? PARSERS[props[index][1]](value) : undefined;
  }

  class WebComponent extends HTMLElement {
    static observedAttributes = [...attributes];

    readonly #root = this.attachShadow({ mode: "closed" });
    #renderPending = false;
    #unmountTimer: ReturnType<typeof setTimeout> | undefined;

    connectedCallback() {
      clearTimeout(this.#unmountTimer);

      // A property set before the element was defined is an own property of
      // the instance, hiding the accessors: set it again through them (an
      // undefined one would remove an attribute that may be set)
      props.forEach(([name]) => {
        if (Object.prototype.hasOwnProperty.call(this, name)) {
          const self = this as unknown as Record<string, unknown>;
          const value = self[name];
          delete self[name];
          if (value !== undefined) {
            self[name] = value;
          }
        }
      });

      this.#scheduleRender();
    }

    disconnectedCallback() {
      // Deferred: an element moved in the DOM is connected again right away,
      // and React warns about unmounting a root while it renders (the
      // element can be removed by a render of the page)
      this.#unmountTimer = setTimeout(() => renderer.unmount(this.#root));
    }

    attributeChangedCallback() {
      this.#scheduleRender();
    }

    /**
     * Renders once for all the attributes set in a row (on upgrade, or by a
     * framework setting several props)
     */
    #scheduleRender() {
      if (this.#renderPending) {
        return;
      }

      this.#renderPending = true;
      queueMicrotask(() => {
        this.#renderPending = false;
        if (this.isConnected) {
          this.#render();
        }
      });
    }

    #render() {
      const values: Record<string, unknown> = {};
      props.forEach(([name], index) => {
        const value = readProp(this, index);
        if (value !== undefined) {
          values[name] = value;
        }
      });

      renderer.render(this.#root, Component, values as P);
    }
  }

  props.forEach(([name], index) => {
    Object.defineProperty(WebComponent.prototype, name, {
      configurable: true,
      enumerable: true,
      get(this: HTMLElement) {
        return readProp(this, index);
      },
      set(this: HTMLElement, value: unknown) {
        if (value === null || value === undefined) {
          this.removeAttribute(attributes[index]);
        } else if (this.getAttribute(attributes[index]) !== String(value)) {
          this.setAttribute(attributes[index], String(value));
        }
      },
    });
  });

  return WebComponent;
}
