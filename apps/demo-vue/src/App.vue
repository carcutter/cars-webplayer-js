<script setup lang="ts">
import { WebPlayer } from "@car-cutter/vue-webplayer";
</script>

<template>
  <div>
    <h1>Vue App</h1>
    <div class="webplayer-wrapper">
      <WebPlayer
        compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json"
        :flatten="true"
      />
    </div>
  </div>
</template>

<style scoped>
.webplayer-wrapper {
  max-width: 800px;
  margin-inline: auto;
}
</style>
