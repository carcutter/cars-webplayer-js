import { z } from "zod";

const positionXlist = ["left", "center", "right"] as const;
export const PositionXschema = z.enum(positionXlist);
export type PositionX = z.infer<typeof PositionXschema>;

const positionYlist = ["top", "middle", "bottom"] as const;
export const PositionYschema = z.enum(positionYlist);
export type PositionY = z.infer<typeof PositionYschema>;

export const PositionSchema = z.enum([
  ...positionXlist,

  ...positionYlist,

  "top-left",
  "top-center",
  "top-right",
  "middle-left",
  "middle-center",
  "middle-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
]);

// -- Could do this way but cannot use the ".extract" method anymore
// export const PositionSchema = z.custom<
//   PositionX | PositionY | `${PositionY}-${PositionX}`
// >(data => {
//   if (isPositionX(data) || isPositionY(data)) {
//     return data;
//   }

//   const [y, x] = data.split("-") as [PositionY, PositionX];
//   if (!isPositionX(x) || !isPositionY(y)) {
//     throw new Error(`Invalid position: ${data}`);
//   }

//   return data as `${PositionY}-${PositionX}`;
// });

export type Position = z.infer<typeof PositionSchema>;

export function isPositionX(str: string): str is PositionX {
  return PositionXschema.safeParse(str).success;
}

export function isPositionY(str: string): str is PositionY {
  return PositionYschema.safeParse(str).success;
}

export function isPosition(str: string): str is Position {
  return PositionSchema.safeParse(str).success;
}

export function extractPositions(
  position: Position
): [PositionY, PositionX] | [PositionY, undefined] | [undefined, PositionX] {
  if (!isPosition(position)) {
    throw new Error(`Invalid position: ${position}`);
  }

  if (isPositionY(position)) {
    return [position, undefined];
  }
  if (isPositionX(position)) {
    return [undefined, position];
  }
  return position.split("-") as [PositionY, PositionX];
}
