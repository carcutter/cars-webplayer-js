export const positionXlist = ["left", "center", "right"] as const;
export const positionYlist = ["top", "middle", "bottom"] as const;
export const positionList = [
  ...positionXlist,

  ...positionYlist,

  "top-left",
  "top-center",
  "top-right",
  "middle-left",
  "middle-center",
  "middle-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;
