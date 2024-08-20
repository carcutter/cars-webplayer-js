import { z } from "zod";

import { Category, Composition, Hotspot, Item } from "../composition";

import { AspectRatioSchema, ImageWidthSchema } from "./misc";

const HotspotSchema = z.object({
  feature: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  description: z
    .object({
      short: z.string(),
      long: z.string().optional(),
    })
    .optional(),
  detail: z
    .object({
      type: z.union([z.literal("image"), z.literal("link"), z.literal("pdf")]),
      src: z.string(),
    })
    .optional(),
}) satisfies z.ZodSchema<Hotspot>;

const ImageWithHotspotsSchema = z.object({
  src: z.string(),
  hotspots: z.array(HotspotSchema).optional(),
});

const ItemSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("image"),
    })
    .merge(ImageWithHotspotsSchema),
  z.object({
    type: z.literal("video"),
    src: z.string(),
    poster: z.string(),
  }),
  z.object({
    type: z.literal("360"),
    images: z.array(ImageWithHotspotsSchema),
  }),
  z.object({
    type: z.literal("omni_directional"),
    src: z.string(),
  }),
]) satisfies z.ZodSchema<Item>;

const CategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  items: z.array(ItemSchema),
}) satisfies z.ZodSchema<Category>;

export const CompositionSchema = z.object({
  aspectRatio: AspectRatioSchema,
  imageHdWidth: ImageWidthSchema,
  imageSubWidths: z.array(ImageWidthSchema),
  categories: z.array(CategorySchema),
}) satisfies z.ZodSchema<Composition>;
