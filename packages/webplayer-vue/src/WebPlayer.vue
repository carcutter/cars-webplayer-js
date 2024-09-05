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
} from "@car-cutter/core";
import { type WebPlayerProps } from "@car-cutter/core-ui";
import { ensureCustomElementsDefinition } from "@car-cutter/wc-webplayer";

export type { WebPlayerProps };
export type WebPlayerEvents = {
  compositionLoading: [];
  compositionLoaded: [];
  compositionLoadError: [];
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

const eventListenerMap = new Map([
  [EVENT_COMPOSITION_LOADING, () => emit("compositionLoading")],
  [EVENT_COMPOSITION_LOADED, () => emit("compositionLoaded")],
  [EVENT_COMPOSITION_LOAD_ERROR, () => emit("compositionLoadError")],
  [EVENT_EXTEND_MODE_ON, () => emit("extendModeOn")],
  [EVENT_EXTEND_MODE_OFF, () => emit("extendModeOff")],
  [EVENT_HOTSPOTS_ON, () => emit("hotspotsOn")],
  [EVENT_HOTSPOTS_OFF, () => emit("hotspotsOff")],
  [EVENT_GALLERY_OPEN, () => emit("galleryOpen")],
  [EVENT_GALLERY_CLOSE, () => emit("galleryClose")],
]);

onMounted(() => {
  eventListenerMap.forEach((emiter, event) => {
    const eventName = generateEventName(event);
    document.addEventListener(eventName, emiter);
  });
});

onUnmounted(() => {
  eventListenerMap.forEach((emiter, event) => {
    const eventName = generateEventName(event);
    document.removeEventListener(eventName, emiter);
  });
});
</script>

<template>
  <cc-webplayer
    :composition-url="compositionUrl"
    :infinite-carrousel="infiniteCarrousel"
    :permanent-gallery="permanentGallery"
    :image-load-strategy="imageLoadStrategy"
    :min-image-width="minImageWidth"
    :max-image-width="maxImageWidth"
    :flatten="flatten"
    :prevent-full-screen="preventFullScreen"
    :eventPrefix="eventPrefix"
    :reverse360="reverse360"
  >
  </cc-webplayer>
</template>
