import { generateUUID } from "./сryptography/generate-uuid";

/**
 * Gets or generates a session ID.
 * The ID is stored in the session storage which is obtainable in the current tab of the same browser.
 *
 * @returns {string} The session ID.
 */
export function getSessionId(): string {
  const STORAGE_KEY = "car-cutter-webplayer-session-id";

  let currentId: string | null = null;
  try {
    currentId =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem(STORAGE_KEY)
        : null;
  } catch {
    currentId = null;
  }
  if (currentId) return currentId;

  const newId = generateUUID();
  try {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(STORAGE_KEY, newId);
    }
  } catch {
    // Storage unavailable (e.g. private browsing): fall back to an in-memory ID.
  }
  return newId;
}
