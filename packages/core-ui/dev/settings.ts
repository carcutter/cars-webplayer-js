// Everything the playground lets you change, with its defaults (the player's
// own but monitoring, so that an untouched setting behaves as in production)
// and its persistence in the URL query (only the changed settings), so that a
// reload or a shared link gives the same player.

import {
  DEFAULT_ANALYTICS_DEBUG,
  DEFAULT_ANALYTICS_DRY_RUN,
  DEFAULT_ANALYTICS_EVENT_PREFIX,
  DEFAULT_AUTO_LOAD_360,
  DEFAULT_AUTO_LOAD_INTERIOR_360,
  DEFAULT_CATEGORY_FILTER,
  DEFAULT_DEMO_SPIN,
  DEFAULT_EVENT_PREFIX,
  DEFAULT_EXTEND_BEHAVIOR,
  DEFAULT_FORCE_TOP_NAV,
  DEFAULT_HIDE_CATEGORIES_NAV,
  DEFAULT_INFINITE_CARROUSEL,
  DEFAULT_INTEGRATION,
  DEFAULT_MAX_ITEMS_SHOWN,
  DEFAULT_MEDIA_LOAD_STRATEGY,
  DEFAULT_PERMANENT_GALLERY,
  DEFAULT_PRELOAD_RANGE,
  DEFAULT_REVERSE_360,
  DEFAULT_SPIN_CURSOR,
  type ExtendBehavior,
  type MediaLoadStrategy,
  type WebPlayerProps,
} from "@car-cutter/core";

import { validMaxItemsShownValues } from "../src/const/integration";

export const DEMO_COMPOSITION_URL =
  "https://cdn.car-cutter.com/libs/web-player/v3/demos/composition_v3.json";

/** The customization variables the player reads (see WebPlayer.tsx) */
export const CSS_VARIABLES = [
  "--cc-webplayer-background",
  "--cc-webplayer-foreground",
  "--cc-webplayer-primary",
  "--cc-webplayer-primary-foreground",
  "--cc-webplayer-primary-light",
  "--cc-webplayer-neutral",
  "--cc-webplayer-neutral-foreground",
  "--cc-webplayer-hotspot-damage-color",
  "--cc-webplayer-hotspot-feature-color",
  "--cc-webplayer-hotspot-description-text",
  "--cc-webplayer-details-background",
  "--cc-webplayer-details-text",
  "--cc-webplayer-radius-ui",
  "--cc-webplayer-radius-carrousel",
  "--cc-webplayer-radius-gallery",
] as const;

export type CssVariable = (typeof CSS_VARIABLES)[number];

/** Colors are bare HSL triplets ("216 100% 52%"), radiuses CSS lengths */
export const isColorVariable = (name: CssVariable) => !name.includes("radius");

export const STAGE_WIDTHS = ["auto", "375", "480", "768", "1024"] as const;

/** The values the player accepts (it uses the closest one otherwise) */
export const MAX_ITEMS_SHOWN: readonly number[] = validMaxItemsShownValues;

export const MEDIA_LOAD_STRATEGIES: MediaLoadStrategy[] = [
  "quality",
  "balanced",
  "speed",
];

export const EXTEND_BEHAVIORS: ExtendBehavior[] = [
  "full_screen",
  "event",
  "none",
];

export const THEME_CONFIGS: Settings["themeConfig"][] = ["", "autonation"];

export type StageWidth = (typeof STAGE_WIDTHS)[number];

export type Settings = {
  compositionUrl: string;

  integration: boolean;
  maxItemsShown: number;
  hideCategoriesNav: boolean;
  forceTopNav: boolean;
  infiniteCarrousel: boolean;
  permanentGallery: boolean;

  mediaLoadStrategy: MediaLoadStrategy;
  preloadRange: number;
  autoLoad360: boolean;
  autoLoadInterior360: boolean;

  categoriesFilter: string;
  extendBehavior: ExtendBehavior;
  eventPrefix: string;
  demoSpin: boolean;
  reverse360: boolean;
  spinCursor: string;
  themeConfig: "" | NonNullable<WebPlayerProps["themeConfig"]>;

  analyticsEventPrefix: string;
  analyticsDryRun: boolean;
  analyticsDebug: boolean;
  monitoring: boolean;

  /** Children of the player */
  customMedia: boolean;
  customIcon: boolean;

  /** How the player is rendered: as in a page, or in a shadow root with its
   * inlined styles, as the web component does */
  shadowDom: boolean;
  stageWidth: StageWidth;
} & Record<CssVariable, string>;

export const DEFAULT_SETTINGS: Settings = {
  compositionUrl: DEMO_COMPOSITION_URL,

  integration: DEFAULT_INTEGRATION,
  maxItemsShown: DEFAULT_MAX_ITEMS_SHOWN,
  hideCategoriesNav: DEFAULT_HIDE_CATEGORIES_NAV,
  forceTopNav: DEFAULT_FORCE_TOP_NAV,
  infiniteCarrousel: DEFAULT_INFINITE_CARROUSEL,
  permanentGallery: DEFAULT_PERMANENT_GALLERY,

  mediaLoadStrategy: DEFAULT_MEDIA_LOAD_STRATEGY,
  preloadRange: DEFAULT_PRELOAD_RANGE,
  autoLoad360: DEFAULT_AUTO_LOAD_360,
  autoLoadInterior360: DEFAULT_AUTO_LOAD_INTERIOR_360,

  categoriesFilter: DEFAULT_CATEGORY_FILTER,
  extendBehavior: DEFAULT_EXTEND_BEHAVIOR,
  eventPrefix: DEFAULT_EVENT_PREFIX,
  demoSpin: DEFAULT_DEMO_SPIN,
  reverse360: DEFAULT_REVERSE_360,
  spinCursor: DEFAULT_SPIN_CURSOR,
  themeConfig: "",

  analyticsEventPrefix: DEFAULT_ANALYTICS_EVENT_PREFIX,
  analyticsDryRun: DEFAULT_ANALYTICS_DRY_RUN,
  analyticsDebug: DEFAULT_ANALYTICS_DEBUG,
  // Off: from localhost, the monitoring service refuses the events (401)
  monitoring: false,

  customMedia: true,
  customIcon: true,

  shadowDom: false,
  stageWidth: "auto",

  ...(Object.fromEntries(CSS_VARIABLES.map(name => [name, ""])) as Record<
    CssVariable,
    string
  >),
};

type Key = keyof Settings;

const KEYS = Object.keys(DEFAULT_SETTINGS) as Key[];

export type NumberKey = {
  [K in Key]: Settings[K] extends number ? K : never;
}[Key];

/** The lowest value of the number settings */
export const MIN: Record<NumberKey, number> = {
  maxItemsShown: 1,
  preloadRange: 0,
};

/** The values a URL may set, for the settings that only take some */
const ALLOWED: Partial<Record<Key, readonly string[]>> = {
  stageWidth: STAGE_WIDTHS,
  mediaLoadStrategy: MEDIA_LOAD_STRATEGIES,
  extendBehavior: EXTEND_BEHAVIORS,
  themeConfig: THEME_CONFIGS,
};

/** Settings from a URL query, the defaults for the ones it doesn't set */
export function parseSettings(search: string): Settings {
  const params = new URLSearchParams(search);
  const settings: Record<string, unknown> = { ...DEFAULT_SETTINGS };

  for (const key of KEYS) {
    const value = params.get(key);
    if (value === null) continue;

    const fallback = DEFAULT_SETTINGS[key];
    if (typeof fallback === "boolean") {
      settings[key] = value === "true";
    } else if (typeof fallback === "number") {
      const number = Number(value);
      if (
        value !== "" &&
        Number.isFinite(number) &&
        number >= MIN[key as NumberKey] &&
        (key !== "preloadRange" || Number.isInteger(number)) &&
        (key !== "maxItemsShown" || MAX_ITEMS_SHOWN.includes(number))
      ) {
        settings[key] = number;
      }
    } else if (!(key in ALLOWED) || ALLOWED[key]!.includes(value)) {
      settings[key] = value;
    }
  }

  return settings as Settings;
}

/** URL query holding the settings that differ from the defaults */
export function serializeSettings(settings: Settings): string {
  const params = new URLSearchParams();
  for (const key of KEYS) {
    if (settings[key] !== DEFAULT_SETTINGS[key]) {
      params.set(key, String(settings[key]));
    }
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

/** The settings that aren't props of the player */
const PLAYGROUND_KEYS = new Set<Key>([
  "customMedia",
  "customIcon",
  "shadowDom",
  "stageWidth",
  ...CSS_VARIABLES,
]);

/** The player's props, from the settings */
export function toPlayerProps(settings: Settings): WebPlayerProps {
  const props = Object.fromEntries(
    KEYS.filter(key => !PLAYGROUND_KEYS.has(key)).map(key => [
      key,
      settings[key],
    ])
  ) as Omit<Settings, "themeConfig"> & Pick<WebPlayerProps, "themeConfig">;
  props.themeConfig = settings.themeConfig || undefined;

  return props;
}

/** The customization variables that are set, as inline styles */
export function toCssVariables(settings: Settings): React.CSSProperties {
  return Object.fromEntries(
    CSS_VARIABLES.filter(name => settings[name].trim()).map(name => [
      name,
      settings[name].trim(),
    ])
  );
}
