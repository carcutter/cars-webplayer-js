export type PositionX = "left" | "center" | "right";
export type PositionY = "top" | "middle" | "bottom";

export type Position = PositionX | PositionY | `${PositionY}-${PositionX}`;

export function isPositionX(str: string): str is PositionX {
  return ["left", "center", "right"].includes(str);
}

export function isPositionY(str: string): str is PositionY {
  return ["top", "middle", "bottom"].includes(str);
}

export function isPosition(str: string): str is Position {
  return (
    isPositionX(str) ||
    isPositionY(str) ||
    (str.includes("-") &&
      isPositionY(str.split("-")[0]) &&
      isPositionX(str.split("-")[1]))
  );
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
