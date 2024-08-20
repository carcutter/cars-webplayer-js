import type {
  positionList,
  positionXlist,
  positionYlist,
} from "../const/position";

export type PositionX = (typeof positionXlist)[number];
export type PositionY = (typeof positionYlist)[number];
export type Position = (typeof positionList)[number];
