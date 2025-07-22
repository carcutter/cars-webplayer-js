import type { MediaWidth } from "./types/misc";

/**
 * Generates a URL for fetching the composition JSON for a given customer and vehicle.
 *
 * @param {string} customerToken - The CarCutter Customer Token (computed by hasing the Customer ID with SHA-256).
 * @param {string} vin - The Vehicle Identification Number.
 * @returns {string} The URL to fetch the composition JSON.
 */
export function generateCompositionUrl(
  customerToken: string,
  vin: string
): string {
  return `https://cdn.car-cutter.com/gallery/${customerToken}/${vin}/composition_v3.json`;
}

/**
 * Adds a specified width to a CDN Image source.
 *
 * @param {string} src - The source URL of the image.
 * @param {MediaWidth} width - The width to be added to the URL.
 * @returns {string} - The modified URL with the width included.
 */
export function cdnImgSrcWithWidth(src: string, width: MediaWidth): string {
  const split = src.split("/");
  const fileName = split.pop();
  const directoryName = split.join("/");

  return [directoryName, width, fileName].join("/");
}

/**
 * Gets or generates a browser ID.
 * The ID is stored in the local storage which is obtainable in all tabs of the current browser.
 *
 * @returns {string} The browser ID.
 */
export function getOrGenerateBrowserId(): string {
  const STORAGE_KEY = "car-cutter-webplayer-browser-id";
  const currentId =
    typeof window !== "undefined"
      ? window.localStorage.getItem(STORAGE_KEY)
      : null;
  if (currentId) return currentId;
  const newId = crypto.randomUUID();
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, newId);
  }
  return newId;
}

/**
 * Gets or generates a session ID.
 * The ID is stored in the session storage which is obtainable in the current tab of the same browser.
 *
 * @returns {string} The session ID.
 */
export function getOrGenerateSessionId(): string {
  const STORAGE_KEY = "car-cutter-webplayer-session-id";
  const currentId =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem(STORAGE_KEY)
      : null;
  if (currentId) return currentId;
  const newId = crypto.randomUUID();
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(STORAGE_KEY, newId);
  }
  return newId;
}

/**
 * Generates a unique instance ID.
 * This ID is used to identify the instance of the webplayer.
 *
 * @returns {string} The instance ID.
 */
export function getOrGenerateInstanceId(): string {
  return crypto.randomUUID();
}
