export type CamelToDashed<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Lowercase<T> ? "" : "-"}${Lowercase<T>}${CamelToDashed<U>}`
  : S;
export type ToStringOrOptional<T> = T extends undefined
  ? string | undefined
  : string;
export type PropsToAttributes<T> = {
  [K in keyof T as CamelToDashed<string & K>]: ToStringOrOptional<T[K]>;
};

function camelToDashedCase<T extends string>(camelCase: T): CamelToDashed<T> {
  return camelCase.replace(
    /([a-z0-9])([A-Z])/g,
    (_, a, b) => `${a}-${b.toLowerCase()}`
  ) as CamelToDashed<T>;
}

/**
 * Used to reverse "@r2wc/react-to-web-component" attributes transformation
 * Inspired by https://github.com/bitovi/react-to-web-component/blob/main/packages/core/src/utils.ts
 */
export function propsToAttributes<T extends object>(
  props: T
): PropsToAttributes<T> {
  return Object.entries(props).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      const dashedKey = camelToDashedCase(key) as keyof PropsToAttributes<T>;
      acc[dashedKey] = value.toString();
    }
    return acc;
  }, {} as PropsToAttributes<T>);
}

const R2WC_PROPS = Symbol.for("r2wc.props");
const R2WC_RENDER = Symbol.for("r2wc.render");

type R2wcElement = HTMLElement & {
  [R2WC_PROPS]: Record<string, unknown>;
  [R2WC_RENDER]: () => void;
};

/** Parse strings like r2wc parses "boolean" and "number" attributes */
const STRING_PARSERS: Record<string, ((value: string) => unknown) | undefined> =
  {
    boolean: value => /^[ty1-9]/i.test(value),
    number: value => parseFloat(value),
  };

/**
 * Fixes two r2wc behaviours on an element it created:
 * - A value set on a typed property is stored as is, then reflected to the
 *   attribute: a "false" string set as a property (as Vue does for props
 *   matching a property name) ended up `true`, a "3" string stayed a string.
 *   Strings are now parsed like attributes before reaching its setter.
 * - Removing an attribute was ignored, so the element kept the last value.
 *   The prop is now reset, letting the component use its default again.
 */
export function patchWebComponentProps(
  element: CustomElementConstructor,
  props: Record<string, string>
): void {
  const propsByAttribute: Record<string, string> = {};

  Object.entries(props).forEach(([name, type]) => {
    propsByAttribute[camelToDashedCase(name)] = name;

    const parse = STRING_PARSERS[type];
    const descriptor = Object.getOwnPropertyDescriptor(element.prototype, name);
    if (!parse || !descriptor?.set) {
      return;
    }

    const { set } = descriptor;
    Object.defineProperty(element.prototype, name, {
      ...descriptor,
      set(value: unknown) {
        set.call(this, typeof value === "string" ? parse(value) : value);
      },
    });
  });

  const { attributeChangedCallback } = element.prototype;
  element.prototype.attributeChangedCallback = function (
    this: R2wcElement,
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    const prop = propsByAttribute[name];
    if (prop && newValue === null) {
      delete this[R2WC_PROPS][prop];
      this[R2WC_RENDER]();
      return;
    }

    attributeChangedCallback.call(this, name, oldValue, newValue);
  };
}
