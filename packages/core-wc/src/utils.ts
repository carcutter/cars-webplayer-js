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

/**
 * r2wc stores a value set on a "boolean" property as is, then reflects it to
 * the attribute as `value ? "true" : "false"`: a "false" string set as a
 * property (as Vue does for props matching a property name) ends up `true`.
 * Parses strings like r2wc parses attributes before they reach its setter.
 */
export function parseBooleanProperties(
  element: CustomElementConstructor,
  props: Record<string, string>
): void {
  Object.entries(props).forEach(([name, type]) => {
    if (type !== "boolean") {
      return;
    }

    const descriptor = Object.getOwnPropertyDescriptor(element.prototype, name);
    const set = descriptor?.set;
    if (!descriptor || !set) {
      return;
    }

    Object.defineProperty(element.prototype, name, {
      ...descriptor,
      set(value: unknown) {
        set.call(
          this,
          typeof value === "string" ? /^[ty1-9]/i.test(value) : value
        );
      },
    });
  });
}
