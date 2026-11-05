export type CamelToDashed<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Lowercase<T> ? "" : "-"}${Lowercase<T>}${CamelToDashed<U>}`
  : S;
export type ToStringOrOptional<T> = T extends undefined | null
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
    (_, a: string, b: string) => `${a}-${b.toLowerCase()}`
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
    // Unset, like the element's properties set to null or undefined
    if (value !== null && value !== undefined) {
      const dashedKey = camelToDashedCase(key) as keyof PropsToAttributes<T>;
      acc[dashedKey] = String(value) as PropsToAttributes<T>[typeof dashedKey];
    }
    return acc;
  }, {} as PropsToAttributes<T>);
}
