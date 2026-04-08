import type { WebPlayerProps } from "@car-cutter/react-webplayer";

export type ExtendBehavior = NonNullable<WebPlayerProps["extendBehavior"]>;
export type MediaLoadStrategy = NonNullable<
  WebPlayerProps["mediaLoadStrategy"]
>;

export type CategoryFilterOption = {
  label: string;
  value: string;
};

export type WebPlayerPropertyAttribute =
  | "auto-load-interior360"
  | "auto-load360"
  | "categories-filter"
  | "demo-spin"
  | "extend-behavior"
  | "hide-categories-nav"
  | "infinite-carrousel"
  | "integration"
  | "media-load-strategy"
  | "permanent-gallery";

export const DEFAULT_AUTO_LOAD_360 = false satisfies NonNullable<
  WebPlayerProps["autoLoad360"]
>;
export const DEFAULT_AUTO_LOAD_INTERIOR_360 = false satisfies NonNullable<
  WebPlayerProps["autoLoadInterior360"]
>;
export const DEFAULT_CATEGORIES_FILTER = "*" satisfies NonNullable<
  WebPlayerProps["categoriesFilter"]
>;
export const DEFAULT_DEMO_SPIN = false satisfies NonNullable<
  WebPlayerProps["demoSpin"]
>;
export const DEFAULT_EXTEND_BEHAVIOR = "full_screen" satisfies ExtendBehavior;
export const DEFAULT_HIDE_CATEGORIES_NAV = false satisfies NonNullable<
  WebPlayerProps["hideCategoriesNav"]
>;
export const DEFAULT_INFINITE_CARROUSEL = false satisfies NonNullable<
  WebPlayerProps["infiniteCarrousel"]
>;
export const DEFAULT_INTEGRATION = false satisfies NonNullable<
  WebPlayerProps["integration"]
>;
export const DEFAULT_MEDIA_LOAD_STRATEGY =
  "quality" satisfies MediaLoadStrategy;
export const DEFAULT_PERMANENT_GALLERY = false satisfies NonNullable<
  WebPlayerProps["permanentGallery"]
>;

export const PROPERTY_LABELS: Record<WebPlayerPropertyAttribute, string> = {
  "auto-load-interior360": "Auto load interior 360",
  "auto-load360": "Auto load 360",
  "categories-filter": "Categories filter",
  "demo-spin": "Demo spin",
  "extend-behavior": "Extend behavior",
  "hide-categories-nav": "Hide categories nav",
  "infinite-carrousel": "Infinite carrousel",
  integration: "Integration",
  "media-load-strategy": "Media load strategy",
  "permanent-gallery": "Permanent gallery",
};

export const EXTEND_BEHAVIOR_OPTIONS: Array<{
  label: string;
  value: ExtendBehavior;
}> = [
  { value: "full_screen", label: "Full screen" },
  { value: "event", label: "Event" },
  { value: "none", label: "None" },
];

export const MEDIA_LOAD_STRATEGY_OPTIONS: Array<{
  label: string;
  value: MediaLoadStrategy;
}> = [
  { value: "quality", label: "Quality" },
  { value: "balanced", label: "Balanced" },
  { value: "speed", label: "Speed" },
];

export const WEBPLAYER_PROPERTIES_DOCS_URL =
  "https://carcutter.github.io/cars-webplayer-js/docs/properties";

const PROPERTY_HREF_OVERRIDES: Partial<
  Record<WebPlayerPropertyAttribute, string>
> = {
  "media-load-strategy":
    "https://carcutter.github.io/cars-webplayer-js/docs/optimization/",
};

export const getWebPlayerPropertyHref = (
  attribute: WebPlayerPropertyAttribute
): string =>
  PROPERTY_HREF_OVERRIDES[attribute] ??
  `${WEBPLAYER_PROPERTIES_DOCS_URL}#${attribute}`;
