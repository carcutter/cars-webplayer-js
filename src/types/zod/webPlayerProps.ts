import { z } from "zod";

import { ImageWidthSchema } from "./misc";
import { PositionSchema, PositionYschema } from "./position";

export const ImageLoadStrategySchema = z.union([
  z.literal("quality"),
  z.literal("speed"),
]);

export const WebPlayerPropsSchema = z.object({
  compositionUrl: z.string(),

  reverse360: z.boolean().optional(),

  minImageWidth: ImageWidthSchema.optional(),
  maxImageWidth: ImageWidthSchema.optional(),
  imageLoadStrategy: ImageLoadStrategySchema.optional(),

  // <CATEGORY>|<CATEGORY>
  categoriesOrder: z.string().optional(),
  flatten: z.boolean().optional(),

  eventId: z.string().optional(),

  allowFullScreen: z.boolean().optional(),

  categoryPosition: PositionYschema.extract(["top", "bottom"]).optional(),
  optionsPosition: PositionSchema.extract([
    "top-right",
    "bottom-right",
    "bottom-left",
    "top-left",
  ]).optional(),
  nextPrevPosition: PositionYschema.optional(),
  zoomPosition: PositionSchema.extract([
    "middle-right",
    "bottom-center",
    "middle-left",
  ]).optional(),
});

export type WebPlayerProps = z.infer<typeof WebPlayerPropsSchema>;
