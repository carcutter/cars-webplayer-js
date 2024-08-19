export type AspectRatio = "4:3" | "16:9";
export type ImageWidth = number;

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

export type ImageItem = {
  type: "image";
  src: string;
  hotspots?: Hotspot[];
};

export type VideoItem = {
  type: "video";
  src: string;
  poster: string;
};

export type OmniDirectionalItem = {
  type: "omni_directional";
  src: string;
};

export type Item360 = {
  type: "360";
  images: ImageWithHotspots[];
};

export type Item = ImageItem | VideoItem | OmniDirectionalItem | Item360;

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
