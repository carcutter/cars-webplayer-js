import type { z } from "zod";

import type {
  CategorySchema,
  CompositionSchema,
  HotspotSchema,
  ImageWithHotspotsSchema,
  ItemSchema,
} from "./zod/composition";

export type Hotspot = z.infer<typeof HotspotSchema>;

export type ImageWithHotspots = z.infer<typeof ImageWithHotspotsSchema>;

export type Item = z.infer<typeof ItemSchema>;

export type Category = z.infer<typeof CategorySchema>;

export type Composition = z.infer<typeof CompositionSchema>;
