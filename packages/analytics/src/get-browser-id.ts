import { generateUUID } from "./cryptography/generate-uuid";

/**
 * Gets or generates a browser ID.
 * The ID is stored in the local storage which is obtainable in all tabs of the current browser.
 *
 * @returns {string} The browser ID.
 */

export function getBrowserId(): string {
  const STORAGE_KEY = "car-cutter-webplayer-browser-id";

  let currentId: string | null = null;
  try {
    currentId =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;
  } catch {
    currentId = null;
  }
  if (currentId) return currentId;

  const newId = generateUUID();
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, newId);
    }
  } catch {
    // Storage unavailable (e.g. private browsing): fall back to an in-memory ID.
  }
  return newId;
}
