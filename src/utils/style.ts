import {
  PositionX,
  PositionY,
  Position,
  extractPosition,
} from "@/types/position";

export function positionXToClassName(positionX: PositionX): string {
  switch (positionX) {
    case "left":
      return "left-0";
    case "right":
      return "right-0";
    case "center":
      return "left-1/2 -translate-x-1/2";
  }
}

export function positionYToClassName(positionY: PositionY): string {
  switch (positionY) {
    case "top":
      return "top-0";
    case "bottom":
      return "bottom-0";
    case "middle":
      return "top-1/2 -translate-y-1/2";
  }
}

export function positionToClassName(position: Position): string {
  const [positionY, positionX] = extractPosition(position);
  let className = "";
  if (positionY) {
    className += positionYToClassName(positionY);
  }
  if (positionX) {
    className += ` ${positionXToClassName(positionX)}`;
  }

  return className;
}
