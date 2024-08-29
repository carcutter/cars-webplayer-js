import type { WebPlayerProps, WebPlayerIconProps } from "@car-cutter/core-ui";

export type CamelToKebab<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Lowercase<T> ? "" : "-"}${Lowercase<T>}${CamelToKebab<U>}`
  : S;

function camelToDashedCase<T extends string>(camelCase: T): CamelToKebab<T> {
  return camelCase.replace(
    /([a-z0-9])([A-Z])/g,
    (_, a, b) => `${a}-${b.toLowerCase()}`
  ) as CamelToKebab<T>;
}

/**
 * Used to reverse "@r2wc/react-to-web-component" attributes transformation
 * Inspired by https://github.com/bitovi/react-to-web-component/blob/main/packages/core/src/utils.ts
 */
export function propsToAttributes(props: WebPlayerProps | WebPlayerIconProps) {
  const attributes: Record<string, string> = {};

  Object.entries(props).forEach(([key, value]) => {
    attributes[camelToDashedCase(key)] = value.toString();
  });

  return attributes;
}
