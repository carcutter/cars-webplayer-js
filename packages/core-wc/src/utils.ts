export type CamelToDashed<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Lowercase<T> ? "" : "-"}${Lowercase<T>}${CamelToDashed<U>}`
  : S;
export type ToStringOrOptional<T> = T extends undefined
  ? string | undefined
  : string;
export type PropsToAttributes<T> = {
  [K in keyof T as CamelToDashed<string & K>]: ToStringOrOptional<T[K]>;
};

export function camelToDashedCase<T extends string>(
  camelCase: T
): CamelToDashed<T> {
  return camelCase.replace(
    /([a-z0-9])([A-Z])/g,
    (_, a, b) => `${a}-${b.toLowerCase()}`
  ) as CamelToDashed<T>;
}

/**
 * The attributes of the web component for the given props: the reverse of
 * how it reads its props (see createElementClass)
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
