import { z } from "zod";

const HotspotSchema = z.object({
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

export type Hotspot = z.infer<typeof HotspotSchema>;

const ItemSchema = z.discriminatedUnion("type", [
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

export type Item = z.infer<typeof ItemSchema>;

const ElementSchema = z.object({
  category: z.string(),
  title: z.string(),
  items: z.array(ItemSchema),
});

// type Element = z.infer<typeof ElementSchema>;

const ImageWidthSchema = z.number().min(24).max(1920);
export type ImageWidth = z.infer<typeof ImageWidthSchema>;

export const CompositionSchema = z.object({
  imageWidths: z.array(ImageWidthSchema),
  elements: z.array(ElementSchema),
});

export type Composition = z.infer<typeof CompositionSchema>;
