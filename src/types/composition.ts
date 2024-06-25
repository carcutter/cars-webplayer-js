export type Hotspot = {
  feature: string;
  position: {
    x: number;
    y: number;
  };
  description: {
    short: string;
    long?: string;
  };
  detail?: string;
};

export type Item =
  | {
      type: "image";
      src: string;
      hotspots?: Hotspot[];
    }
  | {
      type: "video";
      src: string;
      poster: string;
    }
  | {
      type: "360";
      images: string[];
      hotspots: Hotspot[][];
    }
  | {
      type: "omni_directional";
      src: string;
    };

type Element = {
  category: string;
  title: string;
  items: Item[];
};

export type Composition = Array<Element>;
