/**
 * Generates a UUID v4 string using `crypto.getRandomValues`.
 *
 * This is a cryptographically secure fallback used when
 * `crypto.randomUUID()` is not available.
 *
 * Implementation details:
 * - Generates 16 random bytes using Web Crypto API
 * - Forces RFC 4122 UUID v4 compliance:
 *   - Sets version bits (byte 6 → 0x40)
 *   - Sets variant bits (byte 8 → 0x80)
 * - Converts bytes to hexadecimal UUID format
 *
 * Requirements:
 * - Requires `crypto.getRandomValues` support
 *
 * @returns {string} UUID v4 string.
 *
 * @example
 * const id = getCryptoRandomValues();
 * // "550e8400-e29b-41d4-a716-446655440000"
 */
export function getCryptoRandomValues(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
