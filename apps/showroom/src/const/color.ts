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
  { pretty: string; className: `ui-${string}`; hex: `#${string}` }
> = {
  blue: { pretty: "Blue", className: "ui-blue", hex: "#0a84ff" },
  green: { pretty: "Green", className: "ui-green", hex: "#30b05a" },
  yellow: { pretty: "Yellow", className: "ui-yellow", hex: "#f3b200" },
  black: { pretty: "Black", className: "ui-black", hex: "#111827" },
  // orange: { pretty: "Orange", className: "ui-orange" },
  gray: { pretty: "Gray", className: "ui-gray", hex: "#6b7280" },
};

export const colorToPretty = (color: Color): string =>
  colorsInfos[color].pretty;

export const colorToClassName = (color: Color): `ui-${string}` =>
  colorsInfos[color].className;

export const colorToHex = (color: Color): `#${string}` =>
  colorsInfos[color].hex;
