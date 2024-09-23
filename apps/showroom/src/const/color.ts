export const COLOR_LIST = [
  "blue",
  "black",
  "green",
  "gray",
  "yellow",
  // "orange",
] as const;

export type Color = (typeof COLOR_LIST)[number];

export const isColor = (color: string): color is Color =>
  COLOR_LIST.includes(color as Color);

const colorsInfos: Record<
  Color,
  { pretty: string; className: `ui-${string}` }
> = {
  blue: { pretty: "Blue", className: "ui-blue" },
  green: { pretty: "Green", className: "ui-green" },
  yellow: { pretty: "Yellow", className: "ui-yellow" },
  black: { pretty: "Black", className: "ui-black" },
  // orange: { pretty: "Orange", className: "ui-orange" },
  gray: { pretty: "Gray", className: "ui-gray" },
};

export const colorToPretty = (color: Color) => colorsInfos[color].pretty;

export const colorToClassName = (color: Color) => colorsInfos[color].className;
