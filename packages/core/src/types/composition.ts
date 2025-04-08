import { AspectRatio, MediaWidth } from "./misc";

export type Hotspot = {
  title: string;
  icon?: string;
  description?: string;
  position: {
    x: number;
    y: number;
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
  poster?: string;
};

type ThreeSixtyItem = {
  type: "360";
  images: ImageWithHotspots[];
};

type InteriorThreeSixtyItem = {
  type: "interior-360";
  poster?: string;
} & ImageWithHotspots;

export type Item =
  | ImageItem
  | VideoItem
  | ThreeSixtyItem
  | InteriorThreeSixtyItem;

export type Category = {
  id: string;
  title: string;
  items: Item[];
};

export type Composition = {
  aspectRatio: AspectRatio;
  imageHdWidth: MediaWidth;
  imageSubWidths: MediaWidth[];
  categories: Category[];
};
