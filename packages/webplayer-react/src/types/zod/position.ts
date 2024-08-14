import { z } from "zod";

import {
  positionXlist,
  positionYlist,
  positionList,
} from "../../const/position";

export const PositionXschema = z.enum(positionXlist);

export const PositionYschema = z.enum(positionYlist);

export const PositionSchema = z.enum(positionList);
