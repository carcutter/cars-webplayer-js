<script lang="ts" setup>
import {
  ensureCustomElementsDefinition,
  type WebPlayerProps,
} from "@car-cutter/wc-webplayer";

ensureCustomElementsDefinition();

defineProps<WebPlayerProps>();
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
    :allow-full-screen="allowFullScreen"
    :eventPrefix="eventPrefix"
    :reverse360="reverse360"
  >
  </cc-webplayer>
</template>
