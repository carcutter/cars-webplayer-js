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
