import type { z } from "zod";

import type {
  PositionSchema,
  PositionXschema,
  PositionYschema,
} from "./zod/position";

export type PositionX = z.infer<typeof PositionXschema>;
export type PositionY = z.infer<typeof PositionYschema>;
export type Position = z.infer<typeof PositionSchema>;
