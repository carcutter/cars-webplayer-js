import { z } from "zod";

export const AspectRatioSchema = z.union([z.literal("4:3"), z.literal("16:9")]);
export const HD_WIDTH = "HD";

export const WebPlayerPropsSchema = z.object({
  compositionUrl: z.string(),

  aspectRatio: AspectRatioSchema.optional(),

  flatten: z.boolean().optional(),

  maxItemsShown: z.number().min(1).optional(),
  itemsShownBreakpoint: z.number().min(0).optional(),

  // HD|<WIDTH_INT>|<WIDTH_INT>. FUTURE: Add it within the composition
  imageWidths: z
    .string()
    .refine(value =>
      (value ?? "")
        .split("|")
        .every(width => width === HD_WIDTH || parseInt(width) > 0)
    )
    .optional(),
});

export type AspectRatio = z.infer<typeof AspectRatioSchema>;

export type WebPlayerProps = z.infer<typeof WebPlayerPropsSchema>;
