<script lang="ts">
import { defineComponent } from "vue";
import { WebPlayerCustomMediaProps } from "@car-cutter/core";
import { webPlayerCustomMediaPropsToAttributes } from "@car-cutter/wc-webplayer";

export type { WebPlayerCustomMediaProps };

export default defineComponent({
  props: {
    index: { type: Number, required: true },
    thumbnailSrc: String,
  },
  computed: {
    attributes() {
      return webPlayerCustomMediaPropsToAttributes(this.$props);
    },
  },
});
</script>

<template>
  <cc-webplayer-custom-media v-bind="attributes">
    <slot></slot>
  </cc-webplayer-custom-media>
</template>
