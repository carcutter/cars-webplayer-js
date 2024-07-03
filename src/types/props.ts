import { z } from "zod";

export const AspectRatioSchema = z.union([z.literal("4:3"), z.literal("16:9")]);
export type AspectRatio = z.infer<typeof AspectRatioSchema>;

export const HD_WIDTH = "HD";

export const DEFAULT_ASPECT_RATIO = "4:3" satisfies AspectRatio;
export const DEFAULT_FLATTEN = false;
export const DEFAULT_MAX_ITEMS_SHOWN = 1;
export const DEFAULT_ITEMS_SHOWN_BREAKPOINT = 768;
export const DEFAULT_IMAGE_WIDTHS = `${HD_WIDTH}|1024|768|640|512|300|100`;
export const DEFAULT_EVENT_ID = "cc-event";

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

  eventId: z.string().optional(),
});

export type WebPlayerProps = z.infer<typeof WebPlayerPropsSchema>;
