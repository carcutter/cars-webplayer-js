import { z } from "zod";

import { AspectRatioSchema, ImageWidthSchema } from "./misc";

export const HotspotSchema = z.object({
  feature: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  description: z.object({
    short: z.string().optional(),
    long: z.string().optional(),
  }),
  detail: z.string().optional(),
});

export const ItemSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("image"),
    src: z.string(),
    hotspots: z.array(HotspotSchema).optional(),
  }),
  z.object({
    type: z.literal("video"),
    src: z.string(),
    poster: z.string(),
  }),
  z.object({
    type: z.literal("360"),
    images: z.array(z.string()),
    hotspots: z.array(z.array(HotspotSchema)),
  }),
  z.object({
    type: z.literal("omni_directional"),
    src: z.string(),
  }),
]);

export const CategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  items: z.array(ItemSchema),
});

export const CompositionSchema = z.object({
  aspectRatio: AspectRatioSchema,
  imageHdWidth: ImageWidthSchema,
  imageSubWidths: z.array(ImageWidthSchema),
  categories: z.array(CategorySchema),
});
