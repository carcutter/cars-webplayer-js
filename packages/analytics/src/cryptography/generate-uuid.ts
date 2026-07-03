import { buildUUID } from "./build-uuid";
import { getCryptoRandomValues } from "./get-crypto-random-values";
import {
  isCryptoRandomUUIDSupported,
  isCryptoGetRandomValuesSupported,
} from "./support";

/**
 * Generates a UUID v4 string using the best available runtime capability.
 *
 * Priority order:
 * 1. `crypto.randomUUID()` if supported (modern browsers / Node.js)
 * 2. `crypto.getRandomValues()` based implementation for older environments
 * 3. Math.random-based fallback (least secure, lowest entropy)
 *
 * This ensures compatibility across modern and legacy browsers (including older Safari/iOS).
 *
 * Notes:
 * - Output conforms to UUID v4 format in all branches.
 * - Only the first branch is cryptographically strong by specification.
 *
 * @returns {string} UUID v4 string.
 *
 * @example
 * const id = generateUUID();
 * // "550e8400-e29b-41d4-a716-446655440000"
 */
export function generateUUID(): string {
  if (isCryptoRandomUUIDSupported) {
    return crypto.randomUUID();
  } else if (isCryptoGetRandomValuesSupported) {
    return getCryptoRandomValues();
  } else {
    return buildUUID();
  }
}
