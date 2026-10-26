<script lang="ts" setup>
import { computed, onBeforeMount, onUnmounted } from "vue";

import type {
  AnalyticsLoadEvent,
  AnalyticsDisplayEvent,
  AnalyticsInteractionEvent,
  AnalyticsErrorEvent,
} from "@car-cutter/analytics";
import {
  ANALYTICS_EVENT_LOAD,
  ANALYTICS_EVENT_DISPLAY,
  ANALYTICS_EVENT_INTERACTION,
  ANALYTICS_EVENT_ERROR,
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
  type MediaItem,
  type Composition,
  type WebPlayerProps as WebPlayerCoreProps,
} from "@car-cutter/core";
import {
  ensureCustomElementsDefinition,
  webPlayerPropsToAttributes,
} from "@car-cutter/wc-webplayer";

import { booleanPropsDefaults } from "./boolean-props";

ensureCustomElementsDefinition();

export type WebPlayerProps = WebPlayerCoreProps & {
  class?: string;
  style?: HTMLElement["style"];
};

const props = withDefaults(defineProps<WebPlayerProps>(), booleanPropsDefaults);
// Computed (props are not destructured) so prop updates reach the element
const style_ = computed(() => ({ display: "block", ...(props.style ?? {}) }));

// The `^` prefix forces Vue to set attributes, like for every other key: keys
// matching a property of the element (integration, monitoring, reverse360)
// would otherwise be set as properties
const attributes = computed(() => {
  const { class: _class, style: _style, ...wcProps } = props;

  return Object.fromEntries(
    Object.entries(webPlayerPropsToAttributes(wcProps)).map(([key, value]) => [
      `^${key}`,
      value,
    ])
  );
});

// -- Event listeners
export type WebPlayerEvents = {
  compositionLoading: [url: string];
  compositionLoaded: [composition: Composition];
  compositionLoadError: [error: unknown];
  itemChange: [props: { index: number; item: MediaItem }];
  extendModeOn: [];
  extendModeOff: [];
  hotspotsOn: [];
  hotspotsOff: [];
  galleryOpen: [];
  galleryClose: [];
  analyticsLoad: [event: AnalyticsLoadEvent];
  analyticsDisplay: [event: AnalyticsDisplayEvent];
  analyticsInteraction: [event: AnalyticsInteractionEvent];
  analyticsError: [event: AnalyticsErrorEvent];
};

const emit = defineEmits<WebPlayerEvents>();

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
  [EVENT_ITEM_CHANGE]: (props: { index: number; item: MediaItem }) =>
    emit("itemChange", props),
  [EVENT_EXTEND_MODE_ON]: () => emit("extendModeOn"),
  [EVENT_EXTEND_MODE_OFF]: () => emit("extendModeOff"),
  [EVENT_HOTSPOTS_ON]: () => emit("hotspotsOn"),
  [EVENT_HOTSPOTS_OFF]: () => emit("hotspotsOff"),
  [EVENT_GALLERY_OPEN]: () => emit("galleryOpen"),
  [EVENT_GALLERY_CLOSE]: () => emit("galleryClose"),
};

const analyticsEventListenerMap = {
  [ANALYTICS_EVENT_LOAD]: (event: AnalyticsLoadEvent) =>
    emit("analyticsLoad", event),
  [ANALYTICS_EVENT_DISPLAY]: (event: AnalyticsDisplayEvent) =>
    emit("analyticsDisplay", event),
  [ANALYTICS_EVENT_INTERACTION]: (event: AnalyticsInteractionEvent) =>
    emit("analyticsInteraction", event),
  [ANALYTICS_EVENT_ERROR]: (event: AnalyticsErrorEvent) =>
    emit("analyticsError", event),
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

// Before mount, so that events dispatched as soon as <cc-webplayer> is
// connected (e.g. composition-loading) are not missed
onBeforeMount(() => {
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
  <cc-webplayer v-bind="attributes" :class="props.class" :style="style_">
    <slot></slot>
  </cc-webplayer>
</template>
