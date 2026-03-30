import type { ThemeConfig } from "../index";

import defaultSpinSvg from "./default-spin.svg";
import leftSpinSvg from "./left-spin.svg";
import playButtonSvg from "./play-button.svg";
import rightSpinSvg from "./right-spin.svg";

export const config: ThemeConfig = {
  playButton: {
    default: playButtonSvg,
  },
  cursor: {
    // All cursor SVGs are 84x44 → center (42, 22)
    default: { url: defaultSpinSvg, hotspot: { x: 42, y: 22 } },
    leftSpin: { url: leftSpinSvg, hotspot: { x: 42, y: 22 } },
    rightSpin: { url: rightSpinSvg, hotspot: { x: 42, y: 22 } },
  },
  threeSixtyIcon: false,
  errorImage:
    "https://cdn.car-cutter.com/libs/web-player/v3/assets/autonation-fallback.svg",
};
