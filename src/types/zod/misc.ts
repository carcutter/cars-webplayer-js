import { z } from "zod";

export const ImageWidthSchema = z.number().min(24).max(3840);
