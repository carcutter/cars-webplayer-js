<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";

import {
  DEFAULT_EVENT_PREFIX,
  EVENT_COMPOSITION_LOADING,
  EVENT_COMPOSITION_LOADED,
  EVENT_COMPOSITION_LOAD_ERROR,
  EVENT_EXTEND_MODE_ON,
  EVENT_EXTEND_MODE_OFF,
  EVENT_HOTSPOTS_ON,
  EVENT_HOTSPOTS_OFF,
  EVENT_GALLERY_OPEN,
  EVENT_GALLERY_CLOSE,
  type Composition,
} from "@car-cutter/core";
import { type WebPlayerProps } from "@car-cutter/core-ui";
import { ensureCustomElementsDefinition } from "@car-cutter/wc-webplayer";

export type { WebPlayerProps };
export type WebPlayerEvents = {
  compositionLoading: [url: string];
  compositionLoaded: [composition: Composition];
  compositionLoadError: [error: unknown];
  extendModeOn: [];
  extendModeOff: [];
  hotspotsOn: [];
  hotspotsOff: [];
  galleryOpen: [];
  galleryClose: [];
};

const props = defineProps<WebPlayerProps>();
ensureCustomElementsDefinition();

// -- Event listeners
const emit = defineEmits<WebPlayerEvents>();

const eventPrefix = props.eventPrefix ?? DEFAULT_EVENT_PREFIX;

const generateEventName = (event: string) => `${eventPrefix}${event}`;

const eventListenerMap = {
  [EVENT_COMPOSITION_LOADING]: (url: string) => emit("compositionLoading", url),
  [EVENT_COMPOSITION_LOADED]: (composition: Composition) =>
    emit("compositionLoaded", composition),
  [EVENT_COMPOSITION_LOAD_ERROR]: (error: unknown) =>
    emit("compositionLoadError", error),
  [EVENT_EXTEND_MODE_ON]: () => emit("extendModeOn"),
  [EVENT_EXTEND_MODE_OFF]: () => emit("extendModeOff"),
  [EVENT_HOTSPOTS_ON]: () => emit("hotspotsOn"),
  [EVENT_HOTSPOTS_OFF]: () => emit("hotspotsOff"),
  [EVENT_GALLERY_OPEN]: () => emit("galleryOpen"),
  [EVENT_GALLERY_CLOSE]: () => emit("galleryClose"),
};

const eventCbMap = new Map<string, EventListener>();

Object.entries(eventListenerMap).forEach(([event, listener]) => {
  if (!listener) {
    return;
  }

  const eventName = generateEventName(event);
  const eventListener = (event: Event) =>
    listener((event as CustomEvent).detail);

  eventCbMap.set(eventName, eventListener);
});

onMounted(() => {
  eventCbMap.forEach((eventListener, eventName) => {
    document.addEventListener(eventName, eventListener);
  });
});

onUnmounted(() => {
  eventCbMap.forEach((eventListener, eventName) => {
    document.removeEventListener(eventName, eventListener);
  });
});
</script>

<template>
  <cc-webplayer
    :composition-url="compositionUrl"
    :infinite-carrousel="infiniteCarrousel"
    :permanent-gallery="permanentGallery"
    :media-load-strategy="mediaLoadStrategy"
    :min-media-width="minMediaWidth"
    :max-media-width="maxMediaWidth"
    :hide-categories="hideCategories"
    :prevent-full-screen="preventFullScreen"
    :event-prefix="eventPrefix"
    :reverse360="reverse360"
  >
  </cc-webplayer>
</template>
