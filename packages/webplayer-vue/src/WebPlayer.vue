<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";

import {
  ANALYTICS_EVENT_IDENTIFY,
  ANALYTICS_EVENT_PAGE,
  ANALYTICS_EVENT_TRACK,
  DEFAULT_EVENT_PREFIX,
  DEFAULT_ANALYTICS_EVENT_PREFIX,
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
  type AnalyticsIdentifyEvent,
  type AnalyticsPageEvent,
  type AnalyticsTrackEvent,
  type Item,
  type Composition,
  type WebPlayerProps as WebPlayerCoreProps,
} from "@car-cutter/core";
import {
  ensureCustomElementsDefinition,
  webPlayerPropsToAttributes,
} from "@car-cutter/wc-webplayer";

ensureCustomElementsDefinition();

export type WebPlayerProps = WebPlayerCoreProps & {
  class?: string;
  style?: HTMLElement["style"];
};

const props = defineProps<WebPlayerProps>();
const { class: class_, style, ...wcProps } = props;
const style_ = { display: "block", ...(style ?? {}) };

const attributes = webPlayerPropsToAttributes(wcProps);

// -- Event listeners
export type WebPlayerEvents = {
  compositionLoading: [url: string];
  compositionLoaded: [composition: Composition];
  compositionLoadError: [error: unknown];
  itemChange: [props: { index: number; item: Item }];
  extendModeOn: [];
  extendModeOff: [];
  hotspotsOn: [];
  hotspotsOff: [];
  galleryOpen: [];
  galleryClose: [];
};
export type WebPlayerAnalyticsEvents = {
  analyticsIdentify: [event: AnalyticsIdentifyEvent];
  analyticsPage: [event: AnalyticsPageEvent];
  analyticsTrack: [event: AnalyticsTrackEvent];
};
const emit = defineEmits<WebPlayerEvents>();
const emitAnalytics = defineEmits<WebPlayerAnalyticsEvents>();

const eventPrefix = props.eventPrefix ?? DEFAULT_EVENT_PREFIX;
const analyticsEventPrefix =
  props.analyticsEventPrefix ?? DEFAULT_ANALYTICS_EVENT_PREFIX;

const generateEventName = (event: string) => `${eventPrefix}${event}`;
const generateAnalyticsEventName = (event: string) =>
  `${analyticsEventPrefix}${event}`;

const eventListenerMap = {
  [EVENT_COMPOSITION_LOADING]: (url: string) => emit("compositionLoading", url),
  [EVENT_COMPOSITION_LOADED]: (composition: Composition) =>
    emit("compositionLoaded", composition),
  [EVENT_COMPOSITION_LOAD_ERROR]: (error: unknown) =>
    emit("compositionLoadError", error),
  [EVENT_ITEM_CHANGE]: (props: { index: number; item: Item }) =>
    emit("itemChange", props),
  [EVENT_EXTEND_MODE_ON]: () => emit("extendModeOn"),
  [EVENT_EXTEND_MODE_OFF]: () => emit("extendModeOff"),
  [EVENT_HOTSPOTS_ON]: () => emit("hotspotsOn"),
  [EVENT_HOTSPOTS_OFF]: () => emit("hotspotsOff"),
  [EVENT_GALLERY_OPEN]: () => emit("galleryOpen"),
  [EVENT_GALLERY_CLOSE]: () => emit("galleryClose"),
};

const analyticsEventListenerMap = {
  [ANALYTICS_EVENT_IDENTIFY]: (event: AnalyticsIdentifyEvent) =>
    emitAnalytics("analyticsIdentify", event),
  [ANALYTICS_EVENT_PAGE]: (event: AnalyticsPageEvent) =>
    emitAnalytics("analyticsPage", event),
  [ANALYTICS_EVENT_TRACK]: (event: AnalyticsTrackEvent) =>
    emitAnalytics("analyticsTrack", event),
};

const eventCbMap = new Map<string, EventListener>();
const analyticsEventCbMap = new Map<string, EventListener>();

Object.entries(eventListenerMap).forEach(([event, listener]) => {
  if (!listener) {
    return;
  }

  const eventName = generateEventName(event);
  const eventListener = (event: Event) =>
    listener((event as CustomEvent).detail);

  eventCbMap.set(eventName, eventListener);
});

Object.entries(analyticsEventListenerMap).forEach(([event, listener]) => {
  if (!listener) {
    return;
  }

  const eventName = generateAnalyticsEventName(event);
  const eventListener = (event: Event) =>
    listener((event as CustomEvent).detail);

  analyticsEventCbMap.set(eventName, eventListener);
});

onMounted(() => {
  eventCbMap.forEach((eventListener, eventName) => {
    document.addEventListener(eventName, eventListener);
  });
  analyticsEventCbMap.forEach((eventListener, eventName) => {
    document.addEventListener(eventName, eventListener);
  });
});

onUnmounted(() => {
  eventCbMap.forEach((eventListener, eventName) => {
    document.removeEventListener(eventName, eventListener);
  });
  analyticsEventCbMap.forEach((eventListener, eventName) => {
    document.removeEventListener(eventName, eventListener);
  });
});
</script>

<template>
  <cc-webplayer v-bind="attributes" :class="class_" :style="style_">
    <slot></slot>
  </cc-webplayer>
</template>
