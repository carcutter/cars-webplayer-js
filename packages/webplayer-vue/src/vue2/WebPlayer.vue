<script lang="ts">
import { defineComponent } from "vue";
import {
  DEFAULT_EVENT_PREFIX,
  EVENT_COMPOSITION_LOADING,
  EVENT_COMPOSITION_LOADED,
  EVENT_COMPOSITION_LOAD_ERROR,
  EVENT_ITEM_CHANGE,
  EVENT_EXTEND_MODE_ON,
  EVENT_EXTEND_MODE_OFF,
  EVENT_HOTSPOTS_ON,
  EVENT_HOTSPOTS_OFF,
  EVENT_GALLERY_OPEN,
  EVENT_GALLERY_CLOSE,
  type Item,
  type Composition,
  type WebPlayerProps,
  AnalyticsIdentifyEvent,
  AnalyticsPageEvent,
  AnalyticsTrackEvent,
  DEFAULT_ANALYTICS_EVENT_PREFIX,
} from "@car-cutter/core";
import {
  ensureCustomElementsDefinition,
  webPlayerPropsToAttributes,
} from "@car-cutter/wc-webplayer";
import {
  ANALYTICS_EVENT_IDENTIFY,
  ANALYTICS_EVENT_PAGE,
  ANALYTICS_EVENT_TRACK,
} from "@car-cutter/core/src/const/event";

ensureCustomElementsDefinition();

export type { WebPlayerProps };

export default defineComponent({
  props: {
    compositionUrl: { type: String, required: true },

    hideCategoriesNav: Boolean,
    infiniteCarrousel: Boolean,
    permanentGallery: Boolean,

    mediaLoadStrategy: String,
    minMediaWidth: Number,
    maxMediaWidth: Number,
    preloadRange: Number,
    autoLoad360: Boolean,
    autoLoadInterior360: Boolean,

    categoriesFilter: String,
    extendBehavior: String,
    eventPrefix: String,
    demoSpin: Boolean,
    reverse360: Boolean,

    analyticsEventPrefix: String,
    analyticsUrl: String,
    analyticsBearer: String,
    analyticsSimpleRequestsOnly: Boolean,
    analyticsDryRun: Boolean,
    analyticsDebug: Boolean,
    monitoring: Boolean,
  },
  data() {
    return {
      eventCbMap: new Map<string, EventListener>(),
      analyticsEventCbMap: new Map<string, EventListener>(),
    };
  },
  computed: {
    attributes() {
      return webPlayerPropsToAttributes(this.$props as WebPlayerProps);
    },
  },
  methods: {
    // Functional events
    generateEventName(event: string): string {
      const eventPrefix = this.eventPrefix || DEFAULT_EVENT_PREFIX;
      return `${eventPrefix}${event}`;
    },
    setupEventListeners(): void {
      const eventListenerMap = {
        [EVENT_COMPOSITION_LOADING]: (url: string) =>
          this.$emit("compositionLoading", url),
        [EVENT_COMPOSITION_LOADED]: (composition: Composition) =>
          this.$emit("compositionLoaded", composition),
        [EVENT_COMPOSITION_LOAD_ERROR]: (error: unknown) =>
          this.$emit("compositionLoadError", error),
        [EVENT_ITEM_CHANGE]: (props: { index: number; item: Item }) =>
          this.$emit("itemChange", props),
        [EVENT_EXTEND_MODE_ON]: () => this.$emit("extendModeOn"),
        [EVENT_EXTEND_MODE_OFF]: () => this.$emit("extendModeOff"),
        [EVENT_HOTSPOTS_ON]: () => this.$emit("hotspotsOn"),
        [EVENT_HOTSPOTS_OFF]: () => this.$emit("hotspotsOff"),
        [EVENT_GALLERY_OPEN]: () => this.$emit("galleryOpen"),
        [EVENT_GALLERY_CLOSE]: () => this.$emit("galleryClose"),
      };

      Object.entries(eventListenerMap).forEach(([event, listener]) => {
        if (!listener) return;

        const eventName = this.generateEventName(event);
        const eventListener = (event: Event) =>
          listener((event as CustomEvent).detail);

        this.eventCbMap.set(eventName, eventListener);
        document.addEventListener(eventName, eventListener);
      });
    },
    // Analytics events
    generateAnalyticsEventName(event: string): string {
      const eventPrefix =
        this.analyticsEventPrefix || DEFAULT_ANALYTICS_EVENT_PREFIX;
      return `${eventPrefix}${event}`;
    },
    setupAnalyticsEventListeners(): void {
      const eventListenerMap = {
        [ANALYTICS_EVENT_IDENTIFY]: (event: AnalyticsIdentifyEvent) =>
          this.$emit("analyticsIdentify", event),
        [ANALYTICS_EVENT_PAGE]: (event: AnalyticsPageEvent) =>
          this.$emit("analyticsPage", event),
        [ANALYTICS_EVENT_TRACK]: (event: AnalyticsTrackEvent) =>
          this.$emit("analyticsTrack", event),
      };
      Object.entries(eventListenerMap).forEach(([event, listener]) => {
        if (!listener) return;

        const eventName = this.generateAnalyticsEventName(event);
        const eventListener = (event: Event) =>
          listener((event as CustomEvent).detail);

        this.analyticsEventCbMap.set(eventName, eventListener);
        document.addEventListener(eventName, eventListener);
      });
    },
  },
  mounted() {
    this.setupEventListeners();
    this.setupAnalyticsEventListeners();
  },
  beforeDestroy() {
    this.eventCbMap.forEach((eventListener, eventName) => {
      document.removeEventListener(eventName, eventListener);
    });
    this.analyticsEventCbMap.forEach((eventListener, eventName) => {
      document.removeEventListener(eventName, eventListener);
    });
  },
});
</script>

<template>
  <cc-webplayer v-bind="attributes">
    <slot></slot>
  </cc-webplayer>
</template>
