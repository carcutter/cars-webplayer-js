import type { WebPlayerProps } from "@car-cutter/core";

import { config as autonationConfig } from "./autonation";

export type ThemeConfigName = NonNullable<WebPlayerProps["themeConfig"]>;

export type CursorEntry = {
  url: string;
  hotspot: { x: number; y: number };
};

/** `url("…") x y` — append a keyword fallback to get a full `cursor` value. */
export const cursorCssValue = ({ url, hotspot }: CursorEntry): string =>
  `url("${url}") ${hotspot.x} ${hotspot.y}`;

export type ThemeConfig = {
  playButton: {
    default: string;
  };
  cursor: {
    default: CursorEntry;
    leftSpin: CursorEntry;
    rightSpin: CursorEntry;
  };
  errorImage?: string;
  threeSixtyIcon: boolean;
};

const THEME_CONFIG_MAP: Record<ThemeConfigName, ThemeConfig> = {
  autonation: autonationConfig,
};

export const getThemeConfig = (
  themeConfig?: ThemeConfigName
): ThemeConfig | undefined => {
  if (!themeConfig) {
    return undefined;
  }

  return THEME_CONFIG_MAP[themeConfig];
};
