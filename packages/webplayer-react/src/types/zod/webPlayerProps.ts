import { z } from "zod";

export const ImageLoadStrategySchema = z.union([
  z.literal("quality"),
  z.literal("speed"),
]);

export const WebPlayerPropsSchema = z.object({
  compositionUrl: z.string(),

  reverse360: z.boolean().optional(),

  minImageWidth: z.number().optional(),
  maxImageWidth: z.number().optional(),
  imageLoadStrategy: ImageLoadStrategySchema.optional(),

  flatten: z.boolean().optional(),
  infiniteCarrousel: z.boolean().optional(),

  eventId: z.string().optional(),

  allowFullScreen: z.boolean().optional(),

  permanentGallery: z.boolean().optional(),
});

export type WebPlayerProps = z.infer<typeof WebPlayerPropsSchema>;
