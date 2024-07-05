import { z } from "zod";

import { ImageWidthSchema } from "./misc";

export const AspectRatioSchema = z.union([z.literal("4:3"), z.literal("16:9")]);
export type AspectRatio = z.infer<typeof AspectRatioSchema>;

export const ImageLoadStrategySchema = z.union([
  z.literal("quality"),
  z.literal("speed"),
]);
export type ImageLoadStrategy = z.infer<typeof ImageLoadStrategySchema>;

export const DEFAULT_ASPECT_RATIO = "4:3" satisfies AspectRatio;
export const DEFAULT_REVERSE_360 = false;
export const DEFAULT_IMAGE_LOAD_STRATEGY =
  "quality" satisfies ImageLoadStrategy;
export const DEFAULT_FLATTEN = false;
export const DEFAULT_MAX_ITEMS_SHOWN = 1;
export const DEFAULT_ITEMS_SHOWN_BREAKPOINT = 768;
export const DEFAULT_EVENT_ID = "cc-event";

export const WebPlayerPropsSchema = z.object({
  compositionUrl: z.string(),

  aspectRatio: AspectRatioSchema.optional(),

  reverse360: z.boolean().optional(),

  minImageWidth: ImageWidthSchema.optional(),
  maxImageWidth: ImageWidthSchema.optional(),
  imageLoadStrategy: ImageLoadStrategySchema.optional(),

  // <CATEGORY>|<CATEGORY>
  categoriesOrder: z.string().optional(),
  flatten: z.boolean().optional(),

  maxItemsShown: z.number().min(1).optional(),
  itemsShownBreakpoint: z.number().min(0).optional(),

  eventId: z.string().optional(),
});

export type WebPlayerProps = z.infer<typeof WebPlayerPropsSchema>;
