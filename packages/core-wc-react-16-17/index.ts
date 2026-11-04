import { ensureCustomElementsDefinition as ensure } from "@car-cutter/core-wc";

import { renderer } from "./src/renderer";

/**
 * Defines WebPlayer's custom elements in the DOM, rendered with React 16.8 / 17,
 * unless they are already defined.
 */
export function ensureCustomElementsDefinition(): void {
  ensure(renderer);
}
