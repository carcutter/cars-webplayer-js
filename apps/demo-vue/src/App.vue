<script setup lang="ts">
import {
  WebPlayer,
  WebPlayerCustomMedia,
  WebPlayerIcon,
} from "@car-cutter/vue-webplayer";
</script>

<template>
  <div>
    <h1>Vue App</h1>
    <div class="webplayer-wrapper">
      <WebPlayer
        compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json"
        :infiniteCarrousel="true"
        :permanentGallery="true"
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

        <WebPlayerIcon name="UI_IMAGE">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"
            />
          </svg>
        </WebPlayerIcon>
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
