import { z } from "zod";

export const AspectRatioSchema = z.union([z.literal("4:3"), z.literal("16:9")]);
export const ImageWidthSchema = z.number().min(24).max(3840);
