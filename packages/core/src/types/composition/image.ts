import { Hotspot } from "./hotspot";

export type ImageWithHotspots = {
  src: string;
  hotspots?: Hotspot[];
};

export type ImageItem = { type: "image" } & ImageWithHotspots;
