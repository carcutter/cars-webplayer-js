import { generateUUID } from "./сryptography/generate-uuid";

/**
 * Gets or generates a browser ID.
 * The ID is stored in the local storage which is obtainable in all tabs of the current browser.
 *
 * @returns {string} The browser ID.
 */

export function getBrowserId(): string {
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
