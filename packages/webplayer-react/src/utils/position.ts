import { positionXlist, positionYlist, positionList } from "@/const/position";
import { Position, PositionX, PositionY } from "@/types/position";

function isPositionX(str: string): str is PositionX {
  return positionXlist.includes(str as PositionX);
}

function isPositionY(str: string): str is PositionY {
  return positionYlist.includes(str as PositionY);
}

function isPosition(str: string): str is Position {
  return positionList.includes(str as Position);
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
