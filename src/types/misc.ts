import type { z } from "zod";

import type { AspectRatioSchema, ImageWidthSchema } from "./zod/misc";

export type AspectRatio = z.infer<typeof AspectRatioSchema>;
export type ImageWidth = z.infer<typeof ImageWidthSchema>;
