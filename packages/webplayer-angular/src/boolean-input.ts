import { booleanAttribute } from "@angular/core";

/**
 * Transform of the boolean inputs: like `booleanAttribute`, so that a bare
 * attribute (`<car-cutter-webplayer permanentGallery>`) is true, but keeps
 * `undefined` (and `null`, for a missing value), so that the web component
 * uses its own default (e.g. demoSpin, monitoring) when the input isn't given
 */
export function optionalBooleanAttribute(value: unknown): boolean | undefined {
  return value == null ? undefined : booleanAttribute(value);
}
