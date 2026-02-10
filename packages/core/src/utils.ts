import { DEFAULT_ANALYTICS_EVENT_PREFIX } from "./const/default_props";
import { AnalyticsEvent, AnalyticsEventType } from "./types/analytics";
import type { MediaWidth } from "./types/misc";

/**
 * Generates a UUID v4 string.
 * Uses crypto.randomUUID() if available, otherwise falls back to a polyfill
 * for older browsers (Safari < 15.4, iOS < 15.4).
 */
function generateUUID(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  // Fallback for browsers that don't support crypto.randomUUID
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    // Set version (4) and variant (RFC4122)
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join(
      ""
    );
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  // Last resort fallback using Math.random (less secure but works everywhere)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generates a URL for fetching the composition JSON for a given customer and vehicle.
 *
 * @param {string} customerToken - The CarCutter Customer Token (computed by hashing the Customer ID with SHA-256).
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
  const newId = generateUUID();
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
  const newId = generateUUID();
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
  return generateUUID();
}

/**
 * Adds event listeners to the document and removes previous listeners for the same event name.
 *
 * @param {string} eventName - The name of the event to listen to.
 * @param {Function} listener - The listener function to add.
 */
const _analyticsEventListeners = new Map<string, (event: Event) => void>();
const _addEventListenersAndRemovePrevious = (
  eventName: string,
  listener: (event: Event) => void
) => {
  // Remove the previous listener
  const currentListener = _analyticsEventListeners.get(eventName);
  if (currentListener) document.removeEventListener(eventName, currentListener);
  // Add the new listener
  _analyticsEventListeners.set(eventName, listener);
  document.addEventListener(eventName, listener);
};

export function subscribeToAnalyticsEvents<
  TType extends AnalyticsEventType,
  TEvent extends AnalyticsEvent,
>(
  type: TType,
  onEvent: (event: TEvent) => void,
  analyticsEventPrefix?: string
) {
  const prefix = analyticsEventPrefix ?? DEFAULT_ANALYTICS_EVENT_PREFIX;
  const eventName = prefix + type;
  _addEventListenersAndRemovePrevious(eventName, (event: Event) => {
    onEvent((event as CustomEvent<TEvent>).detail);
  });
}
