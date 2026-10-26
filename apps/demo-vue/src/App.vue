<script setup lang="ts">
import { WebPlayer } from "@car-cutter/vue-webplayer";
import { COMPOSITION_URL, THEMES } from "@car-cutter/demo";

import EventLog from "./components/EventLog.vue";
import DemoPage from "./components/DemoPage.vue";
import { useEventLog } from "./useEventLog";

const { entries, total, log, clear } = useEventLog();
</script>

<template>
  <DemoPage :theme="THEMES.vue">
    <template #media>
      <WebPlayer
        class="dm-player"
        :compositionUrl="COMPOSITION_URL"
        :infiniteCarrousel="true"
        :permanentGallery="true"
        @compositionLoading="url => log('composition-loading', url)"
        @compositionLoaded="
          composition => log('composition-loaded', composition)
        "
        @compositionLoadError="error => log('composition-load-error', error)"
        @itemChange="detail => log('item-change', detail)"
        @extendModeOn="log('extend-mode-on')"
        @extendModeOff="log('extend-mode-off')"
        @hotspotsOn="log('hotspots-on')"
        @hotspotsOff="log('hotspots-off')"
        @galleryOpen="log('gallery-open')"
        @galleryClose="log('gallery-close')"
      />
    </template>
    <template #events>
      <EventLog
        :entries="entries"
        :total="total"
        source="Via <WebPlayer @…> emits"
        @clear="clear"
      />
    </template>
  </DemoPage>
</template>
