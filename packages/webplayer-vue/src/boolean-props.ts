import type { WebPlayerProps } from "@car-cutter/core";

type BooleanPropName = {
  [K in keyof WebPlayerProps]-?: NonNullable<WebPlayerProps[K]> extends boolean
    ? K
    : never;
}[keyof WebPlayerProps];

/**
 * Vue casts absent boolean props to `false`: default them to `undefined`
 * instead, so the web component keeps its own defaults (e.g. demoSpin,
 * monitoring). Typed as a Record so that a boolean prop added to the core
 * fails the build until it's listed here.
 */
export const booleanPropsDefaults: Record<BooleanPropName, undefined> = {
  integration: undefined,
  hideCategoriesNav: undefined,
  forceTopNav: undefined,
  infiniteCarrousel: undefined,
  permanentGallery: undefined,
  autoLoad360: undefined,
  autoLoadInterior360: undefined,
  demoSpin: undefined,
  reverse360: undefined,
  analyticsSimpleRequestsOnly: undefined,
  analyticsDryRun: undefined,
  analyticsDebug: undefined,
  monitoring: undefined,
};
