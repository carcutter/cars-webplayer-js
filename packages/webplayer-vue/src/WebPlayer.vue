<script lang="ts" setup>
import type { WebPlayerProps } from "@car-cutter/react-webplayer";
import { ensureCustomElementsDefinition } from "@car-cutter/wc-webplayer";

ensureCustomElementsDefinition();

defineProps<WebPlayerProps>();
</script>

<template>
  <cc-webplayer
    :composition-url="compositionUrl"
    :reverse360="reverse360"
    :min-image-width="minImageWidth"
    :max-image-width="maxImageWidth"
    :image-load-strategy="imageLoadStrategy"
    :flatten="flatten"
    :infinite-carrousel="infiniteCarrousel"
    :event-id="eventId"
    :allow-full-screen="allowFullScreen"
    :permanent-gallery="permanentGallery"
  >
  </cc-webplayer>
</template>
