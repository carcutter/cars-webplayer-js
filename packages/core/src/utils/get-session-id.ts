import { generateUUID } from "./сryptography/generate-uuid";

/**
 * Gets or generates a session ID.
 * The ID is stored in the session storage which is obtainable in the current tab of the same browser.
 *
 * @returns {string} The session ID.
 */
export function getSessionId(): string {
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
