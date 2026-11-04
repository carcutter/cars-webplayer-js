import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  ElementRef,
  inject,
  input,
  type InputSignal,
  type InputSignalWithTransform,
  output,
} from "@angular/core";

import {
  type AnalyticsDisplayEvent,
  type AnalyticsErrorEvent,
  type AnalyticsInteractionEvent,
  type AnalyticsLoadEvent,
  ANALYTICS_EVENT_DISPLAY,
  ANALYTICS_EVENT_ERROR,
  ANALYTICS_EVENT_INTERACTION,
  ANALYTICS_EVENT_LOAD,
  type Composition,
  DEFAULT_ANALYTICS_EVENT_PREFIX,
  DEFAULT_EVENT_PREFIX,
  ensureCustomElementsDefinition,
  EVENT_COMPOSITION_LOAD_ERROR,
  EVENT_COMPOSITION_LOADED,
  EVENT_COMPOSITION_LOADING,
  EVENT_EXTEND_MODE_OFF,
  EVENT_EXTEND_MODE_ON,
  EVENT_GALLERY_CLOSE,
  EVENT_GALLERY_OPEN,
  EVENT_HOTSPOTS_OFF,
  EVENT_HOTSPOTS_ON,
  EVENT_ITEM_CHANGE,
  type MediaItem,
  type WebPlayerProps,
  webPlayerPropsToAttributes,
} from "@car-cutter/wc-webplayer";

import { optionalBooleanAttribute } from "./boolean-input";
import { syncAttributes } from "./sync-attributes";
import { syncEarly } from "./sync-early";

ensureCustomElementsDefinition();

export type { WebPlayerProps };

/** The input of each prop: fails the build until a prop added to the core is */
type WebPlayerInputs = {
  [K in keyof WebPlayerProps]-?: NonNullable<WebPlayerProps[K]> extends boolean
    ? InputSignalWithTransform<boolean | undefined, unknown>
    : InputSignal<WebPlayerProps[K]>;
};

/**
 * The WebPlayer, rendering a `<cc-webplayer>` element. Custom medias and icons
 * (`<car-cutter-webplayer-custom-media>`, `<car-cutter-webplayer-icon>`) are
 * given as its content.
 */
@Component({
  selector: "car-cutter-webplayer",
  template: `
    <cc-webplayer style="display: block"><ng-content /></cc-webplayer>
  `,
  // Inline, like the attributes: component styles would add their scoping
  // attributes to the element
  host: { style: "display: block" },
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebPlayer {
  readonly compositionUrl = input.required<string>();

  // Integration mode
  readonly integration = input(undefined, {
    transform: optionalBooleanAttribute,
  });
  readonly maxItemsShown = input<WebPlayerProps["maxItemsShown"]>();

  // Layout
  readonly hideCategoriesNav = input(undefined, {
    transform: optionalBooleanAttribute,
  });
  readonly forceTopNav = input(undefined, {
    transform: optionalBooleanAttribute,
  });
  readonly infiniteCarrousel = input(undefined, {
    transform: optionalBooleanAttribute,
  });
  readonly permanentGallery = input(undefined, {
    transform: optionalBooleanAttribute,
  });

  // Medias loading
  readonly mediaLoadStrategy = input<WebPlayerProps["mediaLoadStrategy"]>();
  readonly minMediaWidth = input<WebPlayerProps["minMediaWidth"]>();
  readonly maxMediaWidth = input<WebPlayerProps["maxMediaWidth"]>();
  readonly preloadRange = input<WebPlayerProps["preloadRange"]>();
  readonly autoLoad360 = input(undefined, {
    transform: optionalBooleanAttribute,
  });
  readonly autoLoadInterior360 = input(undefined, {
    transform: optionalBooleanAttribute,
  });

  // Miscellaneous
  readonly categoriesFilter = input<WebPlayerProps["categoriesFilter"]>();
  readonly extendBehavior = input<WebPlayerProps["extendBehavior"]>();
  readonly eventPrefix = input<WebPlayerProps["eventPrefix"]>();
  readonly demoSpin = input(undefined, {
    transform: optionalBooleanAttribute,
  });
  readonly reverse360 = input(undefined, {
    transform: optionalBooleanAttribute,
  });
  readonly spinCursor = input<WebPlayerProps["spinCursor"]>();
  readonly themeConfig = input<WebPlayerProps["themeConfig"]>();

  // Analytics
  readonly analyticsEventPrefix =
    input<WebPlayerProps["analyticsEventPrefix"]>();
  /** @deprecated Prefer monitoring (enabled by default). When set, disables monitoring and sends analytics to this URL instead. */
  readonly analyticsUrl = input<WebPlayerProps["analyticsUrl"]>();
  /** @deprecated Only used with analyticsUrl. Sets the Authorization bearer token for analytics requests. Ignored when analyticsSimpleRequestsOnly is true. */
  readonly analyticsBearer = input<WebPlayerProps["analyticsBearer"]>();
  /** @deprecated Only used with analyticsUrl. When true, sends CORS simple requests only (disables custom headers including analyticsBearer). */
  readonly analyticsSimpleRequestsOnly = input(undefined, {
    transform: optionalBooleanAttribute,
  });
  readonly analyticsDryRun = input(undefined, {
    transform: optionalBooleanAttribute,
  });
  readonly analyticsDebug = input(undefined, {
    transform: optionalBooleanAttribute,
  });

  // Monitoring
  readonly monitoring = input(undefined, {
    transform: optionalBooleanAttribute,
  });

  // -- Outputs
  readonly compositionLoading = output<string>();
  readonly compositionLoaded = output<Composition>();
  readonly compositionLoadError = output<unknown>();
  readonly itemChange = output<{ index: number; item: MediaItem }>();
  readonly extendModeOn = output<void>();
  readonly extendModeOff = output<void>();
  readonly hotspotsOn = output<void>();
  readonly hotspotsOff = output<void>();
  readonly galleryOpen = output<void>();
  readonly galleryClose = output<void>();
  readonly analyticsLoad = output<AnalyticsLoadEvent>();
  readonly analyticsDisplay = output<AnalyticsDisplayEvent>();
  readonly analyticsInteraction = output<AnalyticsInteractionEvent>();
  readonly analyticsError = output<AnalyticsErrorEvent>();

  readonly #inputs: WebPlayerInputs = {
    compositionUrl: this.compositionUrl,
    integration: this.integration,
    maxItemsShown: this.maxItemsShown,
    hideCategoriesNav: this.hideCategoriesNav,
    forceTopNav: this.forceTopNav,
    infiniteCarrousel: this.infiniteCarrousel,
    permanentGallery: this.permanentGallery,
    mediaLoadStrategy: this.mediaLoadStrategy,
    minMediaWidth: this.minMediaWidth,
    maxMediaWidth: this.maxMediaWidth,
    preloadRange: this.preloadRange,
    autoLoad360: this.autoLoad360,
    autoLoadInterior360: this.autoLoadInterior360,
    categoriesFilter: this.categoriesFilter,
    extendBehavior: this.extendBehavior,
    eventPrefix: this.eventPrefix,
    demoSpin: this.demoSpin,
    reverse360: this.reverse360,
    spinCursor: this.spinCursor,
    themeConfig: this.themeConfig,
    analyticsEventPrefix: this.analyticsEventPrefix,
    analyticsUrl: this.analyticsUrl,
    analyticsBearer: this.analyticsBearer,
    analyticsSimpleRequestsOnly: this.analyticsSimpleRequestsOnly,
    analyticsDryRun: this.analyticsDryRun,
    analyticsDebug: this.analyticsDebug,
    monitoring: this.monitoring,
  };

  readonly #attributes = computed(() =>
    webPlayerPropsToAttributes(
      Object.fromEntries(
        Object.entries(this.#inputs).map(([name, value]) => [name, value()])
      ) as WebPlayerProps
    )
  );

  readonly #eventListeners = {
    [EVENT_COMPOSITION_LOADING]: (url: string) =>
      this.compositionLoading.emit(url),
    [EVENT_COMPOSITION_LOADED]: (composition: Composition) =>
      this.compositionLoaded.emit(composition),
    [EVENT_COMPOSITION_LOAD_ERROR]: (error: unknown) =>
      this.compositionLoadError.emit(error),
    [EVENT_ITEM_CHANGE]: (props: { index: number; item: MediaItem }) =>
      this.itemChange.emit(props),
    [EVENT_EXTEND_MODE_ON]: () => this.extendModeOn.emit(),
    [EVENT_EXTEND_MODE_OFF]: () => this.extendModeOff.emit(),
    [EVENT_HOTSPOTS_ON]: () => this.hotspotsOn.emit(),
    [EVENT_HOTSPOTS_OFF]: () => this.hotspotsOff.emit(),
    [EVENT_GALLERY_OPEN]: () => this.galleryOpen.emit(),
    [EVENT_GALLERY_CLOSE]: () => this.galleryClose.emit(),
  };

  readonly #analyticsEventListeners = {
    [ANALYTICS_EVENT_LOAD]: (event: AnalyticsLoadEvent) =>
      this.analyticsLoad.emit(event),
    [ANALYTICS_EVENT_DISPLAY]: (event: AnalyticsDisplayEvent) =>
      this.analyticsDisplay.emit(event),
    [ANALYTICS_EVENT_INTERACTION]: (event: AnalyticsInteractionEvent) =>
      this.analyticsInteraction.emit(event),
    [ANALYTICS_EVENT_ERROR]: (event: AnalyticsErrorEvent) =>
      this.analyticsError.emit(event),
  };

  /** The `<cc-webplayer>` element, root of the template */
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  get #player() {
    return this.#host.firstElementChild!;
  }

  /**
   * Listeners on the element for the current prefixes, keyed by event name:
   * its events bubble from it, the ones of other players don't reach it
   */
  #listeners = new Map<string, EventListener>();

  #listen(eventPrefix: string, analyticsEventPrefix: string) {
    const listen = (
      prefix: string,
      map: Record<string, (detail: never) => void>
    ) =>
      Object.entries(map).forEach(([event, listener]) =>
        this.#listeners.set(`${prefix}${event}`, e =>
          listener((e as CustomEvent).detail as never)
        )
      );

    this.#unlisten();
    listen(eventPrefix, this.#eventListeners);
    listen(analyticsEventPrefix, this.#analyticsEventListeners);
    this.#listeners.forEach((cb, name) =>
      this.#player.addEventListener(name, cb)
    );
  }

  #unlisten() {
    this.#listeners.forEach((cb, name) =>
      this.#player.removeEventListener(name, cb)
    );
    this.#listeners.clear();
  }

  constructor() {
    // Before the attributes: the element renders, and dispatches its events,
    // once it has its composition-url
    let listened: string[] = [];
    syncEarly(
      // An empty prefix is unset for the element, which uses the default one
      () => [
        this.eventPrefix() || DEFAULT_EVENT_PREFIX,
        this.analyticsEventPrefix() || DEFAULT_ANALYTICS_EVENT_PREFIX,
      ],
      prefixes => {
        // The element dispatches its events with the new prefixes right away
        if (prefixes.some((prefix, i) => prefix !== listened[i])) {
          listened = prefixes;
          this.#listen(prefixes[0], prefixes[1]);
        }
      }
    );
    inject(DestroyRef).onDestroy(() => this.#unlisten());

    syncAttributes(this.#attributes);
  }
}
