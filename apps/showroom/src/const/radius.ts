export const RADIUS_LIST = ["sm", "md", "lg", "xl"] as const;

export type Radius = (typeof RADIUS_LIST)[number];

export const radiusToClassName = (radius: Radius) => {
  switch (radius) {
    case "sm":
      return "ui-radius-sm";
    case "md":
      return "ui-radius-md";
    case "lg":
      return "ui-radius-lg";
    case "xl":
      return "ui-radius-xl";
  }
};
