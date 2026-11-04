<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

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

// The `^` prefix forces Vue to set attributes for every key. Keys matching a
// property of the element (integration, monitoring, reverse360) would
// otherwise be set as properties, and a prop going back to undefined would
// set the property to false instead of removing the attribute, which lets the
// element use its default again
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

const player = ref<HTMLElement>();

/**
 * Listeners on the element for the current prefixes, keyed by event name: its
 * events bubble from it, the ones of the other players don't reach it
 */
const eventCbMap = new Map<string, EventListener>();

function addEventListeners() {
  // An empty prefix is unset for the element, which uses the default one
  const eventPrefix = props.eventPrefix || DEFAULT_EVENT_PREFIX;
  const analyticsEventPrefix =
    props.analyticsEventPrefix || DEFAULT_ANALYTICS_EVENT_PREFIX;

  const listen = (
    prefix: string,
    listeners: Record<string, (detail: never) => void>
  ) => {
    Object.entries(listeners).forEach(([event, listener]) => {
      const eventListener = (e: Event) =>
        listener((e as CustomEvent).detail as never);

      eventCbMap.set(`${prefix}${event}`, eventListener);
      player.value!.addEventListener(`${prefix}${event}`, eventListener);
    });
  };

  listen(eventPrefix, eventListenerMap);
  listen(analyticsEventPrefix, analyticsEventListenerMap);
}

function removeEventListeners() {
  eventCbMap.forEach((eventListener, eventName) => {
    player.value!.removeEventListener(eventName, eventListener);
  });
  eventCbMap.clear();
}

// Right after <cc-webplayer> is connected: it renders on a microtask, and
// dispatches its events (e.g. composition-loading) from then on
onMounted(addEventListeners);

// The element dispatches its events with the new prefixes right away. Two
// sources: compared one by one, not as a new array each time
watch(
  [
    () => props.eventPrefix || DEFAULT_EVENT_PREFIX,
    () => props.analyticsEventPrefix || DEFAULT_ANALYTICS_EVENT_PREFIX,
  ],
  () => {
    removeEventListeners();
    addEventListeners();
  }
);

// While the element is still referenced
onBeforeUnmount(removeEventListeners);
</script>

<template>
  <cc-webplayer
    ref="player"
    v-bind="attributes"
    :class="props.class"
    :style="style_"
  >
    <slot></slot>
  </cc-webplayer>
</template>
