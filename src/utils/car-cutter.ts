import type { Composition } from "@/types/composition";
import type { ImageWidth } from "@/types/misc";
import { CompositionSchema } from "@/types/zod/composition";

export async function getComposition(url: string): Promise<Composition> {
  const res = await fetch(url);
  const data: unknown = await res.json();

  const parsedData = CompositionSchema.parse(data);

  return parsedData;
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
