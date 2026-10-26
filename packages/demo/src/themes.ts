// Per-integration header branding, from the design canvas
// "WebPlayer Integrations" (Main artboard), with each technology's colours.

export type ThemeKey =
  | "react"
  | "react-legacy"
  | "next"
  | "vanilla"
  | "script"
  | "wc"
  | "vue"
  | "iframe";

export const THEME_KEYS: ThemeKey[] = [
  "react",
  "react-legacy",
  "next",
  "vanilla",
  "script",
  "wc",
  "vue",
  "iframe",
];

export interface Theme {
  /** Technology name, shown in the header and the page title */
  title: string;
  /** Short monogram shown in the header tile */
  mono: string;
  /** What the demo installs or loads by default, shown in the header pill */
  pkg: string;
  headerBg: string;
  headerFg: string;
  tileBg: string;
  tileFg: string;
  /** WebPlayer `--cc-webplayer-primary` (HSL triplet, no `hsl()`) */
  playerPrimary: string;
  /** WebPlayer `--cc-webplayer-primary-foreground` (HSL triplet) */
  playerPrimaryFg: string;
}

export const THEMES: Record<ThemeKey, Theme> = {
  react: {
    title: "React",
    mono: "Rx",
    pkg: "@car-cutter/react-webplayer",
    headerBg: "#23272F",
    headerFg: "#F6F7F9",
    tileBg: "#58C4DC",
    tileFg: "#23272F",
    playerPrimary: "195 91% 34%",
    playerPrimaryFg: "0 0% 100%",
  },
  // Colours of the React 16 / 17 era website
  "react-legacy": {
    title: "React 16 / 17",
    mono: "R17",
    pkg: "@car-cutter/react-webplayer/legacy",
    headerBg: "#20232A",
    headerFg: "#FFFFFF",
    tileBg: "#61DAFB",
    tileFg: "#20232A",
    playerPrimary: "193 95% 68%",
    playerPrimaryFg: "220 13% 15%",
  },
  next: {
    title: "Next.js",
    mono: "N",
    pkg: "@car-cutter/next-webplayer",
    headerBg: "#000000",
    headerFg: "#EDEDED",
    tileBg: "#FFFFFF",
    tileFg: "#000000",
    playerPrimary: "0 0% 9%",
    playerPrimaryFg: "0 0% 100%",
  },
  vanilla: {
    title: "Vanilla JS",
    mono: "JS",
    pkg: "@car-cutter/vanilla-webplayer",
    headerBg: "#F7DF1E",
    headerFg: "#1F1F1C",
    tileBg: "#1F1F1C",
    tileFg: "#F7DF1E",
    playerPrimary: "80 3% 19%",
    playerPrimaryFg: "53 93% 54%",
  },
  script: {
    title: "<script> tag",
    mono: "</>",
    pkg: "@car-cutter/script-webplayer",
    headerBg: "#B83A1B",
    headerFg: "#FFFFFF",
    tileBg: "#FFFFFF",
    tileFg: "#B83A1B",
    playerPrimary: "17 88% 40%",
    playerPrimaryFg: "0 0% 100%",
  },
  wc: {
    title: "Web Component",
    mono: "WC",
    pkg: "@car-cutter/wc-webplayer",
    headerBg: "#1E2A78",
    headerFg: "#FFFFFF",
    tileBg: "#9FA8FF",
    tileFg: "#1E2A78",
    playerPrimary: "231 48% 48%",
    playerPrimaryFg: "0 0% 100%",
  },
  vue: {
    title: "Vue",
    mono: "Vue",
    pkg: "@car-cutter/vue-webplayer",
    headerBg: "#35495E",
    headerFg: "#FFFFFF",
    tileBg: "#42B883",
    tileFg: "#35495E",
    playerPrimary: "153 47% 49%",
    playerPrimaryFg: "208 37% 20%",
  },
  iframe: {
    title: "iframe",
    mono: "[ ]",
    pkg: "public/player + local bundle",
    headerBg: "#FFFFFF",
    headerFg: "#0A0A0A",
    tileBg: "#2563EB",
    tileFg: "#FFFFFF",
    playerPrimary: "221 83% 53%",
    playerPrimaryFg: "0 0% 100%",
  },
};

/** CSS custom properties applied on the page root for a theme */
export function themeStyle(theme: Theme): Record<string, string> {
  return {
    "--dm-header-bg": theme.headerBg,
    "--dm-header-fg": theme.headerFg,
    "--dm-tile-bg": theme.tileBg,
    "--dm-tile-fg": theme.tileFg,
    "--cc-webplayer-primary": theme.playerPrimary,
    "--cc-webplayer-primary-foreground": theme.playerPrimaryFg,
  };
}
