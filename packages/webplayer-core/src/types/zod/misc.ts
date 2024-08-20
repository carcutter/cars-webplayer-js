import { z } from "zod";

import { AspectRatio, ImageWidth } from "../misc";

export const AspectRatioSchema = z.union([
  z.literal("4:3"),
  z.literal("16:9"),
]) satisfies z.ZodSchema<AspectRatio>;

export const ImageWidthSchema = z
  .number()
  .min(1) satisfies z.ZodSchema<ImageWidth>;
