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
