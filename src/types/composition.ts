import type { z } from "zod";

import type {
  CompositionSchema,
  HotspotSchema,
  ItemSchema,
} from "./zod/composition";

export type Hotspot = z.infer<typeof HotspotSchema>;

export type Item = z.infer<typeof ItemSchema>;

// type Element = z.infer<typeof ElementSchema>;

export type Composition = z.infer<typeof CompositionSchema>;
