<script lang="ts" setup>
import type { WebPlayerIconProps } from "@car-cutter/core-ui";
import { webPlayerIconPropsToAttributes } from "@car-cutter/wc-webplayer";

export type { WebPlayerIconProps };

const props = defineProps<WebPlayerIconProps>();
const attributes = webPlayerIconPropsToAttributes(props);
</script>

<template>
  <cc-webplayer-custom-media v-bind="attributes">
    <slot></slot>
  </cc-webplayer-custom-media>
</template>
