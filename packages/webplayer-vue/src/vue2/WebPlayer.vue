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
} from "@car-cutter/core";
import {
  ensureCustomElementsDefinition,
  webPlayerPropsToAttributes,
} from "@car-cutter/wc-webplayer";

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

    analyticsUrl: String,
    analyticsBearer: String,
    analyticsSimpleRequestsOnly: Boolean,
    analyticsDryRun: Boolean,
    analyticsDebug: Boolean,
  },
  data() {
    return {
      eventCbMap: new Map<string, EventListener>(),
    };
  },
  computed: {
    attributes() {
      return webPlayerPropsToAttributes(this.$props as WebPlayerProps);
    },
  },
  methods: {
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
  },
  mounted() {
    this.setupEventListeners();
  },
  beforeDestroy() {
    this.eventCbMap.forEach((eventListener, eventName) => {
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
