import { z } from "zod";

export const AspectRatioSchema = z.union([z.literal("4:3"), z.literal("16:9")]);

export const WebPlayerPropsSchema = z.object({
  compositionUrl: z.string(),

  aspectRatio: AspectRatioSchema.optional(),

  flatten: z.boolean().optional(),

  maxItemsShown: z.number().min(1).optional(),
  breakpoint: z.number().min(0).optional(),
});

export type AspectRatio = z.infer<typeof AspectRatioSchema>;

export type WebPlayerProps = z.infer<typeof WebPlayerPropsSchema>;
