<script setup lang="ts">
import {
  WebPlayer,
  WebPlayerCustomMedia,
  WebPlayerIcon,
} from "@car-cutter/vue-webplayer";
import { ref } from "vue";

const COMPOSITION_URL =
  "https://cdn.car-cutter.com/libs/web-player/v3/demos/composition_v3.json";

const events = ref<string[]>([]);
const log = (name: string) => events.value.push(name);
</script>

<template>
  <WebPlayer
    :compositionUrl="COMPOSITION_URL"
    :permanentGallery="true"
    @compositionLoading="log('composition-loading')"
    @compositionLoaded="log('composition-loaded')"
    @itemChange="log('item-change')"
  >
    <WebPlayerCustomMedia :index="4">
      <div id="custom-media">Custom media</div>
    </WebPlayerCustomMedia>
    <WebPlayerIcon name="UI_GALLERY">
      <svg id="custom-icon" viewBox="0 0 10 10">
        <circle cx="5" cy="5" r="4" />
      </svg>
    </WebPlayerIcon>
  </WebPlayer>
  <ol id="events">
    <li v-for="(name, i) in events" :key="i">{{ name }}</li>
  </ol>
</template>
