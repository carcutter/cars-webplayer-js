/**
 * Generates a random UUID v4-like string.
 *
 * The UUID follows the pattern:
 * `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
 *
 * Notes:
 * - Uses `Math.random()` as the entropy source.
 * - Suitable for non-critical identifiers (e.g. DOM IDs, temporary keys).
 * - Not suitable for cryptographic, security-sensitive, or collision-critical use cases.
 *
 * @returns {string} A randomly generated UUID-like string.
 *
 * @example
 * const id = buildUUID();
 * // "3f2504e0-4f89-41d3-9a0c-0305e82c3301"
 */
export function buildUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
