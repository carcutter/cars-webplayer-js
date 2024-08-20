/**
 * Inspired by https://github.com/bitovi/react-to-web-component/blob/main/packages/core/src/utils.ts
 */

export function camelToDashedCase(camelCase: string): string {
  return camelCase.replace(
    /([a-z0-9])([A-Z])/g,
    (_, a, b) => `${a}-${b.toLowerCase()}`
  );
}

export function dashedToCamelCase(dashedCase: string): string {
  return dashedCase.replace(/[-:]([a-z])/g, (_, b) => `${b.toUpperCase()}`);
}
