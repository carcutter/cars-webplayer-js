export const positionXlist = ["left", "center", "right", "fullW"] as const;
export const positionYlist = ["top", "middle", "bottom", "fullH"] as const;
export const positionList = [
  ...positionXlist,

  ...positionYlist,

  "top-left",
  "top-center",
  "top-right",
  "top-fullW",
  "middle-left",
  "middle-center",
  "middle-right",
  "middle-fullW",
  "bottom-left",
  "bottom-center",
  "bottom-right",
  "bottom-fullW",
  "fullH-left",
  "fullH-center",
  "fullH-right",
  "fullW-fullW",
] as const;
