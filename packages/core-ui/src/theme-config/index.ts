import type { WebPlayerProps } from "@car-cutter/core";

import { config as autonationConfig } from "./autonation";

export type ThemeConfigName = NonNullable<WebPlayerProps["themeConfig"]>;

export type ThemeConfig = {
  playButton: {
    default: string;
  };
  cursor: {
    default: string;
    leftSpin: string;
    rightSpin: string;
  };
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
