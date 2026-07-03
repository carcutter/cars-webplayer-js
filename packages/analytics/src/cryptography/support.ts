/**
 * Indicates whether the runtime supports `crypto.randomUUID`.
 *
 * This API provides a native, cryptographically secure UUID v4 generator
 * in modern browsers and Node.js environments.
 *
 * @returns {boolean} True if `crypto.randomUUID` is available.
 */
export const isCryptoRandomUUIDSupported =
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function";

/**
 * Indicates whether the runtime supports `crypto.getRandomValues`.
 *
 * This API is used as a secure entropy source for UUID generation
 * in environments where `crypto.randomUUID` is not available.
 *
 * @returns {boolean} True if `crypto.getRandomValues` is available.
 */
export const isCryptoGetRandomValuesSupported =
  typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function";
