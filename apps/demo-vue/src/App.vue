<script setup lang="ts">
import { WebPlayer } from "@car-cutter/vue-webplayer";
</script>

<template>
  <div>
    <h1>Vue App</h1>
    <div class="webplayer-wrapper">
      <WebPlayer
        compositionUrl="https://cdn.car-cutter.com/gallery/767f46375d752707fcb76a19b8b22bc0040bd3ff59abc43d1c19eb0c04785c68/TEST1/composition_v3.json"
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
