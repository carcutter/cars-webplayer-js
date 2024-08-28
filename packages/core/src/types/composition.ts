import { AspectRatio, ImageWidth } from "./misc";

export type Hotspot = {
  feature: string;
  position: {
    x: number;
    y: number;
  };
  description?: {
    short: string;
    long?: string;
  };
  detail?: {
    type: "image" | "link" | "pdf";
    src: string;
  };
};

export type ImageWithHotspots = {
  src: string;
  hotspots?: Hotspot[];
};

type ImageItem = { type: "image" } & ImageWithHotspots;

type VideoItem = {
  type: "video";
  src: string;
  poster: string;
};

type ThreeSixtyItem = {
  type: "360";
  images: ImageWithHotspots[];
};

type OmniDirectionalItem = {
  type: "omni_directional";
  src: string;
};

export type Item = ImageItem | VideoItem | ThreeSixtyItem | OmniDirectionalItem;

export type Category = {
  id: string;
  title: string;
  items: Item[];
};

export type Composition = {
  aspectRatio: AspectRatio;
  imageHdWidth: ImageWidth;
  imageSubWidths: ImageWidth[];
  categories: Category[];
};
