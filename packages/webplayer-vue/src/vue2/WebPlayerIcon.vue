<script lang="ts">
import { defineComponent } from "vue";
import { WebPlayerIconProps } from "@car-cutter/core";
import { webPlayerIconPropsToAttributes } from "@car-cutter/wc-webplayer";

export type { WebPlayerIconProps };

export default defineComponent({
  props: {
    name: { type: String, required: true },
  },
  computed: {
    attributes() {
      return webPlayerIconPropsToAttributes(this.$props);
    },
  },
});
</script>

<template>
  <cc-webplayer-icon v-bind="attributes">
    <slot></slot>
  </cc-webplayer-icon>
</template>
