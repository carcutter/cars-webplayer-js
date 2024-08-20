import type { Composition, ImageWidth } from "./types";

export async function getComposition(url: string): Promise<Composition> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch composition: ${res.statusText}`);
  }

  const data = (await res.json()) as Composition;

  return data;
}

/**
 * Adds a specified width to a CDN Image source.
 *
 * @param {string} src - The source URL of the image.
 * @param {ImageWidth} width - The width to be added to the URL.
 * @returns {string} - The modified URL with the width included.
 */
export function cdnImgSrcWithWidth(src: string, width: ImageWidth): string {
  const split = src.split("/");
  const fileName = split.pop();
  const directoryName = split.join("/");

  return [directoryName, width, fileName].join("/");
}
