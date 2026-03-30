import type { WebPlayerProps } from "@car-cutter/core";

import { config as autonationConfig } from "./autonation";

export type ThemeConfigName = NonNullable<WebPlayerProps["themeConfig"]>;

type CursorEntry = {
  url: string;
  hotspot: { x: number; y: number };
};

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
