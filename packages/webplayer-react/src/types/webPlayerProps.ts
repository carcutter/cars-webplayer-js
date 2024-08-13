import type { z } from "zod";

import type {
  ImageLoadStrategySchema,
  WebPlayerPropsSchema,
} from "./zod/webPlayerProps";

export type ImageLoadStrategy = z.infer<typeof ImageLoadStrategySchema>;

export type WebPlayerProps = z.infer<typeof WebPlayerPropsSchema>;
