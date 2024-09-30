<script setup lang="ts">
import { WebPlayer, WebPlayerCustomMedia } from "@car-cutter/vue-webplayer";
</script>

<template>
  <div>
    <h1>Vue App</h1>
    <div class="webplayer-wrapper">
      <WebPlayer
        compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json"
        :hideCategories="true"
        @compositionLoaded="
          composition => console.log('Composition loaded', composition)
        "
      >
        <WebPlayerCustomMedia
          :index="4"
          thumbnailSrc="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_thumbnail_audi.png"
        >
          <img
            src="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_image_1.jpg"
          />
        </WebPlayerCustomMedia>
      </WebPlayer>
    </div>
  </div>
</template>

<style scoped>
.webplayer-wrapper {
  max-width: 800px;
  margin-inline: auto;
}
</style>
