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
    // All cursor SVGs are 80x40 → center (40, 20)
    default: { url: defaultSpinSvg, hotspot: { x: 40, y: 20 } },
    leftSpin: { url: leftSpinSvg, hotspot: { x: 40, y: 20 } },
    rightSpin: { url: rightSpinSvg, hotspot: { x: 40, y: 20 } },
  },
  threeSixtyIcon: false,
  errorImage:
    "https://cdn.car-cutter.com/libs/web-player/v3/assets/autonation-fallback.svg",
};
