import type { z } from "zod";

import type {
  AspectRatioSchema,
  ImageLoadStrategySchema,
  WebPlayerPropsSchema,
} from "./zod/webPlayerProps";

export type AspectRatio = z.infer<typeof AspectRatioSchema>;

export type ImageLoadStrategy = z.infer<typeof ImageLoadStrategySchema>;

export type WebPlayerProps = z.infer<typeof WebPlayerPropsSchema>;
