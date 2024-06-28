import {
  PositionX,
  PositionY,
  Position,
  extractPosition,
} from "@/types/position";
import { AspectRatio } from "@/types/props";

export function positionXToClassName(positionX: PositionX): string {
  switch (positionX) {
    case "left":
      return "left-2";
    case "right":
      return "right-2";
    case "center":
      return "left-1/2 -translate-x-1/2";
  }
}

export function positionYToClassName(positionY: PositionY): string {
  switch (positionY) {
    case "top":
      return "top-2";
    case "bottom":
      return "bottom-2";
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

export function aspectRatioStyle(aspectRatio: AspectRatio, multiplier = 1) {
  const [w, h] = aspectRatio.split(":").map(v => parseInt(v));
  return `${w * multiplier} / ${h}`;
}
