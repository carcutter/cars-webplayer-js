export type Hotspot = {
  title: string;
  icon?: string;
  description?: string;
  type?: "damage" | "feature";
  position: {
    x: number;
    y: number;
  };
  detail?: {
    type: "image" | "link" | "pdf";
    src: string;
  };
};
