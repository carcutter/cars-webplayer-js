import type { AspectRatio } from "../types/misc";
import type { PositionX, PositionY, Position } from "../types/position";
import { extractPositions } from "../utils/position";

export function positionXToClassName(positionX: PositionX): string {
  switch (positionX) {
    case "left":
      return "left-1 sm:left-2";
    case "right":
      return "right-1 sm:right-2";
    case "center":
      return "left-1/2 -translate-x-1/2";
    case "fullW":
      return "inset-x-1 sm:inset-x-2";
  }
}

export function positionYToClassName(positionY: PositionY): string {
  switch (positionY) {
    case "top":
      return "top-1 sm:top-2";
    case "bottom":
      return "bottom-1 sm:bottom-2";
    case "middle":
      return "top-1/2 -translate-y-1/2";
    case "fullH":
      return "inset-y-1 sm:inset-y-2";
  }
}

export function positionsToClassName({
  positionX,
  positionY,
}: {
  positionX?: PositionX;
  positionY?: PositionY;
}): string {
  const arr = new Array<string>();
  if (positionX) {
    arr.push(positionXToClassName(positionX));
  }
  if (positionY) {
    arr.push(positionYToClassName(positionY));
  }

  return arr.join(" ");
}

export function positionToClassName(position: Position): string {
  const [positionY, positionX] = extractPositions(position);

  return positionsToClassName({ positionX, positionY });
}

export function aspectRatioStyle(aspectRatio: AspectRatio, multiplier = 1) {
  const [w, h] = aspectRatio.split(":").map(v => parseInt(v));
  return `${w * multiplier} / ${h}`;
}
