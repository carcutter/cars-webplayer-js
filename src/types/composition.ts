export interface CategoryRoot {
  category: string;
  title: string;
  items: Item[];
}

export interface Item {
  image: string;
  hotspots: Hotspot[];
}

export interface Hotspot {
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
}

export type Composition = Array<CategoryRoot>;
