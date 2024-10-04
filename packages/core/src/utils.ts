import type { MediaWidth } from "./types/misc";

/**
 * Generates a URL for fetching the composition JSON for a given customer and vehicle.
 *
 * @param {string} hashedCustomerId - The ID of the customer (hashed with SHA-256).
 * @param {string} vin - The Vehicle Identification Number.
 * @returns {string} The URL to fetch the composition JSON.
 */
export function generateCompositionUrl(
  hashedCustomerId: string,
  vin: string
): string {
  return `https://cdn.car-cutter.com/gallery/${hashedCustomerId}/${vin}/composition_v3.json`;
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
