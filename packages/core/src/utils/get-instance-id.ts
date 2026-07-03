import { generateUUID } from "./сryptography/generate-uuid";

/**
 * Generates a unique instance ID.
 * This ID is used to identify the instance of the webplayer.
 *
 * @returns {string} The instance ID.
 */
export function getInstanceId(): string {
  return generateUUID();
}
