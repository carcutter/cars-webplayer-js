import type { z } from "zod";

import type { ImageWidthSchema } from "./zod/misc";

export type ImageWidth = z.infer<typeof ImageWidthSchema>;
