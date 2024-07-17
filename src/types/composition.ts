import type { z } from "zod";

import type {
  CategorySchema,
  CompositionSchema,
  HotspotSchema,
  ItemSchema,
} from "./zod/composition";

export type Hotspot = z.infer<typeof HotspotSchema>;

export type Item = z.infer<typeof ItemSchema>;

export type Category = z.infer<typeof CategorySchema>;

export type Composition = z.infer<typeof CompositionSchema>;
